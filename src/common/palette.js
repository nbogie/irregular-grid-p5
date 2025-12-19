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
