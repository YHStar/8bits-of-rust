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
} // struct Song

impl Song {
    pub fn new(name: &str) -> Self {
        Self {
            channels: Vec::new(),
            patterns: Vec::new(),
            name: name.to_string(),
        }
    }

    pub fn new_channel(
        &mut self,
        name: &str,
        preset: &str,
        volume: f32,
        n_poly: usize,
        pan: i8,
        be_modulated: bool,
    ) {
        self.channels.push(Channel {
            name: name.to_string(),
            preset: preset.to_string(),
            volume: volume,
            n_poly: n_poly,
            pan: pan,
            be_modulated: be_modulated,
            display: Vec::new(),
        });
    } // new channel

    pub fn new_pattern(
        &mut self,
        pattern_name: &str,
        id: PatternID,
    ) {
        self.patterns.push(Pattern::new(id, pattern_name));
    }

    pub fn delete_pattern(&mut self, pattern_id: PatternID) {
        self.patterns.remove(self.pattern_index(pattern_id));
    }

    pub fn filter_display_without_pattern_id(&mut self, id: PatternID) {
        if self.channels.is_empty() {
            return;
        }
        for channel in &mut self.channels {
            channel.filter_display_without_pattern_id(id);
        }
    }

    pub fn insert_display(&mut self, channel_index: usize, display_index: usize, pattern_id: PatternID, duration: Timebase, start_time: Timebase) {
        self.channels[channel_index].insert_display(display_index, Display {pattern_id, duration, start_time});
    }

    pub fn delete_display(&mut self, channel_index: usize, display_index: usize) -> Display {
        self.channels[channel_index].delete_display(display_index)
    }

    pub fn push_display(&mut self, channel_index: usize, pattern_id: PatternID, duration: Timebase, start_time: Timebase) {
        self.channels[channel_index].push_display(Display {pattern_id, duration, start_time});
    }

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

    pub fn edit_pattern(
        &mut self,
        pattern_index: usize,
        mode: &str,
        note_idx: u8,
        start_time: Timebase,
        end_time: Timebase,
    ){
        let mode = mode.to_string();
        if mode == "delete" {
            self.patterns[pattern_index].delete_note(note_idx, start_time, end_time).unwrap();
        } else if mode == "insert" {
            self.patterns[pattern_index].insert_note(note_idx, start_time, end_time).unwrap();
        }
    }

    pub fn rename_pattern(&mut self, id: PatternID, new_name: &str) {
        let idx = self.pattern_index(id);
        self.patterns[idx].rename(new_name);
    }

    pub fn clear(&mut self) {
        self.channels.clear();
        self.patterns.clear();
        self.name.clear();
    }

    pub fn clear_pattern_notes(&mut self, pattern_index: usize) {
        self.patterns[pattern_index].clear_notes();
    }

    pub fn swap_pattern(&mut self, pattern_id: PatternID, new_pattern: &mut Pattern) {
        let index = self.pattern_index(pattern_id);
        std::mem::swap(&mut self.patterns[index], new_pattern);
    }

    // pattern的id是由时间获取的，新的pattern id一定大于旧的，id必然按照index递增，故二分查找
    pub fn pattern_index(&self, id: PatternID) -> usize {
        let mut left = 0 as usize;
        let mut right = self.patterns.len();
        let mut mid = right / 2;

        while self.patterns[mid].get_id() != id {
            if right - left <= 1 {
                if self.patterns[right].get_id() == id {
                    return right;
                }
                else {
                    return UNEXIST_PATTERN_INDEX;
                }
            }
            if self.patterns[mid].get_id() < id {
                left = mid;
            }
            else {
                right = mid;
            }
            mid = (right - left) / 2 + left;
        } // while

        mid
    } // index pattern
}