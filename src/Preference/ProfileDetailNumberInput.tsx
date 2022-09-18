import React, { useEffect, useState } from "react";

import "./ProfileDetailNumberInput.css";
import * as ColorUtils from "../utils/colorUtils";

const { electron } = window;

type ProfileDetailNumberInputProps = {
  profileKey: string;
  value: string;
  description: string;
  unit: string;
  convertFunc: ((value: number) => number) | undefined;
  validateFunc: ((value: number) => boolean) | undefined;
  bgColor: number;
  fontColor: number;
  fontInvalidColor: number;
  lineColor: number;
};

function ProfileDetailNumberInput(props: ProfileDetailNumberInputProps) {
  const [profileKey, setProfileKey] = useState("");
  const [value, setValue] = useState("");
  const [description, setDescription] = useState("");
  const [unit, setUnit] = useState("");
  const [convertFunc, setConvertFunc] = useState({
    func: (original: number) => original,
  });
  const [validateFunc, setValidateFunc] = useState({
    func: (value: number) => true,
  } as { func: (value: number) => boolean });
  const [valueIsValid, setValueIsValid] = useState(true);
  const [bgColor, setBgColor] = useState(0x000000);
  const [fontColor, setFontColor] = useState(0x000000);
  const [fontValidColor, setFontValidColor] = useState(0x000000);
  const [fontInvalidColor, setFontInvalidColor] = useState(0x000000);
  const [lineColor, setLineColor] = useState(0x000000);

  //
  // (1) Load profile
  //
  useEffect(() => {
    setProfileKey(props.profileKey);
    setValue(props.value);
    setDescription(props.description);
    setUnit(props.unit);
    if (props.convertFunc) {
      setConvertFunc({ func: props.convertFunc });
    }
    if (props.validateFunc) {
      setValidateFunc({ func: props.validateFunc });
    }
    setBgColor(props.bgColor);
    setFontColor(props.fontColor);
    setFontValidColor(props.fontColor);
    setFontInvalidColor(props.fontInvalidColor);
    setLineColor(props.lineColor);
  }, [props]);

  return (
    <div
      className="ProfileNumberInput"
      style={
        {
          "--font-color": ColorUtils.ntos(fontColor),
        } as React.CSSProperties
      }
    >
      <p className="key">{description}</p>
      <input
        type="text"
        className="value"
        style={
          {
            "--bg-color": ColorUtils.ntos(bgColor),
            "--font-color": ColorUtils.ntos(fontColor),
            "--line-color": ColorUtils.ntos(lineColor),
          } as React.CSSProperties
        }
        value={value}
        onChange={(event) => {
          const valueNumber = Number(event.target.value);
          const isValid = validateFunc.func(valueNumber);
          if (isValid) {
            setFontColor(fontValidColor);
            setValueIsValid(true);
          } else {
            setFontColor(fontInvalidColor);
            setValueIsValid(false);
          }
          setValue(event.target.value);
        }}
        onBlur={() => {
          if (valueIsValid) {
            electron.set(profileKey, convertFunc.func(Number(value)));
          }
        }}
      />
      <p className="unit">{unit}</p>
    </div>
  );
}

export default ProfileDetailNumberInput;
