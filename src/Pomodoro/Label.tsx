import * as ColorUtils from "../utils/colorUtils";
import "./Label.css";

type LabelProps = {
  isWorking: boolean;
  isLongBreak: boolean;
  labelColor: number;
};

const LABEL = {
  work: "Work",
  shortBreak: "Short Break",
  longBreak: "Long Break",
};

function Label(props: LabelProps) {
  if (props.isWorking) {
    return (
      <div
        className="Label"
        style={
          {
            "--color": ColorUtils.ntos(props.labelColor),
          } as React.CSSProperties
        }
      >
        <p>{LABEL.work}</p>
      </div>
    );
  } else if (props.isLongBreak) {
    return (
      <div
        className="Label"
        style={
          {
            "--color": ColorUtils.ntos(props.labelColor),
          } as React.CSSProperties
        }
      >
        <p>{LABEL.longBreak}</p>
      </div>
    );
  } else {
    return (
      <div
        className="Label"
        style={
          {
            "--color": ColorUtils.ntos(props.labelColor),
          } as React.CSSProperties
        }
      >
        <p>{LABEL.shortBreak}</p>
      </div>
    );
  }
}

export default Label;
