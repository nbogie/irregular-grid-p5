/** @type {Palette} */
let palette;

/**
 * @typedef {Object} Palette
 * @property {string[]} allColours
 * @property {string} guidelines
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
    allColours: colours,
    bg: colours[7],
    guidelines: colours[0],
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

/** @type {Placement[]} */
let placements = [];

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
  drawIrregularGrid();
}

function drawIrregularGrid() {
  /** @type {Pos[]} */
  const allCellPositions = [];
  for (let y = 0; y < 10; y++) {
    for (let x = 0; x < 10; x++) {
      const pos = { x, y };
      allCellPositions.push(pos);
    }
  }
  /**
   * @param {Pos} pos
   * @returns {boolean}
   */
  function isEmpty(pos) {
    return !placements.some((placement) =>
      placementCoversPosition(placement, pos)
    );
  }
  allCellPositions.forEach((pos) => {
    //TODO: consider whether this non 1x1 shape fits
    if (isEmpty(pos)) {
      const w = random([1, 2, 3]);
      const h = random([1, 2, 3]);
      /**@type {Placement} */
      const placement = {
        dims: { w, h },
        pos: { x: pos.x, y: pos.y },
        colour: random(palette.allColours),
      };
      placements.push(placement);
    }
  });
  const cellSize = config.cellSize;
  placements.forEach((pl) => {
    push();
    translate(pl.pos.x * cellSize, pl.pos.y * cellSize);
    fill(pl.colour);
    rect(0, 0, cellSize * pl.dims.w, cellSize * pl.dims.h);
    pop();
  });
  drawCellGuides();
}
function drawCellGuides() {
  console.log({ palette });
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
 */
function placementCoversPosition(placement, targetPos) {
  const { x, y } = targetPos;
  const { x: px, y: py } = placement.pos;
  const { w, h } = placement.dims;
  return x >= px && x <= px + w && y >= py && y <= py + h;
}

function mousePressed() {
  redraw();
}
