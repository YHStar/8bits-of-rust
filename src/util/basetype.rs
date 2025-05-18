use multimap::MultiMap;

pub type Level = i8; // 电平大小，在8bit音乐中，用有符号8位整数[-127,128]表示
pub type Timebase = u32; // 时基
pub type Timestamp = u32; // 时间戳，每次采样的时间为一个时间戳
pub type FTimestamp = f32;
pub type NoteType = i8; // 音符类型
pub type Note = u8; // 音高
pub type ChannelID = u8; // 通道ID
pub type PatternID = u32; // pattern ID

pub struct Midi {// midi信号类型
    pub note: Note,// midi信号音高
    pub typ: NoteType,// midi信号类型
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
