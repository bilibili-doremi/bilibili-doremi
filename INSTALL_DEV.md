# 如何安装开发版扩展

本文档将指导你如何将本地的开发版本扩展加载到 Chrome 和 Firefox 中进行测试。

## 准备工作

首先，确保你已经通过 `git clone` 将本仓库克隆到了你的本地电脑上。

```bash
# 克隆仓库到本地
git clone https://github.com/bilibili-doremi/bilibili-doremi.git

# 进入项目目录
cd bilibili-doremi
```

## 在 Chrome / Edge 中安装

1.  **打开扩展管理页面**
    在你的浏览器地址栏输入 `chrome://extensions` (对于 Chrome) 或 `edge://extensions` (对于 Edge) 并按回车键。

2.  **启用开发者模式**
    在页面右上角，找到并打开 **“开发者模式”** 的开关。

    ![Enable Developer Mode](https://i.imgur.com/g3Q9i4R.png)

3.  **加载扩展**
    启用开发者模式后，页面左上方会出现几个新的按钮。点击 **“加载已解压的扩展程序”**。

    ![Load Unpacked](https://i.imgur.com/eO1sI8C.png)

4.  **选择项目文件夹**
    在弹出的文件选择框中，找到并选择你刚刚克隆到本地的 `bilibili-doremi` 整个文件夹。然后点击“选择文件夹”。

5.  **完成**
    扩展现在已经加载完成并处于活动状态。你可以在扩展管理页面看到它的卡片。在你修改代码后，可以点击该卡片上的“刷新”按钮来立即应用更改。

## 在 Firefox 中安装

1.  **打开调试页面**
    在你的浏览器地址栏输入 `about:debugging` 并按回车键。

2.  **进入此 Firefox**
    在左侧菜单中，点击 **“此 Firefox”**。

3.  **加载临时附加组件**
    点击 **“加载临时附加组件...”** 按钮。

    ![Load Temporary Add-on](https://i.imgur.com/9hV4wI4.png)

4.  **选择 manifest.json 文件**
    在弹出的文件选择框中，进入你克隆的 `bilibili-doremi` 文件夹，然后选择 `manifest.json` 文件并打开。

5.  **完成**
    扩展现在已经临时加载完成。你可以在“临时扩展”区域看到它。

    **重要提示**：在 Firefox 中，临时加载的附加组件会在浏览器关闭后自动卸载。当你下次启动 Firefox 时，需要重复以上步骤才能重新加载扩展进行测试。
