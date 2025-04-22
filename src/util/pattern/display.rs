use crate::util::basetype::Timebase;

use crate::util::basetype::PatternID;

#[derive(Copy, Clone)]
pub struct Display {
    pub pattern_id: PatternID,
    pub duration: Timebase,
    pub start_time: Timebase,
}

impl Display {
    pub fn new(id: PatternID, duration: Timebase, start_time: Timebase) -> Self {
        Self {
            pattern_id: id,
            duration,
            start_time,
        }
    } // new

    pub fn change_duration(&mut self, duration: Timebase) {
        self.duration = duration;
    }

    pub fn change_start_time(&mut self, start_time: Timebase) {
        self.start_time = start_time;
    }
}