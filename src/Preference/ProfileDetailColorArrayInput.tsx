import React, { useEffect, useState } from "react";

import "./ProfileDetailColorArrayInput.css";
import * as ColorUtils from "../utils/colorUtils";

const { electron } = window;

type ProfileDetailColorArrayInputProps = {
  profileKey: string;
  value: number[];
  description: string;
  fontColor: number;
};

function ProfileDetailColorArrayInput(
  props: ProfileDetailColorArrayInputProps
) {
  const [profileKey, setProfileKey] = useState("");
  const [value, setValue] = useState([0x000000, 0x000000] as number[]);
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
      className="ProfileColorArrayInput"
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
          typeof value[0] !== "undefined"
            ? ColorUtils.ntos(value[0])
            : "#000000"
        }
        onChange={(event) => {
          const newValue = [] as string[];
          newValue.push(event.target.value);
          newValue.push(ColorUtils.ntos(value[1]));
          electron.set(profileKey, newValue);
        }}
      />
      <input
        type="color"
        value={
          typeof value[1] !== "undefined"
            ? ColorUtils.ntos(value[1])
            : "#000000"
        }
        onChange={(event) => {
          const newValue = [] as string[];
          newValue.push(ColorUtils.ntos(value[0]));
          newValue.push(event.target.value);
          electron.set(profileKey, newValue);
        }}
      />
    </div>
  );
}

export default ProfileDetailColorArrayInput;
