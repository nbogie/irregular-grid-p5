/** @type {Palette} */
let palette;

/**
 * @typedef {Object} Palette
 * @property {string[]} allColours
 * @property {string} guidelines
 * @property {string} placementOutline
 * @property {string} bg
 * @returns Palette
 */
function createPalette() {
  const colours = [
    "#fef9c6",
    "#ffcc4d",
    "#f5b800",
    "#56a1c4",
    "#4464a1",
    "#ee726b",
    "#df5f50",
    "#5a3034",
  ];

  return {
    allColours: colours.slice(0, 7),
    bg: colours[7],
    guidelines: colours[0],
    placementOutline: colours.at(-1),
  };
}
/** @typedef {Object} Config
 * @property {number} cellSize
 */

/** @typedef {Object} Pos
 * @property {number} x
 * @property {number} y
 */
/** @typedef {Object} Dims
 * @property {number} w
 * @property {number} h
 */

/** @typedef {Object} Placement
 * @property {Pos} pos
 * @property {Dims} dims
 * @property {string} colour
 */

/** @type {Config} */
let config;

function setup() {
  createCanvas(400, 400);
  palette = createPalette();
  config = { cellSize: width / 20 };
  noLoop();
}

function draw() {
  background(palette.bg);
  createAndDrawIrregularGrid();
}

/**
 * @param {Pos} pos
 * @param {Placement[]} placements
 * @returns {boolean}
 */
function isEmpty(pos, placements) {
  return !placements.some((placement) =>
    placementCoversPosition(placement, pos)
  );
}

function createAndDrawIrregularGrid() {
  const allCellPositions = generateAllCellPositions();
  const placements = makePlacements(allCellPositions);
  drawPlacements(placements);
  drawCellGuidelines();
}
/**
 *
 * @param {Placement[]} placements
 */
function drawPlacements(placements) {
  const cellSize = config.cellSize;

  placements.forEach((pl) => {
    push();
    strokeWeight(3);
    stroke(palette.placementOutline);
    translate(pl.pos.x * cellSize, pl.pos.y * cellSize);
    const c = color(pl.colour);
    fill(c);
    rect(0, 0, cellSize * pl.dims.w, cellSize * pl.dims.h);
    pop();
  });
}

function drawCellGuidelines() {
  const { cellSize } = config;
  for (let x = 0; x < width + cellSize; x += cellSize) {
    for (let y = 0; y < width + cellSize; y += cellSize) {
      noFill();
      strokeWeight(0.2);
      stroke(palette.guidelines);
      square(x, y, cellSize);
    }
  }
}
/**
 *
 * @param {Placement} placement
 * @param {Pos} targetPos
 * @returns {boolean}
 */
function placementCoversPosition(placement, targetPos) {
  const { x, y } = targetPos;
  const { x: px, y: py } = placement.pos;
  const { w, h } = placement.dims;
  return x >= px && x < px + w && y >= py && y < py + h;
}

function mousePressed() {
  redraw();
}

function generateAllCellPositions() {
  const numRows = floor(height / config.cellSize);
  const numCols = floor(width / config.cellSize);
  /** @type {Pos[]} */
  const posns = [];
  for (let y = 0; y < numRows; y++) {
    for (let x = 0; x < numCols; x++) {
      const pos = { x, y };
      posns.push(pos);
    }
  }
  return posns;
}

/**
 *
 * @param {Pos} pos
 * @param {Placement[]} pls
 */
function attemptPlacement(pos, pls) {
  const dims = { w: random([1, 2, 3]), h: random([1, 2, 3]) };
  const allPosns = calcAllPositionsFrom(pos, dims);

  if (allPosns.every((p) => isEmpty(p, pls))) {
    /**@type {Placement} */
    const placement = {
      dims,
      pos: { x: pos.x, y: pos.y },
      colour: random(palette.allColours),
    };
    pls.push(placement);
  }
}

/**
 *
 * @param {Pos[]} allCellPositions
 * @return {Placement[]}
 */
function makePlacements(allCellPositions) {
  /** @type {Placement[]} */
  const pls = [];
  allCellPositions.map((pos) => attemptPlacement(pos, pls));
  return pls;
}

/**
 * @template T
 * @template A
 * @template B
 * @param {T[]} arr
 * @param {(el:T, ix?: number, arr?:T[]) => boolean} predFn
 * @returns
 */
function partition(arr, predFn) {
  const arrA = [];
  const arrB = [];
  for (let ix = 0; ix < arr.length; ix++) {
    const element = arr[ix];
    const target = predFn(element, ix, arr) ? arrA : arrB;
    target.push(element);
  }
  return [arrA, arrB];
}
/**
 *
 * @param {Pos} pos
 * @param {Dims} dims
 * @returns {Pos[]}
 */
function calcAllPositionsFrom(pos, dims) {
  const positions = [];
  for (let x = pos.x; x < pos.x + dims.w; x++) {
    for (let y = pos.y; y < pos.y + dims.h; y++) {
      positions.push({ x, y });
    }
  }
  return positions;
}
