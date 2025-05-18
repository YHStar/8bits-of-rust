use super::basefn::midi_generator;
use super::basetype::{PatternID, Timebase};
use super::pattern::display;
use crate::Score;
use crate::util::pattern::display::Display;

// 通道（由于一个通道对饮一个乐器/音色，这个结构体相当于储存了合成器参数）
pub struct Channel {
    pub name: String,// 通道名称
    // score: Score,
    // pub score: Score,
    pub preset: String,// 通道预设名称
    pub volume: f32, // 通道音量大小
    pub n_poly: usize, // 通道复音数
    pub pan: i8, // 通道声像
    pub be_modulated: bool, // 通道中合成器声音是否经过fm调制
    pub display: Vec<Display>, // 通道的display列表
}

impl Channel {
    // 构造函数，为某些字段设置初始值
    pub fn new(
        name: &str,
        // score: &str,
        preset: &str,
        volume: f32,
        n_poly: usize,
        pan: i8,
        be_modulated: bool,
    ) -> Self {
        Channel {
            name: name.to_string(),
            // score: midi_generator(score),
            preset: preset.to_string(),
            volume: volume, // 默认音量
            n_poly: n_poly, // 默认复音数量
            pan: pan,       // 默认声相（0 表示居中）
            be_modulated: be_modulated,
            display: Vec::new(),
        }
    } // new

    // 希望把维护display按照start time有序的工作交给前端
    pub fn delete_display(&mut self, index: usize) -> Display {
        self.display.remove(index)
    }

    pub fn filter_display_without_pattern_id(&mut self, id: PatternID) {
        if self.display.is_empty() {
            return;
        }
        let mut tmpVec:Vec<Display> = Vec::new();
        for dis in &self.display {
            if dis.pattern_id != id {
                tmpVec.push(*dis);
            }
        }
        // 找到不包含id的pattern，然后置换
        std::mem::swap(&mut self.display, &mut tmpVec);
    }

    pub fn insert_display(&mut self, index: usize, element: Display) {
        self.display.insert(index, element)
    }

    pub fn push_display(&mut self, element: Display) {
        self.display.push(element);
    }

    pub fn sort_display(&mut self) {
        self.display.sort_by_key(|a| a.start_time);
    }

    pub fn change_display_duration(&mut self, index: usize, new_duration: Timebase) {
        self.display[index].change_duration(new_duration);
    }

    pub fn change_display_start_time(&mut self, index: usize, new_start_time: Timebase) {
        self.display[index].change_start_time(new_start_time);
    }
}
