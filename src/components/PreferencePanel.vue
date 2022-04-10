<template>
  <div id="preference">
    <div class="preference">
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
          <p @click="copyProfile()">+</p>
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
                v-model="nWorkBeforeLongBreakStr"
                v-if="isInvalid.nWorkBeforeLongBreak"
              />
              <input type="text" v-model="nWorkBeforeLongBreakStr" v-else />
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
                v-model="fpsStr"
                v-if="isInvalid.fps"
              />
              <input type="text" v-model="fpsStr" v-else />
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
                v-model="notificationIsEnabledStr"
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
              <input
                type="color"
                v-model="wrappedWorkColorLeft"
                @change="notifyTemporaryChange('workColors')"
              />
              <input
                type="color"
                v-model="wrappedWorkColorRight"
                @blur="notifyTemporaryChange('workColors')"
              />
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
              <input
                type="color"
                v-model="wrappedShortBreakColorLeft"
                @blur="notifyTemporaryChange('shortBreakColors')"
              />
              <input
                type="color"
                v-model="wrappedShortBreakColorRight"
                @blur="notifyTemporaryChange('shortBreakColors')"
              />
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
              <input
                type="color"
                v-model="wrappedLongBreakColorLeft"
                @blur="notifyTemporaryChange('longBreakColors')"
              />
              <input
                type="color"
                v-model="wrappedLongBreakColorRight"
                @blur="notifyTemporaryChange('longBreakColors')"
              />
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
              <input
                type="color"
                v-model="wrappedBackgroundColor"
                @blur="notifyTemporaryChange('backgroundColor')"
              />
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
              <input
                type="color"
                v-model="wrappedRingBaseColor"
                @blur="notifyTemporaryChange('ringBaseColor')"
              />
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
              <input
                type="color"
                v-model="wrappedRingLabelColor"
                @blur="notifyTemporaryChange('ringLabelColor')"
              />
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
              <input
                type="color"
                v-model="wrappedRingFontColor"
                @blur="notifyTemporaryChange('ringFontColor')"
              />
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
              <input
                type="color"
                v-model="wrappedScaleColor"
                @blur="notifyTemporaryChange('scaleColor')"
              />
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
              <input type="color" v-model="preferenceCheckMarkColor" />
            </p>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="footer">
        <p class="button" @click="submit()">Submit</p>
        <p class="button" @click="closePreference()">Close</p>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

import { ProfileConfigFileAccessor } from "../modules/profileConfigFileAccessor";
import { MainConfigFileAccessor } from "../modules/mainConfigFileAccessor";

export default {
  name: "PreferencePanel",
  data() {
    return {
      isInvalid: {},
      profileNames: [],
      renamedProfileName: "",
      mainConfigFileAccessor: undefined,
      profileConfigFileAccessor: undefined,

      //
      // The following fields are initialized by the main config file
      //
      currentProfileName: "",

      //
      // The following fields are initialized by the profile config file.
      //
      // Pomodoro
      workIntervalSec: 0,
      shortBreakIntervalSec: 0,
      longBreakIntervalSec: 0,
      nWorkBeforeLongBreak: 0,
      // Graphic
      fps: 0,
      // Notification
      notificationIsEnabled: false,
      // Color of Pomodoro
      workColors: ["#000000", "#000000"],
      shortBreakColors: ["#000000", "#000000"],
      longBreakColors: ["#000000", "#000000"],
      backgroundColor: "#000000",
      ringBaseColor: "#000000",
      ringLabelColor: "#000000",
      ringFontColor: "#000000",
      scaleColor: "#000000",
      // Color of Preference
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
      preferenceCheckMarkColor: "#000000",
    };
  },
  computed: {
    wrappedWorkColorLeft: {
      get: function () {
        return this.workColors[0];
      },
      set: function (color) {
        this.workColors[0] = color;
        this.notifyTemporaryChange("workColors");
      },
    },
    wrappedWorkColorRight: {
      get: function () {
        return this.workColors[1];
      },
      set: function (color) {
        this.workColors[1] = color;
        this.notifyTemporaryChange("workColors");
      },
    },
    wrappedShortBreakColorLeft: {
      get: function () {
        return this.shortBreakColors[0];
      },
      set: function (color) {
        this.shortBreakColors[0] = color;
        this.notifyTemporaryChange("shortBreakColors");
      },
    },
    wrappedShortBreakColorRight: {
      get: function () {
        return this.shortBreakColors[1];
      },
      set: function (color) {
        this.shortBreakColors[1] = color;
        this.notifyTemporaryChange("shortBreakColors");
      },
    },
    wrappedLongBreakColorLeft: {
      get: function () {
        return this.longBreakColors[0];
      },
      set: function (color) {
        this.longBreakColors[0] = color;
        this.notifyTemporaryChange("longBreakColors");
      },
    },
    wrappedLongBreakColorRight: {
      get: function () {
        return this.longBreakColors[1];
      },
      set: function (color) {
        this.longBreakColors[1] = color;
        this.notifyTemporaryChange("longBreakColors");
      },
    },
    wrappedBackgroundColor: {
      get: function () {
        return this.backgroundColor;
      },
      set: function (color) {
        this.backgroundColor = color;
        this.notifyTemporaryChange("backgroundColor");
      },
    },
    wrappedRingBaseColor: {
      get: function () {
        return this.ringBaseColor;
      },
      set: function (color) {
        this.ringBaseColor = color;
        this.notifyTemporaryChange("ringBaseColor");
      },
    },
    wrappedRingLabelColor: {
      get: function () {
        return this.ringLabelColor;
      },
      set: function (color) {
        this.ringLabelColor = color;
        this.notifyTemporaryChange("ringLabelColor");
      },
    },
    wrappedRingFontColor: {
      get: function () {
        return this.ringFontColor;
      },
      set: function (color) {
        this.ringFontColor = color;
        this.notifyTemporaryChange("ringFontColor");
      },
    },
    wrappedScaleColor: {
      get: function () {
        return this.scaleColor;
      },
      set: function (color) {
        this.scaleColor = color;
        this.notifyTemporaryChange("scaleColor");
      },
    },
    workIntervalMinute: {
      get: function () {
        if (
          typeof this.workIntervalSec !== "number" ||
          Number.isNaN(this.workIntervalSec)
        ) {
          return this.workIntervalSec;
        }
        return this.workIntervalSec / 60;
      },
      set: function (minute) {
        if (Number.isNaN(Number.parseInt(minute))) {
          this.workIntervalSec = minute;
          return;
        }
        this.workIntervalSec = minute * 60;
      },
    },
    shortBreakIntervalMinute: {
      get: function () {
        if (
          typeof this.shortBreakIntervalSec !== "number" ||
          Number.isNaN(this.shortBreakIntervalSec)
        ) {
          return this.shortBreakIntervalSec;
        }
        return this.shortBreakIntervalSec / 60;
      },
      set: function (minute) {
        if (Number.isNaN(Number.parseInt(minute))) {
          this.shortBreakIntervalSec = minute;
          return;
        }
        this.shortBreakIntervalSec = minute * 60;
      },
    },
    longBreakIntervalMinute: {
      get: function () {
        if (
          typeof this.longBreakIntervalSec !== "number" ||
          Number.isNaN(this.longBreakIntervalSec)
        ) {
          return this.longBreakIntervalSec;
        }
        return this.longBreakIntervalSec / 60;
      },
      set: function (minute) {
        if (Number.isNaN(Number.parseInt(minute))) {
          this.longBreakIntervalSec = minute;
          return;
        }
        this.longBreakIntervalSec = minute * 60;
      },
    },
    nWorkBeforeLongBreakStr: {
      get: function () {
        return this.nWorkBeforeLongBreak;
      },
      set: function (num) {
        if (Number.isNaN(Number.parseInt(num))) {
          this.nWorkBeforeLongBreak = num;
          return;
        }
        this.nWorkBeforeLongBreak = Number.parseInt(num);
      },
    },
    fpsStr: {
      get: function () {
        return this.fps;
      },
      set: function (num) {
        if (Number.isNaN(Number.parseInt(num))) {
          this.fps = num;
          return;
        }
        this.fps = Number.parseInt(num);
      },
    },
    notificationIsEnabledStr: {
      get: function () {
        return this.notificationIsEnabled ? "true" : "false";
      },
      set: function (val) {
        this.notificationIsEnabled = val === "true" ? true : false;
      },
    },
  },
  methods: {
    closePreference() {
      const unsavedData = this.getUnSavedData();
      ipcRenderer.send("close-preference", unsavedData);
    },
    loadProfileNames() {
      this.profileNames = this.profileConfigFileAccessor.getProfileNames();
    },
    renameProfile() {
      // If rename candidate is invalid, reset it and return.
      if (
        typeof this.renamedProfileName === "undefined" ||
        this.renamedProfileName.length === 0
      ) {
        this.renamedProfileName = this.currentProfileName;
        return;
      }
      // If rename candidate has already existed, reset it and return.
      const unique = this.profileNames.every(
        (profileName) => profileName !== this.renamedProfileName
      );
      if (!unique) {
        this.renamedProfileName = this.currentProfileName;
        return;
      }

      // If rename candidate is same with current, do nothing and return.
      if (this.renamedProfileName === this.currentProfileName) {
        return;
      }

      // Rename profile file name.
      this.profileConfigFileAccessor.renameProfileConfigFile(
        this.renamedProfileName
      );
      this.selectProfile(this.renamedProfileName);
    },
    copyProfile() {
      // Copy current profile file.
      const newProfileName =
        this.profileConfigFileAccessor.copyProfileConfigFile();
      this.selectProfile(newProfileName);
    },
    deleteProfile() {
      // More than 1 profile should exists.
      if (this.profileNames.length <= 1) {
        return;
      }
      this.profileConfigFileAccessor.deleteProfileConfigFile();
      const targetProfileIndex = this.profileNames.indexOf(
        this.currentProfileName
      );
      let nextProfileName = "";
      if (targetProfileIndex === 0) {
        nextProfileName = this.profileNames[1];
      } else {
        nextProfileName = this.profileNames[targetProfileIndex - 1];
      }
      this.selectProfile(nextProfileName);
    },
    selectProfile(profileName) {
      this.currentProfileName = profileName;
      this.renamedProfileName = profileName;
      this.loadProfileNames();

      // Load preference from selected profile.
      this.profileConfigFileAccessor.changeProfile(this.currentProfileName);
      this.loadPreferenceFromProfile();

      // Update Main config file.
      this.mainConfigFileAccessor.setCurrentProfileName(
        this.currentProfileName
      );

      // Notify Pomodoro to reload
      ipcRenderer.send("notify-config-change");
    },
    loadPreferenceFromProfile() {
      const profile = this.profileConfigFileAccessor.getProfile();
      Object.keys(profile).forEach((key) => {
        this[key] = profile[key];
      });
    },
    getUnSavedData() {
      const unsavedData = {};
      const profile = this.profileConfigFileAccessor.getProfile();
      Object.keys(profile).forEach((key) => {
        if (Array.isArray(profile[key])) {
          for (let i = 0; i < profile[key].length; i++) {
            if (profile[key][i] !== this[key][i]) {
              unsavedData[key] = [...this[key]];
              break;
            }
          }
        } else {
          if (profile[key] !== this[key]) {
            unsavedData[key] = this[key];
          }
        }
      });
      return unsavedData;
    },
    validate() {
      let isValid = true;
      const isInvalid = {};
      if (typeof this.workIntervalSec !== "number") {
        isInvalid.workIntervalMinute = true;
        isValid = false;
      }
      if (typeof this.shortBreakIntervalSec !== "number") {
        isInvalid.shortBreakIntervalMinute = true;
        isValid = false;
      }
      if (typeof this.longBreakIntervalSec !== "number") {
        isInvalid.longBreakIntervalMinute = true;
        isValid = false;
      }
      if (typeof this.nWorkBeforeLongBreak !== "number") {
        isInvalid.nWorkBeforeLongBreak = true;
        isValid = false;
      }
      if (typeof this.fps !== "number") {
        isInvalid.fps = true;
        isValid = false;
      }
      this.isInvalid = isInvalid;
      return isValid;
    },
    copyToFile() {
      const profile = this.profileConfigFileAccessor.getProfile();
      Object.keys(profile).forEach((key) => {
        this.profileConfigFileAccessor.set(key, this[key]);
      });
    },
    notifyTemporaryChange(key) {
      let dataCopy;
      if (Array.isArray(this[key])) {
        dataCopy = [...this[key]];
      } else {
        dataCopy = this[key];
      }
      ipcRenderer.send("notify-temporary-change", { key, value: dataCopy });
    },
    submit() {
      // Validate new settings.
      if (!this.validate()) {
        return;
      }
      // If notification become enabled, send notification.
      const savedNotificationIsEnabled = this.profileConfigFileAccessor.get(
        "notificationIsEnabled"
      );
      if (!savedNotificationIsEnabled && this.notificationIsEnabled) {
        new Notification("Pomodoro Timer", {
          body: "Notification is Enabled " + String.fromCodePoint(0x1f508),
          icon: "public/pomodoroTimer.png",
        });
      }
      // Save the new settings to the config file.
      this.copyToFile();
      this.loadPreferenceFromProfile();
      // Notify Pomodoro to reload
      ipcRenderer.send("notify-config-change");
    },
  },
  mounted: function () {
    // Create file accessor of main config.
    this.mainConfigFileAccessor = new MainConfigFileAccessor();
    // If the file was not found or invalid format, create new file with default values.
    if (!this.mainConfigFileAccessor.isMainConfigFormat()) {
      this.mainConfigFileAccessor.deleteMainConfigFile();
      this.mainConfigFileAccessor.createNewMainConfigFile();
    }

    // Load profile name
    this.currentProfileName =
      this.mainConfigFileAccessor.getCurrentProfileName();

    // Create file accessor of profile config.
    this.profileConfigFileAccessor = new ProfileConfigFileAccessor(
      this.currentProfileName
    );

    // If the file was not found or invalid format, create new file with default values.
    if (!this.profileConfigFileAccessor.isProfileConfigFormat()) {
      this.profileConfigFileAccessor.deleteProfileConfigFile();
      this.profileConfigFileAccessor.createNewProfileConfig();
    }

    this.selectProfile(this.currentProfileName);
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.preference {
  position: absolute;
  background: v-bind(preferenceBackgroundColor);
  top: 0;
  right: 0;
  bottom: 0;
  animation-name: fade;
  animation-duration: 2s;
  display: flex;
  font-family: Helvetica, Arial, sans-serif;
  -webkit-app-region: drag; /* To drag the window. */
}

/* Profile Column */
.preferenceShortColumn {
  width: 198px;
  margin: 0 2px 33px 0;
  border-right: 1px solid v-bind(preferenceLineColor);
  border-radius: 2px;
  position: relative;
}

.preferenceShortColumn .title {
  background: v-bind(preferenceLabelBackgroundColor);
  margin: 2px 0 4px;
  border-radius: 2px;
  padding: 5px 10px;
}

.preferenceShortColumn .title p {
  font-size: 12px;
  margin: 0;
  color: v-bind(preferenceLabelFontColor);
}

.preferenceShortColumn .plusButton {
  position: absolute;
  right: 0;
  top: 0;
  margin: 2px 0 0;
  padding: 0;
}

.preferenceShortColumn .minusButton {
  position: absolute;
  right: 30px;
  top: 0;
  margin: 2px 0 0;
  padding: 0;
}

.preferenceShortColumn .minusButton p {
  color: v-bind(preferenceLabelFontColor);
  margin: 0;
  padding: 1px 3px 4px;
  transform: scaleX(2);
}

.preferenceShortColumn .plusButton p {
  color: v-bind(preferenceLabelFontColor);
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
  background: v-bind(preferenceFontColor);
  border-radius: 2px;
  cursor: pointer;
}

.preferenceShortColumn .profile p {
  color: v-bind(preferenceFontColor);
  font-size: 12px;
  margin: 0px 0;
}

.preferenceShortColumn .selectedProfile input {
  background: none;
  border: none;
  outline: none;
  color: v-bind(preferenceBackgroundColor);
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
.preferenceColumn .title {
  background: v-bind(preferenceLabelBackgroundColor);
  margin: 0 0 4px;
  border-radius: 2px;
  padding: 5px 10px;
}

.preferenceColumn .title p {
  font-size: 12px;
  margin: 0;
  color: v-bind(preferenceLabelFontColor);
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
  color: v-bind(preferenceFontColor);
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
  color: v-bind(preferenceFontColor);
  padding: 10px 0;
  font-size: 12px;
  margin: 0;
}

.preference .content .value input[type="text"] {
  background: v-bind(preferenceBackgroundColor);
  border: 1px solid v-bind(preferenceLineColor);
  border-radius: 4px;
  color: v-bind(preferenceFontColor);
  outline: none;
  width: 60px;
  height: 20px;
  top: 0;
  margin: 0;
}

.preference .content .value input[type="text"][class="invalid"] {
  background: v-bind(preferenceBackgroundColor);
  border: 1px solid v-bind(preferenceFontInvalidColor);
  border-radius: 4px;
  color: v-bind(preferenceFontInvalidColor);
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
  color: v-bind(preferenceFontColor);
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
  border-color: v-bind(preferenceLineColor);
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
  border-color: v-bind(preferenceCheckMarkColor);
}

/* Footer */
.preference .footer {
  position: absolute;
  bottom: 0;
  background: v-bind(preferenceLabelBackgroundColor);
  width: 100%;
  padding: 8px 0px;
}

.preference .footer .button {
  font-size: 11px;
  background: v-bind(preferenceButtonHoverColor);
  color: v-bind(preferenceButtonFontHoverColor);
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
