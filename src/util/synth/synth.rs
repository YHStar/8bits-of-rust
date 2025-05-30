use crate::fm_modulate;
use crate::multi_generator;
use crate::FTimestamp;
use crate::Level;
use crate::SynthParameters;
use crate::util::basetype::EnvelopeStage;
use crate::Timestamp;
use crate::MAX_POLY;
// use gloo_console::log;

pub fn synth(params: &mut SynthParameters, clock: Timestamp) -> Level {
    params.update_envelope();                                                       //更新当前包络状态
    let envelope_level = params.envelope_state.get().current_level;
    let stage = params.envelope_state.get().stage;

    if stage == EnvelopeStage::Off || envelope_level <= 0.0001 {
        return 0;
    }
    let mut phase: [FTimestamp; MAX_POLY] = [0.0; MAX_POLY];
    for i in 0..params.n_poly {
        params.t[i].set(params.t[i].get() + params.delta_t[i]);
        if params.be_modulated == true {
            params.t[i]
                .set(params.t[i].get() + fm_modulate(clock, &params.modulate) * params.delta_t[i]);
        }
        phase[i] = params.t[i].get() % 2.0;
    }

    // phase = fm_modulate(clock, params.frequency);
    let ret = multi_generator(&params.preset, phase, params.n_poly);
    ((ret * params.volume * envelope_level) / params.n_poly as f32) as Level         //返回值乘上包络水平

}

