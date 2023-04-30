import React, { useEffect, useState } from "react";

import "./ProfileDetail.css";
import ProfileDetailNumberInput from "./ProfileDetailNumberInput";
import ProfileDetailCheckboxInput from "./ProfileDetailCheckboxInput";
import ProfileDetailColorArrayInput from "./ProfileDetailColorArrayInput";
import ProfileDetailColorInput from "./ProfileDetailColorInput";
import * as ColorUtils from "../utils/colorUtils";

type ProfileDetailProps = {
  currentProfile: any;
};

function isPositiveInteger(value: number): boolean {
  if (!Number.isInteger(value) || value < 1) {
    return false;
  }
  return true;
}

function isBetween0And1(value: number): boolean {
  const max = 1;
  const min = 0;
  if (Number.isNaN(value) || value > max || value < min) {
    return false;
  }
  return true;
}

function ProfileDetail(props: ProfileDetailProps) {
  // state for timer's configuration
  const [workMinuteStr, setWorkMinuteStr] = useState("0");
  const [shortBreakMinuteStr, setShortBreakMinuteStr] = useState("0");
  const [longBreakMinuteStr, setLongBreakMinuteStr] = useState("0");
  const [nWorkBeforeLongBreakStr, setNWorkBeforeLongBreakStr] = useState("0");

  // state for notification's configuration
  const [notificationIsEnabled, setNotificationIsEnabled] = useState(true);

  // state for window's configuration
  const [backgroundColor, setBackgroundColor] = useState(0x000000);
  const [transparent, setTransparent] = useState("1.0");

  // state for progress bar's configuration
  const [workColors, setWorkColors] = useState([0x000000]);
  const [shortBreakColors, setShortBreakColors] = useState([0x000000]);
  const [longBreakColors, setLongBreakColors] = useState([0x000000]);
  const [workBaseColor, setWorkBaseColor] = useState(0x000000);
  const [shortBreakBaseColor, setShortBreakBaseColor] = useState(0x000000);
  const [longBreakBaseColor, setLongBreakBaseColor] = useState(0x000000);
  const [fontColor, setFontColor] = useState(0x000000);

  // state for preference's configuration
  const [prefTransparent, setPrefTransparent] = useState("1.0");
  const [prefBgColor, setPrefBgColor] = useState(0x000000);
  const [prefLineColor, setPrefLineColor] = useState(0x000000);
  const [prefLabelBgColor, setPrefLabelBgColor] = useState(0x000000);
  const [prefLabelFontColor, setPrefLabelFontColor] = useState(0x000000);
  const [prefFontColor, setPrefFontColor] = useState(0x000000);
  const [prefFontInvalidColor, setPrefFontInvalidColor] = useState(0x000000);
  const [prefCheckMarkColor, setPrefCheckMarkColor] = useState(0x000000);

  //
  // (1) Load profile when current profile is changed.
  //
  useEffect(() => {
    if (typeof props.currentProfile === "undefined") {
      console.warn(`Profile is not initialized. Skip loading.`);
      return;
    }
    console.log(`Load profile.`);
    // about timer's configuration
    setWorkMinuteStr(
      String(Math.floor(props.currentProfile.workIntervalSec / 60))
    );
    setShortBreakMinuteStr(
      String(Math.floor(props.currentProfile.shortBreakIntervalSec / 60))
    );
    setLongBreakMinuteStr(
      String(Math.floor(props.currentProfile.longBreakIntervalSec / 60))
    );
    setNWorkBeforeLongBreakStr(
      String(Math.floor(props.currentProfile.nWorkBeforeLongBreak))
    );

    // about notification configuration
    setNotificationIsEnabled(props.currentProfile.notificationIsEnabled);

    // about pomodoro progress bar's configuration
    setTransparent(props.currentProfile.transparent);
    setWorkColors(props.currentProfile.workColors);
    setShortBreakColors(props.currentProfile.shortBreakColors);
    setLongBreakColors(props.currentProfile.longBreakColors);
    setBackgroundColor(props.currentProfile.backgroundColor);
    setWorkBaseColor(props.currentProfile.workBaseColor);
    setShortBreakBaseColor(props.currentProfile.shortBreakBaseColor);
    setLongBreakBaseColor(props.currentProfile.longBreakBaseColor);
    setFontColor(props.currentProfile.fontColor);

    // about preference's configuration
    setPrefTransparent(props.currentProfile.preferenceTransparent);
    setPrefBgColor(props.currentProfile.preferenceBackgroundColor);
    setPrefLineColor(props.currentProfile.preferenceLineColor);
    setPrefLabelBgColor(props.currentProfile.preferenceLabelBackgroundColor);
    setPrefLabelFontColor(props.currentProfile.preferenceLabelFontColor);
    setPrefFontColor(props.currentProfile.preferenceFontColor);
    setPrefFontInvalidColor(props.currentProfile.preferenceFontInvalidColor);
    setPrefCheckMarkColor(props.currentProfile.preferenceCheckMarkColor);
  }, [props.currentProfile]);

  return (
    <div className="ProfileDetail">
      <div className="ProfileDetailColumn">
        <div
          className="ProfileDetailHeader"
          style={
            {
              "--label-bg-color": ColorUtils.ntos(prefLabelBgColor),
              "--label-font-color": ColorUtils.ntos(prefLabelFontColor),
            } as React.CSSProperties
          }
        >
          <p>Pomodoro</p>
        </div>
        <ProfileDetailNumberInput
          profileKey={"workIntervalSec"}
          value={workMinuteStr}
          description={"Work Interval"}
          unit={"Minutes"}
          convertFunc={(value: number) => Math.floor(value * 60)}
          validateFunc={isPositiveInteger}
          bgColor={prefBgColor}
          fontColor={prefFontColor}
          fontInvalidColor={prefFontInvalidColor}
          lineColor={prefLineColor}
        />
        <ProfileDetailNumberInput
          profileKey={"shortBreakIntervalSec"}
          value={shortBreakMinuteStr}
          description={"Short Break Interval"}
          unit={"Minutes"}
          convertFunc={(value: number) => Math.floor(value * 60)}
          validateFunc={isPositiveInteger}
          bgColor={prefBgColor}
          fontColor={prefFontColor}
          fontInvalidColor={prefFontInvalidColor}
          lineColor={prefLineColor}
        />
        <ProfileDetailNumberInput
          profileKey={"longBreakIntervalSec"}
          value={longBreakMinuteStr}
          description={"Long Break Interval"}
          unit={"Minutes"}
          convertFunc={(value: number) => Math.floor(value * 60)}
          validateFunc={isPositiveInteger}
          bgColor={prefBgColor}
          fontColor={prefFontColor}
          fontInvalidColor={prefFontInvalidColor}
          lineColor={prefLineColor}
        />
        <ProfileDetailNumberInput
          profileKey={"nWorkBeforeLongBreak"}
          value={nWorkBeforeLongBreakStr}
          description={"Number of work before long break"}
          unit={"Times"}
          convertFunc={(value: number) => value}
          validateFunc={isPositiveInteger}
          bgColor={prefBgColor}
          fontColor={prefFontColor}
          fontInvalidColor={prefFontInvalidColor}
          lineColor={prefLineColor}
        />
        <ProfileDetailNumberInput
          profileKey={"transparent"}
          value={transparent}
          description={"Transparent"}
          unit={""}
          convertFunc={(value: number) => value}
          validateFunc={isBetween0And1}
          bgColor={prefBgColor}
          fontColor={prefFontColor}
          fontInvalidColor={prefFontInvalidColor}
          lineColor={prefLineColor}
        />
        <ProfileDetailColorArrayInput
          profileKey={"workColors"}
          value={workColors}
          description={"Work Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorArrayInput
          profileKey={"shortBreakColors"}
          value={shortBreakColors}
          description={"Short Break Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorArrayInput
          profileKey={"longBreakColors"}
          value={longBreakColors}
          description={"Long Break Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"backgroundColor"}
          value={backgroundColor}
          description={"Background Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"workBaseColor"}
          value={workBaseColor}
          description={"Work Base Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"shortBreakBaseColor"}
          value={shortBreakBaseColor}
          description={"Short Break Base Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"longBreakBaseColor"}
          value={longBreakBaseColor}
          description={"Long Break Base Color"}
          fontColor={prefFontColor}
        />

        <ProfileDetailColorInput
          profileKey={"fontColor"}
          value={fontColor}
          description={"Font Color"}
          fontColor={prefFontColor}
        />

        <div
          className="ProfileDetailHeader"
          style={
            {
              "--label-bg-color": ColorUtils.ntos(prefLabelBgColor),
              "--label-font-color": ColorUtils.ntos(prefLabelFontColor),
            } as React.CSSProperties
          }
        >
          <p>Notification</p>
        </div>
        <ProfileDetailCheckboxInput
          profileKey={"notificationIsEnabled"}
          value={notificationIsEnabled}
          description={"Send Notification"}
          bgColor={prefBgColor}
          fontColor={prefFontColor}
          lineColor={prefLineColor}
          checkMarkColor={prefCheckMarkColor}
        />
      </div>

      <div className="ProfileDetailColumn">
        <div
          className="ProfileDetailHeader"
          style={
            {
              "--label-bg-color": ColorUtils.ntos(prefLabelBgColor),
              "--label-font-color": ColorUtils.ntos(prefLabelFontColor),
            } as React.CSSProperties
          }
        >
          <p>Preference</p>
        </div>
        <ProfileDetailNumberInput
          profileKey={"preferenceTransparent"}
          value={prefTransparent}
          description={"Transparent"}
          unit={""}
          convertFunc={(value: number) => value}
          validateFunc={isBetween0And1}
          bgColor={prefBgColor}
          fontColor={prefFontColor}
          fontInvalidColor={prefFontInvalidColor}
          lineColor={prefLineColor}
        />
        <ProfileDetailColorInput
          profileKey={"preferenceBackgroundColor"}
          value={prefBgColor}
          description={"Background Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"preferenceLineColor"}
          value={prefLineColor}
          description={"Line Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"preferenceLabelBackgroundColor"}
          value={prefLabelBgColor}
          description={"Label Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"preferenceLabelFontColor"}
          value={prefLabelFontColor}
          description={"Label Font Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"preferenceFontColor"}
          value={prefFontColor}
          description={"Font Color"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"preferenceFontInvalidColor"}
          value={prefFontInvalidColor}
          description={"Font Color (Invalid)"}
          fontColor={prefFontColor}
        />
        <ProfileDetailColorInput
          profileKey={"preferenceCheckMarkColor"}
          value={prefCheckMarkColor}
          description={"Check Mark Color"}
          fontColor={prefFontColor}
        />
      </div>
    </div>
  );
}

export default ProfileDetail;
