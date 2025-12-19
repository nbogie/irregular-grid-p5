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
 * @type {{pos: p5.Vector, desiredPos: p5.Vector, desiredLookAt:p5.Vector, lookAt:p5.Vector}}
 */
let myCam;

/**
 * @typedef {Placement & { colour: string, heightScale: number }} PlacementMore
 */
/** @typedef {Object} Config
 * @property {number} cellSize
 * @property {number} gap
 * @property {boolean} enableStroke
 * @property {boolean} enableFill
 * @property {boolean} enableTransparent
 * @property {number} worldWidth
 *
 */

function setup() {
  const dim = min(windowWidth, windowHeight);

  createCanvas(dim, dim, WEBGL);
  frustum(-width / 20, width / 20, -height / 20, height / 20, 20, 2000);
  // frustum(-10, 10, -10, 10, 300, 350);

  // The last two parameters, near and far, set the distance of the frustum’s near and far plane from the camera. For example, calling ortho(-100, 100, 200, -200, 50, 1000) creates a frustum that’s 200 pixels wide, 400 pixels tall, starts 50 pixels from the camera, and ends 1,000 pixels from the camera. By default, near is set to 0.1 * 800, which is 1/10th the default distance between the camera and the origin. far is set to 10 * 800

  regenerate();
}

function regenerate() {
  palette = createPalette();
  config = {
    cellSize: width / 20,
    gap: 0.1,
    enableStroke: false,
    enableTransparent: false,
    enableFill: true,

    worldWidth: width,
  };
  placements = createIrregularGrid(config.cellSize).map((p) => ({
    ...p,
    colour: random(palette.allColours),
    heightScale: random(0.5, 1),
  }));
  setBodyBackgroundAsDarkerThan(palette.bg);
  myCam = {
    pos: randomCamPos(),
    desiredPos: randomCamPos(),
    desiredLookAt: createVector(0, 0, 0),
    lookAt: createVector(0, 0, 0),
  };
}

function draw() {
  background(palette.bg);
  orbitControl();
  updateCamera();
  lights();
  directionalLight(color(100), createVector(-0.5, 1, 0.2));
  drawPlacements3D(placements);
}

function setBodyBackgroundAsDarkerThan(baseColour) {
  const lightnessFrac = 0.92;
  document.body.style.backgroundColor = `oklch(from ${baseColour} calc(l * ${lightnessFrac}) c h)`;
}

/**
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
    if (config.enableTransparent) {
      c.setAlpha(220);
    }
    const w = cellSize * pl.dims.w;
    const h = cellSize * pl.dims.h;
    const d = cellSize * 3 * pl.heightScale;
    translate(w / 2, -d / 2, h / 2);
    if (config.enableFill) {
      fill(c);
      // ambientMaterial(c);
    } else {
      noFill();
    }

    box(w - config.gap, d, h - config.gap);
    pop();
  });
}

function mousePressed() {
  redraw();
}

function keyPressed() {
  if (key === "r") {
    regenerate();
  }
  if (key === "f") {
    config.enableFill = !config.enableFill;
    config.enableStroke = !config.enableFill;
  }
  if (key === "s") {
    if (!config.enableFill) {
      config.enableStroke = true;
    } else {
      config.enableStroke = !config.enableStroke;
    }
  }
  if (key === "a") {
    config.enableTransparent = !config.enableTransparent;
  }
  if (key === "g") {
    config.gap = config.gap < 1 ? 10 : 0.1;
  }
}

function updateCamera() {
  camera(
    myCam.pos.x,
    myCam.pos.y,
    myCam.pos.z,
    myCam.lookAt.x,
    myCam.lookAt.y,
    myCam.lookAt.z
  );

  myCam.pos.lerp(myCam.desiredPos, 0.02);
  myCam.lookAt.lerp(myCam.desiredLookAt, 0.005);

  if (random() < 0.001) {
    myCam.desiredPos = randomCamPos();
  }
  if (random() < 0.001) {
    myCam.desiredLookAt = randomLookAtPos();
  }
}

/**
 *
 * @returns {p5.Vector}
 */
function randomCamPos() {
  const p = p5.Vector.fromAngle(random(TWO_PI), 400);
  return createVector(p.x, random(-200, -100), p.y);
}
function randomLookAtPos() {
  const p = p5.Vector.fromAngle(random(TWO_PI), random(0, config.worldWidth));
  return createVector(p.x, random(0, -100), p.y);
}

/**
 * @typedef {Object} Palette
 * @property {string[]} allColours
 * @property {string} guidelines
 * @property {string} placementOutline
 * @property {string} bg
 */
/**
 * @returns Palette
 */
function createPalette() {
  return random([createPalette1, createPalette2])();
}
/**
 * @returns Palette
 */
function createPalette2() {
  const colours = [
    "#f2eb8a",
    "#fed000",
    "#fc8405",
    "#ed361a",
    "#e2f0f3",
    "#b3dce0",
    "#4464a1",
    "#203051",
    "#ffc5c7",
    "#f398c3",
    "#cf3895",
    "#06b4b0",
    "#4b8a5f",
  ];

  /**@type {Palette} */
  const retVal = {
    allColours: colours,
    bg: "#6d358a",
    guidelines: colours[0],
    placementOutline: random(colours),
  };
  return retVal;
}
/**
 * @returns Palette
 */
function createPalette1() {
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
    placementOutline: "#404040",
  };
}
