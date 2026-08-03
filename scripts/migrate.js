/* 迁移脚本: 从现有20套JSON生成 src/ 下的SCSS源层
 * 策略: 位置感知(position-aware)令牌提取 —— 以两份参照主题为模板,
 * 把"跨主题会变化的颜色位置"替换为 #{$令牌}, 令牌值由每套自己的值填充。
 * 不用字面量全局替换, 避免同色不同语义的冲突。
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

function loadTheme(name) {
  for (const d of ['themes/harmony', 'themes/light', 'themes/material']) {
    const p = path.join(ROOT, d, name + '.json');
    if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p, 'utf8'));
  }
  throw new Error('theme not found: ' + name);
}

const CREG = /#[0-9a-fA-F]{3,8}\b|rgba?\([^)]*\)|%23[0-9a-fA-F]{6}/g;

/* 对参照组做逐行比对, 得到:
 * slots: [{line, idx, ref}] —— 模板中需要令牌化的位置(ref=参照主题该位置的颜色字面量)
 * values: Map(themeName -> [{line, idx, color}]) —— 每套主题在同样位置的自己的值
 */
function censusGroup(refName, others) {
  const refLines = loadTheme(refName).custom_css.split('\n');
  const otherLines = others.map(n => ({ n, lines: loadTheme(n).custom_css.split('\n') }));
  if (refLines.length !== 5542 && refLines.length !== 5873) throw new Error('意外行数 ' + refName);
  const slots = [];
  const values = new Map(); others.forEach(n => values.set(n, []));
  for (let i = 0; i < refLines.length; i++) {
    const rc = refLines[i].match(CREG) || [];
    if (!rc.length) continue;
    // 该行的每个颜色位置, 是否有任何主题不同
    for (let k = 0; k < rc.length; k++) {
      let varies = false;
      for (const o of otherLines) {
        const oc = (o.lines[i] || '').match(CREG) || [];
        if (oc.length !== rc.length) throw new Error(`颜色个数不一致 ${refName} vs ${o.n} L${i + 1}: ${rc.length} vs ${oc.length}`);
        if (oc[k] !== rc[k]) {
          varies = true;
          values.get(o.n).push({ line: i, idx: k, color: oc[k] });
        }
      }
      if (varies) slots.push({ line: i, idx: k, ref: rc[k] });
    }
  }
  return { refLines, slots, values };
}

/* 给令牌起名: 按出现顺序 tNN, 同时打印语义线索(所在行附近的选择器) */
function buildGroup(refName, others, outTokensDir, outTemplate) {
  const { refLines, slots, values } = censusGroup(refName, others);
  console.log(`\n=== ${refName}: ${slots.length} 个令牌位 ===`);
  const tokenOfSlot = slots.map((s, i) => 't' + String(i + 1).padStart(2, '0'));
  // 打印每个令牌: 参照值 + 上下文
  slots.forEach((s, i) => {
    let ctx = '';
    for (let j = s.line; j >= Math.max(0, s.line - 12); j--) {
      if (/\{/.test(refLines[j]) && !/:/.test(refLines[j].split('{')[0].slice(-1))) { ctx = refLines[j].trim().slice(0, 60); break; }
      const mm = refLines[j].match(/^([.#@&:\w\[\]=" *>,+~-]+)\s*\{?\s*$/);
      if (mm) { ctx = refLines[j].trim().slice(0, 60); break; }
    }
    console.log(`  ${tokenOfSlot[i]}  ${s.ref.padEnd(24)} L${s.line + 1}  ${ctx}`);
  });

  // 生成模板: 把参照行中的令牌位颜色替换为插值
  const tplLines = refLines.slice();
  // 按行分组处理, 同一行多个令牌从后往前替换(避免位移)
  const byLine = new Map();
  slots.forEach((s, i) => { if (!byLine.has(s.line)) byLine.set(s.line, []); byLine.get(s.line).push({ ...s, token: tokenOfSlot[i] }); });
  for (const [ln, list] of byLine) {
    let lineText = tplLines[ln];
    // 从后往前: 找到第 idx 个颜色出现并替换
    const sorted = list.sort((a, b) => b.idx - a.idx);
    for (const s of sorted) {
      const matches = [...lineText.matchAll(CREG)];
      const m = matches[s.idx];
      if (!m || m[0] !== s.ref) throw new Error(`L${ln + 1} 第${s.idx}个颜色对不上: 期望 ${s.ref} 实得 ${m && m[0]}`);
      const isEncoded = s.ref.startsWith('%23');
      const interp = isEncoded ? `%23#{$${s.token}}` : `#{$${s.token}}`;
      lineText = lineText.slice(0, m.index) + interp + lineText.slice(m.index + m[0].length);
    }
    tplLines[ln] = lineText;
  }
  // 标题注释里的主题名也令牌化
  const titleIdx = tplLines.findIndex(l => l.includes(refName));
  if (titleIdx >= 0) tplLines[titleIdx] = tplLines[titleIdx].replace(refName, '#{$theme-name}');
  fs.writeFileSync(outTemplate, tplLines.join('\n'), 'utf8');
  console.log(`  模板已写: ${path.relative(ROOT, outTemplate)} (标题行 L${titleIdx + 1})`);

  // 每套主题的令牌值文件
  for (const n of others) {
    const lines = ['// ' + n + ' 令牌值(迁移脚本自动生成, 语义名待人工整理)'];
    lines.push(`$theme-name: "${n}";`);
    const vals = values.get(n);
    slots.forEach((s, i) => {
      const hit = vals.find(v => v.line === s.line && v.idx === s.idx);
      const raw = hit ? hit.color : s.ref; // 未变化=用参照值
      const v = raw.startsWith('%23') ? raw.slice(3) : raw;
      // 值一律加引号存字符串: sass 插值逐字输出, 避免颜色对象被规范化(rgba↔hex互转/大小写改变)
      lines.push(`$${tokenOfSlot[i]}: "${v}"; // 参照: ${s.ref}`);
    });
    fs.writeFileSync(path.join(outTokensDir, n + '.scss'), lines.join('\n') + '\n', 'utf8');
  }
  // 参照主题自己的令牌文件(全用参照值)
  const refSelf = ['// ' + refName + ' 令牌值(参照)'];
  refSelf.push(`$theme-name: "${refName}";`);
  slots.forEach((s, i) => {
    const v = s.ref.startsWith('%23') ? s.ref.slice(3) : s.ref;
    refSelf.push(`$${tokenOfSlot[i]}: "${v}";`);
  });
  fs.writeFileSync(path.join(outTokensDir, refName + '.scss'), refSelf.join('\n') + '\n', 'utf8');
  console.log(`  令牌文件 x${others.length + 1} 已写: ${path.relative(ROOT, outTokensDir)}/`);
}

const SRC = path.join(ROOT, 'src');
fs.mkdirSync(path.join(SRC, 'tokens'), { recursive: true });

buildGroup('Gruvbox-Harmony-Blue',
  ['Gruvbox-Harmony-Green', 'Gruvbox-Harmony-Orange', 'Gruvbox-Harmony-Purple', 'Gruvbox-Harmony-Violet',
    'Gruvbox-Material-Blue', 'Gruvbox-Material-Green', 'Gruvbox-Material-Orange', 'Gruvbox-Material-Purple', 'Gruvbox-Material-Violet'],
  path.join(SRC, 'tokens'), path.join(SRC, '_base-dark.scss'));

buildGroup('Gruvbox-Harmony-Blue-Light',
  ['Gruvbox-Harmony-Green-Light', 'Gruvbox-Harmony-Orange-Light', 'Gruvbox-Harmony-Purple-Light', 'Gruvbox-Harmony-Violet-Light',
    'Gruvbox-Material-Blue-Light', 'Gruvbox-Material-Green-Light', 'Gruvbox-Material-Orange-Light', 'Gruvbox-Material-Purple-Light', 'Gruvbox-Material-Violet-Light'],
  path.join(SRC, 'tokens'), path.join(SRC, '_base-light.scss'));

console.log('\n迁移源层生成完毕。');
