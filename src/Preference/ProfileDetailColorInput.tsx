import React, { useEffect, useState } from "react";

import "./ProfileDetailColorInput.css";
import * as ColorUtils from "../utils/colorUtils";

const { electron } = window;

type ProfileDetailColorInputProps = {
  profileKey: string;
  value: number;
  description: string;
  fontColor: number;
};

function ProfileDetailColorInput(props: ProfileDetailColorInputProps) {
  const [profileKey, setProfileKey] = useState("");
  const [value, setValue] = useState(0x000000);
  const [description, setDescription] = useState("");
  const [fontColor, setFontColor] = useState(0x000000);

  //
  // (1) Load profile
  //
  useEffect(() => {
    if (typeof props === "undefined") {
      return;
    }
    setProfileKey(props.profileKey);
    setValue(props.value);
    setDescription(props.description);
    setFontColor(props.fontColor);
  }, [props]);

  return (
    <div
      className="ProfileColorInput"
      style={
        {
          "--font-color": ColorUtils.ntos(fontColor),
        } as React.CSSProperties
      }
    >
      <p className="key">{description}</p>
      <input
        type="color"
        value={
          typeof value !== "undefined" ? ColorUtils.ntos(value) : "#000000"
        }
        onChange={(event) => {
          electron.set(profileKey, event.target.value);
        }}
      />
    </div>
  );
}

export default ProfileDetailColorInput;
