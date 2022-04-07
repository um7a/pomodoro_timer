<template>
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
          <span v-if="!pausing" @click="pausing = true">STOP</span>
          <span v-else @click="pausing = false">START</span>
          <span @click="goToEnd">▶︎</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
import * as utils from "../utils/timeUtils";
import * as colorUtils from "../utils/colorUtils";

export default {
  name: "PomodoroTimer",
  computed: {
    scalePercentage: function () {
      return [
        0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
        90, 95,
      ];
    },
    backgroundColor: function () {
      const backgroundColorStr = colorUtils.ntos(
        this.$store.state.pomodoro.backgroundColor
      );
      return backgroundColorStr;
    },
    ringBaseColor: function () {
      const ringBaseColorStr = colorUtils.ntos(
        this.$store.state.pomodoro.ringBaseColor
      );
      return ringBaseColorStr;
    },
    ringLabelColor: function () {
      const ringLabelColorStr = colorUtils.ntos(
        this.$store.state.pomodoro.ringLabelColor
      );
      return ringLabelColorStr;
    },
    ringFontColor: function () {
      const ringFontColorStr = colorUtils.ntos(
        this.$store.state.pomodoro.ringFontColor
      );
      return ringFontColorStr;
    },
    scaleColor: function () {
      const scaleColorStr = colorUtils.ntos(
        this.$store.state.pomodoro.scaleColor
      );
      return scaleColorStr;
    },
    pausing: {
      get: function () {
        return this.$store.state.pomodoro.pausing;
      },
      set: function (val) {
        this.$store.commit("setPausing", val);
      },
    },
    remainingTimeSec() {
      return this.$store.state.pomodoro.remainingTimeSec;
    },
    innerPercentage() {
      const { elapsedTimeSec, currentIntervalSec } = this.$store.state.pomodoro;
      if (elapsedTimeSec === 0 || currentIntervalSec === 0) {
        return 0;
      }
      return Math.min((elapsedTimeSec / currentIntervalSec) * 100, 100);
    },
    outerPercentage() {
      const { working, workCount, nWorkBeforeLongBreak } =
        this.$store.state.pomodoro;
      let percentage =
        workCount > 1 ? ((workCount - 1) / nWorkBeforeLongBreak) * 100 : 0;
      const innerPercentage = working ? this.innerPercentage : 100;
      if (innerPercentage > 0) {
        percentage += innerPercentage / nWorkBeforeLongBreak;
      }
      return percentage;
    },
    isWorking() {
      return this.$store.state.pomodoro.working;
    },
    isLongBreak() {
      return (
        !this.$store.state.pomodoro.working &&
        this.$store.state.pomodoro.nWorkBeforeLongBreak ===
          this.$store.state.pomodoro.workCount
      );
    },
  },
  methods: {
    startColor() {
      const {
        longBreakColors,
        shortBreakColors,
        workColors,
        workCount,
        nWorkBeforeLongBreak,
        working,
      } = this.$store.state.pomodoro;

      let startColor = undefined;
      if (working) {
        startColor = workColors[0];
      } else if (workCount === nWorkBeforeLongBreak) {
        startColor = longBreakColors[0];
      } else {
        startColor = shortBreakColors[0];
      }
      return colorUtils.ntos(startColor);
    },
    fiftyColor() {
      const {
        longBreakColors,
        shortBreakColors,
        workColors,
        workCount,
        nWorkBeforeLongBreak,
        working,
      } = this.$store.state.pomodoro;

      let leftColor = undefined;
      if (working) {
        leftColor = workColors[workColors.length - 1];
      } else if (workCount === nWorkBeforeLongBreak) {
        leftColor = longBreakColors[longBreakColors.length - 1];
      } else {
        leftColor = shortBreakColors[shortBreakColors.length - 1];
      }
      return colorUtils.ntos(leftColor);
    },
    endColor(percentage) {
      const {
        longBreakColors,
        shortBreakColors,
        workColors,
        workCount,
        nWorkBeforeLongBreak,
        working,
      } = this.$store.state.pomodoro;

      // percentage to index
      percentage = percentage < 50 ? percentage : 100 - percentage;
      const colorIndex = Math.floor(percentage);

      let endColor = undefined;
      if (working) {
        endColor = workColors[colorIndex];
      } else if (workCount === nWorkBeforeLongBreak) {
        endColor = longBreakColors[colorIndex];
      } else {
        endColor = shortBreakColors[colorIndex];
      }
      return colorUtils.ntos(endColor);
    },
    // Return "HH:MM:SS" format string from second Number.
    formatSec: function (seconds) {
      return utils.formatSec(seconds);
    },
    goToEnd: function () {
      this.$store.commit("goToEnd");
    },
    goToStart: function () {
      this.$store.commit("goToStart");
    },
  },
};
</script>

<style>
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
