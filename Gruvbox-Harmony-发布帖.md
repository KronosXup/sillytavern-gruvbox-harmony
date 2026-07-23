# Gruvbox-Harmony 酒馆主题 — 发布帖

基于 SillyTavern 1.18+ 的 Gruvbox 暗色主题，鸿蒙字体 + Phosphor 图标全套替换。

## 配色表（Gruvbox Dark）

| 角色 | 色号 | 预览 |
|------|------|------|
| 背景 | `#1d2021` | `[bg0_hard]` |
| 面板 | `#282828` | `[bg0]` |
| 控件/输入栏 | `#3c3836` | `[bg1]` |
| 边框线 | `#504945` | `[bg2]` |
| 正文 | `#ebdbb2` | `[fg1]` |
| 图标 | `#d5c4a1` | `[fg2]` |
| 灰色文字 | `#a89984` | `[gray]` |
| 红 | `#cc241d` | `[red]` |
| 绿 | `#98971a` | `[green]` |
| 亮绿 | `#b8bb26` | `[bright_green]` |
| 黄 | `#d79921` | `[yellow]` |
| 亮黄 | `#fabd2f` | `[bright_yellow]` |
| 蓝 | `#458588` | `[blue]` |
| 亮蓝 | `#83a598` | `[bright_blue]` |
| 紫 | `#b16286` | `[purple]` |
| 亮紫 | `#d3869b` | `[bright_purple]` |
| 青 | `#689d6a` | `[aqua]` |
| 亮青 | `#8ec07c` | `[bright_aqua]` |
| 橙 | `#d65d0e` | `[orange]` |
| 亮橙 | `#fe8019` | `[bright_orange]` |

## 四个变体版本

**Aqua（当前默认）** — 亮蓝 `#83a598`
**Green（草绿）** — 亮绿 `#b8bb26`
**Purple（紫色）** — 亮紫 `#d3869b`
**Orange（橙色）** — 亮橙 `#fe8019`

每个变体只是发光色和重点色的差异，基础 Gruvbox 配色不变。

## Discord 颜色代码（发帖用）

```
=== Gruvbox Dark 调色板（亮色系）===

[fg0/fg1/fg2 文字]
[gray]
[red][green][yellow][blue][purple][aqua][orange]
[bright_green][bright_yellow][bright_blue][bright_purple][bright_aqua][bright_orange]

=== 四个变体高亮色 ===

[Aqua 亮蓝]
[Green 亮绿]
[Purple 亮紫]
[Orange 亮橙]
```

## 功能特性

- 鸿蒙字体（jsDelivr CDN，`@lobehub/webfont-harmony-sans-sc`）
- 全局 150+ FA 图标 → Phosphor 线性图标
- 自行设计羽毛笔发送图标 + 书写轨迹动效
- 底部三按钮各自动效（汉堡抖动/魔杖星星闪烁/发送发光）
- API 断连红色图标（Gruvbox 红 + 感叹号）
- 面板展开/收拢高度过渡动画
- 引号左竖线 + 背景特效
- 标题左竖线 + 圆角边框
- 代码块 JetBrains Mono 等宽字体

## 导入方式

下载 JSON 文件 → 酒馆主题设置 → 导入主题 → 选择对应文件

## 文件列表

- `Gruvbox-Harmony.json` (Aqua 默认)
- `Gruvbox-Harmony-Green.json`
- `Gruvbox-Harmony-Purple.json`
- `Gruvbox-Harmony-Orange.json`


---

## Discord 颜色代码

```ansi
[0;30mDark bg (#1d2021)[0;0m
[0;31mRed (#cc241d)[0;0m
[0;32mGreen (#98971a)[0;0m
[0;33mYellow (#d79921)[0;0m
[0;34mBlue (#458588)[0;0m
[0;35mPink (#b16286)[0;0m
[0;36mCyan (#689d6a)[0;0m
[0;37mWhite (#a89984)[0;0m

[0;30mBright Green (#b8bb26)[0;0m
[0;31mBright Yellow (#fabd2f)[0;0m
[0;32mBright Blue (#83a598)[0;0m
[0;33mBright Purple (#d3869b)[0;0m
[0;34mBright Aqua (#8ec07c)[0;0m
[0;35mBright Orange (#fe8019)[0;0m
[0;36mText fg1 (#ebdbb2)[0;0m
[0;37mText fg2 (#d5c4a1)[0;0m

=== 四个变体配色 ===

[0;32mAqua / 亮蓝    #83a598[0;0m
[0;33mGreen / 亮绿   #b8bb26[0;0m
[0;34mPurple / 亮紫  #d3869b[0;0m
[0;35mOrange / 亮橙  #fe8019[0;0m
```