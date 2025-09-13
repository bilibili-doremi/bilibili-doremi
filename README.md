# Bilibili-Doremi (哔哩哔哩Do-Re-Mi)

这是一个浏览器扩展，专为B站UP主 **FA将军** ([主页](https://space.bilibili.com/651110133)) 的钢琴教学视频而设计。

它可以在FA将军的视频播放时，根据时间轴实时在视频下方的钢琴键盘上显示当前的调式（大调、小调等）以及每个琴键对应的唱名（do, re, mi...），对于正在学习钢琴和乐理的观众非常有帮助。

## 功能

- **实时显示唱名**：在视频的钢琴键盘上叠加显示当前调式的唱名。
- **自动切换调式**：如果视频在播放过程中有转调，插件会根据时间自动更新调式和唱名。
- **专为FA将军优化**：数据和显示效果针对FA将军的视频风格进行了特别优化。

## 如何安装和使用

### 1. 下载扩展

您可以从本项目的 [GitHub Releases 页面](https://github.com/bilibili-doremi/bilibili-doremi/releases)下载最新的 `zip` 压缩包。

### 2. 安装扩展

#### 对于 Chrome / Edge 浏览器：

1.  下载后，将 `zip` 文件解压到一个你不会删除的文件夹中。
2.  打开浏览器的扩展管理页面 (地址栏输入 `chrome://extensions` 或 `edge://extensions`)。
3.  在页面右上角，启用 **“开发者模式”**。
4.  点击左上角的 **“加载已解压的扩展程序”** 按钮。
5.  在弹出的文件选择框中，选择你刚刚解压出来的那个文件夹。

#### 对于 Firefox 浏览器：

1.  下载后，将 `zip` 文件解压。
2.  在地址栏输入 `about:debugging` 并回车。
3.  点击左侧的 **“此 Firefox”**。
4.  点击 **“加载临时附加组件...”** 按钮。
5.  在弹出的文件选择框中，进入解压后的文件夹，选择其中的 `manifest.json` 文件。

> **注意**: 对于 Firefox，临时加载的附加组件会在浏览器关闭后自动卸载，需要重新加载。

### 3. 使用

安装成功后，无需任何额外操作。只需打开任意一个 **FA将军** 的钢琴视频页面，当视频播放时，唱名就会自动出现在下方的钢琴键盘上。

## 如何开发和测试

如果您想为这个项目贡献代码，或者为新的视频添加调式数据，可以按照以下步骤进行：

1.  **克隆仓库**

    ```bash
    git clone https://github.com/bilibili-doremi/bilibili-doremi.git
    cd bilibili-doremi
    ```

2.  **加载本地扩展**

    请参考 [如何安装开发版扩展](INSTALL_DEV.md) 的详细步骤来加载你本地的扩展进行测试。

3.  **修改代码**
    - `content.js`: 包含了插件注入页面后的主要运行逻辑。大部分关于显示和交互的代码都在这里。
    - `scales.json`: 核心数据文件，包含了所有支持视频的调式信息。每一项的键是B站的BV号，值是一个包含 `{ time, tonic, mode }` 对象的数组。

4.  **测试修改**
    - 在修改完代码（例如，向 `scales.json` 添加了新的视频数据）后，回到浏览器的扩展管理页面。
    - 找到 “Bilibili-Doremi” 扩展，点击 **刷新** 或 **重新加载** 按钮。
    - 然后刷新对应的Bilibili视频页面，你的修改就会生效。

## Icon Development

The PNG icons used in the extension (`icon16.png`, `icon48.png`, `icon128.png`) are generated from the `icon.svg` file.
If you need to update the icon, you should modify the `icon.svg` file and then regenerate the PNG files.

To regenerate the PNG files, you need to have [Inkscape](https://inkscape.org/) installed and available in your command line.

Run the following commands from the root of the project to generate the icons:

```bash
inkscape --export-type="png" --export-width=16 --export-height=16 --export-filename="icon16.png" "icon.svg"
inkscape --export-type="png" --export-width=48 --export-height=48 --export-filename="icon48.png" "icon.svg"
inkscape --export-type="png" --export-width=128 --export-height=128 --export-filename="icon128.png" "icon.svg"
```