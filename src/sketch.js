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
  return emptyCheck(pos, placements).empty;
}
/**
 * @param {Pos} pos
 * @param {Placement[]} placements
 * @returns {{empty: true} | {empty: false, firstCollision: Placement}}
 */
function emptyCheck(pos, placements) {
  const firstCollision = placements.find((placement) =>
    placementCoversPosition(placement, pos)
  );
  return firstCollision ? { empty: false, firstCollision } : { empty: true };
}

function createAndDrawIrregularGrid() {
  const allCellPositions = generateAllCellPositions();
  const placements = makePlacements(allCellPositions);
  drawCellGuides();
  drawPlacements(placements);
}
/**
 *
 * @param {Placement[]} placements
 */
function drawPlacements(placements) {
  const cellSize = config.cellSize;

  placements.forEach((pl) => {
    push();
    stroke(palette.placementOutline);
    translate(pl.pos.x * cellSize, pl.pos.y * cellSize);
    fill(pl.colour);
    rect(0, 0, cellSize * pl.dims.w, cellSize * pl.dims.h);
    pop();
  });
}

function drawCellGuides() {
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
  //TODO: consider whether this non 1x1 shape fits

  const emptyResult = emptyCheck(pos, pls);
  if (emptyResult.empty === true) {
    const w = random([1, 2, 3]);
    const h = random([1, 2, 3]);

    /**@type {Placement} */
    const placement = {
      dims: { w, h },
      pos: { x: pos.x, y: pos.y },
      colour: random(palette.allColours),
    };
    pls.push(placement);
    return { successful: true, data: placement };
  } else {
    return {
      successful: false,
      data: {
        pos,
        reason: "not empty",
        firstCollision: emptyResult.firstCollision,
      },
    };
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

  const results = allCellPositions.map((pos) => attemptPlacement(pos, pls));
  const [_plsWrapped, skips] = partition(results, (r) => r.successful);
  console.log({ skips });
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
