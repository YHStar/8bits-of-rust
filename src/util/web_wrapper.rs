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
use std::io::Cursor;
use wasm_bindgen::JsValue;
use web_sys::{Blob, BlobPropertyBag, Url, HtmlElement, HtmlAnchorElement};
use hound::{WavSpec, SampleFormat, WavWriter};
use js_sys;

#[wasm_bindgen]
pub struct SongWrapper {
    song: Song,
    active_pattern_index: usize,
}

#[wasm_bindgen]
impl SongWrapper {
    pub fn new(name: &str) -> Self {
        SongWrapper {
            song: Song::new(name, 
                0),
            active_pattern_index: UNEXIST_PATTERN_INDEX,
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
        log!("edit pattern!{}",note_idx);
        if self.active_pattern_index != UNEXIST_PATTERN_INDEX {
            self.song.edit_pattern(self.active_pattern_index, mode, note_idx, start_time, end_time);
            // self.pattern_content_log();
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
        log!("need play song!");
        // 从歌曲文件渲染采样
        // TODO：设置音频缓冲区，实时渲染音频并且播放
        let (left_sample, right_sample) = mixer(&self.song);
        
        // 转换 i8 到 Float32
        let float_left_samples: Vec<f32> = left_sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();        

        let float_right_samples: Vec<f32> = right_sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();

        // 创建 AudioContext
        let audio_ctx = AudioContext::new()?;

        // 创建 AudioBuffer
        let buffer = audio_ctx
        .create_buffer(2, left_sample.len() as u32, SAMPLE_RATE as f32)
        .expect("Failed to create audio buffer");
        buffer.copy_to_channel(&float_left_samples, 0)?;
        buffer.copy_to_channel(&float_right_samples, 1)?;

        let source = AudioBufferSourceNode::new(&audio_ctx)?;
        source.set_loop(true); // 循环播放该音频
        source.set_buffer(Some(&buffer));
        source.connect_with_audio_node(&audio_ctx.destination())?;
        // source.set_loop(false); 
        source.start()?;

        Ok(())
    }

    pub fn export_song(&self, song_name: String, bit_width: String, format: String) -> Result<(), JsValue>
    {
        log!("Preparing to save song as WAV file using 'hound'...");

        // (与之前相同) 获取音频采样
        let (left_sample, right_sample) = mixer(&self.song);

        if left_sample.len() != right_sample.len() {
            return Err(JsValue::from_str("Left and right channels have different lengths"));
        }

        let left_sample: Vec<f32> = left_sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();        

        let right_sample: Vec<f32> = right_sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();

        // 2. 使用 hound 定义 WAV 规格
        // 您的样本是 i8，对应 hound 的 8-bit PCM 格式
        let spec = WavSpec {
            channels: 2,
            sample_rate: SAMPLE_RATE,
            bits_per_sample: 8,
            sample_format: SampleFormat::Int,
        };

        // 3. 将 WAV 数据写入内存缓冲区
        let mut cursor = Cursor::new(Vec::new());

        // 使用 match 语句根据 bit_width 处理不同的逻辑
        match bit_width.as_str() {
            "8bit" => {
                log!("Processing 8-bit WAV export.");
                let spec = WavSpec {
                    channels: 2,
                    sample_rate: SAMPLE_RATE, // 假设 SAMPLE_RATE 是一个常量, e.g., 44100
                    bits_per_sample: 8,
                    sample_format: SampleFormat::Int,
                };
                let mut writer = WavWriter::new(&mut cursor, spec)
                    .map_err(|e| JsValue::from_str(&format!("Failed to create 8-bit WavWriter: {}", e)))?;
                
                for i in 0..left_sample.len() {
                    // 将 f32 ([-1.0, 1.0]) 转换为 i8 ([-128, 127])
                    // hound 的 i8 样本范围是全范围的，这里使用 127.0
                    let left_i8 = (left_sample[i] * 127.0) as i8;
                    let right_i8 = (right_sample[i] * 127.0) as i8;
                    writer.write_sample(left_i8).map_err(|e| JsValue::from_str("Failed to write left sample"))?;
                    writer.write_sample(right_i8).map_err(|e| JsValue::from_str("Failed to write right sample"))?;
                }
            }
            "16bit" => {
                log!("Processing 16-bit WAV export.");
                let spec = WavSpec {
                    channels: 2,
                    sample_rate: SAMPLE_RATE,
                    bits_per_sample: 16,
                    sample_format: SampleFormat::Int,
                };
                let mut writer = WavWriter::new(&mut cursor, spec)
                    .map_err(|e| JsValue::from_str(&format!("Failed to create 16-bit WavWriter: {}", e)))?;

                for i in 0..left_sample.len() {
                    // 将 f32 ([-1.0, 1.0]) 转换为 i16 ([-32768, 32767])
                    let left_i16 = (left_sample[i] * 32767.0) as i16;
                    let right_i16 = (right_sample[i] * 32767.0) as i16;
                    writer.write_sample(left_i16).map_err(|e| JsValue::from_str("Failed to write left sample"))?;
                    writer.write_sample(right_i16).map_err(|e| JsValue::from_str("Failed to write right sample"))?;
                }
            }
            "24bit" => {
                log!("Processing 24-bit WAV export.");
                let spec = WavSpec {
                    channels: 2,
                    sample_rate: SAMPLE_RATE,
                    bits_per_sample: 24,
                    sample_format: SampleFormat::Int,
                };
                let mut writer = WavWriter::new(&mut cursor, spec)
                    .map_err(|e| JsValue::from_str(&format!("Failed to create 24-bit WavWriter: {}", e)))?;
                
                // hound 使用 i32 来写入 24-bit 样本
                for i in 0..left_sample.len() {
                    // 将 f32 转换为 24位整数范围内的值
                    const MAX_24BIT: f32 = 8388607.0; // 2^23 - 1
                    let left_i24 = (left_sample[i] * MAX_24BIT) as i32;
                    let right_i24 = (right_sample[i] * MAX_24BIT) as i32;
                    writer.write_sample(left_i24).map_err(|e| JsValue::from_str("Failed to write left sample"))?;
                    writer.write_sample(right_i24).map_err(|e| JsValue::from_str("Failed to write right sample"))?;
                }
            }
            "32bit" => {
                // 32-bit 可以是整数或浮点数，这里我们导出为浮点数，因为质量最高
                log!("Processing 32-bit Float WAV export.");
                let spec = WavSpec {
                    channels: 2,
                    sample_rate: SAMPLE_RATE,
                    bits_per_sample: 32,
                    sample_format: SampleFormat::Float, // 使用浮点数格式
                };
                let mut writer = WavWriter::new(&mut cursor, spec)
                    .map_err(|e| JsValue::from_str(&format!("Failed to create 32-bit WavWriter: {}", e)))?;
                
                for i in 0..left_sample.len() {
                    // 直接写入 f32 样本
                    writer.write_sample(left_sample[i]).map_err(|e| JsValue::from_str("Failed to write left sample"))?;
                    writer.write_sample(right_sample[i]).map_err(|e| JsValue::from_str("Failed to write right sample"))?;
                }
            }
            // 默认或不支持的格式
            unsupported => {
                let error_msg = format!("Unsupported bit width: {}", unsupported);
                return Err(JsValue::from_str(&error_msg));
            }
        }
        
        // 获取内存中的字节数据
        let buffer = cursor.into_inner();
        // 4. 使用 web-sys 触发浏览器下载 (这部分逻辑基本不变)
        let window = web_sys::window().ok_or_else(|| JsValue::from_str("Could not get window object"))?;

        let document = window.document().ok_or_else(|| JsValue::from_str("Could not get document object"))?;

        let uint8_array = js_sys::Uint8Array::from(buffer.as_slice());
        
        let mut blob_options = BlobPropertyBag::new();
        blob_options.set_type("audio/wav");
        
        let blob = Blob::new_with_u8_array_sequence_and_options(
            &js_sys::Array::of1(&uint8_array.into()).into(),
            &blob_options,
        )?;

        let url = Url::create_object_url_with_blob(&blob)?;
        
        // 使用 HtmlAnchorElement 类型更安全
        let link = document
            .create_element("a")?
            .dyn_into::<HtmlAnchorElement>()?;
            
        link.set_href(&url);

        let song_name = song_name + "_" + &bit_width + "_" + &format + ".wav";
        link.set_download(&song_name); // 设置下载的文件名

        // 附加、点击、移除
        document.body().unwrap().append_child(&link)?;
        link.click();
        document.body().unwrap().remove_child(&link)?;
        
        Url::revoke_object_url(&url)?;

        log!("WAV file download initiated successfully.");
        Ok(())
    }
    pub fn get_interleaved_f32_pcm(&self) -> Vec<f32> {
        log!("Generating raw PCM data for JavaScript...");

        // 1. 获取原始样本 (假设 mixer 返回 Vec<i16> 或 Vec<i32>)
        let (left_sample, right_sample) = mixer(&self.song);

        if left_sample.is_empty() {
            return Vec::new();
        }

        let left_sample: Vec<f32> = left_sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();        

        let right_sample: Vec<f32> = right_sample
        .iter()
        .map(|&x| x as f32 / 128.0)
        .collect();

        // 2. 创建交错的、归一化的 f32 Vec
        let mut interleaved_pcm = Vec::with_capacity(left_sample.len() * 2);
        for i in 0..left_sample.len() {
            // 归一化
            let norm_left = left_sample[i];
            let norm_right = right_sample[i];
            // 交错存入
            interleaved_pcm.push(norm_left);
            interleaved_pcm.push(norm_right);
        }
        
        log!("Raw PCM data generated. Length: {}", interleaved_pcm.len());
        interleaved_pcm
    }

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