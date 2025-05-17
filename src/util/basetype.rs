use multimap::MultiMap;

pub type Level = i8;
pub type Timebase = u32;
pub type Timestamp = u32;
pub type FTimestamp = f32;
pub type NoteType = i8;
pub type Note = u8;
pub type ChannelID = u8;
pub type PatternID = u32;

pub struct Midi {
    pub note: Note,
    pub typ: NoteType,
}

impl Clone for Midi {
    fn clone(&self) -> Self {
        Midi {
            note: self.note,
            typ: self.typ,
        }
    }
}

pub struct ModulateParameters { // fm调制参数
    pub frequency: f32, //fm调制频率
    pub range: f32, //fm调制幅度
}

pub type Score = MultiMap<Timebase, Midi>; // 乐谱类型
