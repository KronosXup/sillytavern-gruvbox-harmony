# Gruvbox-Harmony 酒馆主题 — 发布帖

基于 SillyTavern 1.18+ 的 Gruvbox 暗色主题，鸿蒙字体 + Phosphor 图标 150+ 全套替换 + 羽毛笔书写动效。

## Gruvbox Dark 调色板

| 角色 | 色号 | 说明 |
|------|------|------|
| bg0_hard | `#1d2021` | 最深背景 |
| bg0 | `#282828` | 面板背景 |
| bg1 | `#3c3836` | 控件/输入栏 |
| bg2 | `#504945` | 边框线 |
| fg0 | `#fbf1c7` | 最亮文字 |
| fg1 | `#ebdbb2` | 正文 |
| fg2 | `#d5c4a1` | 图标/次要文字 |
| gray | `#a89984` | 灰色 |
| red | `#cc241d` | 红（删除/警告/断开） |
| green | `#98971a` | 绿 |
| yellow | `#d79921` | 黄 |
| blue | `#458588` | 蓝 |
| purple | `#b16286` | 紫（偏粉） |
| aqua | `#689d6a` | 青 |
| orange | `#d65d0e` | 橙 |

亮色系（变体配色来源）：

| 色名 | 色号 |
|------|------|
| Bright Green | `#b8bb26` |
| Bright Yellow | `#fabd2f` |
| Bright Blue | `#83a598` |
| Bright Purple | `#d3869b` |
| Bright Aqua | `#8ec07c` |
| Bright Orange | `#fe8019` |

## 五个变体版本

每个变体只改发光色/重点色，基础 Gruvbox 暗色不变。

| 文件 | 配色 | 色号 | 预览 |
|------|------|------|------|
| `Gruvbox-Harmony.json` | Aqua 亮蓝 | `#83a598` | 默认版 |
| `Gruvbox-Harmony-Green.json` | 草绿 | `#b8bb26` |  |
| `Gruvbox-Harmony-Pink.json` | 粉色 | `#b16286` |  |
| `Gruvbox-Harmony-Purple.json` | 紫色 | `#9966cc` |  |
| `Gruvbox-Harmony-Orange.json` | 亮橙 | `#fe8019` |  |

## 功能特性

- **鸿蒙字体** — jsDelivr CDN，HarmonyOS Sans SC
- **全局图标替换** — 150+ FA → Phosphor 线性图标
- **羽毛笔发送按钮** — mdi:feather 图标 + 书写轨迹墨线动效
- **底部三按钮动效** — 汉堡抖动 / 星星闪烁 / 发送发光
- **API 断连红色图标** — 插头 + 圆圈 + 感叹号，Gruvbox 红色
- **面板展开/收拢动画** — 酒馆原生 @starting-style 高度过渡
- **引号特效** — 左竖线 + 微背景 + 圆角
- **标题统一** — 左竖线 + 圆角边框
- **代码块** — JetBrains Mono 等宽字体
- **工具栏圆角** — 首尾按钮单独圆角
- **暗纹背景** — 极淡交叉线叠加层

## 导入方式

下载 JSON → 酒馆设置 → 主题 → 导入 → 选择文件

## Discord 颜色展示

```ansi
=== Gruvbox 暗色调色板 ===

[0;40m  bg0_hard #1d2021  [0;0m
[0;41m  Red #cc241d  [0;0m
[0;42m  Green #98971a  [0;0m
[0;43m  Yellow #d79921  [0;0m
[0;44m  Blue #458588  [0;0m
[0;45m  Pink #b16286  [0;0m
[0;46m  Aqua #689d6a  [0;0m
[0;47m  Gray #a89984  [0;0m

=== 亮色系 ===

[0;100m  Bright Green #b8bb26  [0;0m
[0;101m  Bright Yellow #fabd2f  [0;0m
[0;102m  Bright Blue #83a598  [0;0m
[0;103m  Bright Purple #d3869b  [0;0m
[0;104m  Bright Aqua #8ec07c  [0;0m
[0;105m  Bright Orange #fe8019  [0;0m
[0;106m  Text fg1 #ebdbb2  [0;0m
[0;107m  Text fg2 #d5c4a1  [0;0m

=== 五个变体 ===

[0;42m  Aqua / 亮蓝 #83a598  [0;0m
[0;102m  Green / 亮绿 #b8bb26  [0;0m
[0;45m  Pink / 粉 #b16286  [0;0m
[0;105m  Purple / 紫 #9966cc  [0;0m
[0;103m  Orange / 亮橙 #fe8019  [0;0m
```

## 测试文本（粘贴到酒馆测试格式渲染）

将以下内容粘贴到任意角色的对话中，检验各种格式的渲染效果：

> 这是引用块。在消息中使用 `>` 开头即可创建。引用内容会显示左竖线和微背景色。可以很长很长来检验自动换行和缩进效果。

<q>这是行内引号</q>，用 `<q>` 标签包裹的短引号效果，自带左竖线和背景色。中间的普通正文用于对比间距。

```
这是代码块
def greet():
    print("Hello, Gruvbox!")
    return True
```

这是 `行内代码` 的展示效果，用反引号包裹。

**这是粗体文字**

*这是斜体文字*

| 表头1 | 表头2 | 表头3 |
|-------|-------|-------|
| 单元格 | 数据 | 测试 |
| 行2 | 内容 | 更多 |

1. 有序列表项一
2. 有序列表项二
3. 有序列表项三

- 无序列表项
- 另一个列表项
  - 嵌套列表项
  - 再多一个

---

分割线上方

分割线下方

这是一段非常长的普通正文文本，用来测试正文的行间距、换行效果、以及整体阅读体验。希望在 Gruvbox-Harmony 主题下，这段文字看起来舒适、易读，行间距不松不紧，文字颜色柔和不刺眼，与背景形成良好的对比度。同时也可以测试中英文混排时的字体回退是否正常工作。English text mixed in for good measure to test HarmonyOS Sans SC fallback behavior and line-height consistency across different character sets.
