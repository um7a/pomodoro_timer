<template>
  <div id="preference">
    <div class="preference" v-if="preferenceIsOpened">
      <!-- Profile Column -->
      <div class="preferenceShortColumn">
        <!-- Profile Title -->
        <div class="title">
          <p>Profiles</p>
        </div>

        <!-- - button -->
        <div class="minusButton">
          <p @click="deleteProfile()">-</p>
        </div>

        <!-- + button -->
        <div class="plusButton">
          <p @click="createProfile()">+</p>
        </div>

        <div v-for="profileName in profileNames" :key="profileName">
          <!-- Selected Profile -->
          <div
            class="selectedProfile"
            v-if="profileName === currentProfileName"
          >
            <input
              type="text"
              id="selectedProfile"
              ref="selectedProfile"
              v-model="renamedProfileName"
              @blur="renameProfile()"
            />
          </div>
          <!-- Non Selected Profile -->
          <div class="profile" v-else @click="selectProfile(profileName)">
            <p>{{ profileName }}</p>
          </div>
        </div>
      </div>

      <!-- 1st Column -->
      <div class="preferenceColumn">
        <!-- Title Pomodoro -->
        <div class="title">
          <p>Pomodoro</p>
        </div>
        <!-- Work Interval -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Work interval</p>
          </div>
          <div class="valueSpace">
            <p class="value">
              <input
                type="text"
                class="invalid"
                v-model="workIntervalMinute"
                v-if="isInvalid.workIntervalMinute"
              />
              <input type="text" v-model="workIntervalMinute" v-else />
            </p>
          </div>
          <div class="unitSpace">
            <p class="unit">minutes</p>
          </div>
        </div>
        <!-- Short Break Interval -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Short break interval</p>
          </div>
          <div class="valueSpace">
            <p class="value">
              <input
                type="text"
                class="invalid"
                v-model="shortBreakIntervalMinute"
                v-if="isInvalid.shortBreakIntervalMinute"
              />
              <input type="text" v-model="shortBreakIntervalMinute" v-else />
            </p>
          </div>
          <div class="unitSpace">
            <p class="unit">minutes</p>
          </div>
        </div>
        <!-- Long Break Interval -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Long break interval</p>
          </div>
          <div class="valueSpace">
            <p class="value">
              <input
                type="text"
                class="invalid"
                v-model="longBreakIntervalMinute"
                v-if="isInvalid.longBreakIntervalMinute"
              />
              <input type="text" v-model="longBreakIntervalMinute" v-else />
            </p>
          </div>
          <div class="unitSpace">
            <p class="unit">minutes</p>
          </div>
        </div>
        <!-- Number of work -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Number of work before long break</p>
          </div>
          <div class="valueSpace">
            <p class="value">
              <input
                type="text"
                class="invalid"
                v-model="nWorkBeforeLongBreak"
                v-if="isInvalid.nWorkBeforeLongBreak"
              />
              <input type="text" v-model="nWorkBeforeLongBreak" v-else />
            </p>
          </div>
          <div class="unitSpace">
            <p class="unit">times</p>
          </div>
        </div>
        <!-- Title Graphic -->
        <div class="title">
          <p>Graphic</p>
        </div>
        <!-- Frame per sec -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Frame per sec</p>
          </div>
          <div class="valueSpace">
            <p class="value">
              <input
                type="text"
                class="invalid"
                v-model="fps"
                v-if="isInvalid.fps"
              />
              <input type="text" v-model="fps" v-else />
            </p>
          </div>
          <div class="unitSpace">
            <p class="unit">fps</p>
          </div>
        </div>
        <!-- Title Notification -->
        <div class="title">
          <p>Notification</p>
        </div>
        <div class="content">
          <div class="keySpace">
            <p class="checkboxKey">Send notification</p>
          </div>
          <div class="valueSpace">
            <p class="checkboxValue">
              <input
                type="checkbox"
                id="notification"
                v-model="notificationStr"
                true-value="true"
                false-value="false"
              /><label for="notification"></label>
            </p>
          </div>
        </div>
      </div>
      <!-- 2nd Column -->
      <div class="preferenceColumn">
        <!-- Title Color -->
        <div class="title">
          <p>Color</p>
        </div>
        <!-- Work Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Work Color ( Left / Right )</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="workColorLeft" />
              <input type="color" v-model="workColorRight" />
            </p>
          </div>
        </div>
        <!-- Short Break Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Short Break Color ( Left / Right )</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="shortBreakColorLeft" />
              <input type="color" v-model="shortBreakColorRight" />
            </p>
          </div>
        </div>
        <!-- Long Break Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Long Break Color ( Left / Right )</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="longBreakColorLeft" />
              <input type="color" v-model="longBreakColorRight" />
            </p>
          </div>
        </div>
        <!-- Background Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Background Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="backgroundColor" />
            </p>
          </div>
        </div>
        <!-- Ring Base Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Ring Base Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="ringBaseColor" />
            </p>
          </div>
        </div>
        <!-- Ring Label Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Ring Label Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="ringLabelColor" />
            </p>
          </div>
        </div>
        <!-- Ring Font Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Ring Font Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="ringFontColor" />
            </p>
          </div>
        </div>
        <!-- Ring Scale Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Scale Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="scaleColor" />
            </p>
          </div>
        </div>
        <!-- Preference Background Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Background Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="preferenceBackgroundColor" />
            </p>
          </div>
        </div>
        <!-- Preference Line Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Line Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="preferenceLineColor" />
            </p>
          </div>
        </div>
        <!-- Preference Label Background Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Label Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="preferenceLabelBackgroundColor" />
            </p>
          </div>
        </div>
        <!-- Preference Label Font Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Label Font Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="preferenceLabelFontColor" />
            </p>
          </div>
        </div>
        <!-- Preference Font Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Font Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="preferenceFontColor" />
              <input type="color" v-model="preferenceFontInvalidColor" />
            </p>
          </div>
        </div>

        <!-- Preference Button Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Button Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="preferenceButtonColor" />
              <input type="color" v-model="preferenceButtonHoverColor" />
            </p>
          </div>
        </div>
        <!-- Preference Button Font Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Button Font Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="preferenceButtonFontColor" />
              <input type="color" v-model="preferenceButtonFontHoverColor" />
            </p>
          </div>
        </div>
        <!-- Check Mark Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Check Mark Color</p>
          </div>
          <div class="valueSpace">
            <p class="colorValue">
              <input type="color" v-model="checkMarkColor" />
            </p>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="footer">
        <p class="button" @click="submit()">Submit</p>
      </div>
    </div>
    <!-- Preference Open/Close Button -->
    <p class="openButton" v-if="!preferenceIsOpened" @click="openPreference()">
      Preference
    </p>
    <p class="closeButton" v-else @click="closePreference()">Close</p>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import * as os from "os";
import * as fs from "fs";
import * as path from "path";

import * as colorUtils from "../utils/colorUtils";
import { ConfigFileAccessor } from "../utils/configFileAccessor";

const valueOrDefault = (value, defaultValue) => {
  return typeof value === "undefined" || value === null ? defaultValue : value;
};

const defaultProfileSettings = {
  workIntervalSec: 25 * 60,
  shortBreakIntervalSec: 5 * 60,
  longBreakIntervalSec: 20 * 60,
  nWorkBeforeLongBreak: 4,
  fps: 2,
  notificationIsEnabled: true,
  workColors: ["#d38312", "#a83279"],
  shortBreakColors: ["#00b09b", "#96c93d"],
  longBreakColors: ["#43cea2", "#1e90ff"],
  backgroundColor: "#000000",
  ringBaseColor: "#131313",
  ringLabelColor: "#4d4d4d",
  ringFontColor: "#c0c0c0",
  scaleColor: "#131313",
  preferenceBackgroundColor: "#0e0e0e",
  preferenceLineColor: "#1e1e1e",
  preferenceLabelBackgroundColor: "#171717",
  preferenceLabelFontColor: "#4d4d4d",
  preferenceFontColor: "#4d4d4d",
  preferenceFontInvalidColor: "#9b0043",
  preferenceButtonColor: "#0e0e0e",
  preferenceButtonHoverColor: "#ff6767", // pink
  //preferenceButtonHoverColor: "#b3ff66", // green
  //preferenceButtonHoverColor: "#454545", // gray
  preferenceButtonFontColor: "#4d4d4d",
  preferenceButtonFontHoverColor: "#000000",
  checkMarkColor: "#72b66d",
};

export default {
  name: "PreferencePanel",
  data() {
    return {
      profileNames: [],
      renamedProfileName: "",
      currentProfileName: "",
      isInvalid: {},
      mainConfigFileAccessor: undefined,
      profileConfigFileAccessor: undefined,
      workIntervalMinute: 0,
      shortBreakIntervalMinute: 0,
      longBreakIntervalMinute: 0,
      nWorkBeforeLongBreak: 0,
      fps: 0,
      notificationIsEnabled: false,
      workColorLeft: "#000000",
      workColorRight: "#000000",
      shortBreakColorLeft: "#000000",
      shortBreakColorRight: "#000000",
      longBreakColorLeft: "#000000",
      longBreakColorRight: "#000000",
      backgroundColor: "#000000",
      ringBaseColor: "#000000",
      ringLabelColor: "#000000",
      ringFontColor: "#000000",
      scaleColor: "#000000",
      preferenceBackgroundColor: "#000000",
      preferenceLineColor: "#000000",
      preferenceLabelBackgroundColor: "#000000",
      preferenceLabelFontColor: "#000000",
      preferenceFontColor: "#000000",
      preferenceFontInvalidColor: "#000000",
      preferenceButtonColor: "#000000",
      preferenceButtonHoverColor: "#000000",
      preferenceButtonFontColor: "#000000",
      preferenceButtonFontHoverColor: "#000000",
      checkMarkColor: "#000000",
    };
  },
  computed: {
    preferenceIsOpened() {
      return this.$store.state.preference.preferenceIsOpened;
    },
    savedPreferenceBackgroundColor() {
      return colorUtils.ntos(
        this.$store.state.preference.preferenceBackgroundColor
      );
    },
    savedPreferenceLineColor() {
      return colorUtils.ntos(this.$store.state.preference.preferenceLineColor);
    },
    savedPreferenceLabelBackgroundColor() {
      return colorUtils.ntos(
        this.$store.state.preference.preferenceLabelBackgroundColor
      );
    },
    savedPreferenceLabelFontColor() {
      return colorUtils.ntos(
        this.$store.state.preference.preferenceLabelFontColor
      );
    },
    savedPreferenceFontColor() {
      return colorUtils.ntos(this.$store.state.preference.preferenceFontColor);
    },
    savedPreferenceFontInvalidColor() {
      return colorUtils.ntos(
        this.$store.state.preference.preferenceFontInvalidColor
      );
    },
    savedPreferenceButtonColor() {
      return colorUtils.ntos(
        this.$store.state.preference.preferenceButtonColor
      );
    },
    savedPreferenceButtonHoverColor() {
      const preferenceButtonHoverColor = colorUtils.ntos(
        this.$store.state.preference.preferenceButtonHoverColor
      );
      return preferenceButtonHoverColor;
    },
    savedPreferenceButtonFontColor() {
      return colorUtils.ntos(
        this.$store.state.preference.preferenceButtonFontColor
      );
    },
    savedPreferenceButtonFontHoverColor() {
      const preferenceButtonFontHoverColor = colorUtils.ntos(
        this.$store.state.preference.preferenceButtonFontHoverColor
      );
      return preferenceButtonFontHoverColor;
    },
    savedCheckMarkColor() {
      const checkMarkColor = colorUtils.ntos(
        this.$store.state.preference.checkMarkColor
      );
      return checkMarkColor;
    },
    notificationStr: {
      get: function () {
        return this.notificationIsEnabled ? "true" : "false";
      },
      set: function (val) {
        this.notificationIsEnabled = val === "true" ? true : false;
      },
    },
  },
  methods: {
    openPreference() {
      this.$store.commit("openPreference");
      ipcRenderer.send("open-preference");
    },
    closePreference() {
      this.$store.commit("closePreference");
      ipcRenderer.send("close-preference");
    },
    loadProfileNames() {
      const profilePath = os.homedir() + "/.pomodoroTimer/profiles/";
      const profileFileNames = fs.readdirSync(profilePath);
      profileFileNames.forEach((profileFileName) => {
        if (!profileFileName.endsWith(".json")) {
          return;
        }
        const profileName = profileFileName.split(".json")[0];
        if (typeof profileName === "undefined" || profileName.length === 0) {
          return;
        }
        this.profileNames.push(profileName);
      });
    },
    reloadProfileNames() {
      this.profileNames = [];
      this.loadProfileNames();
    },
    renameProfile() {
      if (
        typeof this.renamedProfileName === "undefined" ||
        this.renamedProfileName.length === 0
      ) {
        this.renamedProfileName = this.currentProfileName;
        return;
      }
      if (this.renamedProfileName === this.currentProfileName) {
        return;
      }
      // rename profile file name.
      const profilePath = os.homedir() + "/.pomodoroTimer/profiles/";
      const newProfileFileName = this.renamedProfileName + ".json";
      this.profileConfigFileAccessor.rename(profilePath + newProfileFileName);

      this.reloadProfileNames();
      this.selectProfile(this.renamedProfileName);
    },
    createProfile() {
      // Copy current profile file.
      this.profileConfigFileAccessor.copy();
      const copyProfileName = path
        .basename(this.profileConfigFileAccessor.getFilePath())
        .split(".json")[0];

      this.reloadProfileNames();
      this.selectProfile(copyProfileName);
    },
    deleteProfile() {
      // More than 1 profile should exists.
      if (this.profileNames.length <= 1) {
        return;
      }
      this.profileConfigFileAccessor.delete();
      const targetProfileIndex = this.profileNames.indexOf(
        this.currentProfileName
      );
      let nextProfileName = "";
      if (targetProfileIndex === 0) {
        nextProfileName = this.profileNames[1];
      } else {
        nextProfileName = this.profileNames[targetProfileIndex - 1];
      }
      this.reloadProfileNames();
      this.selectProfile(nextProfileName);
    },
    createNewMainConfig() {
      // Default values
      const defaultSettings = {
        currentProfileName: "Default",
      };
      const configFileAccessor = new ConfigFileAccessor(
        os.homedir() + "/.pomodoroTimer/config.json"
      );
      Object.entries(defaultSettings).forEach((keyValue) => {
        const key = keyValue[0];
        const value = keyValue[1];
        configFileAccessor.save(key, value);
      });
    },
    createNewProfileConfig() {
      Object.entries(defaultProfileSettings).forEach((keyValue) => {
        const key = keyValue[0];
        const value = keyValue[1];
        this.profileConfigFileAccessor.save(key, value);
      });
    },
    selectProfile(profileName) {
      this.currentProfileName = profileName;
      this.renamedProfileName = profileName;
      const profileFilePath =
        os.homedir() +
        "/.pomodoroTimer/profiles/" +
        this.currentProfileName +
        ".json";
      this.profileConfigFileAccessor.setFilePath(profileFilePath);
      this.loadPreferenceFromProfile();

      this.mainConfigFileAccessor.save(
        "currentProfileName",
        this.currentProfileName
      );

      // Restart refresh loop.
      this.$store.commit("stopRefreshLoop");
      this.$store.commit("startRefreshLoop");
    },
    loadPreferenceFromProfile() {
      const {
        // Setting about pomodoro
        workIntervalSec,
        shortBreakIntervalSec,
        longBreakIntervalSec,
        nWorkBeforeLongBreak,
        fps,
        notificationIsEnabled,
        workColors,
        shortBreakColors,
        longBreakColors,
        backgroundColor,
        ringBaseColor,
        ringLabelColor,
        ringFontColor,
        scaleColor,
        // Setting about preference
        preferenceBackgroundColor,
        preferenceLineColor,
        preferenceLabelBackgroundColor,
        preferenceLabelFontColor,
        preferenceFontColor,
        preferenceFontInvalidColor,
        preferenceButtonColor,
        preferenceButtonHoverColor,
        preferenceButtonFontColor,
        preferenceButtonFontHoverColor,
        checkMarkColor,
      } = this.profileConfigFileAccessor.getConfigObject();

      // The following data properties are used to save temporary settings of preference panel.
      // When the preferences are submitted, these values are copied to the store and the config file.
      this.workIntervalMinute =
        valueOrDefault(
          workIntervalSec,
          defaultProfileSettings.workIntervalSec
        ) / 60;
      this.shortBreakIntervalMinute =
        valueOrDefault(
          shortBreakIntervalSec,
          defaultProfileSettings.shortBreakIntervalSec
        ) / 60;
      this.longBreakIntervalMinute =
        valueOrDefault(
          longBreakIntervalSec,
          defaultProfileSettings.longBreakIntervalSec
        ) / 60;
      this.nWorkBeforeLongBreak = valueOrDefault(
        nWorkBeforeLongBreak,
        defaultProfileSettings.nWorkBeforeLongBreak
      );
      this.fps = valueOrDefault(fps, defaultProfileSettings.fps);
      this.notificationIsEnabled = valueOrDefault(
        notificationIsEnabled,
        defaultProfileSettings.notificationIsEnabled
      );
      this.workColorLeft = colorUtils.ntos(
        valueOrDefault(workColors[1], defaultProfileSettings.workColors[1])
      );
      this.workColorRight = colorUtils.ntos(
        valueOrDefault(workColors[0], defaultProfileSettings.workColors[0])
      );
      this.shortBreakColorLeft = colorUtils.ntos(
        valueOrDefault(
          shortBreakColors[1],
          defaultProfileSettings.shortBreakColors[1]
        )
      );
      this.shortBreakColorRight = colorUtils.ntos(
        valueOrDefault(
          shortBreakColors[0],
          defaultProfileSettings.shortBreakColors[0]
        )
      );
      this.longBreakColorLeft = colorUtils.ntos(
        valueOrDefault(
          longBreakColors[1],
          defaultProfileSettings.longBreakColors[1]
        )
      );
      this.longBreakColorRight = colorUtils.ntos(
        valueOrDefault(
          longBreakColors[0],
          defaultProfileSettings.longBreakColors[0]
        )
      );
      this.backgroundColor = colorUtils.ntos(
        valueOrDefault(backgroundColor, defaultProfileSettings.backgroundColor)
      );
      this.ringBaseColor = colorUtils.ntos(
        valueOrDefault(ringBaseColor, defaultProfileSettings.ringBaseColor)
      );
      this.ringLabelColor = colorUtils.ntos(
        valueOrDefault(ringLabelColor, defaultProfileSettings.ringLabelColor)
      );
      this.ringFontColor = colorUtils.ntos(
        valueOrDefault(ringFontColor, defaultProfileSettings.ringFontColor)
      );
      this.scaleColor = colorUtils.ntos(
        valueOrDefault(scaleColor, defaultProfileSettings.scaleColor)
      );
      this.preferenceLabelBackgroundColor = colorUtils.ntos(
        valueOrDefault(
          preferenceLabelBackgroundColor,
          defaultProfileSettings.preferenceLabelBackgroundColor
        )
      );
      this.preferenceLabelFontColor = colorUtils.ntos(
        valueOrDefault(
          preferenceLabelFontColor,
          defaultProfileSettings.preferenceLabelFontColor
        )
      );
      this.preferenceFontColor = colorUtils.ntos(
        valueOrDefault(
          preferenceFontColor,
          defaultProfileSettings.preferenceFontColor
        )
      );
      this.preferenceFontInvalidColor = colorUtils.ntos(
        valueOrDefault(
          preferenceFontInvalidColor,
          defaultProfileSettings.preferenceFontInvalidColor
        )
      );
      this.preferenceBackgroundColor = colorUtils.ntos(
        valueOrDefault(
          preferenceBackgroundColor,
          defaultProfileSettings.preferenceBackgroundColor
        )
      );
      this.preferenceLineColor = colorUtils.ntos(
        valueOrDefault(
          preferenceLineColor,
          defaultProfileSettings.preferenceLineColor
        )
      );
      this.preferenceButtonColor = colorUtils.ntos(
        valueOrDefault(
          preferenceButtonColor,
          defaultProfileSettings.preferenceButtonColor
        )
      );
      this.preferenceButtonHoverColor = colorUtils.ntos(
        valueOrDefault(
          preferenceButtonHoverColor,
          defaultProfileSettings.preferenceButtonHoverColor
        )
      );
      this.preferenceButtonFontColor = colorUtils.ntos(
        valueOrDefault(
          preferenceButtonFontColor,
          defaultProfileSettings.preferenceButtonFontColor
        )
      );
      this.preferenceButtonFontHoverColor = colorUtils.ntos(
        valueOrDefault(
          preferenceButtonFontHoverColor,
          defaultProfileSettings.preferenceButtonFontHoverColor
        )
      );
      this.checkMarkColor = colorUtils.ntos(
        valueOrDefault(checkMarkColor, defaultProfileSettings.checkMarkColor)
      );
      this.copySettingToStore();
    },
    validate() {
      let isValid = true;
      const isInvalid = {};

      if (!/^[1-9][0-9]*$/.test(this.workIntervalMinute)) {
        isInvalid.workIntervalMinute = true;
        isValid = false;
      }
      if (!/^[1-9][0-9]*$/.test(this.shortBreakIntervalMinute)) {
        isInvalid.shortBreakIntervalMinute = true;
        isValid = false;
      }
      if (!/^[1-9][0-9]*$/.test(this.longBreakIntervalMinute)) {
        isInvalid.longBreakIntervalMinute = true;
        isValid = false;
      }
      if (!/^[1-9][0-9]*$/.test(this.nWorkBeforeLongBreak)) {
        isInvalid.nWorkBeforeLongBreak = true;
        isValid = false;
      }
      if (!/^[1-9][0-9]*$/.test(this.fps)) {
        isInvalid.fps = true;
        isValid = false;
      }
      this.isInvalid = isInvalid;
      return isValid;
    },
    copySettingToStore() {
      // Set new settings to store.
      this.$store.commit("setWorkIntervalSec", this.workIntervalMinute * 60);
      this.$store.commit(
        "setShortBreakIntervalSec",
        this.shortBreakIntervalMinute * 60
      );
      this.$store.commit(
        "setLongBreakIntervalSec",
        this.longBreakIntervalMinute * 60
      );
      this.$store.commit(
        "setNWorkBeforeLongBreak",
        Number.parseInt(this.nWorkBeforeLongBreak)
      );
      this.$store.commit("setFps", Number.parseInt(this.fps));
      this.$store.commit(
        "setNotificationIsEnabled",
        this.notificationIsEnabled
      );
      this.$store.commit("setWorkColors", [
        colorUtils.ston(this.workColorLeft),
        colorUtils.ston(this.workColorRight),
      ]);
      this.$store.commit("setShortBreakColors", [
        colorUtils.ston(this.shortBreakColorLeft),
        colorUtils.ston(this.shortBreakColorRight),
      ]);
      this.$store.commit("setLongBreakColors", [
        colorUtils.ston(this.longBreakColorLeft),
        colorUtils.ston(this.longBreakColorRight),
      ]);
      this.$store.commit(
        "setBackgroundColor",
        colorUtils.ston(this.backgroundColor)
      );
      this.$store.commit(
        "setRingBaseColor",
        colorUtils.ston(this.ringBaseColor)
      );
      this.$store.commit(
        "setRingLabelColor",
        colorUtils.ston(this.ringLabelColor)
      );
      this.$store.commit(
        "setRingFontColor",
        colorUtils.ston(this.ringFontColor)
      );
      this.$store.commit("setScaleColor", colorUtils.ston(this.scaleColor));
      this.$store.commit(
        "setPreferenceBackgroundColor",
        colorUtils.ston(this.preferenceBackgroundColor)
      );
      this.$store.commit(
        "setPreferenceLineColor",
        colorUtils.ston(this.preferenceLineColor)
      );
      this.$store.commit(
        "setPreferenceLabelBackgroundColor",
        colorUtils.ston(this.preferenceLabelBackgroundColor)
      );
      this.$store.commit(
        "setPreferenceLabelFontColor",
        colorUtils.ston(this.preferenceLabelFontColor)
      );
      this.$store.commit(
        "setPreferenceFontColor",
        colorUtils.ston(this.preferenceFontColor)
      );
      this.$store.commit(
        "setPreferenceFontInvalidColor",
        colorUtils.ston(this.preferenceFontInvalidColor)
      );
      this.$store.commit(
        "setPreferenceButtonColor",
        colorUtils.ston(this.preferenceButtonColor)
      );
      this.$store.commit(
        "setPreferenceButtonHoverColor",
        colorUtils.ston(this.preferenceButtonHoverColor)
      );
      this.$store.commit(
        "setPreferenceButtonFontColor",
        colorUtils.ston(this.preferenceButtonFontColor)
      );
      this.$store.commit(
        "setPreferenceButtonFontHoverColor",
        colorUtils.ston(this.preferenceButtonFontHoverColor)
      );
      this.$store.commit(
        "setCheckMarkColor",
        colorUtils.ston(this.checkMarkColor)
      );
    },

    copyToFile(config) {
      // Save the new settings to the config file.
      const configFileAccessor = this.profileConfigFileAccessor;
      configFileAccessor.save(
        "workIntervalSec",
        config.workIntervalMinute * 60
      );
      configFileAccessor.save(
        "shortBreakIntervalSec",
        config.shortBreakIntervalMinute * 60
      );
      configFileAccessor.save(
        "longBreakIntervalSec",
        config.longBreakIntervalMinute * 60
      );
      configFileAccessor.save(
        "nWorkBeforeLongBreak",
        config.nWorkBeforeLongBreak
      );
      configFileAccessor.save("fps", config.fps);
      configFileAccessor.save(
        "notificationIsEnabled",
        config.notificationIsEnabled
      );
      configFileAccessor.save("workColors", [
        colorUtils.ston(config.workColorLeft),
        colorUtils.ston(config.workColorRight),
      ]);
      configFileAccessor.save("shortBreakColors", [
        colorUtils.ston(config.shortBreakColorLeft),
        colorUtils.ston(config.shortBreakColorRight),
      ]);
      configFileAccessor.save("longBreakColors", [
        colorUtils.ston(config.longBreakColorLeft),
        colorUtils.ston(config.longBreakColorRight),
      ]);
      configFileAccessor.save(
        "backgroundColor",
        colorUtils.ston(config.backgroundColor)
      );
      configFileAccessor.save(
        "ringBaseColor",
        colorUtils.ston(config.ringBaseColor)
      );
      configFileAccessor.save(
        "ringLabelColor",
        colorUtils.ston(config.ringLabelColor)
      );
      configFileAccessor.save(
        "ringFontColor",
        colorUtils.ston(config.ringFontColor)
      );
      configFileAccessor.save("scaleColor", colorUtils.ston(config.scaleColor));
      configFileAccessor.save(
        "preferenceLabelBackgroundColor",
        colorUtils.ston(config.preferenceLabelBackgroundColor)
      );
      configFileAccessor.save(
        "preferenceLabelFontColor",
        colorUtils.ston(config.preferenceLabelFontColor)
      );
      configFileAccessor.save(
        "preferenceFontColor",
        colorUtils.ston(config.preferenceFontColor)
      );
      configFileAccessor.save(
        "preferenceFontInvalidColor",
        colorUtils.ston(config.preferenceFontInvalidColor)
      );
      configFileAccessor.save(
        "preferenceBackgroundColor",
        colorUtils.ston(config.preferenceBackgroundColor)
      );
      configFileAccessor.save(
        "preferenceLineColor",
        colorUtils.ston(config.preferenceLineColor)
      );
      configFileAccessor.save(
        "preferenceButtonColor",
        colorUtils.ston(config.preferenceButtonColor)
      );
      configFileAccessor.save(
        "preferenceButtonHoverColor",
        colorUtils.ston(config.preferenceButtonHoverColor)
      );
      configFileAccessor.save(
        "preferenceButtonFontColor",
        colorUtils.ston(config.preferenceButtonFontColor)
      );
      configFileAccessor.save(
        "preferenceButtonFontHoverColor",
        colorUtils.ston(config.preferenceButtonFontHoverColor)
      );
      configFileAccessor.save(
        "checkMarkColor",
        colorUtils.ston(config.checkMarkColor)
      );
    },

    submit() {
      // Validate new settings.
      if (!this.validate()) {
        return;
      }

      // If notification become enabled, send notification.
      if (
        !this.$store.state.pomodoro.notificationIsEnabled &&
        this.notificationIsEnabled
      ) {
        new Notification("Pomodoro Timer", {
          body: "Notification is Enabled " + String.fromCodePoint(0x1f508),
          icon: "public/pomodoroTimer.png",
        });
      }

      this.copySettingToStore();

      // exec updatePomodoro to update view of HH:MM:SS
      this.$store.commit("updatePomodoro");

      // Restart refresh loop.
      this.$store.commit("stopRefreshLoop");
      this.$store.commit("startRefreshLoop");

      // Save the new settings to the config file.
      this.copyToFile(this);
    },
  },
  mounted: function () {
    // Load profile file names from directory.
    this.loadProfileNames();

    // Create file accessor of main config.
    this.mainConfigFileAccessor = new ConfigFileAccessor(
      os.homedir() + "/.pomodoroTimer/config.json"
    );
    // Create new file with default values.
    if (!this.mainConfigFileAccessor.configFileExists()) {
      this.createNewMainConfig();
    }

    this.currentProfileName =
      this.mainConfigFileAccessor.getConfigObject().currentProfileName;

    // Create file accessor of profile config.
    this.profileConfigFileAccessor = new ConfigFileAccessor(
      os.homedir() +
        "/.pomodoroTimer/profiles/" +
        this.currentProfileName +
        ".json"
    );
    // Create new file with default values.
    if (!this.profileConfigFileAccessor.configFileExists()) {
      this.createNewProfileConfig();
    }

    this.loadPreferenceFromProfile();

    this.selectProfile(this.currentProfileName);

    this.$store.commit("initPomodoro");
    this.$store.commit("startRefreshLoop");
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.openButton,
.closeButton {
  cursor: pointer;
  position: absolute;
  bottom: 0;
  font-size: 12px;
  height: 30px;
  width: 100%;
  margin: 0;
  transition: all 0.5s ease;
  border-radius: 2px;
  /*
   * Make this class to flexible box layout.
   * I want to use justify-content which is
   * the sub property of the flexible box layout.
   */
  display: flex;
  /* Horizontal Middle */
  justify-content: center;
  /* Vertical Middle */
  align-items: center;
}

.openButton {
  color: v-bind(savedPreferenceButtonFontColor);
  background: v-bind(savedPreferenceButtonColor);
}

.openButton:hover,
.closeButton {
  background: v-bind(savedPreferenceButtonHoverColor);
  color: v-bind(savedPreferenceButtonFontHoverColor);
}

.preference {
  position: absolute;
  background: v-bind(savedPreferenceBackgroundColor);
  right: 0;
  bottom: 30px;
  top: 0;
  animation-name: fade;
  animation-duration: 2s;
  display: flex;
}

/* Profile Column */
.preferenceShortColumn {
  width: 194px;
  margin: 0 2px 33px 0;
  border-right: 1px solid v-bind(savedPreferenceLineColor);
  border-radius: 2px;
  position: relative;
}

.preferenceShortColumn .title {
  background: v-bind(savedPreferenceLabelBackgroundColor);
  margin: 0 0 4px;
  border-radius: 2px;
  padding: 0 10px;
}

.preferenceShortColumn .title p {
  font-size: 12px;
  margin: 0;
  color: v-bind(savedPreferenceLabelFontColor);
}

.preferenceShortColumn .plusButton {
  position: absolute;
  right: 0;
  top: 0;
  padding: 0;
}

.preferenceShortColumn .minusButton {
  position: absolute;
  right: 30px;
  top: 0;
  padding: 0;
}

.preferenceShortColumn .minusButton p {
  color: v-bind(savedPreferenceLabelFontColor);
  margin: 0;
  padding: 1px 3px 4px;
  transform: scaleX(2);
}

.preferenceShortColumn .plusButton p {
  color: v-bind(savedPreferenceLabelFontColor);
  margin: 0;
  padding: 1px 7px 4px;
}

.preferenceShortColumn .profile {
  padding: 5px 10px;
  margin: 1px 3px;
  cursor: pointer;
}

.preferenceShortColumn .selectedProfile {
  padding: 0 10px 3px;
  margin: 1px 3px;
  background: v-bind(savedPreferenceFontColor);
  border-radius: 2px;
  cursor: pointer;
}

.preferenceShortColumn .profile p {
  color: v-bind(savedPreferenceFontColor);
  font-size: 12px;
  margin: 0px 0;
}

.preferenceShortColumn .selectedProfile input {
  background: none;
  border: none;
  outline: none;
  color: v-bind(savedPreferenceBackgroundColor);
  font-size: 12px;
  margin: 0;
  padding: 0;
}

/* Column */
.preferenceColumn {
  position: relative;
  width: 368px;
  padding: 0 1px;
}

/* Title */
.preference .title {
  background: v-bind(savedPreferenceLabelBackgroundColor);
  margin: 0 0 4px;
  border-radius: 2px;
  padding: 5px 10px;
}

.preference .title p {
  font-size: 12px;
  margin: 0;
  color: v-bind(savedPreferenceLabelFontColor);
}

/* Content */
.preference .content {
  margin: 0;
}

.preference .content .keySpace {
  display: inline-block;
  margin-left: 10px;
  width: 210px;
}

.preference .content .valueSpace {
  display: inline-block;
  margin: 0 5px;
}

.preference .content .unitSpace {
  display: inline-block;
  margin: 0 5px;
  margin-left: 0;
}
.preference .content .key {
  color: v-bind(savedPreferenceFontColor);
  margin: 10px 10px;
  padding: 0 10px;
  font-size: 12px;
  margin: 0;
}

.preference .content .value {
  padding: 10px 5px;
  font-size: 12px;
  margin: 0;
}

.preference .content .unit {
  color: v-bind(savedPreferenceFontColor);
  padding: 10px 0;
  font-size: 12px;
  margin: 0;
}

.preference .content .value input[type="text"] {
  background: v-bind(savedPreferenceBackgroundColor);
  border: 1px solid v-bind(savedPreferenceLineColor);
  border-radius: 4px;
  color: v-bind(savedPreferenceFontColor);
  outline: none;
  width: 60px;
  height: 20px;
  top: 0;
  margin: 0;
}

.preference .content .value input[type="text"][class="invalid"] {
  background: v-bind(savedPreferenceBackgroundColor);
  border: 1px solid v-bind(savedPreferenceFontInvalidColor);
  border-radius: 4px;
  color: v-bind(savedPreferenceFontInvalidColor);
  outline: none;
  width: 60px;
  height: 20px;
  top: 0;
}

.preference .content .colorValue {
  padding: 7px 5px;
  font-size: 12px;
  margin: 0;
}

.preference .content input[type="color"] {
  background: none;
  border: none;
  outline: none;
  width: 40px;
  height: 22px;
  top: 0;
  vertical-align: -3px;
  padding: 0;
  margin-left: 13px;
}

.preference .content .checkboxKey {
  color: v-bind(savedPreferenceFontColor);
  margin: 10px 10px;
  padding: 0 10px 10px;
  font-size: 12px;
  margin: 0;
}

.preference .content .checkboxValue {
  padding: 10px 5px 10px;
  font-size: 12px;
  margin: 0;
}

.preference .content input[type="checkbox"] {
  display: none;
}

.preference .content input[type="checkbox"] + label {
  display: none;
  cursor: pointer;
  display: inline-block;
  position: relative;
  padding-left: 25px;
  padding-right: 20px;
  position: absolute;
  right: 15px;
}

.preference .content input[type="checkbox"] + label::before {
  content: "";
  position: absolute;
  display: block;
  box-sizing: border-box;
  width: 13px;
  height: 13px;
  margin-top: 0;
  left: 0;
  top: 50%;
  border: 1px solid;
  border-color: v-bind(savedPreferenceLineColor);
  border-radius: 3px;
}

.preference .content input[type="checkbox"]:checked + label::after {
  content: "";
  position: absolute;
  display: block;
  box-sizing: border-box;
  width: 10px;
  height: 3px;
  margin-top: 4px;
  left: 1.5px;
  top: 50%;
  transform: rotate(-45deg);
  border-bottom: 1px solid;
  border-left: 1px solid;
  border-color: v-bind(savedCheckMarkColor);
}

/* Footer */
.preference .footer {
  position: absolute;
  bottom: 0;
  background: v-bind(savedPreferenceLabelBackgroundColor);
  width: 100%;
  padding: 8px 0px;
}

.preference .footer .button {
  font-size: 11px;
  background: v-bind(savedPreferenceButtonHoverColor);
  color: v-bind(savedPreferenceButtonFontHoverColor);
  float: right;
  margin: 0 12px;
  padding: 3px 10px;
  border-radius: 3px;
  cursor: pointer;
}

@keyframes fade {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
</style>
