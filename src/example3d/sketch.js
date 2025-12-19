// credits:
// including some Kjetil Golid palettes from https://github.com/kgolid/chromotome via https://nice-colours-quicker.netlify.app/
// and some Roni Kaufman ones: https://ronikaufman.github.io/color_pals/

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
 * @property {number} baseHeightScale
 * @property {boolean} enableStroke
 * @property {boolean} enableBadOutline
 * @property {boolean} enableFill
 * @property {boolean} enableLights
 * @property {boolean} enableTransparent
 * @property {boolean} enableCameraAnimation
 * @property {number} worldWidth
 *
 */

function setup() {
  const dim = min(windowWidth, windowHeight) - 50;

  createCanvas(dim, dim, WEBGL);
  setCanvasDropShadow();
  perspective(2 * atan(height / 2 / 800), width / height, 1, 2000);
  regenerate();
}

function regenerate() {
  palette = createPalette();
  config = {
    cellSize: width / 20,
    gap: 5,
    baseHeightScale: 2,
    enableStroke: frameCount < 2 ? true : random() < 0.2,
    enableBadOutline: random([true, false, false]),
    enableTransparent: false,
    enableCameraAnimation: false,
    enableFill: true,
    enableLights: frameCount < 2 ? false : random() < 0.9,
    worldWidth: width,
  };
  placements = createIrregularGrid(config.cellSize).map((p) => ({
    ...p,
    colour: random(palette.allColours),
    heightScale: snapTo(random(0.5, 1), 0.1),
  }));
  setBodyBackgroundAsDarkerThan(palette.bg);

  myCam = {
    pos: randomCamPos(),
    desiredPos: randomCamPos(),
    desiredLookAt: createVector(0, 0, 0),
    lookAt: createVector(0, 0, 0),
  };
  updateCamera();
}

function draw() {
  background(palette.bg);
  orbitControl();
  if (config.enableCameraAnimation) {
    updateCamera();
  }
  if (config.enableLights) {
    lights();
    directionalLight(color(100), createVector(-0.5, 1, 0.2));
  }
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
    if (config.enableStroke && !config.enableBadOutline) {
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
    const d = cellSize * config.baseHeightScale * pl.heightScale;
    push();
    translate(w / 2, -d / 2, h / 2);
    if (config.enableFill) {
      fill(c);
      // ambientMaterial(c);
    } else {
      noFill();
    }

    box(w - config.gap, d, h - config.gap);
    pop();
    if (config.enableBadOutline) {
      push();
      const angle = 0.03;
      translate(w / 2, -d / 2, h / 2);
      rotateX(angle);
      rotateY(angle);
      rotateZ(angle);
      noFill();
      stroke(0.1);
      box(w - config.gap * 1.1, d, h - config.gap * 1.1);
      pop();
    }
    pop();
  });
}

function mousePressed() {
  if (random([true, false])) {
    randomiseCameraPosition();
  } else {
    randomiseCameraLookAt();
  }
}

function keyPressed() {
  if (key === "r" || key === " ") {
    regenerate();
  }
  if (key === "p") {
    palette = createPalette();
    assignColours();
    setBodyBackgroundAsDarkerThan(palette.bg);
  }
  if (key === "f") {
    config.enableFill = !config.enableFill;
    config.enableStroke = !config.enableFill;
  }
  if (key === "l") {
    config.enableLights = !config.enableLights;
  }
  if (key === "c") {
    config.enableCameraAnimation = !config.enableCameraAnimation;
  }
  if (key === "s") {
    if (!config.enableFill) {
      config.enableStroke = true;
    } else {
      config.enableStroke = !config.enableStroke;
    }
  }
  if (key === "b") {
    config.enableBadOutline = !config.enableBadOutline;
  }
  if (key === "a") {
    config.enableTransparent = !config.enableTransparent;
  }
  if (key === "g") {
    config.gap = random([0.1, 5, 10, 15, 20].filter((v) => v !== config.gap));
  }
  if (key === "v") {
    save("grid-3d");
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
    randomiseCameraPosition();
  }
  if (random() < 0.001) {
    randomiseCameraLookAt();
  }
}

/**
 *
 * @returns {p5.Vector}
 */
function randomCamPos() {
  if (random() < 0.1) {
    return createVector(0, -700, -300);
  }
  const p = p5.Vector.fromAngle(random(TWO_PI), 400);
  return createVector(p.x, random(-700, -100), p.y);
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
  if (frameCount < 2) {
    return createPalette4();
  }
  return random([
    createPalette1,
    createPalette2,
    createPalette3,
    createPalette4,
  ])();
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
/**
 *
 * @returns {Palette}
 */
function createPalette3() {
  const kgolidPalette = {
    name: "rag-taj",
    colors: ["#ce565e", "#8e1752", "#f8a100", "#3ac1a6"],
    background: "#efdea2",
    size: 4,
    type: "chromotome",
  };
  /**
   * @type {Palette}
   */
  const ret = {
    allColours: kgolidPalette.colors,
    bg: kgolidPalette.background,
    placementOutline: random(kgolidPalette.colors),
    guidelines: "#202020",
  };
  return ret;
}

function createPalette4() {
  const kg = {
    name: "iiso_airlines",
    colors: ["#fe765a", "#ffb468", "#4b588f", "#faf1e0"],
    stroke: "#1c1616",
    background: "#fae5c8",
    size: 4,
    type: "chromotome",
  };
  /**
   * @type {Palette}
   */
  const ret = {
    allColours: kg.colors,
    bg: kg.background,
    guidelines: kg.stroke,
    placementOutline: kg.stroke,
  };
  return ret;
}

function randomiseCameraPosition() {
  myCam.desiredPos = randomCamPos();
}

function randomiseCameraLookAt() {
  myCam.desiredLookAt = randomLookAtPos();
}

function assignColours() {
  placements.forEach((p) => {
    p.colour = random(palette.allColours);
  });
}
/**
 *
 * @param {number} val
 * @param {number} inc
 */
function snapTo(val, inc) {
  return inc * round(val / inc);
}

function windowResized() {
  const dim = min(windowWidth, windowHeight) - 50;
  resizeCanvas(dim, dim);
}

function setCanvasDropShadow() {
  Array.from(document.getElementsByTagName("canvas")).forEach((cnv) => {
    cnv.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.2)";
  });
}
