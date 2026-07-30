# Gruvbox Harmony v2.2

新增 gruvbox-material 同源变体 + Luker 专属适配 + 控件/弹层体验完善。共 14 个提交。

---

## 新增：Material 变体

- 新增 `Gruvbox-Material-Blue` / `Gruvbox-Material-Blue-Light` 两套：源自 [sainnhe/gruvbox-material](https://github.com/sainnhe/gruvbox-material)，前景降压 + accent 降饱和，底色结构不变，"soft contrast 护眼"
- Material 变体 bulkEdit 激活态：暗版 `#7daea3` 光晕、亮版实色底 + 主题色描边
- README 新增配色溯源段（致谢 morhetz/gruvbox + sainnhe/gruvbox-material）

## Luker 适配

> 以下规则均以 Luker 专有名（`luker-action-select2` / prompt-manager 结构）限定，**普通 SillyTavern 零命中**。

- **prompt-manager 分组**：子项不越界、内容对齐、组标题胶囊化
- **luker-action-select2 焦点光晕**：3px 主题色外扩洗光收细为 1px 细环，不再刺眼
- **select2 展开变形拆除**：大圆角弹层、选项卡片、高亮滑移、选中左竖条全部回落，与 base-select 扁平列表统一
- **图标补漏**：补 5 个 Luker 新增/漏网图标替换（取消分组 selection-slash、请求检查 cell-tower、debug bug-beetle、code、排序 sort-ascending）

## 批量编辑（bulkEdit）激活态

- 暗色 10 套：与世界书 `world_set` 统一光晕，每套用自己的色系（Blue 青 / Green 黄绿 / Orange 橙 / Purple 紫 / Violet 紫罗兰）
- 亮版 5 套：实色底 `color-mix(主题色 22%)` + 主题色描边

## 控件与弹层

- **base-select 弹层滚动条融入化**：透明轨道 + 主题色细 thumb，hover 主题强调色（22 套，含 Lite）
- **toastr 弹窗主题化**：主题底 + 左侧语义色条（成功绿 / 错误红 / 警告黄 / 信息水色）+ 标题按类型着色（22 套，含 Lite）
- **代码块**：暗色三系补 Gruvbox Dark hljs 配色 + 容器文字色（亮色走分离、暗色走融合，底色融进聊天底不加边框，修注释斜体不生效）

## 「现代化界面」插件适配

> 以下规则均以 `body.th-modern-enabled` 限定，未安装插件时零影响。

- **快捷插入位置 select**：高度自适应 + `min-width: 110px` 防极窄文字溢出（限定 select 元素，同 class 的 checkbox 不受影响）
- **推理块按钮**：hover 正方形化
- **世界书 picker 搜索框**：聚焦去内框
