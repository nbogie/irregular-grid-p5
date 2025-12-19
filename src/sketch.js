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

function createAndDrawIrregularGrid() {
  const placements = createIrregularGrid(config.cellSize);
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

function mousePressed() {
  redraw();
}
