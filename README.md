# Gruvbox Harmony

SillyTavern 主题包。[Gruvbox](https://github.com/morhetz/gruvbox) 配色 + HarmonyOS Sans SC 字体，共 20 套。

## 系列

| 系列 | 目录 | 说明 |
|---|---|---|
| Harmony | `themes/harmony/` | 暗色主力，图标替换为 Phosphor 线条风格 |
| Lite | `themes/lite/` | 保留 Font Awesome 原生图标的轻量版 |
| Light | `themes/light/` | 浅色版（Gruvbox 官方 light 色板 + faded 主色） |
| Online | `themes/online/` | 图标走 iconify 外链，文件更小 |

## 配色（明暗对称五色）

暗色系用 bright 高亮色、Light 系用 faded 深色——同名不同值，浅底上才压得住：

| 配色 | 暗色系 | Light 系 | 色源 |
|------|--------|----------|------|
| Blue | `#83a598` | `#076678` | 官方 bright_blue / faded_blue |
| Green | `#b8bb26` | `#79740e` | 官方 bright_green / faded_green |
| Orange | `#fe8019` | `#af3a03` | 官方 bright_orange / faded_orange |
| Purple | `#b16286` | `#8f3f71` | 官方 neutral_purple / faded_purple |
| Violet | `#9966cc` | `#9966cc` | 自调色（Amethyst） |

基础色（背景/文字/边框等）明细见 [docs/Gruvbox-Harmony-docs.md](docs/Gruvbox-Harmony-docs.md)。

## 安装

1. 下载对应系列目录下的 `.json` 文件
2. SillyTavern → 用户设置 → UI 主题 → 导入主题文件
3. 下拉框选中即生效

## 说明

- 字体经 jsdelivr CDN 加载，网络不通时的镜像方案见 [docs/CDN-MIRRORS.md](docs/CDN-MIRRORS.md)，换字体方法见 [docs/FONT-GUIDE.md](docs/FONT-GUIDE.md)
- 桌面 Chrome/Edge 135+ 的下拉弹层为主题化渲染；移动端与其他浏览器保持系统原生弹层
- 历史版本打包在 `releases/`，更新记录在 `changelogs/`

## 二改

欢迎。[MIT 协议](LICENSE)，保留出处即可。
