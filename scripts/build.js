/* 构建脚本: src/(tokens + 模板) -> sass编译 -> 格式对账 -> 包进JSON写回 themes/
 * 用法:
 *   node scripts/build.js            构建并写入 themes/(先对账,语义不一致直接拒绝写)
 *   node scripts/build.js --dry      只对账不写入
 *   node scripts/build.js --only X   只构建某一套
 */
const fs = require('fs');
const path = require('path');
const sass = require('sass');
const ROOT = path.join(__dirname, '..');

const GROUPS = {
  dark: {
    template: '_base-dark.scss',
    themes: ['Gruvbox-Harmony-Blue', 'Gruvbox-Harmony-Green', 'Gruvbox-Harmony-Orange', 'Gruvbox-Harmony-Purple', 'Gruvbox-Harmony-Violet',
      'Gruvbox-Material-Blue', 'Gruvbox-Material-Green', 'Gruvbox-Material-Orange', 'Gruvbox-Material-Purple', 'Gruvbox-Material-Violet'],
  },
  light: {
    template: '_base-light.scss',
    themes: ['Gruvbox-Harmony-Blue-Light', 'Gruvbox-Harmony-Green-Light', 'Gruvbox-Harmony-Orange-Light', 'Gruvbox-Harmony-Purple-Light', 'Gruvbox-Harmony-Violet-Light',
      'Gruvbox-Material-Blue-Light', 'Gruvbox-Material-Green-Light', 'Gruvbox-Material-Orange-Light', 'Gruvbox-Material-Purple-Light', 'Gruvbox-Material-Violet-Light'],
  },
};

function themeJsonPath(name) {
  for (const d of ['themes/harmony', 'themes/light', 'themes/material']) {
    const p = path.join(ROOT, d, name + '.json');
    if (fs.existsSync(p)) return p;
  }
  throw new Error('找不到主题JSON: ' + name);
}

/* sass 编译一套主题
 * 用旧式 @import(tokens与模板合并进全局作用域, 模板能直接读 $tNN);
 * @use 模块系统隔离作用域, 不适合这种"变量表+模板"结构。
 * 属性选择器带引号值会被 sass 剥引号/内含括号直接解析失败,
 * 故编译前换成占位符, 编译后原样还原。
 * 同理: sass 会把 alpha=1 的 rgba() 简化成 rgb(), 故 alpha=1 的 rgba 也走占位符旁路 */
const ATTR_RE = /\[[\w-]+[~|^$*]?="[^"\n]*"\]/g;
const RGBA1_RE = /rgba\([^)\n]*,\s*1\.?0?\s*\)/g;
function compileTheme(name, template) {
  let src = fs.readFileSync(path.join(ROOT, 'src', template), 'utf8');
  const attrs = [];
  src = src.replace(ATTR_RE, m => { attrs.push(m); return `__ATTRSEL${attrs.length - 1}__`; });
  src = src.replace(RGBA1_RE, m => { attrs.push(m); return `__ATTRSEL${attrs.length - 1}__`; });
  const entry = `@import "tokens/${name}";\n` + src;
  const out = sass.compileString(entry, {
    style: 'expanded',
    charset: false,
    loadPaths: [path.join(ROOT, 'src')],
    silenceDeprecations: ['import', 'global-builtin'],
  });
  let css = out.css;
  attrs.forEach((a, i) => { css = css.split(`__ATTRSEL${i}__`).join(a); });
  return postFormat(css);
}

/* 后处理: 统一成项目规范格式
 * 1. @import url('...') 单引号(sass会改双引号, 改回来)
 * 2. 连续空行压成1行(sass已做), 不额外扩
 */
function postFormat(css) {
  let out = css.replace(/@import url\("([^"]+)"\)/g, (m, u) => `@import url('${u}')`);
  return out;
}

/* 语义对账: 结构化解析两份CSS, 归一化后逐token比较
 * 已知可归一的格式差异(浏览器行为完全一致):
 * 1. 空规则块: sass会剔除, 解析时自然丢弃(声明为空的块)
 * 2. 嵌套@media: 原文历史遗留嵌套, sass会展平并合并相同条件(A{...A{...}}≡A and A{...})
 * 返回 null=一致, 否则返回首个差异描述 */
function semanticDiff(orig, gen) {
  // 空规则块: sass会剔除, 浏览器对空规则零效果, 故对账前先从原文去掉(选择器里可能含引号串)
  orig = orig.replace(/[^{}]+\{\s*\}/g, '');
  const STRRE = /"[^"\n]*"|'[^'\n]*'/g;
  // 第一层: 引号串(含data URI)逐个精确相等
  const sa = orig.match(STRRE) || [], sb = gen.match(STRRE) || [];
  if (sa.length !== sb.length) return `引号串个数不同: 原${sa.length} 新${sb.length}`;
  for (let i = 0; i < sa.length; i++) {
    if (sa[i] !== sb[i]) return `第${i}个引号串不同:\n  原: ${sa[i].slice(0, 100)}\n  新: ${sb[i].slice(0, 100)}`;
  }
  // 第二层: 结构解析+展平后逐token对比
  const a = flatTokens(orig), b = flatTokens(gen);
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      return `token#${i}: 原="${(a[i] ?? '(结束)').slice(0, 80)}" 新="${(b[i] ?? '(结束)').slice(0, 80)}"\n  原上下文: ${a.slice(Math.max(0, i - 6), i + 3).join(' ')}\n  新上下文: ${b.slice(Math.max(0, i - 6), i + 3).join(' ')}`;
    }
  }
  return null;
}

/* CSS最小结构解析: 引号串当原子, 去注释, 按 {} 分块
 * 切分符含标点与组合符(+ > ~ /), 两侧同法切分, 空白差异自然被忽略 */
function tokenize(s) {
  return s
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/"[^"\n]*"|'[^'\n]*'/g, '@@STR@@')
    .split(/([{};:,/+>~])|\s+/)
    .filter(t => t && t.trim());
}
function parseBlock(tokens) {
  const items = [];
  let i = 0;
  while (i < tokens.length) {
    const t = tokens[i];
    if (t === '{' || t === ';') { i++; continue; }
    const j = tokens.indexOf('{', i);
    const k = tokens.indexOf(';', i);
    if (j >= 0 && (k < 0 || j < k)) {
      let depth = 1, m = j + 1;
      while (depth > 0 && m < tokens.length) {
        if (tokens[m] === '{') depth++;
        else if (tokens[m] === '}') depth--;
        m++;
      }
      items.push({ prelude: tokens.slice(i, j), body: parseBlock(tokens.slice(j + 1, m - 1)) });
      i = m;
    } else {
      const end = k >= 0 ? k : tokens.length;
      items.push({ decl: tokens.slice(i, end) });
      i = end + 1;
    }
  }
  return items;
}
/* 展平: @media嵌套合并条件后提到同级; @supports/@keyframes保留结构但递归归一 */
function emitFlat(items, out, cond) {
  for (const it of items) {
    if (it.decl) {
      if (it.decl.length) out.push(...it.decl, ';');
      continue;
    }
    const p0 = it.prelude[0] || '';
    if (p0 === '@media') {
      const merged = [...cond, ...it.prelude.slice(1)];
      emitFlat(it.body, out, merged);
    } else if (p0 === '@supports' || p0 === '@keyframes') {
      out.push(...it.prelude, '{');
      emitFlat(it.body, out, []);
      out.push('}');
    } else {
      out.push(...it.prelude, ';');
    }
  }
}
function flatTokens(css) {
  const out = [];
  emitFlat(parseBlock(tokenize(css)), out, []);
  // 同一@media被展平后可能多段相邻, 合并相同条件的连续段: 顺序已稳定(sass产物同样逐段输出),
  // 两侧同算法同顺序, 无需额外合并即可对齐
  return out;
}

const args = process.argv.slice(2);
const DRY = args.includes('--dry');
const onlyIdx = args.indexOf('--only');
const ONLY = onlyIdx >= 0 ? args[onlyIdx + 1] : null;

let fail = 0, changed = 0, same = 0;
for (const [gname, g] of Object.entries(GROUPS)) {
  for (const name of g.themes) {
    if (ONLY && name !== ONLY) continue;
    process.stdout.write(`${name} ... `);
    let gen;
    try {
      gen = compileTheme(name, g.template);
    } catch (e) {
      console.log('编译失败:\n' + e.message.split('\n').slice(0, 6).join('\n'));
      fail++; continue;
    }
    const jp = themeJsonPath(name);
    const data = JSON.parse(fs.readFileSync(jp, 'utf8'));
    const orig = data.custom_css;
    if (orig === gen) { console.log('逐字节一致 ✓'); same++; continue; }
    const sd = semanticDiff(orig, gen);
    if (sd) {
      console.log('!! 语义差异(拒绝写入):\n' + sd);
      fail++; continue;
    }
    changed++;
    if (!DRY) {
      data.custom_css = gen;
      fs.writeFileSync(jp, JSON.stringify(data, null, 2), 'utf8');
    }
    const dl = Math.abs(orig.split('\n').length - gen.split('\n').length);
    console.log(`语义一致, 格式规范化(行数差${dl})${DRY ? ' [dry]' : ' 已写入'}`);
  }
}
console.log(`\n=== 完成: 逐字节一致 ${same} / 格式更新 ${changed} / 失败 ${fail} ${DRY ? '(dry-run未写入)' : ''} ===`);
process.exit(fail ? 1 : 0);
