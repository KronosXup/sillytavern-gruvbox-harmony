// ============================================================
// 外观速调(酒馆助手脚本版 v4.2)
// 配套主题: Gruvbox Harmony/Material 全系列(--avatar-mode / --font-* 变量机制)
// ============================================================
// 功能: 魔法棒(扩展)菜单里加一个"外观速调"条目,点开居中大面板:
//   头像: 电影大卡 / 传统小圆
//   字体: sans / serif / mono 三类分管,每类独立填
//         "字体CSS链接 + 字体名"(等效 _fonts-local.scss 的玩法),
//         三类各挂独立 <link>,可同时加载三种不同字体。
//   避让: 移动端底部避让高度/末尾间隔(全面屏手势条设备用,默认关),
//         注入 ≤1000px 门控 CSS,设备差异问题住运行时层不动主题。
// 使用: 脚本库导入本脚本(或配套 JSON),启用即可。
// 要点: 酒馆助手脚本运行在 iframe 内,只有 $/jQuery/toastr 被桥接到
//       父页面;因此本脚本全部 DOM 操作显式走 window.parent。
// ============================================================

(function () {
  'use strict';

  var KEY_AVATAR = 'appearance_avatar_mode'; // 0=大卡 1=小圆
  var KEY_GESTURE_PAD = 'appearance_gesture_pad'; // 移动端避让高度px 0=关
  var KEY_GESTURE_GAP = 'appearance_gesture_gap'; // 移动端末尾间隔px 0=关
  var ITEM_ID = 'appearance_tune_menu_container';
  var PANEL_ID = 'appearance_tune_panel';
  var BACKDROP_ID = 'appearance_tune_backdrop';
  var resizeHandler = null;

  // 三类字体:[键, CSS变量, 显示名, 兜底尾巴]
  var FONT_CLASSES = [
    ['sans', '--font-sans', 'Sans · 正文与界面', 'system-ui, sans-serif'],
    ['serif', '--font-serif', 'Serif · 引号文本', 'system-ui, sans-serif'],
    ['mono', '--font-mono', 'Mono · 代码块', 'ui-monospace, Menlo, Consolas, monospace'],
  ];
  var SYSTEM_SANS = "system-ui, -apple-system, 'Segoe UI', Roboto, 'PingFang SC', 'Microsoft YaHei', sans-serif";
  var SYSTEM_MONO = 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';

  // ---------- 父页面桥接(脚本在 iframe 里,直接 document 是空的) ----------
  var P = window.parent;
  var Pdoc = P.document;
  function cs(el) {
    try { return P.getComputedStyle(el); } catch (e) { return getComputedStyle(el); }
  }
  var store = (function () {
    try { if (P.localStorage) return P.localStorage; } catch (e) {}
    return localStorage;
  })();
  function sget(k) { try { return store.getItem(k); } catch (e) { return null; } }
  function sset(k, v) { try { store.setItem(k, v); } catch (e) {} }
  function sdel(k) { try { store.removeItem(k); } catch (e) {} }

  function toast(msg, warn) {
    if (typeof toastr !== 'undefined') {
      (warn ? toastr.warning : toastr.info)(msg, '外观速调');
    }
  }

  // ---------- 头像模式 ----------
  function getChat() { return Pdoc.getElementById('chat'); }

  // 读主题基准值:临时摘下内联覆盖,读完必须还原
  function readBase(chat) {
    var prev = chat.style.getPropertyValue('--avatar-mode');
    chat.style.removeProperty('--avatar-mode');
    var v = cs(chat).getPropertyValue('--avatar-mode').trim();
    if (prev !== '') chat.style.setProperty('--avatar-mode', prev);
    return v;
  }
  function themeHasAvatarSwitch(chat) { return readBase(chat) !== ''; }
  function avatarSaved() {
    var s = sget(KEY_AVATAR);
    return (s === '0' || s === '1') ? parseInt(s, 10) : null;
  }
  function avatarEffective(chat) {
    var s = avatarSaved();
    if (s !== null) return s;
    return readBase(chat) === '1' ? 1 : 0;
  }
  function applyAvatar(chat, mode) {
    chat.style.setProperty('--avatar-mode', String(mode));
  }

  // ---------- 字体 ----------
  function fontKeyUrl(cls) { return 'appearance_font_url_' + cls; }
  function fontKeyFamily(cls) { return 'appearance_font_family_' + cls; }
  function fontLinkId(cls) { return 'appearance_font_link_' + cls; }

  function ensureFontLink(cls, url) {
    var link = Pdoc.getElementById(fontLinkId(cls));
    if (!url) { if (link) link.remove(); return; }
    if (!link) {
      link = Pdoc.createElement('link');
      link.id = fontLinkId(cls);
      link.rel = 'stylesheet';
      Pdoc.head.appendChild(link);
    }
    if (link.getAttribute('href') !== url) link.setAttribute('href', url);
  }

  // 应用某一类:url 空 = 恢复主题默认
  function applyFontClass(cls, varName, fallback, url, family) {
    var root = Pdoc.documentElement;
    if (!url || !family) {
      ensureFontLink(cls, null);
      root.style.removeProperty(varName);
      return;
    }
    ensureFontLink(cls, url);
    root.style.setProperty(varName, "'" + family.replace(/'/g, '') + "', " + fallback);
  }

  function restoreAllFonts() {
    FONT_CLASSES.forEach(function (c) {
      var url = sget(fontKeyUrl(c[0]));
      var family = sget(fontKeyFamily(c[0]));
      applyFontClass(c[0], c[1], c[3], url, family);
    });
  }

  function systemAllFonts() {
    var root = Pdoc.documentElement;
    FONT_CLASSES.forEach(function (c) {
      ensureFontLink(c[0], null);
      root.style.setProperty(c[1], c[0] === 'mono' ? SYSTEM_MONO : SYSTEM_SANS);
    });
    FONT_CLASSES.forEach(function (c) { sdel(fontKeyUrl(c[0])); sdel(fontKeyFamily(c[0])); });
    sset('appearance_font_system', '1');
  }

  // ---------- 移动端底部避让(手势条设备) ----------
  function gestureVals() {
    var pad = parseInt(sget(KEY_GESTURE_PAD), 10); if (isNaN(pad) || pad < 0) pad = 0;
    var gap = parseInt(sget(KEY_GESTURE_GAP), 10); if (isNaN(gap) || gap < 0) gap = 0;
    return { pad: pad, gap: gap };
  }
  // 独立 style tag:避让是设备差异,住脚本层;0/空=移除规则零影响
  function applyGesture() {
    var v = gestureVals();
    var st = Pdoc.getElementById('appearance_gesture_style');
    if (!v.pad && !v.gap) { if (st) st.remove(); return; }
    if (!st) {
      st = Pdoc.createElement('style');
      st.id = 'appearance_gesture_style';
      Pdoc.head.appendChild(st);
    }
    var css = '@media screen and (max-width: 1000px) {';
    // 避让:输入栏内部加高,自身底色下填手势区,不露异色带
    if (v.pad) css += '#send_form { padding-bottom: calc(env(safe-area-inset-bottom, 0px) + ' + v.pad + 'px) !important; }';
    // 间隔:chat 末尾留白,消息+箭头行整体抬(值须先吸收箭头行 30px 外挂)
    if (v.gap) css += '#chat { padding-bottom: ' + v.gap + 'px !important; }';
    css += '}';
    st.textContent = css;
  }

  // ---------- 面板 ----------
  function injectStyle() {
    var st = Pdoc.getElementById('appearance_tune_style');
    if (!st) {
      st = Pdoc.createElement('style');
      st.id = 'appearance_tune_style';
      Pdoc.head.appendChild(st);
    }
    // 总是整体覆写:旧版本脚本若先注入过样式,新版必须盖掉它的缓存
    st.textContent =
      '#' + BACKDROP_ID + ' {' +
      '  position: fixed; inset: 0; z-index: 29999;' +
      '  background: rgba(0,0,0,0.5);' +
      '}' +
      '#' + PANEL_ID + ' {' +
      '  position: fixed; left: 50%; top: 50%; transform: translate(-50%,-50%);' +
      '  z-index: 30000; width: min(430px, 92vw); max-height: 80vh;' +
      '  overflow-y: auto; box-sizing: border-box;' +
      '  background-color: var(--SmartThemeBlurTintColor);' +
      '  -webkit-backdrop-filter: blur(var(--SmartThemeBlurStrength));' +
      '  backdrop-filter: blur(var(--SmartThemeBlurStrength));' +
      '  border: 1px solid var(--SmartThemeBorderColor);' +
      '  border-radius: 10px; padding: 10px 14px 14px;' +
      '  box-shadow: 0 4px 24px rgba(0,0,0,0.5);' +
      '  font-size: var(--mainFontSize);' +
      '  color: var(--SmartThemeBodyColor);' +
      '}' +
      '#' + PANEL_ID + ' .at-head {' +
      '  display: flex; align-items: center; justify-content: space-between;' +
      '  font-weight: 600; font-size: 1.1em; margin-bottom: 8px;' +
      '}' +
      '#' + PANEL_ID + ' .at-close { cursor: pointer; opacity: 0.7; padding: 0 6px; }' +
      '#' + PANEL_ID + ' .at-close:hover { opacity: 1; }' +
      '#' + PANEL_ID + ' .at-group {' +
      '  margin-top: 10px; padding-top: 8px;' +
      '  border-top: 1px solid var(--SmartThemeBorderColor);' +
      '  font-size: 0.85em; opacity: 0.65;' +
      '}' +
      '#' + PANEL_ID + ' .at-row { display: flex; gap: 8px; margin-top: 6px; flex-wrap: wrap; }' +
      '#' + PANEL_ID + ' .at-opt {' +
      '  flex: 1; min-width: 120px; text-align: center;' +
      '  padding: 6px 8px; border-radius: 6px; cursor: pointer;' +
      '  border: 1px solid var(--SmartThemeBorderColor);' +
      '}' +
      '#' + PANEL_ID + ' .at-opt:hover {' +
      '  background: color-mix(in srgb, var(--SmartThemeQuoteColor) 15%, transparent);' +
      '}' +
      '#' + PANEL_ID + ' .at-opt.at-cur {' +
      '  color: var(--SmartThemeQuoteColor); font-weight: 600;' +
      '  border-color: var(--SmartThemeQuoteColor);' +
      '}' +
      '#' + PANEL_ID + ' .at-block {' +
      '  margin-top: 8px; padding: 8px; border-radius: 8px;' +
      '  border: 1px solid var(--SmartThemeBorderColor);' +
      '}' +
      '#' + PANEL_ID + ' .at-block-title { font-size: 0.9em; margin-bottom: 6px; opacity: 0.85; }' +
      '#' + PANEL_ID + ' .at-input {' +
      '  width: 100%; box-sizing: border-box; margin-bottom: 6px;' +
      '  background: rgba(0,0,0,0.3); color: var(--SmartThemeBodyColor);' +
      '  border: 1px solid var(--SmartThemeBorderColor); border-radius: 4px;' +
      '  padding: 5px 8px; font-size: 0.9em;' +
      '}' +
      '#' + PANEL_ID + ' .at-mini {' +
      '  display: inline-block; padding: 4px 10px; margin-right: 6px;' +
      '  border-radius: 6px; cursor: pointer; font-size: 0.85em;' +
      '  border: 1px solid var(--SmartThemeBorderColor);' +
      '}' +
      '#' + PANEL_ID + ' .at-mini:hover {' +
      '  background: color-mix(in srgb, var(--SmartThemeQuoteColor) 18%, transparent);' +
      '}' +
      '#' + PANEL_ID + ' .at-state { font-size: 0.75em; opacity: 0.6; margin-left: 4px; }';
    Pdoc.head.appendChild(st);
  }

  function closePanel() {
    if (resizeHandler) { P.removeEventListener('resize', resizeHandler); resizeHandler = null; }
    var b = Pdoc.getElementById(BACKDROP_ID);
    if (b) b.remove();
    var p = Pdoc.getElementById(PANEL_ID);
    if (p) p.remove();
  }

  // JS硬居中:样式表里的百分比top/translate/max-height会被主题或插件的
  // !important规则、毛玻璃包含块等任意一层劫持(实测面板被顶到屏幕顶部),
  // 改用像素算好的left/top内联!important钉死,尺寸同步钉成px,resize重算
  function layoutPanel(p) {
    var vw = P.innerWidth || Pdoc.documentElement.clientWidth;
    var vh = P.innerHeight || Pdoc.documentElement.clientHeight;
    p.style.setProperty('width', Math.min(430, Math.round(vw * 0.92)) + 'px', 'important');
    p.style.setProperty('max-height', Math.round(vh * 0.8) + 'px', 'important');
    var pw = p.offsetWidth || 430;
    var ph = p.offsetHeight || Math.round(vh * 0.8);
    p.style.setProperty('left', Math.max(4, Math.round((vw - pw) / 2)) + 'px', 'important');
    p.style.setProperty('top', Math.max(4, Math.round((vh - ph) / 2)) + 'px', 'important');
    p.style.setProperty('transform', 'none', 'important');
  }

  function el(tag, cls, text) {
    var e = Pdoc.createElement(tag);
    if (cls) e.className = cls;
    if (text) e.textContent = text;
    return e;
  }

  function openPanel() {
    closePanel();
    var chat = getChat();
    if (!chat) return;
    injectStyle();

    var backdrop = el('div');
    backdrop.id = BACKDROP_ID;
    backdrop.addEventListener('click', closePanel);
    var p = el('div');
    p.id = PANEL_ID;
    p.addEventListener('click', function (ev) { ev.stopPropagation(); });

    // ---- 头部 ----
    var head = el('div', 'at-head');
    head.appendChild(el('span', null, '外观速调'));
    var x = el('span', 'at-close', '✕');
    x.addEventListener('click', closePanel);
    head.appendChild(x);
    p.appendChild(head);

    // ---- 头像组 ----
    if (themeHasAvatarSwitch(chat)) {
      p.appendChild(el('div', 'at-group', '头像'));
      var row = el('div', 'at-row');
      var curAvatar = avatarEffective(chat);
      var optBig = el('div', 'at-opt' + (curAvatar === 0 ? ' at-cur' : ''), '电影大卡');
      optBig.addEventListener('click', function () {
        applyAvatar(chat, 0); sset(KEY_AVATAR, '0'); toast('已切换:电影大卡'); refreshAvatarMarks();
      });
      var optSmall = el('div', 'at-opt' + (curAvatar === 1 ? ' at-cur' : ''), '传统小圆');
      optSmall.addEventListener('click', function () {
        applyAvatar(chat, 1); sset(KEY_AVATAR, '1'); toast('已切换:传统小圆'); refreshAvatarMarks();
      });
      row.appendChild(optBig);
      row.appendChild(optSmall);
      p.appendChild(row);
      function refreshAvatarMarks() {
        var c = avatarEffective(chat);
        optBig.className = 'at-opt' + (c === 0 ? ' at-cur' : '');
        optSmall.className = 'at-opt' + (c === 1 ? ' at-cur' : '');
      }
    }

    // ---- 字体组 ----
    p.appendChild(el('div', 'at-group', '字体(按类配置,各类独立加载)'));

    // 全局快捷
    var quick = el('div', 'at-row');
    var bSys = el('div', 'at-opt', '一键全部系统原生');
    bSys.addEventListener('click', function () {
      systemAllFonts(); toast('已切换:全部系统原生字体'); buildFontBlocks();
    });
    var bReset = el('div', 'at-opt', '一键全部主题默认');
    bReset.addEventListener('click', function () {
      FONT_CLASSES.forEach(function (c) { sdel(fontKeyUrl(c[0])); sdel(fontKeyFamily(c[0])); });
      sdel('appearance_font_system');
      FONT_CLASSES.forEach(function (c) { applyFontClass(c[0], c[1], c[3], null, null); });
      toast('已恢复:全部主题默认字体'); buildFontBlocks();
    });
    quick.appendChild(bSys);
    quick.appendChild(bReset);
    p.appendChild(quick);

    // 三类配置块的容器(重建用)
    var blocksHost = el('div');
    p.appendChild(blocksHost);

    function buildFontBlocks() {
      blocksHost.textContent = '';
      FONT_CLASSES.forEach(function (c) {
        var cls = c[0], varName = c[1], title = c[2], fallback = c[3];
        var block = el('div', 'at-block');
        var t = el('div', 'at-block-title');
        t.appendChild(Pdoc.createTextNode(title));
        var url = sget(fontKeyUrl(cls));
        var family = sget(fontKeyFamily(cls));
        var stateTxt = (url && family) ? '自定义' : (sget('appearance_font_system') === '1' ? '系统原生' : '主题默认');
        t.appendChild(el('span', 'at-state', '· 当前: ' + stateTxt));
        block.appendChild(t);

        var inpUrl = el('input', 'at-input');
        inpUrl.placeholder = '字体 CSS 链接 https://...css';
        inpUrl.value = url || '';
        var inpFamily = el('input', 'at-input');
        inpFamily.placeholder = "字体名 如 'LXGW WenKai Screen'";
        inpFamily.value = family || '';
        block.appendChild(inpUrl);
        block.appendChild(inpFamily);

        var bApply = el('span', 'at-mini', '应用');
        bApply.addEventListener('click', function () {
          var u = inpUrl.value.trim();
          var f = inpFamily.value.trim();
          if (!u || !f) { toast('链接和字体名都要填', true); return; }
          sset(fontKeyUrl(cls), u);
          sset(fontKeyFamily(cls), f);
          sdel('appearance_font_system');
          applyFontClass(cls, varName, fallback, u, f);
          toast('已应用: ' + title);
          buildFontBlocks();
        });
        var bClear = el('span', 'at-mini', '恢复默认');
        bClear.addEventListener('click', function () {
          sdel(fontKeyUrl(cls));
          sdel(fontKeyFamily(cls));
          sdel('appearance_font_system');
          applyFontClass(cls, varName, fallback, null, null);
          toast('已恢复默认: ' + title);
          buildFontBlocks();
        });
        var btns = el('div');
        btns.appendChild(bApply);
        btns.appendChild(bClear);
        block.appendChild(btns);
        blocksHost.appendChild(block);
      });
    }
    buildFontBlocks();

    // ---- 避让组 ----
    p.appendChild(el('div', 'at-group', '移动端底部避让(全面屏手势条设备)'));
    var gBlock = el('div', 'at-block');
    var gT = el('div', 'at-block-title');
    gT.appendChild(Pdoc.createTextNode('底部避让 / 箭头间隔'));
    function gestureStateTxt() {
      var v = gestureVals();
      return (v.pad || v.gap) ? '· 当前: 开启(' + v.pad + '/' + v.gap + ')' : '· 当前: 关闭';
    }
    var gState = el('span', 'at-state', gestureStateTxt());
    gT.appendChild(gState);
    gBlock.appendChild(gT);
    var gv0 = gestureVals();
    var inpPad = el('input', 'at-input');
    inpPad.placeholder = '推荐22 输入栏上抬,不与底部手势条重叠';
    inpPad.value = gv0.pad ? String(gv0.pad) : '';
    var inpGap = el('input', 'at-input');
    inpGap.placeholder = '推荐60 拉开与滑动箭头距离防误碰';
    inpGap.value = gv0.gap ? String(gv0.gap) : '';
    gBlock.appendChild(inpPad);
    gBlock.appendChild(inpGap);
    var bGApply = el('span', 'at-mini', '应用');
    bGApply.addEventListener('click', function () {
      var pad = parseInt(inpPad.value, 10); if (isNaN(pad) || pad < 0) pad = 0;
      var gap = parseInt(inpGap.value, 10); if (isNaN(gap) || gap < 0) gap = 0;
      sset(KEY_GESTURE_PAD, String(pad));
      sset(KEY_GESTURE_GAP, String(gap));
      applyGesture();
      toast((pad || gap) ? '已应用: 底部避让 ' + pad + '/' + gap : '已应用: 底部避让关闭');
      gState.textContent = gestureStateTxt();
    });
    var bGClear = el('span', 'at-mini', '恢复默认');
    bGClear.addEventListener('click', function () {
      sdel(KEY_GESTURE_PAD);
      sdel(KEY_GESTURE_GAP);
      applyGesture();
      toast('已恢复默认: 底部避让关闭');
      gState.textContent = gestureStateTxt();
    });
    var gBtns = el('div');
    gBtns.appendChild(bGApply);
    gBtns.appendChild(bGClear);
    gBlock.appendChild(gBtns);
    p.appendChild(gBlock);

    Pdoc.body.appendChild(backdrop);
    Pdoc.body.appendChild(p);
    layoutPanel(p);
    if (resizeHandler) P.removeEventListener('resize', resizeHandler);
    resizeHandler = function () { layoutPanel(p); };
    P.addEventListener('resize', resizeHandler);
  }

  // ---------- 魔法棒菜单条目 ----------
  function ensureMenuItem() {
    var menu = Pdoc.getElementById('extensionsMenu');
    if (!menu || Pdoc.getElementById(ITEM_ID)) return;
    var box = Pdoc.createElement('div');
    box.id = ITEM_ID;
    box.className = 'extension_container interactable';
    box.tabIndex = 0;
    box.innerHTML =
      '<div class="list-group-item flex-container flexGap5 interactable" role="listitem" tabindex="0" title="头像样式 / 字体(sans/serif/mono) 快捷配置">' +
      '  <div class="fa-fw fa-solid fa-wand-magic-sparkles extensionsMenuExtensionButton"></div>' +
      '  <span>外观速调</span>' +
      '</div>';
    var row = box.firstChild;
    row.addEventListener('click', function () {
      menu.style.display = 'none';
      openPanel();
    });
    menu.appendChild(box);
  }

  // ---------- 启动 ----------
  function boot() {
    var chat = getChat();
    if (chat && avatarSaved() !== null && themeHasAvatarSwitch(chat)) {
      applyAvatar(chat, avatarSaved());
    }
    if (sget('appearance_font_system') === '1') {
      // 系统原生是纯变量覆盖,直接恢复
      var root = Pdoc.documentElement;
      FONT_CLASSES.forEach(function (c) {
        root.style.setProperty(c[1], c[0] === 'mono' ? SYSTEM_MONO : SYSTEM_SANS);
      });
    } else {
      restoreAllFonts();
    }
    applyGesture();
    ensureMenuItem();
  }

  // 立即执行 + 巡检补挂 + APP_READY 兜底
  boot();
  setInterval(ensureMenuItem, 3000);
  if (typeof eventOn === 'function' && typeof tavern_events !== 'undefined' && tavern_events.APP_READY) {
    eventOn(tavern_events.APP_READY, boot);
  }
})();
