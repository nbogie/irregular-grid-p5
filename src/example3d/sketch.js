/**
 * @type {Palette}
 */
let palette;
/**
 * @type {PlacementMore[]}
 */
let placements;
/**
 * @type {Config}
 */
let config;

/**
 * @typedef {Placement & { colour: string }} PlacementMore
 */
/** @typedef {Object} Config
 * @property {number} cellSize
 * @property {number} gap
 *
 */

function setup() {
  createCanvas(400, 400, WEBGL);
  palette = createPalette();
  config = { cellSize: width / 20, gap: 2 };
  placements = createIrregularGrid(config.cellSize).map((p) => ({
    ...p,
    colour: random(palette.allColours),
  }));
}

function draw() {
  background(palette.bg);
  orbitControl();
  lights();
  drawPlacements3D(placements);
}

/**
 *
 * @param {PlacementMore[]} placements
 */
function drawPlacements3D(placements) {
  const cellSize = config.cellSize;
  translate(-width / 2, 0, -height / 2);

  placements.forEach((pl) => {
    push();
    noStroke();
    // strokeWeight(3);
    // stroke(palette.placementOutline);
    translate(pl.pos.x * cellSize, 0, pl.pos.y * cellSize);
    const c = color(pl.colour);
    const w = cellSize * pl.dims.w;
    const h = cellSize * pl.dims.h;
    translate(w / 2, 0, h / 2);
    if (frameCount === 1) {
      console.log(c);
    }
    ambientMaterial(c);
    box(w - config.gap, 20, h - config.gap);
    pop();
  });
}

function mousePressed() {
  redraw();
}
