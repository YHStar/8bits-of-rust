use rodio::cpal::Sample;

use crate::Channel;
use crate::Pattern;
use crate::Score;
use std::io::BufRead;
use std::io::Read;
use std::io::Write;
use std::string;
use std::vec;

use super::basefn::mixer;
use super::basetype::Level;
use super::basetype::PatternID;
use super::basetype::Timebase;
use super::pattern::display::Display;
use super::parameter::baseconst::UNEXIST_PATTERN_INDEX;
// use std::sync::LazyLock;

pub struct Song {
    pub channels: Vec<Channel>,
    pub patterns: Vec<Pattern>,
    pub name: String,
    pub active_synth_id: usize, // 当前激活的合成器索引
} // struct Song

impl Song {
    pub fn new(
        name: &str, 
        active_synth_id: usize,
    ) -> Self 
    {
        Self {
            channels: Vec::new(),
            patterns: Vec::new(),
            name: name.to_string(),
            active_synth_id: active_synth_id,
        }
    }

    // 创建新channel
    pub fn new_channel(
        &mut self,
        name: &str,
        preset: &str,
        
        volume: f32,
        n_poly: usize,
        pan: f32,
        
        be_modulated: bool,

        attack: f32,
        decay: f32,
        sustain: f32,
        release: f32,
    ) {
        self.channels.push(
            Channel{
                name: name.to_string(),
                preset: preset.to_string(),
                volume: volume,
                n_poly: n_poly,
                pan: pan,
                be_modulated: be_modulated,

                attack: attack,
                decay: decay,
                sustain: sustain,
                release: release,

                display: Vec::new(),
            }
        );
    } // new channel

    pub fn set_synth_preset(&mut self, value: &str){
        self.channels[self.active_synth_id].set_preset(value);
    }

    pub fn set_channel_volume(&mut self, index: usize, value: f32){
        self.channels[index].set_volume(value);
    }

    pub fn set_channel_pan(&mut self, index: usize, value: f32){
        self.channels[index].set_pan(value);
    }

    pub fn set_synth_attack(&mut self, value: f32){
        self.channels[self.active_synth_id].set_attack(value);
    }

    pub fn set_synth_decay(&mut self, value: f32){
        self.channels[self.active_synth_id].set_decay(value);
    }

    pub fn set_synth_sustain(&mut self, value: f32){
        self.channels[self.active_synth_id].set_sustain(value);
    }

    pub fn set_synth_release(&mut self, value: f32){
        self.channels[self.active_synth_id].set_release(value);
    }

    pub fn set_active_synth_id(&mut self, value: usize) {
        self.active_synth_id = value;
    }
    // 创建新pattern
    pub fn new_pattern(
        &mut self,
        pattern_name: &str,
        id: PatternID,
    ) {
        self.patterns.push(Pattern::new(id, pattern_name));
    }

    // 删除pattern
    pub fn delete_pattern(&mut self, pattern_id: PatternID) {
        self.patterns.remove(self.pattern_index(pattern_id));
    }

    // 
    pub fn filter_display_without_pattern_id(&mut self, id: PatternID) {
        if self.channels.is_empty() {
            return;
        }
        for channel in &mut self.channels {
            channel.filter_display_without_pattern_id(id);
        }
    }

    // 插入display
    pub fn insert_display(&mut self, channel_index: usize, display_index: usize, pattern_id: PatternID, duration: Timebase, start_time: Timebase) {
        self.channels[channel_index].insert_display(display_index, Display {pattern_id, duration, start_time});
    }

    // 删除display
    pub fn delete_display(&mut self, channel_index: usize, display_index: usize) -> Display {
        self.channels[channel_index].delete_display(display_index)
    }

    // 和插入display有何区别
    pub fn push_display(&mut self, channel_index: usize, pattern_id: PatternID, duration: Timebase, start_time: Timebase) {
        self.channels[channel_index].push_display(Display {pattern_id, duration, start_time});
    }

    // 更新display持续时间
    pub fn update_display_duration(&mut self, channel_index: usize, display_index: usize, new_duration: Timebase) {
        self.channels[channel_index].display[display_index].duration = new_duration;
    }

    
    pub fn sort_display(&mut self) {
        for channel in &mut self.channels {
            channel.sort_display();
        }
    }

    pub fn copy_pattern_from(
        &mut self,
        pattern_index: usize,
        score: &Score,
    ){
        self.patterns[pattern_index].copy_notes_from(score);
    }

    //编辑Pattern中的音符
    pub fn edit_pattern(
        &mut self,
        pattern_index: usize,
        mode: &str,
        note_idx: u8,
        start_time: Timebase,
        end_time: Timebase,
    ){
        let mode = mode.to_string();
        // 删除音符
        if mode == "delete" {
            self.patterns[pattern_index].delete_note(note_idx, start_time, end_time).unwrap();
        }// 插入音符
        else if mode == "insert" {
            self.patterns[pattern_index].insert_note(note_idx, start_time, end_time).unwrap();
        }
    }

    // 重命名pattern
    pub fn rename_pattern(&mut self, id: PatternID, new_name: &str) {
        let idx = self.pattern_index(id);
        self.patterns[idx].rename(new_name);
    }

    // 清空歌曲中所有内容
    pub fn clear(&mut self) {
        self.channels.clear();
        self.patterns.clear();
        self.name.clear();
    }

    // 清除pattern中的音符
    pub fn clear_pattern_notes(&mut self, pattern_index: usize) {
        self.patterns[pattern_index].clear_notes();
    }

    // 交换pattern的位置（对应前端拖动排序）
    pub fn swap_pattern(&mut self, pattern_id: PatternID, new_pattern: &mut Pattern) {
        let index = self.pattern_index(pattern_id);
        std::mem::swap(&mut self.patterns[index], new_pattern);
    }

    // 暂时不用二分，数据量不够大，而且会引发未知bug
    // pattern的id是由时间获取的，新的pattern id一定大于旧的，id必然按照index递增，故二分查找
    pub fn pattern_index(&self, id: PatternID) -> usize {
        let mut index = 0;
        for pattern in &self.patterns{
            if pattern.get_id() == id{
                return index;
            }
            index += 1;
        }
        return UNEXIST_PATTERN_INDEX;

        // // 常规二分
        // let mut left = 0 as usize;
        // let mut right = self.patterns.len();
        // let mut mid = right / 2;

        // while self.patterns[mid].get_id() != id {
        //     if right - left <= 1 {
        //         if self.patterns[right].get_id() == id {
        //             return right;
        //         }
        //         else {
        //             return UNEXIST_PATTERN_INDEX;
        //         }
        //     }
        //     if self.patterns[mid].get_id() < id {
        //         left = mid;
        //     }
        //     else {
        //         right = mid;
        //     }
        //     mid = (right - left) / 2 + left;
        // } // while

        // mid
    } // index pattern
}