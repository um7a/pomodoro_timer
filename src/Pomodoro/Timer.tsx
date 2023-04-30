import * as ColorUtils from "../utils/colorUtils";
import "./Timer.css";

function getMinutes(date: Date): string {
  const hours = date.getHours();
  let minutes = date.getMinutes();
  minutes = hours * 60 + minutes;
  return minutes < 10 ? `0${minutes}` : `${minutes}`;
}

function getSeconds(date: Date): string {
  const seconds = date.getSeconds();
  return seconds < 10 ? `0${seconds}` : `${seconds}`;
}

function secToDate(second: number) {
  const year = 1970;
  const monthIndex = 0; // January
  const day = 1;
  const hour = 0;
  const minute = 0;
  return new Date(year, monthIndex, day, hour, minute, second);
}

type TimerProps = {
  timeSec: number;
  fontColor: number;
};

function Timer(props: TimerProps) {
  return (
    <div className="Timer">
      <div
        className="TimerLabel"
        style={
          {
            "--color": ColorUtils.ntos(props.fontColor),
          } as React.CSSProperties
        }
      >
        <div className="Minute">{getMinutes(secToDate(props.timeSec))}</div>
        <div className="Colon">:</div>
        <div className="Second">{getSeconds(secToDate(props.timeSec))}</div>
      </div>
    </div>
  );
}

export default Timer;
