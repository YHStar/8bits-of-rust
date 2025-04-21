use rodio::cpal::Sample;

use crate::Channel;
use crate::Pattern;
use crate::Score;
use std::io::BufRead;
use std::io::Read;
use std::io::Write;
use std::string;
use std::vec;

use super::basetype::PatternID;
use super::basetype::Timebase;
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

    pub fn copy_pattern_from(
        &mut self,
        pattern_index: usize,
        score: &Score,
    ){
        self.patterns[pattern_index].copy_notes_from(score);
    }

    pub fn edit_pattern(
        &mut self,
        pattern_id: PatternID,
        mode: &str,
        note_idx: u8,
        start_time: Timebase,
        end_time: Timebase,
    ){
        let mode = mode.to_string();
        let p_index = self.pattern_index(pattern_id);
        if mode == "delete" {
            self.patterns[p_index].delete_note(note_idx, start_time, end_time);
        } else if mode == "insert" {
            self.patterns[p_index].insert_note(note_idx, start_time, end_time);
        }
    }

    pub fn clear(&mut self) {
        self.channels.clear();
        self.patterns.clear();
        self.name.clear();
    }

    // pattern的id是由时间获取的，新的pattern id一定大于旧的，id必然按照index递增，故二分查找
    pub fn pattern_index(&self, id: PatternID) -> usize {
        let mut left = 0 as usize;
        let mut right = self.patterns.len();
        let mut mid = right / 2;

        while self.patterns[mid].get_id() != id {
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