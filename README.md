# Gruvbox Harmony

SillyTavern 主题包。[Gruvbox](https://github.com/morhetz/gruvbox) 配色 + HarmonyOS Sans SC 字体，正式 20 套 + 测试 2 套。

## 预览

| 暗色（Harmony-Blue） | 浅色（Blue-Light） |
|---|---|
| ![dark](screenshots/desktop-harmony-blue.png) | ![light](screenshots/desktop-light-blue.png) |

更多配色与移动端预览见 [screenshots/](screenshots/)。

## 系列

| 系列 | 目录 | 说明 |
|---|---|---|
| Harmony | `themes/harmony/` | 暗色主力，图标替换为 Phosphor 线条风格 |
| Light | `themes/light/` | 浅色版（Gruvbox 官方 light 色板 + faded 主色） |
| Material | `themes/material/` | gruvbox-material 变体（前景降压 + accent 降饱和），5 暗 5 亮 |
| Classic（测试） | `test-themes/` | mode1 传统小圆头布局锁定版（暗/亮各一），**不进发布包** |

> Lite / Online 系列已停维，大卡改造前快照归档在 `archive/lite/`、`archive/online/`。

## 头像样式开关

每个主题 CSS 里 `#chat { --avatar-mode: 0 }` 可切换头像形态（改完需切一次主题生效）：

- `0` = 电影大卡：顶部居中 16:9 大图 + 相框板 + 海报式信息行（默认）
- `1` = 传统小圆头像：左上圆形小头，名字/计数器在下方

## 配色（明暗对称五色）

暗色系用 bright 高亮色、Light 系用 faded 深色——同名不同值，浅底上才压得住：

| 配色 | 暗色系 | Light 系 | 色源 |
|------|--------|----------|------|
| Blue | `#83a598` | `#076678` | 官方 bright_blue / faded_blue |
| Green | `#b8bb26` | `#79740e` | 官方 bright_green / faded_green |
| Orange | `#fe8019` | `#af3a03` | 官方 bright_orange / faded_orange |
| Purple | `#b16286` | `#8f3f71` | 官方 neutral_purple / faded_purple |
| Violet | `#9966cc` | `#9966cc` | 自调色（Amethyst） |

Material 系列配色独立：暗色用 gruvbox-material 官方色板（前景 `#d4be98`、背景 `#282828`、accent 降饱和 `#7daea3`/`#a9b665`/`#e78a4e`/`#d3869b`），亮色用 faded 深色版 + 米白底。

基础色（背景/文字/边框等）明细见 [docs/Gruvbox-Harmony-docs.md](docs/Gruvbox-Harmony-docs.md)。

## 安装

1. 下载对应系列目录下的 `.json` 文件
2. SillyTavern → 用户设置 → UI 主题 → 导入主题文件
3. 下拉框选中即生效

## 说明

- 字体经 jsdelivr CDN 加载，网络不通时的镜像方案见 [docs/CDN-MIRRORS.md](docs/CDN-MIRRORS.md)，换字体方法见 [docs/FONT-GUIDE.md](docs/FONT-GUIDE.md)
- 桌面 Chrome/Edge 135+ 的下拉弹层为主题化渲染；移动端与其他浏览器保持系统原生弹层
- 历史版本打包在 `releases/`，更新记录在 `changelogs/`（打包只含 `themes/`，不含测试主题与归档）

## 二改

欢迎。[MIT 协议](LICENSE)，保留出处即可。

## 配色溯源

- 基础配色（Harmony / Light）源自 [morhetz/gruvbox](https://github.com/morhetz/gruvbox)
- Material 变体源自 [sainnhe/gruvbox-material](https://github.com/sainnhe/gruvbox-material)（前景降压 + accent 降饱和，"soft contrast 护眼"）
