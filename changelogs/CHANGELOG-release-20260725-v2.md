# Gruvbox Harmony 主题更新说明（release-20260725-v2）

## 手机端

- 消息顶部重排：名字、时间·模型、楼层/耗时/token 分层，不再挤成一坨
- 楼层/耗时/token 合成横条，长了不叠字
- 编辑按钮两排三列
- 「⋯」菜单往下弹
- **聊天框补背景色 + 斜线纹理**：ST 移动端默认关 backdrop-filter，之前蒙版和纹理全丢，现在手动补回
- **删除模式输入栏**：补同款背景色 + 纹理，去 margin-top 4px，与聊天框完全贴合
- **输入栏贴底**：覆盖 ST 默认 #sheld 的 -1px 高度差 + #form_sheld 的 margin，底部不再露背景缝

## 电脑端

- 头像 56px，左右留白对称（右 padding 补偿滚动条轨道）
- 分割线贴头像底边；楼层/耗时/token 横条夹在名字和分割线中间
- 操作/编辑按钮用酒馆原版逻辑

## 全平台

- **hover 光晕颜色修正**：之前所有配色都硬编码了 Aqua 的 RGB，现在 Green/Orange/Pink/Purple 各用自己 Quote 色
- **AI 回复格式化图标**：fa-font 大小写 Aa → Phosphor sparkle 空心四角星（与输入栏实心 wand-sparkles 区分）
- **fa-robot 图标**：换 Phosphor CPU 芯片风格
- **头像外框**：50% 圆改 6px 圆角矩形，框与头像形状一致
- **选中/默认人设/收藏头像**：outline 改 box-shadow spread + Quote 色
- **select2 激活标签**：X 按钮和名字等高整块圆角，加分隔线
- **ACU 导航栏**：去掉 min-width: 100% 限制，不再撑破右侧
- **textarea**：min-height 40→32，与汉堡图标对齐

## 怎么选

| 版本 | 图标 | 大小 | 说明 |
|------|------|------|------|
| Harmony | 内联 SVG | ~270KB | 图标全，离线可用 |
| Online | iconify 外链 | ~145KB | 轻量，需联网加载图标 |
| Lite | FA 默认 | ~50KB | 无图标替换，最轻 |

5 种配色：Aqua / Green / Orange / Pink / Purple

包：Gruvbox-Themes-release-20260725-v2.zip
导入：酒馆 → 用户设置 → 界面主题 → 导入 JSON
