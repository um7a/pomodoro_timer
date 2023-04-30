import "./CircularProgressBar.css";
import { useEffect, useState, useRef } from "react";

type RGB = {
  red: number;
  green: number;
  blue: number;
};

function makeId(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
    counter += 1;
  }
  return result;
}

function padByZero(uintStr: string, digit: number): string {
  if (uintStr.length >= digit) {
    return uintStr;
  }
  while (uintStr.length < digit) {
    uintStr = "0" + uintStr;
  }
  return uintStr;
}

function keepInRange(value: number, min: number, max: number): number {
  if (value < min) {
    return min;
  }
  if (value > max) {
    return max;
  }
  return value;
}

function parseColor(color: number): RGB {
  let colorStr = color.toString(16);
  if (colorStr.length < 6) {
    colorStr = padByZero(colorStr, 6);
  }
  colorStr = "#" + colorStr;

  const red = parseInt(colorStr.substring(1, 3), 16);
  const green = parseInt(colorStr.substring(3, 5), 16);
  const blue = parseInt(colorStr.substring(5, 7), 16);
  return { red: red, green: green, blue: blue };
}

function constructColorStr(rgb: RGB): string {
  return (
    `#` +
    `${padByZero(rgb.red.toString(16), 2)}` +
    `${padByZero(rgb.green.toString(16), 2)}` +
    `${padByZero(rgb.blue.toString(16), 2)}`
  );
}

type CircularProgressBarProps = {
  radius: number;
  colorLeft: number;
  colorRight: number;
  colorBase: number;
  centerX: number;
  centerY: number;
  strokeWidth: number;
  percentage: number;
};

function CircularProgressBar(props: CircularProgressBarProps) {
  const linearGradientId = useRef(makeId(10));
  const circumference = props.radius * 2 * Math.PI;

  const [initialized, setInitialized] = useState(false);

  const [colorLeft, setColorLeft] = useState("");
  const [colorLeftCenter, setColorLeftCenter] = useState("");
  const [colorCenter, setColorCenter] = useState("");
  const [colorRightCenter, setColorRightCenter] = useState("");
  const [colorRight, setColorRight] = useState("");
  const [colorBase, setColorBase] = useState("");

  const allColors = useRef<string[]>([]); // calculated later

  const colorChangeStage = 30;
  const colorChangeCount = useRef(0);

  // initialization
  useEffect(() => {
    // calculate all colors of gradation.
    const edgeRgbLeft = parseColor(props.colorLeft);
    const edgeRgbRight = parseColor(props.colorRight);
    const diffRed = edgeRgbLeft.red - edgeRgbRight.red;
    const diffGreen = edgeRgbLeft.green - edgeRgbRight.green;
    const diffBlue = edgeRgbLeft.blue - edgeRgbRight.blue;

    const fragmentRed =
      diffRed > 0
        ? Math.ceil(diffRed / colorChangeStage)
        : Math.floor(diffRed / colorChangeStage);
    const fragmentGreen =
      diffGreen > 0
        ? Math.ceil(diffGreen / colorChangeStage)
        : Math.floor(diffGreen / colorChangeStage);
    const fragmentBlue =
      diffBlue > 0
        ? Math.ceil(diffBlue / colorChangeStage)
        : Math.floor(diffBlue / colorChangeStage);

    allColors.current = [];
    for (let i = 0; i < colorChangeStage; i++) {
      const red = keepInRange(edgeRgbLeft.red - fragmentRed * i, 0x00, 0xff);
      const green = keepInRange(
        edgeRgbLeft.green - fragmentGreen * i,
        0x00,
        0xff
      );
      const blue = keepInRange(edgeRgbLeft.blue - fragmentBlue * i, 0x00, 0xff);
      allColors.current.push(constructColorStr({ red, green, blue }));
    }
    for (let i = colorChangeStage - 1; i >= 0; i--) {
      const red = keepInRange(edgeRgbLeft.red - fragmentRed * i, 0x00, 0xff);
      const green = keepInRange(
        edgeRgbLeft.green - fragmentGreen * i,
        0x00,
        0xff
      );
      const blue = keepInRange(edgeRgbLeft.blue - fragmentBlue * i, 0x00, 0xff);
      allColors.current.push(constructColorStr({ red, green, blue }));
    }

    setColorBase(constructColorStr(parseColor(props.colorBase)));

    setInitialized(true);
  }, [props.colorLeft, props.colorRight, props.colorBase]);

  // rotate gradation
  useEffect(() => {
    if (initialized === false) {
      // CircularProgressBar has not initialized yet.
      // Do nothing.
      return;
    }

    const rotateGradation = () => {
      const colorPositionLeft = colorChangeCount.current;
      const colorPositionLeftCenter =
        (colorChangeCount.current + Math.floor(colorChangeStage / 4)) %
        (colorChangeStage * 2);
      const colorPositionCenter =
        (colorChangeCount.current + Math.floor(colorChangeStage / 2)) %
        (colorChangeStage * 2);
      const colorPositionRightCenter =
        (colorChangeCount.current + Math.floor((colorChangeStage / 4) * 3)) %
        (colorChangeStage * 2);
      const colorPositionRight =
        (colorChangeCount.current + colorChangeStage) % (colorChangeStage * 2);

      setColorLeft(allColors.current[colorPositionLeft]);
      setColorLeftCenter(allColors.current[colorPositionLeftCenter]);
      setColorCenter(allColors.current[colorPositionCenter]);
      setColorRightCenter(allColors.current[colorPositionRightCenter]);
      setColorRight(allColors.current[colorPositionRight]);

      colorChangeCount.current = colorChangeCount.current + 1;
      if (colorChangeCount.current >= colorChangeStage * 2) {
        colorChangeCount.current = 0;
      }
    };

    rotateGradation();
    const intervalId = setInterval(() => {
      rotateGradation();
    }, 250);

    return () => clearInterval(intervalId);
  }, [initialized]);

  return (
    <div className="CircularProgressBar">
      <svg id="circle" width="230" height="240">
        <defs>
          <linearGradient
            id={linearGradientId.current}
            gradientUnits="userSpaceOnUse"
          >
            <stop className="stop1" offset="0%" stopColor={colorLeft} />
            <stop className="stop2" offset="25%" stopColor={colorLeftCenter} />
            <stop className="stop3" offset="50%" stopColor={colorCenter} />
            <stop className="stop4" offset="75%" stopColor={colorRightCenter} />
            <stop className="stop5" offset="100%" stopColor={colorRight} />
          </linearGradient>
        </defs>

        <circle
          cx={props.centerX}
          cy={props.centerY}
          r={props.radius}
          stroke={colorBase}
          strokeLinecap="round"
          strokeWidth={props.strokeWidth}
          fillOpacity="0%"
        />

        <circle
          cx={props.centerX}
          cy={props.centerY}
          r={props.radius}
          stroke={`url(#${linearGradientId.current})`}
          strokeLinecap="round"
          strokeWidth={props.strokeWidth}
          fillOpacity="0%"
          strokeDasharray={circumference}
          strokeDashoffset={
            circumference - (circumference * props.percentage) / 100
          }
        ></circle>
      </svg>
    </div>
  );
}

export default CircularProgressBar;
