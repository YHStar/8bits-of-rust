# 8bits_of_rust

一个基于Rust的**8bit音频工作站**

## 功能

- MIDI 音符解析和合成。
- 支持多种波形（锯齿波、方波、三角波、脉冲波、噪波）
- 多通道音频混合。
- 音频输出为 WAV 文件并播放

## 依赖

- `hound`：用于生成 WAV 文件。
- `rodio`：用于音频播放。
- `multimap`：用于处理多值映射。
- `rand`：用于生成随机噪声。
- `libm`：用于数学运算。
- `wasm-bindgen`：用于编译rust代码为WASM。
- `console_error_panic_hook`：用于把rust中的panic输出到前端的log中。

## 使用方法

### 安装依赖

确保你已经安装了 Rust 编译器和 `cargo`。然后在项目根目录运行以下命令安装依赖：

```bash
cargo build
```

为了编译rust为wasm，安装wasm pack工具包
```bash
cargo install wasm-pack
```

对于前端的环境，请确保安装了nodejs、npm和vue，建议使用nvm等工具来管理node和npm的版本
```bash
npm install npm@latest -g
```

### 运行程序

运行程序以生成和播放音频（记得戴上耳机，音量别太大）：

```bash
cargo run
```

程序内部存储了一首示例歌曲，该命令以[main.rs](src/main.rs)为主文件编译代码，运行后将生成一个名为 `my_wave.wav` 的音频文件，并尝试播放它。

在运行前，利用wasm-pack把代码编译成可供JavaScript使用的库。在项目根目录下执行以下命令，该命令以[lib.rs](src/lib.rs)为主文件编译：

```bash
wasm-pack build
```

之后启动前端服务：

```bash
cd frontend
npm install
npm build
npm run serve
```

### 自定义音频

你可以在代码中修改[test.rs](src/util/test.rs)中的 MIDI 数据来生成不同的音频。每个通道支持不同的波形和音符序列。

### 音频文件存储

生成的音频文件将存储在程序的当前工作目录下的 `wav` 文件夹中。如果该文件夹不存在，程序将自动创建它。

## 代码结构

- **`src/main.rs`** 
- **`src/lib.rs`** 
- **`src/util/mod.rs`** 

## 注意事项

- 确保程序有权限访问音频设备，否则将无法正常播放声音
- 如果程序无法找到默认音频设备，请检查音频设置。

## 示例输出

程序运行后，将在当前目录下的 `wav` 文件夹中生成一个名为 `my_wave.wav` 的文件，并尝试播放该文件。

## 贡献

欢迎提交 PR 或 Issue 来改进程序功能或修复问题。
