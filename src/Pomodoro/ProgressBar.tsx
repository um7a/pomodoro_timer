import CircularProgressBar from "./CircularProgressBar";
import "./ProgressBar.css";

type ProgressBarProps = {
  colors: number[];
  baseColor: number;
  oneIntervalProgress: number;
  allIntervalProgress: number;
};

function ProgressBar(props: ProgressBarProps) {
  return (
    <div id="ProgressBar">
      <CircularProgressBar
        radius={70}
        colorLeft={props.colors[0]}
        colorRight={props.colors[1]}
        colorBase={props.baseColor}
        centerX={95}
        centerY={95}
        strokeWidth={7}
        percentage={props.oneIntervalProgress}
      />
      <CircularProgressBar
        radius={77}
        colorLeft={props.colors[0]}
        colorRight={props.colors[1]}
        colorBase={props.baseColor}
        centerX={95}
        centerY={95}
        strokeWidth={2}
        percentage={props.allIntervalProgress}
      />
    </div>
  );
}

export default ProgressBar;
