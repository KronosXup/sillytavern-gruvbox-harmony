# Gruvbox-Harmony 主题文档

## 概述

基于 Gruvbox Dark 配色方案的 SillyTavern 主题，配合 HarmonyOS Sans SC 鸿蒙字体和 Hermes 版画背景图，风格沉稳干净。

- **配色体系**：Gruvbox Dark（bg0_hard 深色底）
- **字体**：HarmonyOS Sans SC（正文/引号）+ JetBrains Mono（代码）
- **背景**：Hermes 版画暗纹（极低透明度透出）
- **特色**：引号文本特效、图标悬停琥珀发光、不区分用户/AI消息背景

---

## 配色表

### 主题颜色变量

| 用途 | 颜色 | 色值 | Gruvbox 名 |
|------|------|------|-----------|
| 正文文字 | 米色 | `rgba(235, 219, 178, 1)` | fg `#ebdbb2` |
| 斜体文字 | 暗米色 | `rgba(189, 174, 147, 1)` | fg4 `#bdae93` |
| 下划线 | 琥珀黄 | `rgba(250, 189, 47, 1)` | yellow `#fabd2f` |
| 引号文字 | 蓝灰 | `rgba(131, 165, 152, 1)` | blue `#83a598` |
| 聊天底色 | 深炭（75%透明） | `rgba(29, 32, 33, 0.75)` | bg0_hard `#1d2021` |
| 面板背景 | 深灰棕 | `rgba(60, 56, 54, 1)` | bg1 `#3c3836` |
| 用户消息背景 | 透明 | `rgba(40, 40, 40, 0)` | - |
| AI 消息背景 | 透明 | `rgba(40, 40, 40, 0)` | - |
| 阴影/按钮底色 | 最深炭 | `rgba(29, 32, 33, 1)` | bg0_hard `#1d2021` |
| 边框 | 中灰棕 | `rgba(80, 73, 69, 1)` | bg2 `#504945` |
| 选中高亮 | 暗红 | `rgba(204, 36, 29, 0.3)` | red `#cc241d` |

### CSS 额外颜色

| 用途 | 色值 | 说明 |
|------|------|------|
| 背景遮罩（body::after） | `rgba(29, 32, 33, 0.92)` | 盖住两侧空白，透出 8% 背景图 |
| 图标默认微光 | `rgba(235, 219, 178, 0.15)` | fg 15% |
| 图标悬停发光 | `rgba(250, 189, 47, 0.4)` | yellow 40% |
| 图标悬停强光 | `rgba(250, 189, 47, 0.2)` | yellow 20% |
| 发送按钮悬停发光 | `rgba(250, 189, 47, 0.5)` | yellow 50% |

### 背景图层叠关系

```
背景图（Hermes 版画）
  └─ body::after 遮罩（0.92 不透明深色，z-index: -1）
      └─ #chat 聊天区（chat_tint 0.75 透明）
          └─ .mes 消息（完全透明，直接透出 chat_tint）
```

- 两侧空白：被 body::after（0.92）+ chat_tint（0.75）双层盖住，几乎看不到原图
- 消息区域：消息背景透明，只经过 chat_tint（0.75）一层，能透出背景纹理

---

## 字体

| 用途 | CSS 变量 | 字体链 | 来源 |
|------|---------|--------|------|
| 正文 | `--font-sans` | `'HarmonyOS Sans SC', system-ui, sans-serif` | jsDelivr CDN `@lobehub/webfont-harmony-sans-sc` |
| 引号 | `--font-serif` | `'HarmonyOS Sans SC', system-ui, sans-serif` | 同上，用字重 Medium（500）区分 |
| 代码 | `--font-mono` | `'JetBrains Mono', 'Cascadia Code', 'HarmonyOS Sans SC', ui-monospace, Menlo, Consolas, monospace` | JetBrains Mono 本地，中文 fallback 鸿蒙 |

### 字体许可证

| 字体 | 许可证 | 商用 |
|------|--------|------|
| HarmonyOS Sans SC | 华为免费商用许可 | ✅ |
| JetBrains Mono | Apache 2.0 | ✅ |

---

## 功能特性

### 引号文本特效

SillyTavern 用 `<q>` 标签包裹引号文字，不是 `<blockquote>`。

- 左竖线 3px 蓝灰色
- 底色 10% 透明度
- 左微缩进 + 右圆角
- 字重 Medium（500）区分正文（Regular 400）
- 不用斜体，不用宋体

```css
.mes_text q {
  font-family: var(--font-serif) !important;
  font-weight: 500;
  color: var(--SmartThemeQuoteColor) !important;
  background: color-mix(in srgb, var(--SmartThemeQuoteColor) 10%, transparent);
  border-left: 3px solid var(--SmartThemeQuoteColor);
  padding: 2px 6px 2px 8px;
  margin: 0 2px;
  border-radius: 0 4px 4px 0;
}
```

### 图标悬停特效

- 默认：opacity 0.7 + 极淡暖色微光
- 悬停：Gruvbox 琥珀色 `#fabd2f` 发光 + 1.1 倍放大
- 过渡：0.2s ease
- 作用范围：抽屉图标（drawer-icon）、顶栏菜单、发送按钮

### 代码块修复

- `.mes_text span` 排除 `hljs` 元素，不覆盖代码块字体
- `pre`/`code`/`hljs` 内所有元素强制用 `--font-mono !important`
- 代码块 `<pre>` 显式设背景色，防止落到意外颜色

### 楼层号/时间/token 数

- `display: block`（换行显示，不挤占正文宽度）
- 不用 `display: contents`（会消失盒模型但仍占位置）

---

## CSS 技术坑记录

1. **全局字体覆盖不能用 `*{font-family!important}`**：会杀掉 Font Awesome 图标字体。必须排除 `i` 标签和 `fa-*` class 元素。
2. **引号标签是 `<q>` 不是 `<blockquote>`**：SillyTavern 渲染中文引号用 `.mes_text q`。
3. **`.mes_text span` 会覆盖代码块 hljs span**：用 `:not([class*="hljs"])` 排除。
4. **代码块中文不走 body 字体继承**：走浏览器系统 fallback（Windows 通常微软雅黑）。需在 `--font-mono` 链里显式加鸿蒙。
5. **`mesIDDisplay`/`mes_timer`/`tokenCounterDisplay` 用 `display:contents`**：会让楼层号/时间/token 数消失盒模型但仍占位置，跟角色名挤在一行，把正文往右推。改用 `display: block`。
6. **`.mes` 绝对不能碰 flex 布局**：SillyTavern 默认布局是对的，强改 `flex-direction: row` 会导致文字偏移、头像位置错乱。
7. **`background-color` 用 `!important` 会阻止半透明生效**：消息背景需去掉 `!important` + alpha < 1 才能透出背景图。
8. **`pre` 元素需显式设 `background-color`**：否则落到意外颜色。
9. **不要用 CSS 假纹理替代真背景图**：效果不对，用真实图片 + 透明度叠加。
10. **酒馆背景图在 `body` 层级，不在 `#chat`**：改 `chat_tint` 不影响两侧空白，需要 `body::after` 遮罩处理。
11. **消息背景设成透明让纹理透出**：用户和 AI 消息不需要区分背景色，酒馆主题一般不做区分。
12. **不要自定义 `.mes` 的 flex 布局**：ST 默认布局正确，强改会导致头像居中、文字偏移等问题。

---

## 文件位置

| 文件 | 路径 |
|------|------|
| 主题文件（主） | `F:/角色卡/美化/Gruvbox-Harmony.json` |
| 主题文件（副本） | `D:/下载/Gruvbox-Harmony.json` |
| 背景图 | `F:/角色卡/美化/hermes-bg.jpg` |

---

## 主题设置值

```json
{
  "blur_strength": 0,
  "noShadows": true,
  "fast_ui_mode": false,
  "chat_width": 50,
  "font_scale": 0.98,
  "timer_enabled": true,
  "timestamps_enabled": true,
  "mesIDDisplay_enabled": true,
  "message_token_count_enabled": true
}
```
