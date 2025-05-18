use hound;
use rodio::{Decoder, OutputStream, Sink}; //, source::Source};
use std::collections::HashMap;
use std::env;
use std::fs;
use std::fs::File;
use std::io::BufReader;
use std::sync::LazyLock;
use std::thread;
use std::time::Duration;

use crate::Channel;
use crate::Level;
use crate::Midi;
use crate::Note;
use crate::NoteType;
use crate::Pattern;
use crate::Score;
use crate::SynthParameters;
use crate::Timebase;
use crate::Timestamp;

use crate::synth::synth;

use crate::END;
use crate::START;

use crate::FREQ_DATA;
use crate::LOOP_TIMES;
use crate::SAMPLE_RATE;
use crate::SONG_LEN;
use crate::T_BASE;
use crate::T_BEAT;

use super::song::Song;
use gloo_console::log;
use wasm_bindgen::JsValue;

// 测试用函数：将字符串转化为midi信号序列，用于单独测试后端功能
pub fn midi_generator(note: &str) -> Score {
    let mut tbase: Timebase = 0;
    let mut idx_vec: Vec<Note> = Vec::new();
    let mut score: Score = Score::new();
    let mut idx_tmp: Note = 0;
    let mut need_reset = false;
    for byte in note.bytes() {
        match byte {
            b'(' => {
                need_reset = true;
                for idx in &idx_vec {
                    score.insert(
                        tbase,
                        Midi {
                            note: *idx,
                            typ: START!(),
                        },
                    );
                }
            }
            b')' => {
                for idx in &idx_vec {
                    score.insert(
                        tbase,
                        Midi {
                            note: *idx,
                            typ: END!(),
                        },
                    );
                }
            }
            b'-' => tbase += 2,
            b'=' => tbase += 1,
            b'A'..=b'G' => {
                idx_tmp = (byte - 4) % 7;
                idx_tmp = 2 * idx_tmp - (idx_tmp > 2) as Note;
            }
            b'#' => idx_tmp += 1,
            b'b' => idx_tmp -= 1,
            b'0'..=b'9' => {
                if need_reset == true {
                    idx_vec.clear();
                    need_reset = false;
                }
                idx_vec.push(idx_tmp + (byte - b'1') * 12 + 2);
            }
            _ => {}
        }
    }
    // log!("midi_generator");
    score
}

pub fn generate_wav(name: &str, sample: Vec<Level>) {
    // 创建 WAV 文件规格
    let spec = hound::WavSpec {
        channels: 2, // 单声道
        sample_rate: SAMPLE_RATE,
        bits_per_sample: 8, // 8位样本
        sample_format: hound::SampleFormat::Int,
    };

    let current_dir = match env::current_dir() {
        Ok(path) => path,
        Err(e) => {
            eprintln!("无法获取当前工作目录: {}", e);
            return;
        }
    };

    let wav_path = current_dir.join("wav");

    if wav_path.exists() {
    } else {
        match fs::create_dir(&wav_path) {
            Ok(_) => {}
            Err(e) => {
                eprintln!("无法创建文件夹: {}", e);
            }
        }
    }

    let path = wav_path.join(format!("{}{}", name, ".wav"));
    let mut writer = hound::WavWriter::create(path, spec).unwrap();

    // 写入双声道音频
    for i in 0..sample.len() {
        writer
            .write_sample(((sample[i] as f32) * 0.65) as Level)
            .unwrap();
        if i < 50 {
            writer.write_sample(0).unwrap();
        } else {
            writer.write_sample(sample[i - 50]).unwrap();
        }
    }
    writer.finalize().unwrap();
}

pub fn load_wav(name: &str) {
    // 获取默认音频输出设备
    let (_stream, stream_handle) = match OutputStream::try_default() {
        Ok(stream) => stream,
        Err(e) => {
            eprintln!("无法获取默认输出设备: {}", e);
            return;
        }
    };

    // 创建音频播放器
    let sink = match Sink::try_new(&stream_handle) {
        Ok(sink) => sink,
        Err(e) => {
            eprintln!("无法创建音频播放器: {}", e);
            return;
        }
    };
    let mut i = 0;
    let current_dir = match env::current_dir() {
        Ok(path) => path,
        Err(e) => {
            eprintln!("无法获取当前工作目录: {}", e);
            return;
        }
    };
    let wav_path = current_dir.join("wav");
    // println!({},wav_path);
    let path = wav_path.join(format!("{}{}", name, ".wav"));
    while i < LOOP_TIMES {
        let file_result = File::open(&path);

        // 使用 match 处理 Result
        let file = match file_result {
            Ok(file) => file,
            Err(e) => {
                eprintln!("无法打开文件: {}", e);
                return;
            }
        };

        if i == 0 {
            thread::sleep(Duration::from_secs(1));
        }

        // 创建 BufReader 包装文件
        let source = match Decoder::new(BufReader::new(file)) {
            Ok(source) => source,
            Err(e) => {
                eprintln!("无法解码音频文件: {}", e);
                return;
            }
        };
        i += 1;
        sink.append(source);
        sink.sleep_until_end();
    }
}
/*
pub fn mixer(song: &LazyLock<[Channel; N_CHAN]>) -> Vec<Level> {
    let mut clock = 0 as Timestamp;
    // let full_samples = (SAMPLE_RATE as f32 * T_BEAT) as Timestamp;
    let full_samples = (SAMPLE_RATE as f32 * T_BASE) as Timestamp;
    let mut sample: Vec<Level> = Vec::new();
    let mut synth_parameters: HashMap<usize, SynthParameters> = HashMap::new();

    let mut idx: Timebase = 0;
    while idx < SONG_LEN {
        let mut channel_idx = 0;

        while (channel_idx) < N_CHAN {
            // 初始化音轨设置
            if let Some(midis) = song[channel_idx].score.get_vec(&idx) {
                for midi in midis {
                    if midi.typ == START!() as NoteType {
                        synth_parameters.insert(
                            channel_idx * 128 + midi.note as usize,
                            SynthParameters::new(
                                FREQ_DATA[midi.note as usize],
                                song[channel_idx].volume,
                                &song[channel_idx].preset,
                                song[channel_idx].n_poly,
                                song[channel_idx].be_modulated,
                            ),
                        );
                    }
                    if midi.typ == END!() as NoteType {
                        synth_parameters.remove(&(channel_idx * 128 + midi.note as usize));
                    }
                }
            }
            channel_idx += 1;
        }
        for _i in 0..full_samples {
            let mut res: Level = 0;
            for params in synth_parameters.values() {
                res += synth(params, clock);
            }
            sample.push(res);
            clock += 1;
        }

        idx += 1;
    }
    sample
    // println!("{}", f);
}
*/

// 混音器
pub fn mixer(song: &Song) -> Vec<Level> {
    let patterns = &song.patterns;
    let channels = &song.channels;
    let channel_num = channels.len();
    let mut clock = 0 as Timestamp;
    // let full_samples = (SAMPLE_RATE as f32 * T_BEAT) as Timestamp;
    let full_samples = (SAMPLE_RATE as f32 * T_BASE) as Timestamp;
    let mut sample: Vec<Level> = Vec::new();
    let mut synth_parameters: HashMap<usize, SynthParameters> = HashMap::new();


    let mut song_tbase: Timebase = 0;

    log!("————————————");

    // 按时基遍历歌曲
    while song_tbase < SONG_LEN {
        let mut channel_idx = 0;
        // 测试用
        if song_tbase < 8{
            log!("——>>timebase: ", song_tbase);
        }
        // 按channel遍历歌曲
        while (channel_idx) < channel_num {
            // 按display遍历歌曲，找到mixer当前时间所在的display
            for dis in &channels[channel_idx].display {
                // 如果mixer的当前时间不在display中，如果没有到当前的display，也到不了后面的，break；如果超过了当前的，可能也能到达后面的，continue
                if song_tbase < dis.start_time{
                    break;
                }
                else if song_tbase > dis.start_time + dis.duration {
                    continue;
                }

                // 获取当前的pattern
                let current_pattern = &patterns[song.pattern_index(dis.pattern_id)];
                // 当到达current_pattern的结束时基时，将所有的midi信号全部移除，完全结束这个pattern的midi信号
                if song_tbase == dis.start_time + dis.duration{
                    synth_parameters.retain(|i, _| {
                        // 条件判断：返回 true 保留元素，false 删除元素
                        (i/128 != channel_idx)
                    });
                    continue;
                }
                // idx是全局的时间，减去display的开始时间得到在pattern的相对时间
                // 在current_pattern中获得midi信号
                if let Some(midis) = current_pattern.get_vec(song_tbase - dis.start_time) {
                    for midi in midis {
                        log!("test_midi type: ", midi.typ, "pitch: ",FREQ_DATA[midi.note as usize] * 2.0);
                        if midi.typ == START!() as NoteType {
                            // 若midi信号的类型是START，就设置合成器相关参数
                            synth_parameters.insert(
                                channel_idx * 128 + midi.note as usize,
                                SynthParameters::new(
                                    FREQ_DATA[midi.note as usize] * 2.0,
                                    channels[channel_idx].volume,
                                    &channels[channel_idx].preset,
                                    channels[channel_idx].n_poly,
                                    channels[channel_idx].be_modulated,
                                ),
                            );
                        }
                        if midi.typ == END!() as NoteType {
                            synth_parameters.remove(&(channel_idx * 128 + midi.note as usize));
                        }
                    }
                }
            }
            channel_idx += 1;
        }
        for _i in 0..full_samples {
            let mut res: Level = 0;
            for params in synth_parameters.values() {
                res += synth(params, clock);
            }
            sample.push(res);
            clock += 1;
        }

        song_tbase += 1;
    }
    sample
}
