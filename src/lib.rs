extern crate libm;
extern crate getrandom;
extern crate rand;

mod util;
use util::basefn::generate_wav;
use util::basefn::load_wav;
use util::basefn::midi_generator;

use util::basetype::FTimestamp;
use util::basetype::Level;
use util::basetype::Midi;
use util::basetype::ModulateParameters;
use util::basetype::Note;
use util::basetype::NoteType;
use util::basetype::Score;
use util::basetype::Timebase;
use util::basetype::Timestamp;

use util::channel::Channel;
use util::pattern::pattern::Pattern;
// use util::song::SONG;
use util::synth::synthparameters::SynthParameters;

use util::synth::wavefn::multi_generator;

use util::effect::effectfn::fm_modulate;

use util::synth::synth;

use util::basefn::mixer;

use util::test::init_test_song;

use util::parameter::baseconst::BPM;
use util::parameter::baseconst::N_TBASE;
use util::parameter::baseconst::SAMPLE_RATE; // 采样率
use util::parameter::baseconst::SONG_LEN;
use util::parameter::baseconst::T_BASE;
use util::parameter::baseconst::T_BEAT;
// use util::parameter::baseconst::LOOP_TIMES;
use util::parameter::baseconst::FREQ_DATA;
use util::parameter::baseconst::LOOP_TIMES;
use util::parameter::baseconst::MAX_POLY;

extern crate wasm_bindgen;
extern crate console_error_panic_hook;
use wasm_bindgen::prelude::*;
use web_sys::{AudioContext, AudioBuffer, AudioBufferSourceNode};

#[wasm_bindgen]
pub fn init_panic_hook() {
    console_error_panic_hook::set_once();
}
#[wasm_bindgen]
pub fn test() {
    
}