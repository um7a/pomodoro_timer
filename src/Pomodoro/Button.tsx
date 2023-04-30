import React from "react";
import "./Button.css";
import * as ColorUtils from "../utils/colorUtils";

type ButtonProps = {
  isPausing: boolean;
  setIsPausing: React.Dispatch<React.SetStateAction<boolean>>;
  setGoNext: React.Dispatch<React.SetStateAction<boolean>>;
  setGoPrevious: React.Dispatch<React.SetStateAction<boolean>>;
  fontColor: number;
};

function Button(props: ButtonProps) {
  return (
    <div className="Button">
      <p
        style={
          {
            "--color": ColorUtils.ntos(props.fontColor),
          } as React.CSSProperties
        }
      >
        <span
          onClick={() => {
            props.setGoPrevious(true);
          }}
        >
          ◀︎
        </span>
        {props.isPausing ? (
          <span
            onClick={() => {
              props.setIsPausing(false);
            }}
          >
            Start
          </span>
        ) : (
          <span
            onClick={() => {
              props.setIsPausing(true);
            }}
          >
            Stop
          </span>
        )}
        <span
          onClick={() => {
            props.setGoNext(true);
          }}
        >
          ▶︎
        </span>
      </p>
    </div>
  );
}

export default Button;
