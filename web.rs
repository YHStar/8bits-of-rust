use super::song::Song;
use crate::util::parameter::baseconst::BPM;
use crate::mixer;
use super::parameter::baseconst::{ UNEXIST_PATTERN_INDEX, SAMPLE_RATE };
use super::basetype::{PatternID, Timebase};
extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;
use web_sys::{AudioContext, AudioBuffer, AudioBufferSourceNode};
use gloo_console::log;

#[wasm_bindgen]
pub struct SongWrapper {
    song: Song,
    active_pattern_index: usize,

    audio_ctx: AudioContext,
    audio_buffer: Option<AudioBuffer>,
    source_node: Option<AudioBufferSourceNode>,
    start_time: f64,
    paused_time: f64,
    is_playing: bool,
    is_paused: bool,
    duration: f64, // 音频持续时间
}

#[wasm_bindgen]
impl SongWrapper {
    pub fn new(name: &str) -> Self {
        SongWrapper {
            song: Song::new(name, 
                0),
            active_pattern_index: UNEXIST_PATTERN_INDEX,
            audio_ctx: AudioContext::new().expect("Failed to create AudioContext"),
            audio_buffer: None,
            source_node: None,
            start_time: 0.0,
            paused_time: 0.0,
            is_playing: false,
            is_paused: false,
            duration: 16.0 * 60.0 / BPM as f64, // 默认持续时间为64个时基的长度
        }
    } // fn new

    fn pattern_content_log(&self) {
        // log!(self.song.patterns[self.active_pattern_index].score_to_str());
    } // fn pattern_content_log

    pub fn new_channel(
        &mut self,
        name: &str,

        volume: f32,
        pan: f32,

        preset: &str,

        n_poly: usize,
        be_modulated: bool,

        attack: f32,
        decay: f32,
        sustain: f32,
        release: f32,
    ) {
        log!(name, preset);
        self.song.new_channel(name, preset, volume, n_poly, pan, be_modulated, attack, decay, sustain, release);
    } // fn new_channel

    // 实现son
    pub fn clear(&mut self) {
        self.song.clear();
    }

    pub fn set_synth_preset(&mut self, value: &str){
        self.song.set_synth_preset(value);
    }

    pub fn set_channel_volume(&mut self, index: usize, value: f32){
        self.song.set_channel_volume(index, value);
    }

    pub fn set_channel_pan(&mut self, index: usize, value: f32){
        self.song.set_channel_pan(index, value);
    }

    pub fn set_synth_attack(&mut self, value: f32){
        self.song.set_synth_attack(value);
    }

    pub fn set_synth_decay(&mut self, value: f32){
        self.song.set_synth_decay(value);
    }

    pub fn set_synth_sustain(&mut self, value: f32){
        self.song.set_synth_sustain(value);
    }

    pub fn set_synth_release(&mut self, value: f32){
        self.song.set_synth_release(value);
    }

    pub fn set_active_synth_id(&mut self, value: usize){
        self.song.set_active_synth_id(value);
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

    // 编辑Pattern中的音符
    pub fn edit_pattern(
        &mut self,
        mode: &str,
        note_idx: u8,
        start_time: Timebase,
        end_time: Timebase,
    ) {
        log!("edit pattern!");
        if self.active_pattern_index != UNEXIST_PATTERN_INDEX {
            self.song.edit_pattern(self.active_pattern_index, mode, note_idx, start_time, end_time);
            // self.pattern_content_log();
        }
        // 为了支持同步播放实施修改，我们偷偷pause一下然后在play中假装从pause中恢复，读取修改后的pattern
        self.pause();
        self.play();
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

/**************************** CodeGeeX Inline Diff ****************************/
    /// 加载音频数据并创建音频缓冲区
    ///
    /// 该函数从 `self.song` 中获取音频样本，将其转换为浮点数格式，
    /// 并创建一个包含左右声道音频数据的 `AudioBuffer`。
    ///
    /// # 返回值
    ///
    /// 如果成功创建音频缓冲区，则返回 `Ok(())`；否则返回 `JsValue` 错误。
    fn load(&mut self) -> Result<(), JsValue> {
        // 调用 `mixer` 函数获取左右声道的音频样本
        let (left_sample, right_sample) = mixer(&self.song);
        
        // 将左声道音频样本从 i8 转换为 Float32
        // 转换 i8 到 Float32
        let float_left_samples: Vec<f32> = left_sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();        

        let float_right_samples: Vec<f32> = right_sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();

        // 创建 AudioBuffer
        self.audio_buffer = self.audio_ctx
        .create_buffer(2, left_sample.len() as u32, SAMPLE_RATE as f32)
        .ok();
        if let Some(buffer) = &self.audio_buffer {
            buffer.copy_to_channel(&float_left_samples, 0)?;
            buffer.copy_to_channel(&float_right_samples, 1)?;
        }

        Ok(())
    } // fn load
/******************** 250bc0b0-c4d7-4470-afc8-e93e53d28d53 ********************/

    // 播放当前工程中的音频
    pub fn play(&mut self) -> Result<(), JsValue> {
        if self.is_playing {
            return Ok(());
        }

        log!("need play song!");
        // 从歌曲文件渲染采样

        // 创建 AudioBufferSourceNode
        let source = AudioBufferSourceNode::new(&self.audio_ctx)?;
        source.set_loop(true); // 循环播放该音频
        // source.set_loop(false); 
        self.load();
        source.set_buffer(Some(&self.audio_buffer.as_ref().unwrap()));
        source.connect_with_audio_node(&self.audio_ctx.destination())?;
        let start_offset = if self.is_paused {
            self.paused_time
        } else {
            0.0
        };

        source.start_with_when_and_grain_offset(
            self.audio_ctx.current_time(),
            start_offset,
        )?;
        
        self.start_time = self.audio_ctx.current_time() - start_offset;
        self.source_node = Some(source);
        self.is_playing = true;
        self.is_paused = false;

        Ok(())
    } 

    // 暂停音频
    pub fn pause(&mut self) -> Result<(), JsValue> {
        if !self.is_playing {
            return Ok(());
        }

        if let Some(source) = &self.source_node {
            #[allow(deprecated)]
            source.stop()?;
            self.paused_time = (self.audio_ctx.current_time() - self.start_time) % self.duration;
            self.is_playing = false;
            self.is_paused = true;
        }

        Ok(())
    } // fn pause

    // 重置音频
    pub fn reset(&mut self) -> Result<(), JsValue> {
        if let Some(source) = &self.source_node {
            #[allow(deprecated)]
            source.stop()?;
            self.start_time = 0.0;
            self.paused_time = 0.0;
            self.is_playing = false;
            self.is_paused = false;
        }

        Ok(())
    } // fn reset

    pub fn reload_and_play(&mut self) -> Result<(), JsValue> {
        // 重新加载音频并播放
        // if let Some(source) = &self.source_node {
        //     #[allow(deprecated)]
        //     source.stop()?;
        // }
        // let reload_time = (self.audio_ctx.current_time() - self.start_time) % self.duration;

        // let source = AudioBufferSourceNode::new(&self.audio_ctx)?;
        // source.set_loop(true); // 循环播放该音频
        // // source.set_loop(false); 
        // self.load();
        // source.set_buffer(Some(&self.audio_buffer.as_ref().unwrap()));
        // source.connect_with_audio_node(&self.audio_ctx.destination())?;

        // source.start_with_when_and_grain_offset(
        //     self.audio_ctx.current_time(),
        //     reload_time
        // )?;
        
        // self.source_node = Some(source);
        self.load();

        Ok(())
    } // fn reload_and_play

    // pub fn save_to_file(&self, file_path: &str) {
    //     self.song.save_to_file(file_path);
    // }

    // pub fn read_from_file(&mut self, file_path: &str) {
    //     self.song.read_from_file(file_path).unwrap();
    // }
} // impl SongWrapper

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