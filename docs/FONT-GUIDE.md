 Gruvbox Harmony 主题字体替换指南

> 两种改法：改成品 JSON（二、五节）或改源层（推荐，见第一节——clone 仓库的用户一次配置永久生效，拉新版不丢字体）。


 一、源层自定义字体（clone 仓库用户推荐）

字体定义已从模板抽到 `src/_fonts.scss`，构建时注入。自定义流程：

1. `src/_fonts.scss` 复制一份改名为 `src/_fonts-local.scss`（已 gitignore，永远不会被 pull 覆盖）
2. 改 `_fonts-local.scss` 里的 @import 链接和 --font-* 变量（改法同下文第二、三节）
3. `node scripts/build.js` 构建，产物 `themes/` 下的 JSON 直接导入酒馆

之后仓库更新只需 `git pull` + 重新构建，字体配置不动。构建时若检测到本地字体文件会在开头提示 `[字体] 使用本地自定义`。


 二、找到要改的位置

用记事本/VSCode 打开主题 JSON（如 Gruvbox-Harmony-Aqua.json），搜「---字体加载---」这一节：

/* ---字体加载--- */
@import url('https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.0/index.css');
@import url('https://cdn.jsdelivr.net/npm/@lobehub/webfont-harmony-sans-sc@1.0.0/css/index-full.css');
@import url('https://cdn.jsdelivr.net/npm/cn-fontsource-source-han-sans-sc-vf/font.css');

/* ---字体变量--- */
:root {
  --font-sans: 'HarmonyOS Sans SC', system-ui, sans-serif;
  --font-serif: 'HarmonyOS Sans SC', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', 'Cascadia Code', ui-monospace, Menlo, Consolas, 'Source Han Sans SC VF', monospace;
}

三个变量对应的用途：

  --font-sans  →  正文、聊天、菜单、输入框、下拉选择、按钮等大多数文字
  --font-serif →  引号文 <q>、引用块 <blockquote>
  --font-mono  →  代码块、行内 code、hljs 高亮、katex 公式

 --font-mono 的降级逻辑

代码块字体按从左往右尝试，装上哪个用哪个：

 第 1 位  JetBrains Mono           英文等宽主力，代码缩进/运算符的对齐全靠它
 第 2~5 位 Cascadia / ui-monospace  备选英文等宽，给没装 JB Mono 的系统兜底
 第 6 位  Source Han Sans SC VF     中文 fallback（思源黑体），真正中英 1:2 严格对齐

> 之前最后一位是 HarmonyOS Sans SC，它不是等宽字体，所以换成了思源。


 三、换成霞鹜文楷（示例）

 1. 改 @import

替换为文楷 Screen（含 Mono 等宽变体，一个包全包）：

@import url('https://cdn.jsdelivr.net/npm/lxgw-wenkai-screen-web@latest/style.css');
@import url('https://cdn.jsdelivr.net/npm/@fontsource/jetbrains-mono@5.0.0/index.css');

> 想用原版（带笔锋）改成 lxgw-wenkai-webfont@1.7.0/style.css，GB 版改成 lxgw-wenkai-gb-web@latest/style.css。这些包同样自带 Mono 变体。

 2. 改 --font-*

:root {
  --font-sans: 'LXGW WenKai Screen', system-ui, sans-serif;
  --font-serif: 'LXGW WenKai Screen', system-ui, serif;
  --font-mono: 'JetBrains Mono', 'Cascadia Code', ui-monospace, Menlo, Consolas, 'LXGW WenKai Mono Screen', monospace;
}

> 文楷 Screen 用于正文，Mono Screen 是等宽变体用于代码块，同一个 CDN 包加载。

注意 family 名必须和 CDN 包里的 font-family 完全一致（区分大小写、空格），否则会回退到 system-ui。


 四、常见字体 CDN 和 family 名对照

| 字体 | @import 链接 | family 名 |
|------|------------|----------|
| 霞鹜文楷屏幕版 | lxgw-wenkai-screen-web@latest/style.css | LXGW WenKai Screen |
| 霞鹜文楷等宽屏幕版 | 同上，一个包自带 | LXGW WenKai Mono Screen |
| 霞鹜文楷原版 | lxgw-wenkai-webfont@1.7.0/style.css | LXGW WenKai |
| 霞鹜文楷等宽原版 | 同上，一个包自带 | LXGW WenKai Mono |
| 霞鹜文楷 GB | lxgw-wenkai-gb-web@latest/style.css | LXGW WenKai GB |
| 霞鹜文楷等宽 GB | 同上，一个包自带 | LXGW WenKai Mono GB |
| 霞鹜文楷 Lite | lxgw-wenkai-lite-webfont@1.1.0/style.css | LXGW WenKai Lite |
| 霞鹜文楷 TC（繁中） | lxgw-wenkai-tc-webfont@1.0.0/style.css | LXGW WenKai TC |
| 思源黑体 | cn-fontsource-source-han-sans-sc-vf/font.css | Source Han Sans SC VF |
| HarmonyOS Sans SC | @lobehub/webfont-harmony-sans-sc@1.0.0/css/index-full.css | HarmonyOS Sans SC（默认） |

> 所有链接加前缀 https://cdn.jsdelivr.net/npm/


 五、只改 --font-mono 不碰其他

主题默认 mono 中文 fallback 从 HarmonyOS 改成了 Source Han Sans SC VF。若不想要它：

--font-mono: 'JetBrains Mono', 'Cascadia Code', ui-monospace, Menlo, Consolas, monospace;

即删掉最后的 'Source Han Sans SC VF' 手动降级为系统等宽。


 六、改完不生效的排查

1. 打开浏览器 F12 → Network，看那些 CSS 是不是 200。404 就是链接写错了
2. Elements 选中 body，看 Computed → font-family 是不是你写的名字。如果是 system-ui 就是 family 名拼错了
3. 主题没重新加载：新版酒馆的激活主题 CSS 存在 settings 里，覆盖主题文件后要先 F5 刷新页面，再在下拉框切换一次主题（切到别的再切回来）才会从磁盘重读
4. 正文字体生效但下拉/输入框不生效：v1.5.1+ 已 fix，所有表单元素显式用 var(--font-sans)


 七、关于布局

font-family 只影响字形，不参与盒模型计算（margin/padding/width 都不变），所以改字体不会破坏任何布局。

唯一例外：代码块的等宽对齐——如果 --font-mono 被换成比例字体，代码不再对齐。所以 --font-mono 建议永远保留一个等宽 fallback。主题默认沿用 JetBrains Mono（英文前半段都是真等宽），中文 fallback 改为思源黑体，代码块对齐没问题。


 版本

- v1.5.1+ 表单元素显式使用 var(--font-sans)，下拉选项、输入框统一跟随主题字体
- v1.5.2  --font-mono 中文 fallback 从 HarmonyOS → Source Han Sans SC VF（真等宽，代码对齐更可靠）
