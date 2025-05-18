use super::{pattern::display::Display, song::Song};
use super::pattern::pattern::Pattern;
use crate::Note;
use crate::{mixer, generate_wav, load_wav};
use super::parameter::baseconst::{ UNEXIST_PATTERN_INDEX, SAMPLE_RATE };
use super::basetype::{PatternID, Timebase};
extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
use web_sys::{AudioContext, AudioBuffer, AudioBufferSourceNode};
use gloo_console::log;

#[wasm_bindgen]
pub struct songWrapper {
    song: Song,
    active_pattern_index: usize,
}

#[wasm_bindgen]
impl songWrapper {
    pub fn new(name: &str) -> Self {
        songWrapper {
            song: Song::new(name),
            active_pattern_index: UNEXIST_PATTERN_INDEX,
        }
    } // fn new

    pub fn new_channel(
        &mut self,
        name: &str,
        preset: &str,
        volume: f32,
        n_poly: usize,
        pan: i8,
        be_modulated: bool,
    ) {
        self.song.new_channel(name, preset, volume, n_poly, pan, be_modulated);
    } // fn new_channel

    pub fn clear(&mut self) {
        self.song.clear();
    }

    pub fn clear_pattern_notes(&mut self) {
        self.song.clear_pattern_notes(self.active_pattern_index);
    }

    pub fn set_active_pattern(&mut self, id: PatternID) {
        if id == 0 {
            self.active_pattern_index = UNEXIST_PATTERN_INDEX;
        }
        else {
            self.active_pattern_index = self.song.pattern_index(id);
        }
    }

    pub fn filter_display_without_pattern_id(&mut self, id: PatternID) {
        self.song.filter_display_without_pattern_id(id);
    }

    pub fn sort_display(&mut self) {
        self.song.sort_display();
    }

    pub fn new_pattern(
        &mut self,
        pattern_name: &str,
        pattern_id: PatternID
    ) {
        self.song.new_pattern(pattern_name, pattern_id);
    }

    pub fn rename_pattern(&mut self, id: PatternID, new_name: &str) {
        self.song.rename_pattern(id, new_name);
    }

    pub fn delete_pattern(&mut self, pattern_id: PatternID) {
        self.song.delete_pattern(pattern_id);
    }

    pub fn edit_pattern(
        &mut self,
        mode: &str,
        note_idx: u8,
        start_time: Timebase,
        end_time: Timebase,
    ) {
        if self.active_pattern_index != UNEXIST_PATTERN_INDEX {
            self.song.edit_pattern(self.active_pattern_index, mode, note_idx, start_time, end_time);
        }
    }

    pub fn insert_display(&mut self, channel_index: usize, display_index: usize, pattern_id: PatternID, duration: Timebase, start_time: Timebase) {
        self.song.insert_display(channel_index, display_index, pattern_id, duration, start_time);
    }

    pub fn delete_display(&mut self, channel_index: usize, pattern_id: PatternID, start_time: Timebase) {
        // 根据pattern id和start time来检索删除display
        let mut display_index = 0;
        for dis in &self.song.channels[channel_index].display {
            if dis.pattern_id == pattern_id && dis.start_time == start_time {
                break;
            }
            display_index += 1;
        }
        if display_index >= self.song.channels[channel_index].display.len() {
            return;
        }
        self.song.delete_display(channel_index, display_index);
    }

    pub fn update_display_duration(&mut self, channel_index: usize, pattern_id: PatternID, start_time: Timebase, new_duration: Timebase) {
        // 根据pattern id和start time来检索删除display
        let mut display_index = 0;
        for dis in &self.song.channels[channel_index].display {
            if dis.pattern_id == pattern_id && dis.start_time == start_time {
                break;
            }
            display_index += 1;
        }
        self.song.update_display_duration(channel_index, display_index, new_duration);
    }

    pub fn push_display(&mut self, channel_index: usize, pattern_id: PatternID, duration: Timebase, start_time: Timebase) {
        self.song.push_display(channel_index, pattern_id, duration, start_time);
    }

    // 播放当前工程中的音频
    pub fn play(&self) -> Result<(), JsValue> {
        // 从歌曲文件渲染采样
        // TODO：设置音频缓冲区，实时渲染音频并且播放
        let sample = mixer(&self.song);
        
        // 转换 i8 到 Float32
        let float_samples: Vec<f32> = sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();

        // 创建 AudioContext
        let audio_ctx = AudioContext::new()?;

        // 创建 AudioBuffer
        let buffer = audio_ctx
        .create_buffer(1, sample.len() as u32, SAMPLE_RATE as f32)
        .expect("Failed to create audio buffer");
        buffer.copy_to_channel(&float_samples, 0)?;

        // 创建并播放音频源
        let source = AudioBufferSourceNode::new(&audio_ctx)?;
        source.set_buffer(Some(&buffer));
        source.connect_with_audio_node(&audio_ctx.destination())?;
        source.start()?;

        Ok(())
    }

    // pub fn save_to_file(&self, file_path: &str) {
    //     self.song.save_to_file(file_path);
    // }

    // pub fn read_from_file(&mut self, file_path: &str) {
    //     self.song.read_from_file(file_path).unwrap();
    // }
} // impl songWrapper

/*
#[wasm_bindgen]
pub struct patternWrapper {
    pattern: Pattern,
}
#[wasm_bindgen]
impl patternWrapper {
    pub fn new(t: Timebase, name: &str) -> Self {
        Self {
            pattern: Pattern::new(t, name),
        }
    }
    pub fn insert_note(&mut self, note_idx: Note, start_time:Timebase, end_time: Timebase) {
        self.pattern.insert_note(note_idx, start_time, end_time).unwrap();
    }
    pub fn delete_note(&mut self, note_idx: Note, start_time:Timebase, end_time: Timebase) {
        self.pattern.delete_note(note_idx, start_time, end_time).unwrap();
    }
    pub fn clear(&mut self) {
        self.pattern.clear();
    }
    pub fn rename(&mut self, new_name: &str) {
        self.pattern.rename(new_name);
    }
}
    */