# Gruvbox 主题维护笔记（会话交接用）

> 本文件记录当前项目状态与维护要点，供 compact 后继续工作。**本会话主做 Gruvbox 维护**；Nord-Contour 在另一条 fork 对话里。

## 项目事实

- 仓库：`F:\sillytavern-themes\gruvbox-theme`（GitHub `KronosXup/sillytavern-gruvbox-harmony`）
- 主题：22 套，在 `themes/{harmony,online,light,lite,material}/`
  - harmony 5 + online 5（暗色）、light 5（亮色）、lite 5（暗色精简，图标类改动跳过）、material 2（Material-Blue 暗/亮，accent `#7daea3`）
- 部署：改完把 `themes/**/*.json` 拷到两处并 diff 校验：
  - `D:\SillyTavern-1.18.0\data\default-user\themes\`
  - `D:\Luker\data\default-user\themes\`
- git：`user.name=KronosXup`、`user.email=manticore.mylove@gmail.com`
- 工作流 skill：`C:\Users\Hata_\.claude\skills\sillytavern-theme-maintenance\SKILL.md`

## 铁律

1. **只改主题 JSON 的 `custom_css`**，用 round-trip 法：parse → 改 css → `JSON.stringify(d,null,2)` → 校验一致 → rename 覆盖
2. **每次改动单独 commit**，中文短消息 `系列:描述`（如 `全系:`、`非Lite:`、`Luker:`、`Material变体:`、`docs:`）
3. 改完部署两处 → 提醒用户切主题验证 → 满意再 commit（现在已习惯验证后即时 commit）
4. Lite 系跳过图标替换类改动；状态色/toast/滚动条这类控件皮肤 Lite 也要

## 操作铁律（从 ds 会话学来的，别犯我的错）

1. **每次改动立刻 commit，不等用户确认**——不在乎 commit 干不干净，要的是回滚方便。改一点提一点，错了 `git revert` 就是，绝不让未提交的改动悬着被回滚冲掉
2. **修 bug 先用控制台探针量化，不靠截图估、不靠猜**——`getBoundingClientRect` / `getComputedStyle` 拿实际坐标尺寸，改动前后/插件开关前后做对照，用数据定位
3. **插件干扰用隔离选择器针对性修**（如 `.luker-action-select2`、插件专属类名），做到装/不装插件一致；绝不为迁就插件大改布局
4. **不贪重构**——用户要的是修好 bug，不是重新设计。头像区/层分隔这类"设计感"重构谨慎，先确认用户要，别自作主张推翻现状

## 当前状态（截至 2026-07-30，全部已 commit+push）

- **bulkEdit 激活态**：暗色 10 套光晕（各色系 accent：Blue#83a598/Green#b8bb26/Orange#fe8019/Purple#b16286/Violet#9966cc）；亮版 5 套实色底+描边；Material 变体暗#7daea3 光晕/亮实色底
- **base-select 弹层滚动条**：全系 22 套融入化（透明轨道+主题色细 thumb）
- **toastr 弹窗**：全系 22 套主题化（主题底+左侧语义色条+标题按类型着色）
- **Luker 适配 4 条**（选择器用 `.luker-action-select2` 限定，普通 ST 零命中）：
  1. select2 展开变形拆除（回落扁平列表）
  2. 焦点 3px 洗光收细 1px 环
  3. 常态去 inset 高光+外投影（四角溢光）
  4. 焦点态再去细环，只留边框变色
- **v2.2 更新日志**已写（`changelogs/CHANGELOG-v2.2.md`），**未打 tag、未发 Release**（等用户发版）
- 截图已统一 `luker-*` 命名；冗余 zip/color-demo 已删

## 关键技术点（本会话踩过的坑）

- **ST 状态类**：`fav_on/fav_off`（收藏，非 .active！hover 排除必须含 `:not(.fav_on)`）、`world_set`（世界书已链接）、`toggleEnabled`、`.bulk_edit_overlay_active`（批量编辑）、`.red_button`（危险红钮）
- **主题 vs fork 对抗原则**：fork 注入样式的控件，主题要么 `!important` 全包，要么接受 fork 原生长相。Luker 的发光规则不带 important，主题带 important 就稳赢
- **hover 变色规则散三处**（基线/追加块/图标块），每条都要独立管边界（active/selected/red_button/tag/fav_on 排除）
- **toastr 此前全系零规则**——第三方库默认色，主题化要补 `.toast`/`.toast-{success,error,warning,info}`
- 亮色版的光晕类效果改用"实色底 color-mix(主题色 22%)+主题色描边"（亮底上光晕显脏）

## 待办 / 已知事项

- Luker 上游修复（用户已反馈光晕问题）：**落地后清除 22 套里的 "Luker 适配" 注释块**（脚本化移除）
- v2.2 tag + zip + Release：用户哪天要发版再 bump，日志已备
- 截图/文档有新图要进 `screenshots/`（命名 `luker-*` 或 `desktop-*`）
