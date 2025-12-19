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

/**
 * @param {number} cellSize
 * return {Placement[]}
 */
function createIrregularGrid(cellSize) {
  const allCellPositions = generateAllCellPositions(cellSize);
  const placements = makePlacements(allCellPositions);
  return placements;
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

/**
 *
 * @param {number} cellSize
 * @returns {Pos[]}
 */
function generateAllCellPositions(cellSize) {
  const numRows = floor(height / cellSize);
  const numCols = floor(width / cellSize);
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
 * @typedef {()=>Dims[]} ShapeGenFn
 */
/**
 *
 * @param {Pos} pos
 * @param {ShapeGenFn} shapeGenFn
 *
 * @param {Placement[]} pls
 */
function attemptPlacement(pos, shapeGenFn, pls) {
  const dims = random(shapeGenFn());
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
  const shapeGenMain1 = () => [{ w: random([2, 5]), h: random([1, 2, 3]) }];
  const shapeGenMain2 = () => [
    { w: 5, h: 1 },
    { w: 1, h: 6 },
    { w: 2, h: 3 },
    { w: 4, h: 4 },
    { w: 7, h: 7 },
  ];
  const shapeGenSingle = () => [{ w: 1, h: 1 }];
  allCellPositions.map((pos) => attemptPlacement(pos, shapeGenMain1, pls));

  allCellPositions.map((pos) => attemptPlacement(pos, shapeGenSingle, pls));
  return pls;
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
