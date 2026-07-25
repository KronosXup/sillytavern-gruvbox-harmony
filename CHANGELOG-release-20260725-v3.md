# Gruvbox Harmony v2 更新

## 移动端
- 聊天框补回背景色 + 斜线纹理（ST 移动端关 backdrop-filter 导致蒙版丢失）
- 删除模式输入栏补同款背景 + 纹理，与聊天框完全贴合
- 输入栏贴底，不再露背景缝
- 消息头重排、编辑 3×2、操作菜单向下展开（上一版已有）

## 全平台
- **hover 光晕配色修正**：之前所有配色都用了 Aqua 色，现在各用自己主题色
- **头像形状跟随 ST 设置**：Circle/Square/Rounded/Rectangle 四种不再被强制覆盖
- AI 格式化图标换 Phosphor sparkle 空心四角星
- fa-robot 换 CPU 芯片风格
- 头像选中/收藏/默认人设外框统一 Quote 色
- select2 标签样式修复
- ACU 导航栏不再撑破
- textarea 高度对齐汉堡图标

## 版本选择

| 版本 | 图标 | 大小 |
|------|------|------|
| Harmony | 内联 SVG，离线可用 | ~270KB |
| Online | iconify 外链，需联网 | ~145KB |
| Lite | FA 默认，最轻 | ~50KB |

5 配色：Aqua / Green / Orange / Pink / Purple

导入：酒馆 → 用户设置 → 界面主题 → 导入 JSON
