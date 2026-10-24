// Author: lidawen
// Migrated from the repository JavaScript parity implementation.
// Board vocabulary and the rules of one game: a port of lib/domain/board.dart
// and lib/domain/game_engine.dart. Pure JavaScript, no `wx` and no canvas, so
// it runs under Node for the tests.
//
// A cell is its row-major index `row * size + column`.


const EMPTY = 0;
const EXCLUDED = 1;
const CAT = 2;

/// Unpacks one board of data/levels.js: `r` holds a base-36 Region ID per
/// cell, `s` the column of each row's cat, `t` the picture's cells as
/// row/column digit pairs, `g` given cells as a digit per cell.
function makeLevel(raw) {
  const size = raw.n;
  const regions = Array.from(raw.r, (id) => parseInt(id, 36));
  const solution = Array.from(raw.s, (column, row) => row * size + parseInt(column, 36));
  const given = raw.g ? Array.from(raw.g, Number) : null;
  const theme = [];
  for (let i = 0; raw.t && i < raw.t.length; i += 2) {
    theme.push(parseInt(raw.t[i], 36) * size + parseInt(raw.t[i + 1], 36));
  }
  return {
    id: raw.id,
    size,
    catCount: solution.length,
    maxMistakes: raw.m || 3,
    regions,
    regionIDs: [...new Set(regions)].sort((a, b) => a - b),
    solution,
    solutionSet: new Set(solution),
    given,
    theme: new Set(theme),
  };
}

function rowOf(level, cell) {
  return Math.floor(cell / level.size);
}

function columnOf(level, cell) {
  return cell % level.size;
}

function isAdjacent(level, a, b) {
  return (
    Math.abs(rowOf(level, a) - rowOf(level, b)) <= 1 &&
    Math.abs(columnOf(level, a) - columnOf(level, b)) <= 1
  );
}

/// The rules two cats on [a] and [b] would break: 'color', 'line', 'touch'.
function brokenRules(level, a, b) {
  const rules = [];
  if (level.regions[a] === level.regions[b]) rules.push('color');
  if (rowOf(level, a) === rowOf(level, b) || columnOf(level, a) === columnOf(level, b)) {
    rules.push('line');
  }
  if (isAdjacent(level, a, b)) rules.push('touch');
  return rules;
}

function conflicts(level, a, b) {
  return brokenRules(level, a, b).length > 0;
}

function catCells(cells) {
  const cats = [];
  for (let i = 0; i < cells.length; i++) if (cells[i] === CAT) cats.push(i);
  return cats;
}

/// Every cat a cat at [target] would break a rule against, row-major.
function conflictsWith(level, cells, target) {
  return catCells(cells).filter((cat) => cat !== target && conflicts(level, cat, target));
}

function hasConflict(level, cells) {
  const cats = catCells(cells);
  for (let i = 0; i < cats.length; i++) {
    for (let j = i + 1; j < cats.length; j++) {
      if (conflicts(level, cats[i], cats[j])) return true;
    }
  }
  return false;
}

/// Solved once every Region holds one cat and no rule is broken. The other
/// cells do not need a ×.
function isSolved(level, cells) {
  const cats = catCells(cells);
  return (
    cats.length === level.catCount &&
    level.regionIDs.length === level.catCount &&
    new Set(cats.map((cat) => level.regions[cat])).size === level.regionIDs.length &&
    !hasConflict(level, cells)
  );
}

function initialCells(level) {
  return level.given ? level.given.slice() : new Array(level.size * level.size).fill(EMPTY);
}

/// The single owner of board mutation, mistake tracking and restart. A cat
/// outside the solution is refused and costs a mistake; with
/// [marksRefusedCats] its cell becomes a locked ×, which is always right.
class Game {
  constructor(level, { marksRefusedCats = true } = {}) {
    this.level = level;
    this.marksRefusedCats = marksRefusedCats;
    /** @type {Set<number>} */
    this.marks = new Set();
    this.restart();
  }

  /// Rebuilds a game from saved state, or returns null for anything legal
  /// play could not have reached.
  static restore(level, saved, options) {
    const { cells, mistakes, marks = [] } = saved || {};
    const count = level.size * level.size;
    if (!Array.isArray(cells) || cells.length !== count) return null;
    if (!cells.every((state) => state === EMPTY || state === EXCLUDED || state === CAT)) return null;
    if (!Number.isInteger(mistakes) || mistakes < 0) return null;
    if (level.given && level.given.some((state, i) => state !== EMPTY && cells[i] !== state)) {
      return null;
    }
    if (hasConflict(level, cells)) return null;
    if (!catCells(cells).every((cat) => level.solutionSet.has(cat))) return null;
    if (!Array.isArray(marks)) return null;
    for (const mark of marks) {
      if (cells[mark] !== EXCLUDED || level.solutionSet.has(mark)) return null;
      if (level.given && level.given[mark] !== EMPTY) return null;
    }
    const game = new Game(level, options);
    game.cells = cells.slice();
    game.mistakes = mistakes;
    game.marks = new Set(marks);
    return game;
  }

  /// Gives a failed board back its last life: the cats and marks stay, and
  /// the next refused cat ends it again. A board still in play is left as
  /// it is.
  revive() {
    if (!this.isFailed) return;
    this.mistakes = this.level.maxMistakes - 1;
  }

  restart() {
    this.cells = initialCells(this.level);
    this.mistakes = 0;
    this.marks = new Set();
  }

  get isSolved() {
    return isSolved(this.level, this.cells);
  }

  get isFailed() {
    return this.mistakes >= this.level.maxMistakes;
  }

  get isBlank() {
    return this.mistakes === 0 && this.cells.every((state) => state === EMPTY);
  }

  isGiven(cell) {
    return !!this.level.given && this.level.given[cell] !== EMPTY;
  }

  isLocked(cell) {
    return this.isGiven(cell) || this.marks.has(cell);
  }

  /// Crossed-out cells the solution needs. A × is only a note, so these cost
  /// no life, but no deduction can finish the board while they stand.
  get mistakenExclusions() {
    return this.level.solution
      .filter((cell) => this.cells[cell] === EXCLUDED)
      .sort((a, b) => a - b);
  }

  /// The one mutation. Returns {changed} when the board took the state (or
  /// already had it), {error} for a cell that cannot change, or {refused,
  /// clashes} for a cat the board turned down, which costs a mistake.
  setState(cell, state) {
    if (this.isFailed) return { error: 'failed' };
    if (!(cell >= 0 && cell < this.cells.length)) return { error: 'invalid' };
    if (this.isLocked(cell)) return { error: 'locked' };
    if (this.cells[cell] === state) return { changed: false };

    if (state === CAT) {
      const clashes = conflictsWith(this.level, this.cells, cell);
      if (!this.level.solutionSet.has(cell) || clashes.length > 0) {
        this.mistakes += 1;
        // Only a cell off the solution is marked, so the × is never wrong.
        if (this.marksRefusedCats && !this.level.solutionSet.has(cell)) {
          this.cells[cell] = EXCLUDED;
          this.marks.add(cell);
        }
        return { refused: clashes.length > 0 ? 'conflict' : 'wrong', clashes };
      }
    }
    this.cells[cell] = state;
    return { changed: true };
  }

  /// Applies every action of a hint, or none of them.
  applyHint(hint) {
    const saved = { cells: this.cells.slice(), mistakes: this.mistakes, marks: new Set(this.marks) };
    for (const action of hint.actions) {
      const result = this.setState(action.cell, action.state);
      if (result.error || result.refused) {
        Object.assign(this, saved);
        return false;
      }
    }
    return true;
  }

  toJSON() {
    return { cells: this.cells.slice(), mistakes: this.mistakes, marks: [...this.marks] };
  }
}

/// Maps cumulative player-facing numbers to the authored boards: after the
/// last one the numbers go on and the boards repeat, without the first ten
/// teaching boards.
function levelIndexFor(completedCount, levelCount) {
  if (levelCount === 0) return -1;
  if (completedCount < levelCount) return completedCount;
  const start = levelCount > 10 ? 10 : 0;
  return start + ((completedCount - levelCount) % (levelCount - start));
}

export {
  EMPTY,
  EXCLUDED,
  CAT,
  makeLevel,
  rowOf,
  columnOf,
  isAdjacent,
  brokenRules,
  conflicts,
  conflictsWith,
  catCells,
  hasConflict,
  isSolved,
  initialCells,
  Game,
  levelIndexFor,
};
