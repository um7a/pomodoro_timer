<template>
  <div id="app">
    <div class="ring">
      <!-- Scale -->
      <div
        class="scale"
        v-for="p in scalePercentage"
        :style="{
          '--percentage-no-percent': p,
        }"
        v-bind:key="p"
      ></div>

      <!-- outer ring -->
      <div
        class="outerRing"
        v-if="outerPercentage < 50"
        :style="{
          'background-image':
            'radial-gradient(var(--body-background-color) 68%, transparent 69%),' +
            'conic-gradient(from 90deg, var(--front-color1) 0% 0%, var(--front-color2) calc(1% * var(--percentage)) calc(1% * var(--percentage)), var(--ring-base-color) calc(1% * var(--percentage)) 100%)',
        }"
      ></div>
      <div
        class="outerRing"
        v-else
        :style="{
          'background-image':
            'radial-gradient(var(--body-background-color) 68%, transparent 69%),' +
            `conic-gradient(from 90deg, var(--front-color1) 0% 0%, ${fiftyColor()} 50% 50%, var(--front-color2) calc(1% * var(--percentage)) calc(1% * var(--percentage)), var(--ring-base-color) calc(1% * var(--percentage)) 100%)`,
        }"
      ></div>

      <!-- inner ring -->
      <div
        class="innerRing"
        v-if="innerPercentage < 50"
        :style="{
          'background-image':
            'radial-gradient(var(--body-background-color) 64%, transparent 65%),' +
            'conic-gradient(from 90deg, var(--front-color1) 0% 0%, var(--front-color2) calc(1% * var(--percentage)) calc(1% * var(--percentage)), var(--ring-base-color) calc(1% * var(--percentage)) 100%)',
        }"
      ></div>
      <div
        class="innerRing"
        v-else
        :style="{
          'background-image':
            'radial-gradient(var(--body-background-color) 64%, transparent 65%),' +
            `conic-gradient(from 90deg, var(--front-color1) 0% 0%, ${fiftyColor()} 50% 50%, var(--front-color2) calc(1% * var(--percentage)) calc(1% * var(--percentage)), var(--ring-base-color) calc(1% * var(--percentage)) 100%)`,
        }"
      ></div>
      <!-- texts -->
      <div class="ringTextArea">
        <div>
          <!-- Work/Short Break/Long Break label -->
          <p class="workLabel" v-if="isWorking">Work</p>
          <p class="label" v-else-if="isLongBreak">Long Break</p>
          <p class="label" v-else>Short Break</p>
          <!-- HH:MM:SS -->
          <p class="mainText">
            {{ formatSec(remainingTimeSec) }}
          </p>

          <!-- < STOP/START > -->
          <p class="button">
            <span @click="goToStart">◀︎</span>
            <span v-if="!pausing" @click="setPausing(true)">STOP</span>
            <span v-else @click="setPausing(false)">START</span>
            <span @click="goToNext">▶︎</span>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ipcRenderer } from "electron";

import * as utils from "../utils/timeUtils";
import * as colorUtils from "../utils/colorUtils";
import { ProfileConfigFileAccessor } from "../modules/profileConfigFileAccessor";
import { MainConfigFileAccessor } from "../modules/mainConfigFileAccessor";

const calcColor = (edgeColors) => {
  const colors = [];
  const leftColor = edgeColors[0];
  const rightColor = edgeColors[1];
  for (let percentage = 0; percentage <= 50; percentage += 1) {
    colors.push(colorUtils.calcColor(leftColor, rightColor, percentage));
  }
  return colors;
};

export default {
  name: "PomodoroTimer",
  data() {
    return {
      currentIntervalSec: 0,
      pausing: true,
      refreshLoop: undefined,
      remainingTimeSec: 0,
      scalePercentage: [
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
        90, 95,
      ],
      workCount: 1,
      working: true,

      // This value is set and used only in updatePomodoro() to put the time of the last function call.
      lastUpdateTimeSec: 0,

      //
      // The following fields are initialized by the main config file.
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
      // Color
      workColors: ["#000000", "#000000"],
      shortBreakColors: ["#000000", "#000000"],
      longBreakColors: ["#000000", "#000000"],
      backgroundColor: "#000000",
      ringBaseColor: "#000000",
      ringLabelColor: "#000000",
      ringFontColor: "#000000",
      scaleColor: "#000000",
    };
  },
  computed: {
    innerPercentage() {
      const elapsedTimeSec = this.currentIntervalSec - this.remainingTimeSec;
      if (elapsedTimeSec === 0 || this.currentIntervalSec === 0) {
        return 0;
      }
      return Math.min((elapsedTimeSec / this.currentIntervalSec) * 100, 100);
    },
    outerPercentage() {
      let percentage =
        this.workCount > 1
          ? ((this.workCount - 1) / this.nWorkBeforeLongBreak) * 100
          : 0;
      const innerPercentage = this.working ? this.innerPercentage : 100;
      if (innerPercentage > 0) {
        percentage += innerPercentage / this.nWorkBeforeLongBreak;
      }
      return percentage;
    },
    isWorking() {
      return this.working;
    },
    isLongBreak() {
      return !this.working && this.nWorkBeforeLongBreak === this.workCount;
    },
  },
  methods: {
    startColor() {
      if (this.working) {
        return this.workColors[this.workColors.length - 1];
      } else if (this.workCount === this.nWorkBeforeLongBreak) {
        return this.longBreakColors[this.workColors.length - 1];
      } else {
        return this.shortBreakColors[this.workColors.length - 1];
      }
    },
    fiftyColor() {
      if (this.working) {
        return this.workColors[0];
      } else if (this.workCount === this.nWorkBeforeLongBreak) {
        return this.longBreakColors[0];
      } else {
        return this.shortBreakColors[0];
      }
    },
    endColor(percentage) {
      // percentage to index
      percentage = percentage < 50 ? percentage : 100 - percentage;
      const colorIndex = 50 - Math.floor(percentage);

      if (this.working) {
        return this.workColors[colorIndex];
      } else if (this.workCount === this.nWorkBeforeLongBreak) {
        return this.longBreakColors[colorIndex];
      } else {
        return this.shortBreakColors[colorIndex];
      }
    },
    // Return "HH:MM:SS" format string from second Number.
    formatSec: function (seconds) {
      return utils.formatSec(seconds);
    },
    goToStart: function () {
      this.remainingTimeSec = this.currentIntervalSec;
    },
    goToNext: function () {
      // If this is end of break time, Update workCount.
      if (!this.working) {
        this.workCount =
          this.workCount >= this.nWorkBeforeLongBreak ? 1 : this.workCount + 1;
      }

      // Invert working
      this.working = !this.working;

      this.initPomodoro();
    },
    loadConfig() {
      // Load main config.
      const mainConfigFileAccessor = new MainConfigFileAccessor();
      // If the current main config file is invalid format, recreate.
      if (!mainConfigFileAccessor.isMainConfigFormat()) {
        mainConfigFileAccessor.deleteMainConfigFile();
        mainConfigFileAccessor.createNewMainConfigFile();
      }
      const currentProfileName = mainConfigFileAccessor.getCurrentProfileName();

      // Load profile config.
      const profileConfigFileAccessor = new ProfileConfigFileAccessor(
        currentProfileName
      );
      // If the current profile config file is invalid format, recreate.
      if (!profileConfigFileAccessor.isProfileConfigFormat()) {
        profileConfigFileAccessor.deleteProfileConfigFile();
        profileConfigFileAccessor.createNewProfileConfigFile();
      }

      // Copy profile data to data properties.
      const profile = profileConfigFileAccessor.getProfile();
      Object.keys(profile).forEach((key) => {
        this[key] = profile[key];
      });
      this.workColors = calcColor(this.workColors);
      this.shortBreakColors = calcColor(this.shortBreakColors);
      this.longBreakColors = calcColor(this.longBreakColors);
    },
    reloadConfig() {
      const oldElapsedTimeSec = this.currentIntervalSec - this.remainingTimeSec;
      console.log(`oldElapsedTimeSec: ${oldElapsedTimeSec}`);

      this.loadConfig();

      // Recalculate currentIntervalSec
      if (this.working) {
        // If the next is work
        this.currentIntervalSec = this.workIntervalSec;
      } else if (this.workCount >= this.nWorkBeforeLongBreak) {
        // If the next is long break
        this.currentIntervalSec = this.longBreakIntervalSec;
      } else {
        // If the next is short break
        this.currentIntervalSec = this.shortBreakIntervalSec;
      }

      // Recalculate remainingTimeSec
      if (oldElapsedTimeSec > this.currentIntervalSec) {
        this.remainingTimeSec = 0;
      } else {
        this.remainingTimeSec = this.currentIntervalSec - oldElapsedTimeSec;
      }

      // Recalculate workCount
      this.workCount = this.workCount % this.nWorkBeforeLongBreak;
    },
    initPomodoro() {
      if (this.working) {
        // If the next is work
        this.currentIntervalSec = this.workIntervalSec;
      } else if (this.workCount >= this.nWorkBeforeLongBreak) {
        // If the next is long break
        this.currentIntervalSec = this.longBreakIntervalSec;
      } else {
        // If the next is short break
        this.currentIntervalSec = this.shortBreakIntervalSec;
      }
      this.remainingTimeSec = this.currentIntervalSec;
    },
    updatePomodoro() {
      let elapsedTimeSec = 0;
      if (this.lastUpdateTimeSec !== 0) {
        elapsedTimeSec = (new Date().getTime() - this.lastUpdateTimeSec) / 1000;
      }
      this.lastUpdateTimeSec = new Date().getTime();

      if (this.pausing) {
        return;
      }

      // Update remainingTimeSec
      this.remainingTimeSec -= elapsedTimeSec;
      if (this.remainingTimeSec > 0) {
        return;
      }

      // Send notification
      if (this.notificationIsEnabled) {
        if (this.working && this.nWorkBeforeLongBreak === this.workCount) {
          // This is the end of final work. And the start of long break.
          const intervalStr = `${this.longBreakIntervalSec / 60} Minutes`;
          new Notification("Long Break " + String.fromCodePoint(0x1f943), {
            body: intervalStr,
            icon: "public/pomodoroTimer.png",
          });
        } else if (this.working) {
          // This is the end of work. And the start of short break.
          const intervalStr = `${this.shortBreakIntervalSec / 60} Minutes`;
          new Notification("Short Break " + String.fromCodePoint(0x2615), {
            body: intervalStr,
            icon: "public/pomodoroTimer.png",
          });
        } else {
          // This is the end of short or long break.
          const intervalStr = `${this.workIntervalSec / 60} Minutes`;
          new Notification("Work " + String.fromCodePoint(0x1f680), {
            body: intervalStr,
            icon: "public/pomodoroTimer.png",
          });
        }
      }

      this.goToNext();
    },
    startRefreshLoop() {
      this.stopRefreshLoop();
      this.refreshLoop = setInterval(() => {
        this.updatePomodoro();
      }, 1000 / this.fps);
    },
    stopRefreshLoop() {
      if (!this.refreshLoop) {
        return;
      }
      clearInterval(this.refreshLoop);
      this.refreshLoop = undefined;
    },
    setPausing(isPausing) {
      this.pausing = isPausing;
    },
  },
  mounted: function () {
    this.loadConfig();
    this.initPomodoro();
    this.startRefreshLoop();
    ipcRenderer.on("notify-config-change", () => {
      const pausing = this.pausing;
      this.stopRefreshLoop();
      this.reloadConfig();
      if (!pausing) {
        this.startRefreshLoop();
      }
    });
    ipcRenderer.on("notify-temporary-change", (event, arg) => {
      const key = arg.key;
      const value = arg.value;

      this[key] = value;
      // The following data are recalculated if updated.
      if (key === "workColors") {
        this.workColors = calcColor(this.workColors);
      }
      if (key === "shortBreakColors") {
        this.shortBreakColors = calcColor(this.shortBreakColors);
      }
      if (key === "longBreakColors") {
        this.longBreakColors = calcColor(this.longBreakColors);
      }
    });
  },
  created() {
    document.body.style.background = this.backgroundColor;
  },
};
</script>

<style>
body {
  margin: 0;
  overflow: hidden;
}
#app {
  margin: 0;
  width: 100%;
  height: 100%;
  font-family: Helvetica, Arial, sans-serif;
}

.ring {
  /* Page-Wide variables */
  position: absolute;
  padding: 15px;
  height: 100%;
  width: 100%;
  margin: 0;
  /*background: var(--body-background-color);*/
  background: v-bind(backgroundColor);
  -webkit-app-region: drag; /* To drag the window. */
}

/* Common settings for innerRing and outerRing */
.innerRing,
.outerRing,
.ringTextArea {
  --body-background-color: v-bind(backgroundColor);
  --ring-base-color: v-bind(ringBaseColor);
  position: absolute;
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
  /*
   * Round the corners.
   * Radius of the corner is 50% of the element.
   * i.e. the element becomes a circle.
   */
  border-radius: 50%;
}

/* Common settings for innerRing, innerRing::before and innerRing::after */
.innerRing,
.innerRing::before,
.innerRing::after {
  --percentage: v-bind(innerPercentage);
  --front-color1: v-bind(startColor());
  --front-color2: v-bind(endColor(innerPercentage));
  position: absolute;
  /* Size of inner ring */
  width: 170px;
  height: 170px;
  margin: 15px;
}

.innerRing::before {
  content: ""; /* content is necessary to show ::before element */
  background: radial-gradient(
      farthest-side,
      var(--front-color1) 98%,
      transparent
    )
    100%/7px /* position and width ? */ 7px /* height ? */ no-repeat;
}

.innerRing::after {
  content: ""; /* content is necessary to show ::after element */
  background: radial-gradient(
      farthest-side,
      var(--front-color2) 98%,
      transparent
    )
    100%/7px /* position and width ? */ 7px /* height ? */ no-repeat;
  transform: rotate(calc(360deg * var(--percentage) * 0.01));
}

.ringTextArea {
  position: absolute;
  width: 200px;
  height: 200px;
  margin: 0px;
  text-align: center;
  background-color: transparent;
  cursor: default;
}

.ringTextArea ::selection {
  background-color: transparent;
}

.ringTextArea .label {
  --ring-label-color: v-bind(ringLabelColor);
  color: var(--ring-label-color);
  font-size: 12px;
  margin: 20px 0px 0px;
  text-align: center;
  animation-name: fade-in;
  animation-duration: 1s;
}

.ringTextArea .workLabel {
  --ring-label-color: v-bind(ringLabelColor);
  color: var(--ring-label-color);
  font-size: 12px;
  margin: 20px 0px 0px;
  text-align: center;
  animation-name: fade-in;
  animation-duration: 1s;
  letter-spacing: 3px;
}

@keyframes fade-in {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}

.ringTextArea .mainText {
  color: v-bind(ringFontColor);
  font-size: 15px;
  margin: 0px 0px 0px;
  text-align: center;
}

.ringTextArea .button {
  color: v-bind(ringLabelColor);
  font-size: 11px;
  margin: 5px 0px 0px;
  text-align: center;
  visibility: hidden;
}

.ringTextArea:hover .button {
  visibility: visible;
  animation-duration: 0.3s;
  animation-name: fade-in;
}

.ringTextArea .button span {
  margin: 0px 5px;
  cursor: pointer;
}

.ringTextArea .button ::selection {
  color: v-bind(ringLabelColor);
  background-color: transparent;
  cursor: default;
}

.outerRing {
  --percentage: v-bind(outerPercentage);
  --front-color1: v-bind(startColor());
  --front-color2: v-bind(endColor(outerPercentage));
  /* Size of outer ring */
  width: 180px;
  height: 180px;
  margin: 10px;
}

.scale {
  position: absolute;
  /* Size of scale */
  width: 200px;
  height: 200px;
  margin: 0px;
  background-image: radial-gradient(
      v-bind(backgroundColor) 66%,
      transparent 67%
    ),
    conic-gradient(v-bind(scaleColor) 0deg, transparent 1deg 359deg);
  /*
   * Round the corners.
   * Radius of the corner is 50% of the element.
   * i.e. the element becomes a circle.
   */
  border-radius: 50%;
  transform: rotate(calc(360deg * var(--percentage-no-percent) * 0.01));
}
</style>
