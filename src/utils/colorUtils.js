export function ntos(colorNumber) {
  let colorStr = colorNumber.toString(16);
  while (colorStr.length < 6) {
    colorStr = "0" + colorStr;
  }
  colorStr = "#" + colorStr;
  return colorStr;
}

export function ston(colorStr) {
  return Number.parseInt(colorStr.substr(1), 16);
}

export function calcColor(rightColor, leftColor, percentage) {
  const leftColorRed = (leftColor & 0xff0000) >> 16;
  const leftColorGreen = (leftColor & 0x00ff00) >> 8;
  const leftColorBlue = leftColor & 0x0000ff;

  const rightColorRed = (rightColor & 0xff0000) >> 16;
  const rightColorGreen = (rightColor & 0x00ff00) >> 8;
  const rightColorBlue = rightColor & 0x0000ff;

  const diffRed = leftColorRed - rightColorRed;
  const diffGreen = leftColorGreen - rightColorGreen;
  const diffBlue = leftColorBlue - rightColorBlue;

  const distanceFromZero = percentage < 50 ? percentage : 100 - percentage;

  const endColorRed = Math.floor(
    rightColorRed + (diffRed * distanceFromZero) / 50
  );
  const endColorGreen = Math.floor(
    rightColorGreen + (diffGreen * distanceFromZero) / 50
  );
  const endColorBlue = Math.floor(
    rightColorBlue + (diffBlue * distanceFromZero) / 50
  );
  const endColor = (endColorRed << 16) + (endColorGreen << 8) + endColorBlue;

  return endColor;
}
