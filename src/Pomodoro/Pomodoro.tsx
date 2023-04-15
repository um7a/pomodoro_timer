import { useEffect, useState, useRef } from "react";

import "./Pomodoro.css";
import Label from "./Label";
import Ring from "./Ring";
import Timer from "./Timer";
import Button from "./Button";
import * as ColorUtils from "../utils/colorUtils";

const { electron } = window;

const useIntervalBy250ms = (callback: () => void, deps: any[]) => {
  const callbackRef = useRef<() => void>(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = () => {
      callbackRef.current();
    };
    const id = setInterval(tick, 250);
    return () => {
      clearInterval(id);
    };
  }, deps);
};

function Pomodoro() {
  // state for configuration
  const [configIsReady, setConfigIsReady] = useState(false);
  const [configWasChanged, setConfigWasChanged] = useState(false);

  // state for timer's configuration
  const [workMSec, setWorkMSec] = useState(0);
  const [shortBreakMSec, setShortBreakMSec] = useState(0);
  const [longBreakMSec, setLongBreakMSec] = useState(0);
  const [nWorkBeforeLongBreak, setNWorkBeforeLongBreak] = useState(0);

  // state for timer's condition
  const [timeMSec, setTimeMSec] = useState(0);
  const [workCount, setWorkCount] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [timerIsReady, setTimerIsReady] = useState(false);
  const [currentIntervalMSec, setCurrentIntervalMSec] = useState(0);
  const [lastHeartBeat, setLastHeartBeat] = useState(0);
  const [isPausing, setIsPausing] = useState(false);
  const [goNext, setGoNext] = useState(false);
  const [goPrevious, setGoPrevious] = useState(false);

  // state for notification's configuration
  const [notificationIsEnabled, setNotificationIsEnabled] = useState(true);

  // state for window's configuration
  const [backgroundColor, setBackgroundColor] = useState(0x000000);

  // state for ring's configuration
  const [transparent, setTransparent] = useState(0);
  const [workColors, setWorkColors] = useState([0x000000]);
  const [shortBreakColors, setShortBreakColors] = useState([0x000000]);
  const [longBreakColors, setLongBreakColors] = useState([0x000000]);
  const [backRingColor, setBackRingColor] = useState(0x000000);
  const [ringLabelColor, setRingLabelColor] = useState(0x000000);
  const [scaleColor, setScaleColor] = useState(0x000000);

  // state for ring's condition
  const [ringIsReady, setRingIsReady] = useState(false);
  const [currentColors, setCurrentColors] = useState([0x000000]);

  //
  // (1) Set listener of profile change.
  //
  useEffect(() => {
    console.log("set electron.onProfileChanged.");
    electron.onProfileChanged(() => {
      console.log(`Profile was changed. Reload configurations.`);
      setConfigWasChanged(true);
    });
  }, []);

  //
  // (2) Read config file and initialize some states.
  //
  useEffect(() => {
    if (configIsReady && !configWasChanged) {
      console.warn(
        `Config is ready and not changed. Stop re-initialize states.`
      );
      return;
    }
    if (configWasChanged) {
      setConfigIsReady(false);
    }

    console.log(`Initialize states from profile.`);

    electron.getProfile().then((profile: any) => {
      console.log(profile);
      // Initialize state
      // state for timer's configuration
      setWorkMSec(1000 * profile.workIntervalSec);
      setShortBreakMSec(1000 * profile.shortBreakIntervalSec);
      setLongBreakMSec(1000 * profile.longBreakIntervalSec);
      setNWorkBeforeLongBreak(profile.nWorkBeforeLongBreak);

      // state for notification's configuration
      setNotificationIsEnabled(profile.notificationIsEnabled);

      // state for window's configuration
      setBackgroundColor(profile.backgroundColor);

      // state for ring's configuration
      setTransparent(profile.transparent);
      setWorkColors(profile.workColors);
      setShortBreakColors(profile.shortBreakColors);
      setLongBreakColors(profile.longBreakColors);
      setBackRingColor(profile.ringBaseColor);
      setRingLabelColor(profile.ringLabelColor);
      setScaleColor(profile.scaleColor);

      setConfigIsReady(true);
      setConfigWasChanged(false);
    });
  }, [configWasChanged]);

  //
  // (3) Setup and start timer
  //
  useEffect(() => {
    if (!configIsReady) {
      console.warn(`Config is not ready. Stop starting timer.`);
      return;
    }
    if (!ringIsReady) {
      console.warn(`Ring is not ready. Stop starting timer.`);
      return;
    }
    console.log(`Writing the startup message is done. Setup timer.`);
    // Initialize Timer
    setTimeMSec(workMSec);
    setCurrentIntervalMSec(workMSec);
    setWorkCount(1);
    setCurrentColors(workColors);
    setIsWorking(true);
    setIsPausing(true);
    setTimerIsReady(true);
  }, [configIsReady, ringIsReady]);

  //
  // (4) Update states every second
  //
  useIntervalBy250ms(() => {
    console.log(`Update states.`);

    // Temporary heart beat output for debug.
    const currentHeartBeat = new Date().getTime();
    console.log(
      `heart beat. timeMSec = ${timeMSec}. duration = ${
        currentHeartBeat - lastHeartBeat
      }`
    );
    setLastHeartBeat(currentHeartBeat);

    if (!timerIsReady) {
      return;
    }
    if (!ringIsReady) {
      return;
    }
    if (isPausing) {
      console.log(`Timer is pausing.`);
      return;
    }

    if (timeMSec > 0) {
      setTimeMSec(timeMSec - 250);
      return;
    }

    setGoNext(true);
    if (notificationIsEnabled === false) {
      return;
    }

    console.log(`Send notification.`);
    if (isWorking) {
      if (workCount === nWorkBeforeLongBreak) {
        const longBreakSec = longBreakMSec / 1000;
        const nextIntervalMinuteStr =
          longBreakSec > 60
            ? `${longBreakSec / 60} Minutes`
            : `${longBreakSec} Seconds`;
        new Notification("Long Break " + String.fromCodePoint(0x1f943), {
          body: nextIntervalMinuteStr,
          silent: true,
        });
        const bell = new Audio("notification.mp3");
        bell.currentTime = 0;
        bell.play();
      } else {
        const shortBreakSec = shortBreakMSec / 1000;
        const nextIntervalMinuteStr =
          shortBreakSec > 60
            ? `${shortBreakSec / 60} Minutes`
            : `${shortBreakSec} Seconds`;
        new Notification("Short Break " + String.fromCodePoint(0x2615), {
          body: nextIntervalMinuteStr,
          silent: true,
        });
        const bell = new Audio("notification.mp3");
        bell.currentTime = 0;
        bell.play();
      }
    } else {
      const workSec = workMSec / 1000;
      const nextIntervalMinuteStr =
        workSec > 60 ? `${workSec / 60} Minutes` : `${workSec} Seconds`;
      new Notification("Work" + String.fromCodePoint(0x1f680), {
        body: nextIntervalMinuteStr,
        silent: true,
      });
      const bell = new Audio("notification.mp3");
      bell.currentTime = 0;
      bell.play();
    }
  }, [timerIsReady, ringIsReady, isPausing]);

  //
  // (5) Go to next interval.
  //
  useEffect(() => {
    if (!goNext) {
      return;
    }
    setGoNext(false);
    console.log(`Go next.`);

    const currentIsPausing = isPausing;
    if (!currentIsPausing) {
      setIsPausing(true);
    }

    const nextIsBreak = isWorking;
    if (nextIsBreak) {
      if (workCount === nWorkBeforeLongBreak) {
        setCurrentIntervalMSec(longBreakMSec);
        setTimeMSec(longBreakMSec);
        setCurrentColors(longBreakColors);
      } else {
        setCurrentIntervalMSec(shortBreakMSec);
        setTimeMSec(shortBreakMSec);
        setCurrentColors(shortBreakColors);
      }
    } else {
      if (workCount === nWorkBeforeLongBreak) {
        setWorkCount(1);
      } else {
        setWorkCount(workCount + 1);
      }
      setCurrentIntervalMSec(workMSec);
      setTimeMSec(workMSec);
      setCurrentColors(workColors);
    }
    setIsWorking(!isWorking);

    if (!currentIsPausing) {
      setIsPausing(false);
    }
  }, [goNext]);

  //
  // (6) Go to the start of this interval or previous interval.
  //
  useEffect(() => {
    if (!goPrevious) {
      return;
    }
    setGoPrevious(false);
    console.log(`Go Previous.`);

    const currentIsPausing = isPausing;
    if (!currentIsPausing) {
      setIsPausing(true);
    }

    // Go to previous interval.
    if (currentIntervalMSec - timeMSec < 2000) {
      const prevIsBreak = isWorking;
      if (prevIsBreak) {
        // Current interval is work. The previous interval is break.
        if (workCount === 1) {
          // The previous interval is long break.
          setTimeMSec(longBreakMSec);
          setCurrentIntervalMSec(longBreakMSec);
          setCurrentColors(longBreakColors);
          setWorkCount(nWorkBeforeLongBreak);
        } else {
          // The previous interval is short break.
          setTimeMSec(shortBreakMSec);
          setCurrentIntervalMSec(shortBreakMSec);
          setCurrentColors(shortBreakColors);
          setWorkCount(workCount - 1);
        }
      } else {
        // Current interval is break. The previous interval is work.
        setTimeMSec(workMSec);
        setCurrentIntervalMSec(workMSec);
        setCurrentColors(workColors);
      }
      setIsWorking(!isWorking);
    } else {
      setTimeMSec(currentIntervalMSec);
    }

    if (!currentIsPausing) {
      setIsPausing(false);
    }
  }, [goPrevious]);

  return (
    <div
      className="Pomodoro"
      style={
        {
          "--background-transparent": transparent,
          "--background-color-red": ColorUtils.ntorn(backgroundColor),
          "--background-color-green": ColorUtils.ntogn(backgroundColor),
          "--background-color-blue": ColorUtils.ntobn(backgroundColor),
        } as React.CSSProperties
      }
    >
      {timerIsReady ? (
        <Label
          isWorking={isWorking}
          isLongBreak={workCount === nWorkBeforeLongBreak}
          labelColor={ringLabelColor}
        />
      ) : undefined}

      {timerIsReady ? (
        <Timer
          timeSec={Math.floor(timeMSec / 1000)}
          labelColor={ringLabelColor}
        />
      ) : undefined}

      <Ring
        configIsReady={configIsReady}
        ringIsReady={ringIsReady}
        setRingIsReady={setRingIsReady}
        timeMSec={timeMSec}
        currentIntervalMSec={currentIntervalMSec}
        workIntervalMSec={workMSec}
        isWorking={isWorking}
        workCount={workCount}
        nWorkBeforeLongBreak={nWorkBeforeLongBreak}
        currentColors={currentColors}
        backRingColor={backRingColor}
        scaleColor={scaleColor}
      />

      {timerIsReady ? (
        <Button
          isPausing={isPausing}
          setIsPausing={setIsPausing}
          setGoNext={setGoNext}
          setGoPrevious={setGoPrevious}
          labelColor={ringLabelColor}
        />
      ) : undefined}
    </div>
  );
}

export default Pomodoro;
