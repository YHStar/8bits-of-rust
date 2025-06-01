use multimap::MultiMap;
use crate::MAX_POLY;
use std::cell::Cell;

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

pub type Score = MultiMap<Timebase, Midi>; // 乐谱类型
