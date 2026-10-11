// The daily challenge, playable in a browser: the board a shared link opens.
// The page sets window.MEOW_PUZZLE = {id, regions: ['77700022', …], cats:
// '27305164', picture} before this script: `regions` holds one base-36 Region
// ID per cell, `cats` the column of each row's cat.

'use strict';

// ---- Rules -----------------------------------------------------------------

// MISTAKE is the red × a refused cat leaves: ruled out, and locked.
const EMPTY = 0, EXCLUDED = 1, CAT = 2, MISTAKE = 3;

function parsePuzzle(puzzle) {
  const regions = puzzle.regions.map((row) =>
    [...row].map((id) => parseInt(id, 36)),
  );
  return {
    id: puzzle.id,
    size: regions.length,
    regions,
    cats: [...puzzle.cats].map((column) => parseInt(column, 36)),
    slots: regionSlots(puzzle.id, regions, puzzle.picture === true),
  };
}

/// Which of the twelve palette colors each Region takes: the app's draw
/// (RegionSlots in lib/presentation/theme.dart), so the board has the colors
/// the player saw. A board painted as a picture keeps its own.
function regionSlots(id, regions, picture) {
  const ids = [...new Set(regions.flat())].sort((a, b) => a - b);
  if (picture) return new Map(ids.map((region) => [region, region % 12]));
  let seed = 0x811c9dc5;
  for (let i = 0; i < id.length; i++) {
    seed = Math.imul(seed ^ id.charCodeAt(i), 0x01000193) >>> 0;
  }
  if (seed === 0) seed = 0x811c9dc5;
  const next = () => {
    seed = (seed ^ (seed << 13)) >>> 0;
    seed = (seed ^ (seed >>> 17)) >>> 0;
    seed = (seed ^ (seed << 5)) >>> 0;
    return seed;
  };
  const slots = Array.from({ length: 12 }, (_, slot) => slot);
  for (let last = slots.length - 1; last > 0; last--) {
    const pick = next() % (last + 1);
    [slots[last], slots[pick]] = [slots[pick], slots[last]];
  }
  return new Map(ids.map((region, index) => [region, slots[index % 12]]));
}

/// The rule a cat on [row, column] would break beside the cats already
/// placed: {rule, cats} with the cats it clashes with, or null for none.
function brokenRule(level, cells, row, column) {
  const clash = { touch: [], line: [], color: [] };
  for (let r = 0; r < level.size; r++) {
    for (let c = 0; c < level.size; c++) {
      if (cells[r][c] !== CAT || (r === row && c === column)) continue;
      if (Math.abs(r - row) <= 1 && Math.abs(c - column) <= 1) {
        clash.touch.push([r, c]);
      } else if (r === row || c === column) {
        clash.line.push([r, c]);
      } else if (level.regions[r][c] === level.regions[row][column]) {
        clash.color.push([r, c]);
      }
    }
  }
  for (const rule of ['touch', 'line', 'color']) {
    if (clash[rule].length) return { rule, cats: clash[rule] };
  }
  return null;
}

function catCount(cells) {
  return cells.flat().filter((state) => state === CAT).length;
}

if (typeof module !== 'undefined') {
  module.exports = { parsePuzzle, regionSlots, brokenRule, catCount, CAT };
}

// ---- Page ------------------------------------------------------------------

if (typeof document !== 'undefined') {
  // The App Store page, once the app is on sale; null shows "coming soon".
  const STORE_URL = null; // 'https://apps.apple.com/app/id6819126730'

  const PALETTE = [
    '#FFB2C6', '#227A66', '#FFE085', '#105081', '#654228', '#9FCA90',
    '#E49758', '#6E67A8', '#37B1BF', '#B84A47', '#ACDEFC', '#958679',
  ];
  const DARK_SLOTS = new Set([1, 3, 4, 7, 9, 11]);

  const TEXT = {
    en: {
      daily: 'Daily Challenge',
      goal: (n) => `Find all ${n} cats`,
      friend: (time) => `A friend solved this in ${time}. Can you beat it?`,
      rules: ['One color, one cat', 'One cat per row & column', 'Cats cannot touch'],
      refused: {
        color: 'One color, one cat',
        line: 'One cat per row & column',
        touch: 'Cats cannot touch',
        wrong: 'No cat here',
      },
      gestures: ['Tap', 'to rule a cell out', 'Double-tap', 'to place a cat'],
      won: 'Purrfect!',
      wonSub: 'Every cat found!',
      solvedIn: (time) => `Solved in ${time}`,
      mistakes: (n) => (n === 0 ? 'No mistakes' : n === 1 ? '1 mistake' : `${n} mistakes`),
      faster: (time) => `${time} faster than your friend!`,
      slower: (time) => `Your friend was ${time} faster.`,
      tie: 'Exactly as fast as your friend!',
      story: 'In the app, every daily puzzle reveals a piece of a story.',
      get: 'Get MeowPuzzle',
      soon: 'Coming soon to the App Store',
      pitch: 'A new puzzle every day, and hundreds of levels.',
      again: 'Play again',
    },
    zh: {
      daily: '每日挑战',
      goal: (n) => `找出全部 ${n} 只猫`,
      friend: (time) => `朋友用了 ${time} 解开这一题，你能更快吗？`,
      rules: ['每种颜色一只猫', '每行每列一只猫', '猫咪不能相邻'],
      refused: {
        color: '每种颜色一只猫',
        line: '每行每列一只猫',
        touch: '猫咪不能相邻',
        wrong: '这里没有猫',
      },
      gestures: ['单击', '排除一格', '双击', '放一只猫'],
      won: '太喵了！',
      wonSub: '猫咪全部找到啦！',
      solvedIn: (time) => `用时 ${time}`,
      mistakes: (n) => (n === 0 ? '零失误' : `失误 ${n} 次`),
      faster: (time) => `比朋友快了 ${time}！`,
      slower: (time) => `朋友比你快 ${time}。`,
      tie: '和朋友一样快！',
      story: '在 App 里，每天的挑战都会揭开一块故事插画。',
      get: '下载 MeowPuzzle',
      soon: '即将登陆 App Store',
      pitch: '每天一道新题，还有数百个关卡。',
      again: '再玩一次',
    },
  };

  const level = parsePuzzle(window.MEOW_PUZZLE);
  const query = new URLSearchParams(location.search);
  const text = TEXT[
    (query.get('lang') || navigator.language || 'en').startsWith('zh')
      ? 'zh'
      : 'en'
  ];
  // `?still` shows every state at rest, for a screenshot.
  const still = query.has('still') || query.has('og');
  if (still) document.documentElement.classList.add('still');
  const friendSeconds = Math.max(0, parseInt(query.get('t'), 10) || 0);
  const $ = (id) => document.getElementById(id);

  const clock = (seconds) =>
    `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const span = (seconds) =>
    seconds < 60 ? `${seconds}s` : clock(seconds);

  // -- Colors, as RegionTilePainter and RegionPalette.excludedInk mix them.

  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const css = (parts) => `rgb(${parts.map(Math.round).join(',')})`;
  const mix = (from, to, amount) =>
    from.map((part, i) => part + (to[i] - part) * amount);

  function excludedInk(slot) {
    const base = rgb(PALETTE[slot]);
    if (DARK_SLOTS.has(slot)) return css(mix(base, [255, 255, 255], 0.42));
    const [r, g, b] = base.map((part) => part / 255);
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    const light = (max + min) / 2, delta = max - min;
    let hue = 0, saturation = 0;
    if (delta) {
      saturation = delta / (1 - Math.abs(2 * light - 1));
      hue = max === r ? ((g - b) / delta) % 6
        : max === g ? (b - r) / delta + 2
        : (r - g) / delta + 4;
      hue *= 60;
    }
    return `hsl(${hue} ${saturation * 62}% ${light * 72}%)`;
  }

  // -- Marks. The paw is ShapePaths.pawprint, in its unit square.

  const PAW =
    '<svg class="paw" viewBox="0 0 1 1" aria-hidden="true"><path d="M.5 .45' +
    'C.67 .45 .82 .66 .8 .79C.78 .92 .63 .92 .5 .87C.37 .92 .22 .92 .2 .79' +
    'C.18 .66 .33 .45 .5 .45Z"/>' +
    [[0.14, 0.42, -25.8], [0.35, 0.2, -8.6], [0.65, 0.2, 8.6], [0.86, 0.42, 25.8]]
      .map(([x, y, turn]) =>
        `<ellipse cx="${x}" cy="${y}" rx=".095" ry=".125" ` +
        `transform="rotate(${turn} ${x} ${y})"/>`)
      .join('') +
    '</svg>';
  const CROSS =
    '<svg class="cross" viewBox="0 0 100 100" aria-hidden="true">' +
    '<path d="M31.2 31.2L68.8 68.8M68.8 31.2L31.2 68.8"/></svg>';
  // MistakeMarkView at rest: a red ×, larger, on a white rim.
  const WRONG =
    '<svg class="wrong" viewBox="0 0 100 100" aria-hidden="true">' +
    '<path d="M28.3 28.3L71.7 71.7M71.7 28.3L28.3 71.7"/>' +
    '<path d="M28.3 28.3L71.7 71.7M71.7 28.3L28.3 71.7"/></svg>';

  // -- State

  let cells, mistakes, started, finished, timer, toastTimer;
  let lastTap = null; // {row, column, time, before}

  const board = $('board');
  const tiles = [];

  function build() {
    board.style.setProperty('--n', level.size);
    for (let row = 0; row < level.size; row++) {
      tiles.push([]);
      for (let column = 0; column < level.size; column++) {
        const slot = level.slots.get(level.regions[row][column]);
        const color = rgb(PALETTE[slot]);
        const tile = document.createElement('div');
        tile.className = 'cell';
        tile.style.setProperty('--top', css(mix(color, [255, 255, 255], 0.12)));
        tile.style.setProperty('--mid', css(color));
        tile.style.setProperty('--low', css(mix(color, [0, 0, 0], 0.03)));
        tile.style.setProperty('--lip', css(mix(color, [0, 0, 0], 0.16)));
        tile.style.setProperty('--ink', excludedInk(slot));
        board.appendChild(tile);
        tiles[row].push(tile);
      }
    }
    const fit = () => {
      const inner = board.clientWidth - 4;
      board.style.setProperty(
        '--cell',
        `${inner / (level.size + 0.08 * (level.size - 1))}px`,
      );
    };
    new ResizeObserver(fit).observe(board);
    fit();
  }

  function reset() {
    cells = level.regions.map((row) => row.map(() => EMPTY));
    mistakes = 0;
    started = null;
    finished = false;
    lastTap = null;
    clearInterval(timer);
    $('time').textContent = '0:00';
    document.body.classList.remove('won');
    for (const row of tiles) for (const tile of row) tile.innerHTML = '';
    showCount();
  }

  function set(row, column, state) {
    if (cells[row][column] === state) return;
    cells[row][column] = state;
    tiles[row][column].innerHTML =
      state === CAT ? `<i class="cat">${PAW}</i>`
        : state === EXCLUDED ? CROSS
        : state === MISTAKE ? WRONG
        : '';
    showCount();
  }

  function showCount() {
    $('count').textContent = `${catCount(cells)} / ${level.size}`;
  }

  function seconds() {
    return started === null ? 0 : Math.round((Date.now() - started) / 1000);
  }

  function begin() {
    if (started !== null) return;
    started = Date.now();
    timer = setInterval(() => ($('time').textContent = clock(seconds())), 500);
  }

  function toast(message) {
    const element = $('toast');
    element.textContent = message;
    element.classList.add('shown');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => element.classList.remove('shown'), 1500);
  }

  function replay(element, name) {
    element.classList.remove(name);
    void element.offsetWidth;
    element.classList.add(name);
  }

  /// As in the app, a cat that is not the answer is refused and leaves a
  /// red × there. Unlike the app there are no lives: it only counts.
  function placeCat(row, column) {
    if (level.cats[row] !== column) {
      const why = brokenRule(level, cells, row, column);
      mistakes++;
      set(row, column, MISTAKE);
      toast(text.refused[why ? why.rule : 'wrong']);
      replay(tiles[row][column], 'refused');
      for (const [r, c] of why ? why.cats : []) replay(tiles[r][c], 'clash');
      return;
    }
    set(row, column, CAT);
    if (catCount(cells) === level.size) win();
  }

  const locked = (row, column) =>
    cells[row][column] === CAT || cells[row][column] === MISTAKE;

  function tap(row, column) {
    begin();
    const now = Date.now();
    if (locked(row, column)) {
      lastTap = null;
      return;
    }
    const second =
      lastTap && lastTap.row === row && lastTap.column === column &&
      now - lastTap.time < 300;
    if (second) {
      set(row, column, lastTap.before);
      lastTap = null;
      placeCat(row, column);
      return;
    }
    lastTap = { row, column, time: now, before: cells[row][column] };
    set(row, column, cells[row][column] === EMPTY ? EXCLUDED : EMPTY);
  }

  function win() {
    finished = true;
    clearInterval(timer);
    const mine = seconds();
    $('time').textContent = clock(mine);
    $('solved').textContent =
      `${text.solvedIn(clock(mine))} · ${text.mistakes(mistakes)}`;
    $('versus').textContent = !friendSeconds ? ''
      : mine < friendSeconds ? text.faster(span(friendSeconds - mine))
      : mine > friendSeconds ? text.slower(span(mine - friendSeconds))
      : text.tie;
    setTimeout(() => document.body.classList.add('won'), still ? 0 : 450);
  }

  // -- Input: a tap, or a drag that rules out (or clears) the cells it crosses.

  function cellAt(x, y) {
    const box = board.getBoundingClientRect();
    const cell = parseFloat(board.style.getPropertyValue('--cell'));
    const pitch = cell * 1.08;
    const pad = (box.width - (pitch * level.size - cell * 0.08)) / 2;
    const column = Math.floor((x - box.left - pad) / pitch);
    const row = Math.floor((y - box.top - pad) / pitch);
    if (row < 0 || column < 0 || row >= level.size || column >= level.size) {
      return null;
    }
    // The gaps between cells belong to no cell.
    if ((x - box.left - pad) % pitch > cell || (y - box.top - pad) % pitch > cell) {
      return null;
    }
    return [row, column];
  }

  let press = null; // {x, y, cell, dragging, to}

  board.addEventListener('pointerdown', (event) => {
    if (finished || !event.isPrimary) return;
    const cell = cellAt(event.clientX, event.clientY);
    if (!cell) return;
    board.setPointerCapture(event.pointerId);
    press = { x: event.clientX, y: event.clientY, cell, dragging: false };
  });

  board.addEventListener('pointermove', (event) => {
    if (!press) return;
    if (!press.dragging) {
      if (Math.hypot(event.clientX - press.x, event.clientY - press.y) < 8) return;
      const [row, column] = press.cell;
      if (locked(row, column)) {
        press = null;
        return;
      }
      begin();
      lastTap = null;
      press.dragging = true;
      press.to = cells[row][column] === EMPTY ? EXCLUDED : EMPTY;
      set(row, column, press.to);
    }
    // Sampled along the way, so a fast drag skips no cell.
    const cell = parseFloat(board.style.getPropertyValue('--cell'));
    const distance = Math.hypot(event.clientX - press.x, event.clientY - press.y);
    const steps = Math.max(1, Math.ceil(distance / Math.max(cell / 3, 1)));
    for (let step = 1; step <= steps; step++) {
      const at = cellAt(
        press.x + ((event.clientX - press.x) * step) / steps,
        press.y + ((event.clientY - press.y) * step) / steps,
      );
      if (at && !locked(at[0], at[1])) set(at[0], at[1], press.to);
    }
    press.x = event.clientX;
    press.y = event.clientY;
  });

  board.addEventListener('pointerup', () => {
    if (press && !press.dragging) tap(...press.cell);
    press = null;
  });
  board.addEventListener('pointercancel', () => (press = null));

  // A double tap places a cat; it must not also zoom the page. iOS Safari
  // zooms on one unless the touches themselves are cancelled, whatever
  // `touch-action` says. Pointer events still arrive.
  for (const type of ['touchstart', 'touchend', 'dblclick']) {
    board.addEventListener(type, (event) => event.preventDefault(), {
      passive: false,
    });
  }

  // -- Words

  $('daily').textContent = text.daily;
  $('goal').textContent = friendSeconds
    ? text.friend(clock(friendSeconds))
    : text.goal(level.size);
  $('rules').innerHTML = text.rules.map((rule) => `<li>${rule}</li>`).join('');
  $('gestures').innerHTML =
    `<b>${text.gestures[0]}</b> ${text.gestures[1]}` +
    `<span>·</span><b>${text.gestures[2]}</b> ${text.gestures[3]}`;
  $('won-title').innerHTML =
    `<span class="outline" aria-hidden="true">${text.won}</span>` +
    `<span class="face">${text.won}</span>`;
  $('won-sub').textContent = text.wonSub;
  $('story').textContent = text.story;
  $('pitch').textContent = text.pitch;
  $('again').textContent = text.again;
  for (const link of document.querySelectorAll('.store')) {
    link.textContent = STORE_URL ? text.get : text.soon;
    if (STORE_URL) link.href = STORE_URL;
    else link.setAttribute('aria-disabled', 'true');
  }
  $('again').addEventListener('click', reset);
  document.documentElement.lang = text === TEXT.zh ? 'zh' : 'en';

  build();
  reset();

  // `?cats=02,17&out=00,01` starts with those cells (row, column) filled:
  // for the preview picture and for looking at a state without playing to it.
  const listed = (name) =>
    (query.get(name) || '').split(',').filter(Boolean).map((cell) => [...cell].map(Number));
  for (const [row, column] of listed('out')) set(row, column, EXCLUDED);
  for (const [row, column] of listed('cats')) placeCat(row, column);

  // The link's preview picture is this page in its `og` dress.
  if (query.has('og')) {
    document.body.classList.add('og');
    $('goal').textContent = text.goal(level.size);
  }
}
