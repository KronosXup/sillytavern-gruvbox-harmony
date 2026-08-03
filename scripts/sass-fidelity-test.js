/* sass 保真度测试: 把现有CSS原样喂给sass编译, 与原文逐行对比, 列出所有sass自作主张的改动 */
const fs = require('fs');
const path = require('path');
const sass = require('sass');
const ROOT = path.join(__dirname, '..');

function test(name, file) {
  const css = JSON.parse(fs.readFileSync(path.join(ROOT, file), 'utf8')).custom_css;
  const out = sass.compileString(css, { style: 'expanded', charset: false }).css;
  const a = css.split('\n'), b = out.split('\n');
  console.log(`\n===== ${name} =====`);
  console.log('原行数:', a.length, ' 编译后行数:', b.length);
  let diffCount = 0;
  const shown = [];
  const n = Math.max(a.length, b.length);
  for (let i = 0; i < n; i++) {
    if (a[i] !== b[i]) {
      diffCount++;
      if (shown.length < 25) shown.push({ line: i + 1, a: a[i], b: b[i] });
    }
  }
  console.log('差异行:', diffCount);
  // 分类统计差异类型
  const cats = { 空行: 0, 引号: 0, 其他: 0 };
  for (let i = 0; i < n; i++) {
    if (a[i] === b[i]) continue;
    const x = a[i] ?? '', y = b[i] ?? '';
    if (!x.trim() || !y.trim()) cats.空行++;
    else if (x.replace(/'/g, '"') === y.replace(/'/g, '"')) cats.引号++;
    else cats.其他++;
  }
  console.log('分类:', JSON.stringify(cats));
  for (const d of shown) {
    console.log(`L${d.line}`);
    console.log('  原:', (d.a ?? '(无)').slice(0, 140));
    console.log('  新:', (d.b ?? '(无)').slice(0, 140));
  }
}

test('暗色 Blue', 'themes/harmony/Gruvbox-Harmony-Blue.json');
test('亮色 Blue-Light', 'themes/light/Gruvbox-Harmony-Blue-Light.json');
