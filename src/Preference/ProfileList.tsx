import React, { useEffect, useState } from "react";

import "./ProfileList.css";
import * as ColorUtils from "../utils/colorUtils";

const { electron } = window;

type ProfileListProps = {
  currentProfile: any;
};

function ProfileList(props: ProfileListProps) {
  const [profileNames, setProfileNames] = useState([] as string[]);
  const [currentProfileName, setCurrentProfileName] = useState("");
  const [editedCurrentProfileName, setEditedCurrentProfileNameCopy] =
    useState("");
  const [fontColor, setFontColor] = useState(0x000000);
  const [labelBgColor, setLabelBgColor] = useState(0x000000);
  const [labelFontColor, setLabelFontColor] = useState(0x000000);
  const [lineColor, setLineColor] = useState(0x000000);

  //
  // (1) Load profile when current profile is changed.
  //
  useEffect(() => {
    if (typeof props.currentProfile === "undefined") {
      console.warn(`Profile is not initialized. Skip loading.`);
      return;
    }
    console.log(`Load profile.`);
    setFontColor(props.currentProfile.preferenceFontColor);
    setLabelBgColor(props.currentProfile.preferenceLabelBackgroundColor);
    setLabelFontColor(props.currentProfile.preferenceLabelFontColor);
    setLineColor(props.currentProfile.preferenceLineColor);
    electron.getProfileNames().then((profileNames: string[]) => {
      setProfileNames(profileNames);
    });
    electron.getCurrentProfileName().then((profileName: string) => {
      setCurrentProfileName(profileName);
      setEditedCurrentProfileNameCopy(profileName);
    });
  }, [props.currentProfile]);

  const profileList = profileNames.map((profileName) => {
    if (profileName === currentProfileName) {
      return (
        <input
          className="selected"
          style={
            {
              "--font-color": ColorUtils.ntos(fontColor),
              "--label-bg-color": ColorUtils.ntos(labelBgColor),
            } as React.CSSProperties
          }
          type="text"
          value={editedCurrentProfileName}
          onChange={(event) => {
            setEditedCurrentProfileNameCopy(event.target.value);
          }}
          onBlur={() => {
            electron.renameCurrentProfile(editedCurrentProfileName);
          }}
        />
      );
    }
    return (
      <p
        onClick={async () => {
          await electron.setCurrentProfileName(profileName);
          console.log(`Current profile name is changed to ${profileName}`);
        }}
        style={
          {
            "--font-color": ColorUtils.ntos(fontColor),
          } as React.CSSProperties
        }
      >
        {profileName}
      </p>
    );
  });

  return (
    <div
      className="ProfileList"
      style={
        {
          "--line-color": ColorUtils.ntos(lineColor),
        } as React.CSSProperties
      }
    >
      <div
        className="ProfileListHeader"
        style={
          {
            "--label-bg-color": ColorUtils.ntos(labelBgColor),
            "--label-font-color": ColorUtils.ntos(labelFontColor),
          } as React.CSSProperties
        }
      >
        <p className="Title">Profiles</p>
        <p
          className="MinusButton"
          onClick={() => {
            console.log(`- is clicked.`);
            if (profileNames.length <= 1) {
              console.warn(`No more profile. Skip deleting profile.`);
              return;
            }
            const targetProfileIndex = profileNames.indexOf(currentProfileName);
            let nextProfileName = "";
            if (targetProfileIndex === 0) {
              nextProfileName = profileNames[1];
            } else {
              nextProfileName = profileNames[targetProfileIndex - 1];
            }
            electron.deleteProfile(nextProfileName);
          }}
        >
          -
        </p>
        <p
          className="PlusButton"
          onClick={() => {
            console.log(`+ is clicked.`);
            electron.copyProfile();
          }}
        >
          +
        </p>
      </div>
      {profileList}
    </div>
  );
}

export default ProfileList;
