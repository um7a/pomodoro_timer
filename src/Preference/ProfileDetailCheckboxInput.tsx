import React, { useEffect, useState } from "react";

import "./ProfileDetailCheckboxInput.css";
import * as ColorUtils from "../utils/colorUtils";

const { electron } = window;

type ProfileDetailCheckboxInputProps = {
  profileKey: string;
  value: boolean;
  description: string;
  bgColor: number;
  fontColor: number;
  lineColor: number;
  checkMarkColor: number;
};

function ProfileDetailCheckboxInput(props: ProfileDetailCheckboxInputProps) {
  const [profileKey, setProfileKey] = useState("");
  const [value, setValue] = useState(false);
  const [description, setDescription] = useState("");
  const [fontColor, setFontColor] = useState(0x000000);
  const [lineColor, setLineColor] = useState(0x000000);
  const [checkMarkColor, setCheckMarkColor] = useState(0x000000);

  //
  // (1) Load profile
  //
  useEffect(() => {
    setProfileKey(props.profileKey);
    setValue(props.value);
    setDescription(props.description);
    setFontColor(props.fontColor);
    setLineColor(props.lineColor);
    setCheckMarkColor(props.checkMarkColor);
  }, [props]);

  return (
    <div
      className="ProfileCheckboxInput"
      style={
        {
          "--font-color": ColorUtils.ntos(fontColor),
        } as React.CSSProperties
      }
    >
      <p className="key">{description}</p>
      <input
        type="checkbox"
        id={profileKey}
        checked={value}
        onBlur={() => {
          electron.set(profileKey, value);
        }}
      />
      <label
        style={
          {
            "--line-color": ColorUtils.ntos(lineColor),
            "--check-mark-color": ColorUtils.ntos(checkMarkColor),
          } as React.CSSProperties
        }
        onClick={() => {
          setValue(!value);
          electron.set(profileKey, !value);
        }}
      ></label>
    </div>
  );
}

export default ProfileDetailCheckboxInput;
