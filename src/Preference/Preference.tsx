import { useEffect, useState } from "react";

import "./Preference.css";
import ProfileList from "./ProfileList";
import ProfileDetail from "./ProfileDetail";
import * as ColorUtils from "../utils/colorUtils";

const { electron } = window;

function Preference() {
  // state for configuration
  const [currentProfile, setCurrentProfile] = useState(undefined as any);

  // state for preference's configuration
  const [prefTransparent, setPrefTransparent] = useState(0);
  const [prefBgColor, setPrefBgColor] = useState(0x000000);
  const [profileWasChanged, setProfileWasChanged] = useState(true);

  //
  // (1) Set listener of profile change.
  //
  useEffect(() => {
    console.log("set electron.onProfileChanged.");
    electron.onProfileChanged(() => {
      console.log(`Profile was changed. Reload configurations.`);
      setProfileWasChanged(true);
    });
  }, []);

  //
  // (2) Read config file and initialize some state.
  //
  useEffect(() => {
    if (!profileWasChanged) {
      console.warn(`Profile is not changed. Stop loading profile.`);
      return;
    }
    console.log(`Load profile.`);

    electron.getProfile().then((profile: any) => {
      setCurrentProfile(profile);

      // state for window's configuration
      setPrefTransparent(profile.preferenceTransparent);
      setPrefBgColor(profile.preferenceBackgroundColor);

      setProfileWasChanged(false);
    });
  }, [profileWasChanged]);

  return (
    <div
      className="Preference"
      style={
        {
          "--background-transparent": prefTransparent,
          "--background-color-red": ColorUtils.ntorn(prefBgColor),
          "--background-color-green": ColorUtils.ntogn(prefBgColor),
          "--background-color-blue": ColorUtils.ntobn(prefBgColor),
        } as React.CSSProperties
      }
    >
      <ProfileList currentProfile={currentProfile} />
      <ProfileDetail currentProfile={currentProfile} />
    </div>
  );
}

export default Preference;
