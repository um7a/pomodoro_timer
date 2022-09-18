export function ntos(colorNumber: number): string {
  let colorStr = colorNumber.toString(16);
  while (colorStr.length < 6) {
    colorStr = "0" + colorStr;
  }
  colorStr = "#" + colorStr;
  return colorStr;
}

export function ston(colorStr: string): number {
  return Number.parseInt(colorStr.substr(1), 16);
}

export function storn(colorStr: string, base: number): number {
  return Number.parseInt(colorStr.substr(1, 2), base);
}

export function ntorn(colorNumber: number): number {
  return (colorNumber & 0xff0000) >> 16;
}

export function stogn(colorStr: string): number {
  return Number.parseInt(colorStr.substr(3, 2), 16);
}

export function ntogn(colorNumber: number): number {
  return (colorNumber & 0x00ff00) >> 8;
}

export function stobn(colorStr: string): number {
  return Number.parseInt(colorStr.substr(5, 2), 16);
}

export function ntobn(colorNumber: number): number {
  return (colorNumber & 0x0000ff) >> 0;
}

export function calcColor(
  leftColor: string,
  rightColor: string,
  percentage: number
): string {
  if (!isColorStr(leftColor)) {
    throw new Error(`Invalid leftColor: "${leftColor}"`);
  }
  if (!isColorStr(rightColor)) {
    throw new Error(`Invalid rightColor: "${rightColor}"`);
  }
  const leftColorNum = ston(leftColor);
  const rightColorNum = ston(rightColor);

  const leftColorRed = (leftColorNum & 0xff0000) >> 16;
  const leftColorGreen = (leftColorNum & 0x00ff00) >> 8;
  const leftColorBlue = leftColorNum & 0x0000ff;

  const rightColorRed = (rightColorNum & 0xff0000) >> 16;
  const rightColorGreen = (rightColorNum & 0x00ff00) >> 8;
  const rightColorBlue = rightColorNum & 0x0000ff;

  const diffRed = rightColorRed - leftColorRed;
  const diffGreen = rightColorGreen - leftColorGreen;
  const diffBlue = rightColorBlue - leftColorBlue;

  const distanceFromZero = percentage < 50 ? percentage : 100 - percentage;

  const endColorRed = Math.floor(
    leftColorRed + (diffRed * distanceFromZero) / 50
  );
  const endColorGreen = Math.floor(
    leftColorGreen + (diffGreen * distanceFromZero) / 50
  );
  const endColorBlue = Math.floor(
    leftColorBlue + (diffBlue * distanceFromZero) / 50
  );
  const endColor = (endColorRed << 16) + (endColorGreen << 8) + endColorBlue;

  return ntos(endColor);
}

export function isColorStr(colorStr: string): boolean {
  if (colorStr.length !== 4 && colorStr.length !== 7) {
    return false;
  }
  const regex = /^#[0-9a-fA-F]+$/;
  return regex.test(colorStr);
}

export function isColorNumber(colorNumber: number): boolean {
  return (
    colorNumber >= 0x000000 &&
    colorNumber <= 0xffffff &&
    Number.isInteger(colorNumber)
  );
}
