// Author: lidawen
// Shared browser board rules, art and gestures. No storage, network or page chrome.
const MeowtrixBoard = (() => {
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

  const PALETTE = [
    '#FFB2C6', '#227A66', '#FFE085', '#105081', '#654228', '#9FCA90',
    '#E49758', '#6E67A8', '#37B1BF', '#B84A47', '#ACDEFC', '#958679',
  ];
  const DARK_SLOTS = new Set([1, 3, 4, 7, 9, 11]);

  const rgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  const css = (parts) => `rgb(${parts.map(Math.round).join(',')})`;
  const mix = (from, to, amount) =>
    from.map((part, i) => part + (to[i] - part) * amount);

  function excludedInk(slot, hex = PALETTE[slot]) {
    const base = rgb(hex);
    if (DARK_SLOTS.has(slot) || (slot < 0 && base[0]*.299 + base[1]*.587 + base[2]*.114 < 145)) return css(mix(base, [255, 255, 255], 0.42));
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


  function tileStyle(tile, color, slot = -1) {
    const base = rgb(color);
    for (const [key, value] of Object.entries({top: css(mix(base,[255,255,255],.12)), mid: css(base), low: css(mix(base,[0,0,0],.03)), lip: css(mix(base,[0,0,0],.16)), ink: excludedInk(slot,color)})) tile.style.setProperty('--'+key,value);
  }
  const mark = state => state === CAT ? `<i class="cat">${PAW}</i>` : state === EXCLUDED ? CROSS : state === MISTAKE ? WRONG : '';
  function createTapHandler({get,set,locked,placeCat,begin,now = Date.now}) {
    let last = null;
    return {
      reset() { last = null; },
      tap(row,column) {
        if (locked(row,column)) { last = null; return; }
        const time = now();
        if (last && last.row === row && last.column === column && time-last.time < 300) {
          set(row,column,last.before); last = null; placeCat(row,column); return;
        }
        begin();
        last = {row,column,time,before:get(row,column)};
        set(row,column,get(row,column) === EMPTY ? EXCLUDED : EMPTY);
      }
    };
  }
  function bindInput(board, {size,get,set,locked,begin,tap,resetTap,finished}) {
  function cellAt(x, y) {
    const box = board.getBoundingClientRect();
    const cell = parseFloat(board.style.getPropertyValue('--cell'));
    const pitch = cell * 1.08;
    const pad = (box.width - (pitch * size - cell * 0.08)) / 2;
    const column = Math.floor((x - box.left - pad) / pitch);
    const row = Math.floor((y - box.top - pad) / pitch);
    if (row < 0 || column < 0 || row >= size || column >= size) {
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
    if (finished() || !event.isPrimary) return;
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
      resetTap();
      press.dragging = true;
      press.to = get(row, column) === EMPTY ? EXCLUDED : EMPTY;
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


  }
  return {parsePuzzle,regionSlots,brokenRule,catCount,EMPTY,EXCLUDED,CAT,MISTAKE,PALETTE,PAW,CROSS,WRONG,rgb,css,mix,excludedInk,tileStyle,mark,createTapHandler,bindInput};
})();
if (typeof module !== 'undefined') module.exports = MeowtrixBoard;

globalThis.MeowtrixBoard=MeowtrixBoard;
