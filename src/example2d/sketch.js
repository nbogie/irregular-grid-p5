/**
 * @typedef {Object} World2D
 * @property {Palette} palette
 * @property {Config} config
 */

/** The world for this 2d sketch
 * @type {World2D}
 */
let w2;
/**
 * @typedef {Placement & { colour: string }} PlacementColoured
 */

/** @typedef {Object} Config
 * @property {number} cellSize
 *
 */

function setup() {
  createCanvas(400, 400);
  w2 = {
    palette: createPalette(),
    config: { cellSize: width / 20 },
  };
  noLoop();
}

function draw() {
  background(w2.palette.bg);
  createAndDrawIrregularGrid();
}

function createAndDrawIrregularGrid() {
  const placements = createIrregularGrid(w2.config.cellSize);
  const placementsColoured = placements.map((p) => {
    return { ...p, colour: random(w2.palette.allColours) };
  });
  drawPlacements(placementsColoured);
  drawCellGuidelines();
}
/**
 *
 * @param {PlacementColoured[]} placements
 */
function drawPlacements(placements) {
  const cellSize = w2.config.cellSize;

  placements.forEach((pl) => {
    push();
    strokeWeight(3);
    stroke(w2.palette.placementOutline);
    translate(pl.pos.x * cellSize, pl.pos.y * cellSize);
    const c = color(pl.colour);
    fill(c);
    rect(0, 0, cellSize * pl.dims.w, cellSize * pl.dims.h);
    pop();
  });
}

function drawCellGuidelines() {
  const { cellSize } = w2.config;
  for (let x = 0; x < width + cellSize; x += cellSize) {
    for (let y = 0; y < width + cellSize; y += cellSize) {
      noFill();
      strokeWeight(0.2);
      stroke(w2.palette.guidelines);
      square(x, y, cellSize);
    }
  }
}

function mousePressed() {
  redraw();
}

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
