use crate::util::basetype::EnvelopeStage;
use crate::util::basetype::EnvelopeState;
use crate::FTimestamp;
use crate::ModulateParameters;
use crate::MAX_POLY;
use crate::SAMPLE_RATE;
use std::cell::Cell;
use std::default;
use gloo_console::log;

pub struct SynthParameters {
    pub t: [Cell<FTimestamp>; MAX_POLY],
    pub delta_t: [FTimestamp; MAX_POLY],
    pub frequency: f32,
    
    pub volume: f32,
    pub pan: f32,

    pub preset: String,
    
    pub n_poly: usize,
    
    pub is_active: bool,

    // ========= fm调制参数 ========= //
    pub be_modulated: bool,
    pub modulate: ModulateParameters, // modulate: ModulateParameters,

    // ========= 音量包络参数 ======== //
    pub attack_time: f32, 
    pub decay_time: f32,
    pub sustain_level: f32,
    pub release_time: f32,
    pub envelope_state: Cell<EnvelopeState>,
}

impl SynthParameters {
    pub fn new(
        frequency: f32,
        volume: f32,
        pan: f32,
        preset: &str,
        n_poly: usize,
        be_modulated: bool,

        attack_time: f32,
        decay_time: f32,
        sustain_level: f32,
        release_time: f32,
    ) -> Self {
        if frequency == 0.0 {
            panic!("Division by zero frequency");
        }
        let range = 0.01;
        let mut delta_time: [FTimestamp; MAX_POLY] = [frequency / SAMPLE_RATE as f32; MAX_POLY];
        let t: [Cell<f32>; MAX_POLY] = std::array::from_fn(|_| Cell::new(0.0));
        let envelope_state = Cell::new(EnvelopeState::default());

        let preset = String::from(preset);
        for i in 0..n_poly {
            delta_time[i] *= 1.0 + range - 2.0 * range * ((i + 1) / n_poly) as f32;
            t[i].set(0.2 * (i as FTimestamp) / n_poly as FTimestamp);
        }
        let mut params = SynthParameters {
            t: t,
            delta_t: delta_time,
            frequency,
            volume,
            pan,
            preset,
            n_poly,
            is_active: false,
            be_modulated: be_modulated,
            modulate: ModulateParameters {
                frequency: 50.0,
                range: 0.01,
            },
            envelope_state: envelope_state,
            attack_time: attack_time,
            decay_time: decay_time,
            sustain_level: sustain_level,
            release_time: release_time,
        };
        params.note_on();                       //立即调用使得音符开始
        params
    }
    pub fn note_on(&mut self) {
        let mut env_state = self.envelope_state.get();
        env_state.stage = EnvelopeStage::Attack;
        env_state.current_level = 0.0;
        env_state.time_in_stage = 0.0;
        self.envelope_state.set(env_state);
        self.is_active = true;
    } //

    pub fn note_off(&mut self) {
        let mut env_state = self.envelope_state.get();
        // 只有当音符确实在发声或维持时，才进入Release阶段
        if env_state.stage != EnvelopeStage::Off && env_state.stage != EnvelopeStage::Release {
            env_state.level_at_release_start = env_state.current_level;
            env_state.stage = EnvelopeStage::Release;
            env_state.time_in_stage = 0.0;
            self.envelope_state.set(env_state);
        }
        // is_active 保持 true 直到 Release 阶段结束
    }

        // 这个函数可以在 synth 调用后检查，以确定是否可以移除
    pub fn is_finished(&self) -> bool {
        !self.is_active && self.envelope_state.get().stage == EnvelopeStage::Off
    }

         // update_envelope_state 应该作为 SynthParameters 的一个方法或被 synth 函数调用
    pub fn update_envelope(&mut self) {
        let mut env_state = self.envelope_state.get();
        // log!("cur_level is %f",env_state.current_level);
        let dt = 1.0 / SAMPLE_RATE as FTimestamp;

        match env_state.stage {
            EnvelopeStage::Attack => {
                if self.attack_time > 0.0001 {
                    env_state.current_level += (1.0 / self.attack_time as f32) * dt as f32;
                } else {
                    env_state.current_level = 1.0;
                }
                env_state.time_in_stage += dt;
                if env_state.current_level >= 1.0 {
                    env_state.current_level = 1.0;
                    env_state.stage = EnvelopeStage::Decay;
                    env_state.time_in_stage = 0.0;
                }
            }
            EnvelopeStage::Decay => {
                if self.decay_time > 0.0001 {
                    let decay_rate = (1.0 - self.sustain_level) / self.decay_time as f32;
                    env_state.current_level -= decay_rate * dt as f32;
                } else {
                    env_state.current_level = self.sustain_level;
                }
                env_state.time_in_stage += dt;
                if env_state.current_level <= self.sustain_level {
                    env_state.current_level = self.sustain_level;
                    env_state.stage = EnvelopeStage::Sustain;
                    env_state.time_in_stage = 0.0;
                }
            }
            EnvelopeStage::Sustain => {
                // 等待 Note Off 事件改变 stage
            }
            EnvelopeStage::Release => {
                if self.release_time > 0.0001 { // 确保 release_time 有效且大于一个极小值
                    // env_state.time_in_stage 是自 Release 阶段开始以来已经过的时间
                    // 在第一次进入 Release 时，time_in_stage 应为 0

                    // 计算归一化时间 (0.0 到 1.0)
                    // FTimestamp 用于更高精度的时间计算
                    let normalized_time = env_state.time_in_stage / self.release_time;

                    if normalized_time < 1.0 {
                        // 使用 (1-x)^2 的二次方衰减曲线
                        // 将 FTimestamp 转换为 f32 进行电平计算
                        let factor = 1.0 - normalized_time as f32;
                        env_state.current_level = env_state.level_at_release_start * factor * factor;

                        // 防止因浮点数精度问题导致 current_level 意外变为负数
                        if env_state.current_level < 0.0 {
                            env_state.current_level = 0.0;
                        }
                    } 
                    else {
                        // 归一化时间达到或超过1.0，释放结束
                        env_state.current_level = 0.0;
                    }
                } else {
                    // release_time 几乎为零，视为瞬时释放
                    env_state.current_level = 0.0;
                }

                // 检查是否应转换到 Off 状态
                // 使用一个小的 epsilon 来比较浮点数是否接近零
                if env_state.current_level < 0.00001 {
                    env_state.current_level = 0.0; // 精确置零
                    env_state.stage = EnvelopeStage::Off;
                    env_state.time_in_stage = 0.0; // 为下一阶段或下次激活重置时间
                    // 如果需要，在这里更新 is_active 状态
                    // self.is_active = false; (这通常在外部管理，或者在 is_finished() 方法中体现)
                }
                else {
                    {
                    env_state.time_in_stage += dt;
                }
                }
            }
            EnvelopeStage::Off => {
                env_state.current_level = 0.0;
                self.is_active = false; // 确保标记为不活动
            }
        }
        self.envelope_state.set(env_state);
        if env_state.stage == EnvelopeStage::Off {
            // 如果 SynthParameters 实例知道自己是否应该被移除，可以在这里做一些标记
            self.is_active = false; // 标记为不活动
            // 更好的做法是在外部循环中检查 stage == Off 并移除
        }
    }


}
