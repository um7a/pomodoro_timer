<template>
  <div id="preference">
    <div
      class="preference"
      v-if="preferenceIsOpened"
      :style="{
        '--preference-background-color': savedPreferenceBackgroundColor,
      }"
    >
      <!-- 1st Column -->
      <div class="preferenceColumn">
        <!-- Title Pomodoro -->
        <div
          class="title"
          :style="{
            '--preference-label-background-color':
              savedPreferenceLabelBackgroundColor,
          }"
        >
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
        <div
          class="title"
          :style="{
            '--preference-label-background-color':
              savedPreferenceLabelBackgroundColor,
          }"
        >
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
        <div
          class="title"
          :style="{
            '--preference-label-background-color':
              savedPreferenceLabelBackgroundColor,
          }"
        >
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
        <div
          class="title"
          :style="{
            '--preference-label-background-color':
              savedPreferenceLabelBackgroundColor,
          }"
        >
          <p>Color</p>
        </div>
        <!-- Work Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Work Color ( Left / Right )</p>
          </div>
          <div class="valueSpace">
            <p class="value">
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
            <p class="value">
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
            <p class="value">
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
            <p class="value">
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
            <p class="value">
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
            <p class="value">
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
            <p class="value">
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
            <p class="value">
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
            <p class="value">
              <input type="color" v-model="preferenceBackgroundColor" />
            </p>
          </div>
        </div>
        <!-- Preference Label Background Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Label Color</p>
          </div>
          <div class="valueSpace">
            <p class="value">
              <input type="color" v-model="preferenceLabelBackgroundColor" />
            </p>
          </div>
        </div>
        <!-- Preference Button Color -->
        <div class="content">
          <div class="keySpace">
            <p class="key">Preference Button Color</p>
          </div>
          <div class="valueSpace">
            <p class="value">
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
            <p class="value">
              <input type="color" v-model="preferenceButtonFontColor" />
              <input type="color" v-model="preferenceButtonFontHoverColor" />
            </p>
          </div>
        </div>
      </div>
      <!-- Footer -->
      <div class="footer">
        <p
          class="button"
          @click="submit()"
          :style="{
            '--preference-button-hover-color': savedPreferenceButtonHoverColor,
            '--preference-button-font-hover-color':
              savedPreferenceButtonFontHoverColor,
          }"
        >
          Submit
        </p>
      </div>
    </div>
    <!-- Preference Open/Close Button -->
    <p
      class="openButton"
      v-if="!preferenceIsOpened"
      @click="openPreference()"
      :style="{
        '--preference-button-color': savedPreferenceButtonColor,
        '--preference-button-hover-color': savedPreferenceButtonHoverColor,
        '--preference-button-font-color': savedPreferenceButtonFontColor,
        '--preference-button-font-hover-color':
          savedPreferenceButtonFontHoverColor,
      }"
    >
      Preference
    </p>
    <p
      class="closeButton"
      v-else
      @click="closePreference()"
      :style="{
        '--preference-button-hover-color': savedPreferenceButtonHoverColor,
        '--preference-button-font-hover-color':
          savedPreferenceButtonFontHoverColor,
      }"
    >
      Close
    </p>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";
import * as os from "os";

import * as colorUtils from "../utils/colorUtils";
import { ConfigFileAccessor } from "../utils/configFileAccessor";

const valueOrDefault = (value, defaultValue) => {
  return typeof value === "undefined" || value === null ? defaultValue : value;
};

export default {
  name: "PreferencePanel",
  data() {
    return {
      isInvalid: {},
      configFileAccessor: undefined,
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
      preferenceLabelBackgroundColor: "#000000",
      preferenceButtonColor: "#000000",
      preferenceButtonHoverColor: "#000000",
      preferenceButtonFontColor: "#000000",
      preferenceButtonFontHoverColor: "#000000",
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
    savedPreferenceLabelBackgroundColor() {
      return colorUtils.ntos(
        this.$store.state.preference.preferenceLabelBackgroundColor
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
        "setPreferenceLabelBackgroundColor",
        colorUtils.ston(this.preferenceLabelBackgroundColor)
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

      // Restart refresh loop.
      this.$store.commit("stopRefreshLoop");
      this.$store.commit("startRefreshLoop");

      // Save the new settings to the config file.
      const configFileAccessor = new ConfigFileAccessor(
        os.homedir() + "/.pomodoroTimer/config.json"
      );
      configFileAccessor.save("workIntervalSec", this.workIntervalMinute * 60);
      configFileAccessor.save(
        "shortBreakIntervalSec",
        this.shortBreakIntervalMinute * 60
      );
      configFileAccessor.save(
        "longBreakIntervalSec",
        this.longBreakIntervalMinute * 60
      );
      configFileAccessor.save(
        "nWorkBeforeLongBreak",
        this.nWorkBeforeLongBreak
      );
      configFileAccessor.save("fps", this.fps);
      configFileAccessor.save(
        "notificationIsEnabled",
        this.notificationIsEnabled
      );
      configFileAccessor.save("workColors", [
        colorUtils.ston(this.workColorRight),
        colorUtils.ston(this.workColorLeft),
      ]);
      configFileAccessor.save("shortBreakColors", [
        colorUtils.ston(this.shortBreakColorRight),
        colorUtils.ston(this.shortBreakColorLeft),
      ]);
      configFileAccessor.save("longBreakColors", [
        colorUtils.ston(this.longBreakColorRight),
        colorUtils.ston(this.longBreakColorLeft),
      ]);
      configFileAccessor.save(
        "backgroundColor",
        colorUtils.ston(this.backgroundColor)
      );
      configFileAccessor.save(
        "ringBaseColor",
        colorUtils.ston(this.ringBaseColor)
      );
      configFileAccessor.save(
        "ringLabelColor",
        colorUtils.ston(this.ringLabelColor)
      );
      configFileAccessor.save(
        "ringFontColor",
        colorUtils.ston(this.ringFontColor)
      );
      configFileAccessor.save("scaleColor", colorUtils.ston(this.scaleColor));
      configFileAccessor.save(
        "preferenceLabelBackgroundColor",
        colorUtils.ston(this.preferenceLabelBackgroundColor)
      );
      configFileAccessor.save(
        "preferenceBackgroundColor",
        colorUtils.ston(this.preferenceBackgroundColor)
      );
      configFileAccessor.save(
        "preferenceButtonColor",
        colorUtils.ston(this.preferenceButtonColor)
      );
      configFileAccessor.save(
        "preferenceButtonHoverColor",
        colorUtils.ston(this.preferenceButtonHoverColor)
      );
      configFileAccessor.save(
        "preferenceButtonFontColor",
        colorUtils.ston(this.preferenceButtonFontColor)
      );
      configFileAccessor.save(
        "preferenceButtonFontHoverColor",
        colorUtils.ston(this.preferenceButtonFontHoverColor)
      );
    },
  },
  mounted: function () {
    // Default values
    const defaultSettings = {
      workIntervalSec: 25 * 60,
      shortBreakIntervalSec: 5 * 60,
      longBreakIntervalSec: 20 * 60,
      nWorkBeforeLongBreak: 4,
      fps: 2,
      notificationIsEnabled: true,
      workColors: [0xd38312, 0xa83279],
      shortBreakColors: [0x00b09b, 0x96c93d],
      longBreakColors: [0x43cea2, 0x1e90ff],
      backgroundColor: 0x000000,
      ringBaseColor: 0x131313,
      ringLabelColor: 0x4d4d4d,
      ringFontColor: 0xc0c0c0,
      scaleColor: 0x131313,
      preferenceBackgroundColor: 0x0e0e0e,
      preferenceLabelBackgroundColor: 0x171717,
      preferenceButtonColor: 0x0e0e0e,
      preferenceButtonHoverColor: 0xff6767, // pink
      //preferenceButtonHoverColor: 0xb3ff66, // green
      //preferenceButtonHoverColor: 0x454545, // gray
      preferenceButtonFontColor: 0x4d4d4d,
      preferenceButtonFontHoverColor: 0x000000,
    };

    this.configFileAccessor = new ConfigFileAccessor(
      os.homedir() + "/.pomodoroTimer/config.json"
    );
    // Create new file with default values.
    if (!this.configFileAccessor.configFileExists()) {
      this.configFileAccessor.save(
        "workIntervalSec",
        defaultSettings.workIntervalSec
      );
      this.configFileAccessor.save(
        "shortBreakIntervalSec",
        defaultSettings.shortBreakIntervalSec
      );
      this.configFileAccessor.save(
        "longBreakIntervalSec",
        defaultSettings.longBreakIntervalSec
      );
      this.configFileAccessor.save(
        "nWorkBeforeLongBreak",
        defaultSettings.nWorkBeforeLongBreak
      );
      this.configFileAccessor.save("fps", defaultSettings.fps);
      this.configFileAccessor.save(
        "notificationIsEnabled",
        defaultSettings.notificationIsEnabled
      );
      this.configFileAccessor.save("workColors", defaultSettings.workColors);
      this.configFileAccessor.save(
        "shortBreakColors",
        defaultSettings.shortBreakColors
      );
      this.configFileAccessor.save(
        "longBreakColors",
        defaultSettings.longBreakColors
      );
      this.configFileAccessor.save(
        "backgroundColor",
        defaultSettings.backgroundColor
      );
      this.configFileAccessor.save(
        "ringBaseColor",
        defaultSettings.ringBaseColor
      );
      this.configFileAccessor.save(
        "ringLabelColor",
        defaultSettings.ringLabelColor
      );
      this.configFileAccessor.save(
        "ringFontColor",
        defaultSettings.ringFontColor
      );
      this.configFileAccessor.save("scaleColor", defaultSettings.scaleColor);
      this.configFileAccessor.save(
        "preferenceBackgroundColor",
        defaultSettings.preferenceBackgroundColor
      );
      this.configFileAccessor.save(
        "preferenceLabelBackgroundColor",
        defaultSettings.preferenceLabelBackgroundColor
      );
      this.configFileAccessor.save(
        "preferenceButtonColor",
        defaultSettings.preferenceButtonColor
      );
      this.configFileAccessor.save(
        "preferenceButtonHoverColor",
        defaultSettings.preferenceButtonHoverColor
      );
      this.configFileAccessor.save(
        "preferenceButtonFontColor",
        defaultSettings.preferenceButtonColor
      );
      this.configFileAccessor.save(
        "preferenceButtonFontHoverColor",
        defaultSettings.preferenceButtonHoverColor
      );
    }

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
      preferenceLabelBackgroundColor,
      preferenceButtonColor,
      preferenceButtonHoverColor,
      preferenceButtonFontColor,
      preferenceButtonFontHoverColor,
    } = this.configFileAccessor.getConfigObject();

    // The following data properties are used to save temporary settings of preference panel.
    // When the preferences are submitted, these values are copied to the store and the config file.
    this.workIntervalMinute =
      valueOrDefault(workIntervalSec, defaultSettings.workIntervalSec) / 60;
    this.shortBreakIntervalMinute =
      valueOrDefault(
        shortBreakIntervalSec,
        defaultSettings.shortBreakIntervalSec
      ) / 60;
    this.longBreakIntervalMinute =
      valueOrDefault(
        longBreakIntervalSec,
        defaultSettings.longBreakIntervalSec
      ) / 60;
    this.nWorkBeforeLongBreak = valueOrDefault(
      nWorkBeforeLongBreak,
      defaultSettings.nWorkBeforeLongBreak
    );
    this.fps = valueOrDefault(fps, defaultSettings.fps);
    this.notificationIsEnabled = valueOrDefault(
      notificationIsEnabled,
      defaultSettings.notificationIsEnabled
    );
    this.workColorLeft = colorUtils.ntos(
      valueOrDefault(workColors[1], defaultSettings.workColors[1])
    );
    this.workColorRight = colorUtils.ntos(
      valueOrDefault(workColors[0], defaultSettings.workColors[0])
    );
    this.shortBreakColorLeft = colorUtils.ntos(
      valueOrDefault(shortBreakColors[1], defaultSettings.shortBreakColors[1])
    );
    this.shortBreakColorRight = colorUtils.ntos(
      valueOrDefault(shortBreakColors[0], defaultSettings.shortBreakColors[0])
    );
    this.longBreakColorLeft = colorUtils.ntos(
      valueOrDefault(longBreakColors[1], defaultSettings.longBreakColors[1])
    );
    this.longBreakColorRight = colorUtils.ntos(
      valueOrDefault(longBreakColors[0], defaultSettings.longBreakColors[0])
    );
    this.backgroundColor = colorUtils.ntos(
      valueOrDefault(backgroundColor, defaultSettings.backgroundColor)
    );
    this.ringBaseColor = colorUtils.ntos(
      valueOrDefault(ringBaseColor, defaultSettings.ringBaseColor)
    );
    this.ringLabelColor = colorUtils.ntos(
      valueOrDefault(ringLabelColor, defaultSettings.ringLabelColor)
    );
    this.ringFontColor = colorUtils.ntos(
      valueOrDefault(ringFontColor, defaultSettings.ringFontColor)
    );
    this.scaleColor = colorUtils.ntos(
      valueOrDefault(scaleColor, defaultSettings.scaleColor)
    );
    this.preferenceLabelBackgroundColor = colorUtils.ntos(
      valueOrDefault(
        preferenceLabelBackgroundColor,
        defaultSettings.preferenceLabelBackgroundColor
      )
    );
    this.preferenceBackgroundColor = colorUtils.ntos(
      valueOrDefault(
        preferenceBackgroundColor,
        defaultSettings.preferenceBackgroundColor
      )
    );
    this.preferenceButtonColor = colorUtils.ntos(
      valueOrDefault(
        preferenceButtonColor,
        defaultSettings.preferenceButtonColor
      )
    );
    this.preferenceButtonHoverColor = colorUtils.ntos(
      valueOrDefault(
        preferenceButtonHoverColor,
        defaultSettings.preferenceButtonHoverColor
      )
    );
    this.preferenceButtonFontColor = colorUtils.ntos(
      valueOrDefault(
        preferenceButtonFontColor,
        defaultSettings.preferenceButtonFontColor
      )
    );
    this.preferenceButtonFontHoverColor = colorUtils.ntos(
      valueOrDefault(
        preferenceButtonFontHoverColor,
        defaultSettings.preferenceButtonFontHoverColor
      )
    );
    this.copySettingToStore();

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
  color: var(--preference-button-font-color);
  font-size: 12px;
  height: 30px;
  width: 100%;
  margin: 0;
  background: var(--preference-button-color);
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

.openButton:hover,
.closeButton {
  background: var(--preference-button-hover-color);
  color: var(--preference-button-font-hover-color);
}

.preference {
  position: absolute;
  background: var(--preference-background-color);
  color: #4d4d4d;
  right: 0;
  bottom: 30px;
  top: 0;
  animation-name: fade;
  animation-duration: 2s;
  display: flex;
}

/* Column */
.preferenceColumn {
  position: relative;
  width: 368px;
  padding: 0 1px;
}

/* Title */
.preference .title {
  background: var(--preference-label-background-color);
  margin: 0 0 4px;
  border-radius: 2px;
  padding: 5px 10px;
}

.preference .title p {
  font-size: 12px;
  margin: 0;
}

/* Content */
.preference .content {
  border-bottom: #000000;
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
  margin: 10px 10px;
  padding: 0 10px;
  font-size: 12px;
  margin: 0;
}
.preference .content .key2Line {
  margin: 10px 10px;
  padding: 0 10px;
  font-size: 11px;
  margin: 0;
}
.preference .content .value {
  padding: 10px 5px;
  font-size: 12px;
  margin: 0;
}

.preference .content .unit {
  padding: 10px 0;
  font-size: 12px;
  margin: 0;
}

.preference .content input[type="text"] {
  background: #0e0e0e;
  border: 1px solid #222222;
  border-radius: 4px;
  color: #4d4d4d;
  outline: none;
  width: 60px;
  height: 20px;
  top: 0;
  margin: 0;
}

.preference .content input[type="text"][class="invalid"] {
  background: #1a1010;
  border: 1px solid #540000;
  border-radius: 4px;
  color: #9b0043;
  outline: none;
  width: 60px;
  height: 20px;
  top: 0;
}

.preference .content input[type="color"] {
  background: none;
  border: none;
  color: #4d4d4d;
  outline: none;
  width: 40px;
  height: 22px;
  top: 0;
  vertical-align: -3px;
  padding: 0;
  margin-left: 13px;
}

.preference .content .checkboxKey {
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
  border-color: #2f2f2f;
  background: #0e0e0e;
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
  border-color: #587e4c;
}

/* Footer */
.preference .footer {
  position: absolute;
  bottom: 0;
  background: #171717;
  width: 100%;
  padding: 8px 0px;
}

.preference .footer .button {
  font-size: 11px;
  background: var(--preference-button-hover-color);
  color: var(--preference-button-font-hover-color);
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
