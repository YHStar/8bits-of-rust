use super::song::Song;
use super::pattern::pattern::Pattern;
use crate::Note;
use super::basetype::{PatternID, Timebase};
extern crate wasm_bindgen;
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub struct songWrapper {
    song: Song,
}

#[wasm_bindgen]
impl songWrapper {
    pub fn new(name: &str) -> Self {
        songWrapper {
            song: Song::new(name)
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

    pub fn new_pattern(
        &mut self,
        pattern_name: &str,
        pattern_id: PatternID
    ) {
        self.song.new_pattern(pattern_name, pattern_id);
    }

    pub fn edit_pattern(
        &mut self,
        pattern_id: u32,
        mode: &str,
        note_idx: u8,
        start_time: Timebase,
        end_time: Timebase,
    ) {
        self.song.edit_pattern(pattern_id, mode, note_idx, start_time, end_time);
    }

    // pub fn save_to_file(&self, file_path: &str) {
    //     self.song.save_to_file(file_path);
    // }

    // pub fn read_from_file(&mut self, file_path: &str) {
    //     self.song.read_from_file(file_path).unwrap();
    // }
} // impl songWrapper

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