use multimap::MultiMap;
use crate::MAX_POLY;
use std::cell::Cell;
use std::sync::Arc;
use std::f32::consts::PI;
use crate::SAMPLE_RATE;

pub type Level = i8; // 电平大小，在8bit音乐中，用有符号8位整数[-127,128]表示
pub type Timebase = u32; // 时基
pub type Timestamp = u32; // 时间戳，每次采样的时间为一个时间戳
pub type FTimestamp = f32;
pub type NoteType = i8; // 音符类型
pub type Note = u8; // 音高
pub type ChannelID = u8; // 通道ID
pub type PatternID = u32; // pattern ID

pub struct Midi {// midi信号类型
    pub note: Note,// midi信号音高
    pub typ: NoteType,// midi信号类型
}

impl Clone for Midi {
    fn clone(&self) -> Self {
        Midi {
            note: self.note,
            typ: self.typ,
        }
    }
}

// --- 包络阶段定义 ---
#[derive(Copy, Clone, Debug, PartialEq)]
pub enum EnvelopeStage {
    Attack,
    Decay,
    Sustain,
    Release,
    Off, // 包络不活动
}

// --- 每个声音的包络状态 ---
#[derive(Copy, Clone, Debug)]
pub struct EnvelopeState {
    pub stage: EnvelopeStage,
    pub current_level: f32,
    pub time_in_stage: FTimestamp,
    // 在进入Release阶段时，记录当时的电平，以便从该点开始释放
    pub level_at_release_start: f32,
}

impl Default for EnvelopeState {
    fn default() -> Self {
        EnvelopeState {
            stage: EnvelopeStage::Off,
            current_level: 0.0,
            time_in_stage: 0.0,
            level_at_release_start: 0.0,
        }
    }
}

pub struct ModulateParameters { 
    // ========= fm调制参数 ========= //
    pub frequency: f32, 
    pub range: f32, 
}

#[derive(Clone)]
pub struct SingleSample {
    // 使用Arc<Vec<f32>>可以在多个播放实例之间共享样本数据而无需复制
    pub data: Arc<Vec<f32>>, 
}

pub fn create_debug_sine_wave_sample(duration_secs: f32, frequency: f32) -> SingleSample {
    println!("正在生成一个 {:.1} 秒, {} Hz 的正弦波采样...", duration_secs, frequency);

    // 1. 计算总共需要多少个样本点
    let num_samples = (SAMPLE_RATE as f32 * duration_secs) as usize;

    // 2. 创建一个空的 Vec<f32> 来存放数据
    let mut data_vec = Vec::with_capacity(num_samples);

    // 3. 计算每个样本点之间相位的增量
    let angle_step = 2.0 * PI * frequency / SAMPLE_RATE as f32;

    // 4. 循环生成每一个样本点
    for i in 0..num_samples {
        let current_angle = i as f32 * angle_step;
        let sample_value = current_angle.sin();
        data_vec.push(sample_value);
    }
    
    println!("数据生成完毕，共 {} 个样本点。", data_vec.len());

    // 5. 将生成的 Vec<f32> 用 Arc::new() 包装起来，然后创建 Sample 实例
    SingleSample {
        data: Arc::new(data_vec),
    }
}


/// 代表一个正在播放中的采样实例，鉴于鼓的采样一般不含ADSR，这里分开处理
pub struct ActiveSample {       
    pub sample: SingleSample,           // 对要播放的采样的引用
    pub current_index: usize,     // 当前播放到了采样数据的哪个位置
    pub volume: f32,
    pub pan: f32,
    pub is_active: bool,          // 播放完成后设为false
    // 如果需要，可以添加独立的ADSR包络等
}

impl ActiveSample {             
    pub fn new(sample: SingleSample, volume: f32, pan: f32) -> Self {
        ActiveSample {
            sample,
            current_index: 0,
            volume,
            pan,
            is_active: true,
        }
    }
}

pub type SampleBank = std::collections::HashMap<u8, SingleSample>; //管理note与采样的映射关系

pub type Score = MultiMap<Timebase, Midi>; // 乐谱类型
