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
 * @typedef {Placement & { colour: string, heightScale: number }} PlacementMore
 */
/** @typedef {Object} Config
 * @property {number} cellSize
 * @property {number} gap
 * @property {boolean} enableStroke
 *
 */

function setup() {
  const dim = min(windowWidth, windowHeight);
  createCanvas(dim, dim, WEBGL);
  palette = createPalette();
  config = { cellSize: width / 20, gap: 10, enableStroke: false };
  placements = createIrregularGrid(config.cellSize).map((p) => ({
    ...p,
    colour: random(palette.allColours),
    heightScale: random(0.5, 1),
  }));
  setBodyBackgroundAsDarkerThan(palette.bg);
}

function draw() {
  background(palette.bg);
  orbitControl();
  lights();
  drawPlacements3D(placements);
}

function setBodyBackgroundAsDarkerThan(baseColour) {
  const lightnessFrac = 0.92;
  document.body.style.backgroundColor = `oklch(from ${baseColour} calc(l * ${lightnessFrac}) c h)`;
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
    if (config.enableStroke) {
      strokeWeight(1);
      stroke(palette.placementOutline);
    } else {
      noStroke();
    }

    translate(pl.pos.x * cellSize, 0, pl.pos.y * cellSize);
    const c = color(pl.colour);
    const w = cellSize * pl.dims.w;
    const h = cellSize * pl.dims.h;
    const d = cellSize * 3 * pl.heightScale;
    translate(w / 2, -d / 2, h / 2);
    if (frameCount === 1) {
      console.log(c);
    }
    ambientMaterial(c);
    box(w - config.gap, d, h - config.gap);
    pop();
  });
}

function mousePressed() {
  redraw();
}
