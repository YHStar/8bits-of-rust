// 在文件顶部引入 lamejs
import { Mp3Encoder } from "lamejs"; // <--- 关键修改 #1

export default {
  namespaced: true,
  state: () => ({
    format: "",
    bitWidth: "16bit", // 添加缺失的属性
    songName: "", // 添加缺失的属性
    estimated_space: 0,
  }),
  mutations: {
    setFormat(state, value) {
      state.format = value;
    },
    // 添加其他必要的mutations
    setBitWidth(state, value) {
      state.bitWidth = value;
    },
    setSongName(state, value) {
      state.songName = value;
    },
  },
  actions: {
    // 添加必要的actions
    setFormat({ commit, rootState }, value) {
      console.log("Action setFormat value = ", value);
      if (rootState.wasm_song) {
        // rootState.wasm_song.set_format(value);
      }
      commit("setFormat", value);
    },
    setBitWidth({ commit, rootState }, value) {
      console.log("Action setBitWidth value = ", value);
      if (rootState.wasm_song) {
        // rootState.wasm_song.set_format(value);
      }
      commit("setBitWidth", value);
    },
    setSongName({ commit, rootState }, value) {
      console.log("Action setSongName value = ", value);
      if (rootState.wasm_song) {
        // rootState.wasm_song.set_format(value);
      }
      commit("setSongName", value);
    },
    async exportSong({ rootState, state }) {
      console.log("Dispatching exportSong action");
      const format = state.format; // 从 state 获取格式

      if (!rootState.wasm_song) {
        console.error("Wasm module (wasm_song) is not initialized!");
        alert("错误：Wasm 模块未初始化！");
        return;
      }

      if (format === 'wav') {
        // --- WAV 导出路径 ---
        try {
          // 直接调用我们之前写好的 Rust WAV 导出函数
          // 注意：现在这个函数只处理 WAV
          console.log("Exporting as WAV...");
          rootState.wasm_song.export_song(
            state.songName || "untitled",
            state.bitWidth,
            state.format
          );
        } catch (error) {
          console.error("Error exporting WAV:", error);
          alert(`导出 WAV 失败: ${error}`);
        }
      } else if (format === 'mp3') {
        // --- MP3 导出路径 ---
        console.log("Exporting as MP3...");
        try {
          await this.dispatch("exportsongs/exportSongAsMp3"); // 调用下面的新 action
        } catch (error) {
            console.error("Error exporting MP3:", error);
            alert(`导出 MP3 失败: ${error}`);
        }
      } else {
        alert(`不支持的导出格式: ${format}`);
      }
    },

    // 新的、专门用于 MP3 导出的 action
    async exportSongAsMp3({ rootState, state }) {
      // 1. 从 Wasm 获取原始 PCM 数据
      console.log("Getting raw PCM data from Wasm...");
      const pcm_f32_interleaved = rootState.wasm_song.get_interleaved_f32_pcm();

      if (pcm_f32_interleaved.length === 0) {
        alert("无法导出空歌曲！");
        return;
      }
      console.log("PCM data received, length:", pcm_f32_interleaved.length);

      // 2. 将 f32 PCM 转换为 i16 PCM
      const pcm_i16 = new Int16Array(pcm_f32_interleaved.length);
      for (let i = 0; i < pcm_f32_interleaved.length; i++) {
        const s = Math.max(-1, Math.min(1, pcm_f32_interleaved[i]));
        pcm_i16[i] = s < 0 ? s * 0x8000 : s * 0x7FFF;
      }

      // 3. 使用 lamejs 进行编码
      console.log("Encoding with lamejs...");
      const channels = 2;
      const sampleRate = 44100; // 您的采样率
      const kbps = 128; // MP3 比特率

      // 使用修正后的方式实例化
      const mp3encoder = new Mp3Encoder(channels, sampleRate, kbps);
      const mp3Data = [];
      const sampleBlockSize = 1152;

      // 在这个循环中，我们将交错数据分离为左、右声道
      for (let i = 0; i < pcm_i16.length; i += sampleBlockSize * channels) {
          const left = new Int16Array(sampleBlockSize);
          const right = new Int16Array(sampleBlockSize);
          let writeIndex = 0;
          // 确保不会超出数组边界
          for (let j = i; j < i + (sampleBlockSize * channels) && j < pcm_i16.length; j += 2) {
              left[writeIndex] = pcm_i16[j];
              if (j + 1 < pcm_i16.length) {
                  right[writeIndex] = pcm_i16[j + 1];
              }
              writeIndex++;
          }
          
          const mp3buf = mp3encoder.encodeBuffer(left, right);
          if (mp3buf.length > 0) {
            mp3Data.push(mp3buf);
          }
      }
      const mp3buf = mp3encoder.flush();
      if (mp3buf.length > 0) {
        mp3Data.push(mp3buf);
      }

      // 4. 创建 Blob 并触发下载
      const blob = new Blob(mp3Data.map(d => new Uint8Array(d)), { type: "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${state.songName || "untitled"}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      console.log("MP3 download initiated.");
    },
  },    
};
