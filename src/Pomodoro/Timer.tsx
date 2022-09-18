import * as ColorUtils from "../utils/colorUtils";
import "./Timer.css";

function formatDate(date: Date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();

  const hoursStr = hours < 10 ? `0${hours}` : `${hours}`;
  const minutesStr = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const secondsStr = seconds < 10 ? `0${seconds}` : `${seconds}`;

  return `${hoursStr} : ${minutesStr} : ${secondsStr}`;
}

function formatSec(second: number) {
  const year = 1970;
  const monthIndex = 0; // January
  const day = 1;
  const hour = 0;
  const minute = 0;
  const secDate = new Date(year, monthIndex, day, hour, minute, second);
  return formatDate(secDate);
}

type TimerProps = {
  timeSec: number;
  labelColor: number;
};

function Timer(props: TimerProps) {
  return (
    <div className="Timer">
      <p
        style={
          {
            "--color": ColorUtils.ntos(props.labelColor),
          } as React.CSSProperties
        }
      >
        {formatSec(props.timeSec)}
      </p>
    </div>
  );
}

export default Timer;
