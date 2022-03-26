export function ntos(colorNumber) {
  let colorStr = colorNumber.toString(16);
  while (colorStr.length < 6) {
    colorStr = '0' + colorStr;
  }
  colorStr = '#' + colorStr;
  return colorStr;
}

export function ston(colorStr) {
  return Number.parseInt(colorStr.substr(1), 16);
}