import { calcColor } from "../../utils/colorUtils";

const state = () => ({
  elapsedTimeSec: 0,
  lastUpdateTime: new Date(),
  workCount: 1,
  working: true,
  refreshLoop: undefined,
  pausing: true,
  currentIntervalSec: 0,
  remainingTimeSec: 0,
  // The following fields are initialized by the values of config file.
  longBreakColors: [0x000000, 0x000000],
  longBreakIntervalSec: 0,
  nWorkBeforeLongBreak: 0,
  fps: 0,
  notificationIsEnabled: false,
  shortBreakColors: [0x000000, 0x000000],
  shortBreakIntervalSec: 0,
  workColors: [0x000000, 0x000000],
  workIntervalSec: 0,
  backgroundColor: 0x000000,
  ringBaseColor: 0x000000,
  ringLabelColor: 0x000000,
  ringFontColor: 0x000000,
  scaleColor: 0x000000,
});

const mutations = {
  goToStart(state) {
    state.elapsedTimeSec = 0;
    state.remainingTimeSec = state.currentIntervalSec;
  },
  goToEnd(state) {
    if (state.working) {
      // end of work
      state.working = false;
    } else {
      // end of break
      if (state.workCount >= state.nWorkBeforeLongBreak) {
        // end of long break
        state.workCount = 1;
      } else {
        state.workCount++;
      }
      state.working = true;
    }
    state.currentIntervalSec = state.working
      ? state.workIntervalSec
      : state.workCount >= state.nWorkBeforeLongBreak
      ? state.longBreakIntervalSec
      : state.shortBreakIntervalSec;
    state.elapsedTimeSec = 0;
    state.remainingTimeSec = state.currentIntervalSec;
  },
  setPausing(state, val) {
    state.pausing = val;
  },
  initPomodoro(state) {
    state.currentIntervalSec = state.working
      ? state.workIntervalSec
      : state.workCount >= state.nWorkBeforeLongBreak
      ? state.longBreakIntervalSec
      : state.shortBreakIntervalSec;
    state.remainingTimeSec = state.currentIntervalSec;
  },
  updatePomodoro(state) {
    const now = new Date();

    if (!state.pausing) {
      // Update elapsed time
      state.elapsedTimeSec +=
        (now.getTime() - state.lastUpdateTime.getTime()) / 1000;

      // Update current interval
      state.currentIntervalSec = state.working
        ? state.workIntervalSec
        : state.workCount >= state.nWorkBeforeLongBreak
        ? state.longBreakIntervalSec
        : state.shortBreakIntervalSec;

      // Update remaining time
      state.remainingTimeSec = state.currentIntervalSec - state.elapsedTimeSec;
    }

    // Update last update time
    state.lastUpdateTime = now;

    // If interval finished
    if (state.elapsedTimeSec >= state.currentIntervalSec) {
      // Reset elapsed time
      state.elapsedTimeSec = 0;

      if (state.working) {
        // end of work
        if (state.workCount >= state.nWorkBeforeLongBreak) {
          // Send notification
          if (state.notificationIsEnabled) {
            // start of long break
            let intervalStr = `${state.longBreakIntervalSec / 60} Minutes`;
            if (state.longBreakIntervalSec / 60 < 1) {
              intervalStr = `${state.longBreakIntervalSec} Seconds`;
            }
            new Notification("Long Break " + String.fromCodePoint(0x1f943), {
              body: intervalStr,
              icon: "public/pomodoroTimer.png",
            });
          } else {
            let intervalStr = `${state.shortBreakIntervalSec / 60} Minutes`;
            if (state.shortBreakIntervalSec / 60 < 1) {
              intervalStr = `${state.shortBreakIntervalSec} Seconds`;
            }
            new Notification("Short Break " + String.fromCodePoint(0x2615), {
              body: intervalStr,
              icon: "public/pomodoroTimer.png",
            });
          }
        }
        state.working = false;
      } else {
        // Send notification
        if (state.notificationIsEnabled) {
          // end of break
          let intervalStr = `${state.workIntervalSec / 60} Minutes`;
          if (state.workIntervalSec / 60 < 1) {
            intervalStr = `${state.workIntervalSec} Seconds`;
          }
          new Notification("Work " + String.fromCodePoint(0x1f680), {
            body: intervalStr,
            icon: "public/pomodoroTimer.png",
          });
          if (state.workCount >= state.nWorkBeforeLongBreak) {
            // end of long break
            state.workCount = 1;
          } else {
            state.workCount++;
          }
        }
        state.working = true;
      }
    }
  },
  //
  // about refresh loop
  //
  startRefreshLoop(state) {
    const refreshLoop = setInterval(() => {
      this.commit("updatePomodoro");
    }, 1000 / state.fps);
    state.refreshLoop = refreshLoop;
  },
  stopRefreshLoop(state) {
    clearInterval(state.refreshLoop);
    state.refreshLoop = undefined;
  },
  //
  // The following mutations are called
  // when settings are updated from preference.
  //
  setWorkIntervalSec(state, sec) {
    state.workIntervalSec = sec;
  },
  setShortBreakIntervalSec(state, sec) {
    state.shortBreakIntervalSec = sec;
  },
  setLongBreakIntervalSec(state, sec) {
    state.longBreakIntervalSec = sec;
  },
  setNWorkBeforeLongBreak(state, nWork) {
    state.nWorkBeforeLongBreak = nWork;
  },
  setFps(state, fps) {
    state.fps = fps;
  },
  setWorkColors(state, edgeColors) {
    const colors = [];
    const leftColor = edgeColors[0];
    const rightColor = edgeColors[1];
    for (let percentage = 0; percentage <= 50; percentage += 1) {
      const color = calcColor(rightColor, leftColor, percentage);
      colors.push(color);
    }
    state.workColors = colors;
  },
  setShortBreakColors(state, edgeColors) {
    const colors = [];
    const leftColor = edgeColors[0];
    const rightColor = edgeColors[1];
    for (let percentage = 0; percentage <= 50; percentage += 1) {
      colors.push(calcColor(rightColor, leftColor, percentage));
    }
    state.shortBreakColors = colors;
  },
  setLongBreakColors(state, edgeColors) {
    const colors = [];
    const leftColor = edgeColors[0];
    const rightColor = edgeColors[1];
    for (let percentage = 0; percentage <= 50; percentage += 1) {
      colors.push(calcColor(rightColor, leftColor, percentage));
    }
    state.longBreakColors = colors;
  },
  setBackgroundColor(state, color) {
    state.backgroundColor = color;
  },
  setRingBaseColor(state, color) {
    state.ringBaseColor = color;
  },
  setRingLabelColor(state, color) {
    state.ringLabelColor = color;
  },
  setRingFontColor(state, color) {
    state.ringFontColor = color;
  },
  setScaleColor(state, color) {
    state.scaleColor = color;
  },
  setNotificationIsEnabled(state, enabled) {
    state.notificationIsEnabled = enabled;
  },
};

export default {
  state,
  mutations,
};
