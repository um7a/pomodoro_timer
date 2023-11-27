import React, { useEffect, useState, useRef } from "react";

import "./Pomodoro.css";
import Label from "./Label";
import ProgressBar from "./ProgressBar";
import Timer from "./Timer";
import Button from "./Button";
import * as ColorUtils from "../utils/colorUtils";
import { Logger, LogLevelInfo } from "../utils/logger";

const { electron } = window;

const logger = new Logger(LogLevelInfo);

function Pomodoro() {
  // state for configuration
  const [configIsReady, setConfigIsReady] = useState(false);
  const [configWasChanged, setConfigWasChanged] = useState(false);

  // state for window's configuration
  const [backgroundColor, setBackgroundColor] = useState(0x000000);
  const [transparent, setTransparent] = useState(0);

  // state for notification's configuration
  const notificationIsEnabled = useRef(true);

  // state for timer's configuration
  const [workMSec, setWorkMSec] = useState(0);
  const [shortBreakMSec, setShortBreakMSec] = useState(0);
  const [longBreakMSec, setLongBreakMSec] = useState(0);
  const [nWorkBeforeLongBreak, setNWorkBeforeLongBreak] = useState(0);
  const [fontColor, setFontColor] = useState(0x000000);

  // state for progress bar's configuration
  const [workColors, setWorkColors] = useState([0x000000]);
  const [shortBreakColors, setShortBreakColors] = useState([0x000000]);
  const [longBreakColors, setLongBreakColors] = useState([0x000000]);
  const [workBaseColor, setWorkBaseColor] = useState(0x000000);
  const [shortBreakBaseColor, setShortBreakBaseColor] = useState(0x000000);
  const [longBreakBaseColor, setLongBreakBaseColor] = useState(0x000000);

  // state for timer's condition
  const [remainingTimeMSec, setRemainingTimeMSec] = useState(0);
  const [workCount, setWorkCount] = useState(0);
  const [isWorking, setIsWorking] = useState(false);
  const [timerIsReady, setTimerIsReady] = useState(false);
  const lastHeartBeat = useRef(0);
  const [isPausing, setIsPausing] = useState(false);
  const [isSuspended, setIsSuspended] = useState(false);
  const [goNext, setGoNext] = useState(false);
  const [goPrevious, setGoPrevious] = useState(false);
  const updateTimerIntervalId = useRef<NodeJS.Timeout | undefined>(undefined);
  const resumed = useRef(true);

  // state for progressBar's condition
  const [progressBarIsInitialized, setProgressBarIsInitialized] =
    useState(false);
  const [progressBarIsReady, setProgressBarIsReady] = useState(false);
  const [currentProgressBarColors, setCurrentProgressBarColors] = useState([
    0x000000,
  ]);
  const [currentProgressBarBaseColor, setCurrentProgressBarBaseColor] =
    useState(0x000000);
  const [oneIntervalProgress, setOneIntervalProgress] = useState(0);
  const [allIntervalProgress, setAllIntervalProgress] = useState(0);
  const [
    oneIntervalProgressIsOnAnimation,
    setOneIntervalProgressIsOnAnimation,
  ] = useState(false);
  const [
    allIntervalProgressIsOnAnimation,
    setAllIntervalProgressIsOnAnimation,
  ] = useState(false);
  const oneIntervalProgressIntervalId = useRef<NodeJS.Timeout | undefined>(
    undefined
  );
  const allIntervalProgressIntervalId = useRef<NodeJS.Timeout | undefined>(
    undefined
  );
  const delta = useRef<number>(0);

  function moveProgressTo(
    requestedPercentage: number,
    currentPercentage: number,
    setProgress: React.Dispatch<React.SetStateAction<number>>,
    setProgressIsOnAnimation: React.Dispatch<React.SetStateAction<boolean>>
  ): NodeJS.Timeout | undefined {
    if (currentPercentage === requestedPercentage) {
      logger.log(`No need to move progress bar. Do nothing.`);
      return;
    }
    setProgressIsOnAnimation(true);
    setProgressBarIsReady(false);

    const moveStartPercentage = currentPercentage;
    const moveEndPercentage = requestedPercentage;
    const duration = moveEndPercentage - moveStartPercentage;
    logger.log(
      `Move progress from ${moveStartPercentage}% to ${moveEndPercentage}%. The duration is ${duration}%.`
    );
    const acceleratePercentageEnd = moveStartPercentage + duration * 0.1; // 0 ~ 10%
    const slowDownPercentageStart = moveStartPercentage + duration * 0.2; // 20 ~ 100%
    logger.log(
      `Accelerate movement until ${acceleratePercentageEnd}%. And Slow down movement from ${slowDownPercentageStart}%.`
    );

    const deltaStart = Math.max(Math.abs(0.1 * (duration / 100)), 0.1);
    const deltaMax = Math.max(Math.abs(5 * (duration / 100)), 0.5);
    const deltaEnd = Math.max(Math.abs(0.01 * (duration / 100)), 0.01);
    const deltaDiffStartMax = deltaMax - deltaStart;
    const deltaDiffMaxEnd = deltaMax - deltaEnd;
    const deltaStartMaxPerPercentage = Math.abs(
      deltaDiffStartMax / (acceleratePercentageEnd - moveStartPercentage)
    );
    const deltaMaxEndPerPercentage = Math.abs(
      deltaDiffMaxEnd / (moveEndPercentage - slowDownPercentageStart)
    );

    delta.current = deltaStart;

    return setInterval(() => {
      setProgress((currentPercentage) => {
        if (duration > 0) {
          if (currentPercentage >= requestedPercentage) {
            setProgressIsOnAnimation(false);
            return requestedPercentage;
          }
          if (currentPercentage < acceleratePercentageEnd) {
            delta.current =
              deltaStart +
              deltaStartMaxPerPercentage *
                (currentPercentage - moveStartPercentage);
          } else if (currentPercentage < slowDownPercentageStart) {
            delta.current = deltaMax;
          } else {
            delta.current =
              deltaMax -
              deltaMaxEndPerPercentage *
                (currentPercentage - slowDownPercentageStart);
          }
          return Math.min(
            currentPercentage + delta.current,
            requestedPercentage
          );
        } else {
          if (currentPercentage <= requestedPercentage) {
            setProgressIsOnAnimation(false);
            return requestedPercentage;
          }
          if (currentPercentage > acceleratePercentageEnd) {
            delta.current =
              deltaStart +
              deltaStartMaxPerPercentage *
                (moveStartPercentage - currentPercentage);
          } else if (currentPercentage > slowDownPercentageStart) {
            delta.current = deltaMax;
          } else {
            delta.current =
              deltaMax -
              deltaMaxEndPerPercentage *
                (slowDownPercentageStart - currentPercentage);
          }
          return Math.max(
            currentPercentage - delta.current,
            requestedPercentage
          );
        }
      });
    }, 1000 / 60); // 60 fps
  }

  //
  // (1) Set listener of the events which are sent by main process.
  //
  useEffect(() => {
    logger.log("Set a listener for profile change.");
    electron.onProfileChanged(() => {
      logger.log(`Profile was changed. Kick configuration reload.`);
      setConfigWasChanged(true);
    });

    logger.log("Set a listener for computer suspending.");
    electron.onComputerSuspended(() => {
      logger.log(`Computer was suspended. Stop updating timer.`);
      setIsSuspended(true);
    });

    logger.log("Set a listener for computer resuming.");
    electron.onComputerResumed(() => {
      logger.log(`Computer was resumed. Restart updating timer.`);
      setIsSuspended(false);
    });
  }, []);

  //
  // (2) Read config file and initialize some states.
  //
  useEffect(() => {
    if (configIsReady) {
      logger.warn(`Config is ready. Stop initializing states.`);
      return;
    }

    logger.log(`Initialize states from profile.`);
    electron.getProfile().then((profile: any) => {
      logger.log(`Current profile:\n${JSON.stringify(profile, undefined, 2)}`);
      // State for timer's configuration
      setWorkMSec(1000 * profile.workIntervalSec);
      setShortBreakMSec(1000 * profile.shortBreakIntervalSec);
      setLongBreakMSec(1000 * profile.longBreakIntervalSec);
      setNWorkBeforeLongBreak(profile.nWorkBeforeLongBreak);

      // State for notification's configuration
      notificationIsEnabled.current = profile.notificationIsEnabled;

      // State for window's configuration
      setBackgroundColor(profile.backgroundColor);

      // State for progressBar's configuration
      setTransparent(profile.transparent);
      setWorkColors(profile.workColors);
      setShortBreakColors(profile.shortBreakColors);
      setLongBreakColors(profile.longBreakColors);
      setWorkBaseColor(profile.workBaseColor);
      setShortBreakBaseColor(profile.shortBreakBaseColor);
      setLongBreakBaseColor(profile.longBreakBaseColor);
      setFontColor(profile.fontColor);

      setConfigIsReady(true);
    });
  }, [configIsReady]);

  //
  // (3) When config is changed, read config file and re-initialize some states again.
  //
  useEffect(() => {
    if (!configIsReady) {
      logger.warn(`Config is not ready. Stop re-initializing states.`);
      return;
    }
    if (!configWasChanged) {
      logger.warn(`Config was not changed. Stop re-initializing states.`);
      return;
    }
    logger.log(`Config was changed. Re-initialize states.`);
    electron.getProfile().then((profile: any) => {
      logger.log(`Current profile:\n${JSON.stringify(profile, undefined, 2)}`);

      // State for timer's configuration
      const newWorkMSec = 1000 * profile.workIntervalSec;
      const newShortBreakMSec = 1000 * profile.shortBreakIntervalSec;
      const newLongBreakMSec = 1000 * profile.longBreakIntervalSec;
      const newNWorkBeforeLongBreak = profile.nWorkBeforeLongBreak;

      if (
        newWorkMSec !== workMSec ||
        newShortBreakMSec !== shortBreakMSec ||
        newLongBreakMSec !== longBreakMSec ||
        newNWorkBeforeLongBreak !== nWorkBeforeLongBreak
      ) {
        // This case, kick initialization again.
        setConfigIsReady(false);
        setTimerIsReady(false);
        setProgressBarIsInitialized(false);
        setProgressBarIsReady(false);
        setConfigWasChanged(false);
        return;
      }

      // State for notification's configuration
      notificationIsEnabled.current = profile.notificationIsEnabled;

      // State for window's configuration
      setBackgroundColor(profile.backgroundColor);

      // State for progressBar's configuration
      setTransparent(profile.transparent);
      setWorkColors(profile.workColors);
      setWorkBaseColor(profile.workBaseColor);
      setShortBreakColors(profile.shortBreakColors);
      setShortBreakBaseColor(profile.shortBreakBaseColor);
      setLongBreakColors(profile.longBreakColors);
      setLongBreakBaseColor(profile.longBreakBaseColor);
      setFontColor(profile.fontColor);

      if (isWorking) {
        setCurrentProgressBarColors(profile.workColors);
        setCurrentProgressBarBaseColor(profile.workBaseColor);
      } else {
        if (workCount === nWorkBeforeLongBreak) {
          setCurrentProgressBarColors(profile.longBreakColors);
          setCurrentProgressBarBaseColor(profile.longBreakBaseColor);
        } else {
          setCurrentProgressBarColors(profile.shortBreakColors);
          setCurrentProgressBarBaseColor(profile.shortBreakBaseColor);
        }
      }

      setConfigIsReady(true);
      setConfigWasChanged(false);
    });
  }, [configWasChanged]);

  //
  // (4) Initialize states for timer
  //
  useEffect(() => {
    if (!configIsReady) {
      logger.warn(`Config is not ready. Stop initializing timer.`);
      return;
    }

    logger.log(`Configuration became ready. Initialize states for timer.`);
    setRemainingTimeMSec(workMSec);
    setWorkCount(1);
    setIsWorking(true);
    setIsPausing(true);

    setTimerIsReady(true);
  }, [configIsReady]);

  //
  // (5) Initialize states for progress bar
  //
  useEffect(() => {
    if (!configIsReady) {
      logger.warn(`Config is not ready. Stop initializing progress bar.`);
      return;
    }
    if (!timerIsReady) {
      logger.warn(`Timer is not ready. Stop initializing progress bar.`);
      return;
    }

    logger.log(
      `Configuration and timer became ready. Initialize states for progress bar.`
    );
    setCurrentProgressBarColors(workColors);
    setCurrentProgressBarBaseColor(workBaseColor);
    setOneIntervalProgress(0); // Animated from 0% to 100% latter.
    setAllIntervalProgress(0); // Animated from 0% to 100% latter.

    setProgressBarIsInitialized(true);
  }, [configIsReady, timerIsReady]);

  //
  // (6) Animate all progresses to 100%
  //
  useEffect(() => {
    if (!progressBarIsInitialized) {
      logger.warn(`Progress bar is not initialized. Stop animating progress.`);
      return;
    }

    if (oneIntervalProgressIntervalId !== undefined) {
      logger.log(`Cancel current animation of oneIntervalProgress.`);
      clearInterval(oneIntervalProgressIntervalId.current);
    }
    logger.log(
      `Start animating oneIntervalProgress from ${oneIntervalProgress}% to 100%.`
    );
    oneIntervalProgressIntervalId.current = moveProgressTo(
      100,
      oneIntervalProgress,
      setOneIntervalProgress,
      setOneIntervalProgressIsOnAnimation
    );

    if (allIntervalProgressIntervalId !== undefined) {
      logger.log(`Cancel current animation of allIntervalProgress.`);
      clearInterval(allIntervalProgressIntervalId.current);
    }
    logger.log(
      `Start animating allIntervalProgress from ${allIntervalProgress}% to 100%.`
    );
    allIntervalProgressIntervalId.current = moveProgressTo(
      100,
      allIntervalProgress,
      setAllIntervalProgress,
      setAllIntervalProgressIsOnAnimation
    );
  }, [progressBarIsInitialized]);

  //
  // (7) Check all progresses finish animation and set progresses are ready.
  //
  useEffect(() => {
    if (
      !oneIntervalProgressIsOnAnimation &&
      oneIntervalProgressIntervalId.current !== undefined
    ) {
      logger.log(
        `oneIntervalProgress finished its animation. Clear the interval.`
      );
      clearInterval(oneIntervalProgressIntervalId.current);
    }
    if (
      !allIntervalProgressIsOnAnimation &&
      allIntervalProgressIntervalId.current !== undefined
    ) {
      logger.log(
        `allIntervalProgress finished its animation. Clear the interval.`
      );
      clearInterval(allIntervalProgressIntervalId.current);
    }
    if (
      progressBarIsInitialized &&
      !oneIntervalProgressIsOnAnimation &&
      !allIntervalProgressIsOnAnimation
    ) {
      logger.log(
        `All progresses are not on animation. Set progress bar is ready.`
      );
      setProgressBarIsReady(true);
      resumed.current = true;
    }
  }, [oneIntervalProgressIsOnAnimation, allIntervalProgressIsOnAnimation]);

  //
  // (8) Update remainingTimeMSec periodically.
  //
  useEffect(() => {
    // The old interval would cleared but clear one more time just in case it is not canceled.
    if (updateTimerIntervalId.current !== undefined) {
      logger.log(
        `Clear the old interval for update states before creating new one.`
      );
      clearInterval(updateTimerIntervalId.current);
    }

    if (!progressBarIsReady) {
      logger.warn(
        `Progress bar is not ready. Do not start the interval for update states.`
      );
      return;
    }

    if (isPausing) {
      logger.warn(
        `Timer is pausing. Do not start the interval for update states.`
      );
      return;
    }

    if (isSuspended) {
      logger.warn(
        `Computer is being suspended. Do not start the interval for update states.`
      );
      return;
    }

    const currentIntervalMSec = isWorking
      ? workMSec
      : workCount === nWorkBeforeLongBreak
      ? longBreakMSec
      : shortBreakMSec;

    const fps = Math.min(
      currentIntervalMSec * 0.0005, // Update every (currentIntervalMSec * 0.05 %) milli sec.
      300 // fps should be bigger than 300 milli seconds for updating the remaining time text smoothly.
    );
    logger.log(`Update remainingTimeMSec every ${fps} milli seconds.`);

    updateTimerIntervalId.current = setInterval(() => {
      if (!progressBarIsReady) {
        logger.warn(`Progress bar is not ready. Stop updating states.`);
        return;
      }

      if (isPausing) {
        logger.warn(`Timer is pausing. Stop updating states.`);
        return;
      }

      if (isSuspended) {
        logger.warn(`Computer is being suspended. Stop updating states.`);
        return;
      }

      if (goNext) {
        logger.warn(
          `Timer is now going to the next interval. Stop updating states.`
        );
        return;
      }

      if (goPrevious) {
        logger.warn(
          `Timer is now going to the start of the current interval or the previous interval. Stop updating states.`
        );
        return;
      }

      const currentHeartBeat = new Date().getTime();
      const duration = currentHeartBeat - lastHeartBeat.current;
      lastHeartBeat.current = currentHeartBeat;
      logger.debug(
        `currentHeartBeat: ${currentHeartBeat}, lastHeartBeat: ${lastHeartBeat.current}, duration: ${duration}`
      );
      if (resumed.current) {
        // This case, timer resumed from pausing or suspending.
        // This time the current lastHeartBeat is the value before pausing or suspending.
        logger.log(`Resumed from pausing or suspending.`);
        resumed.current = false;
        return;
      }

      setRemainingTimeMSec((currentRemainingTimeMSec) => {
        const newRemainingTimeMSec = Math.max(
          currentRemainingTimeMSec - duration,
          0
        );
        logger.debug(`newRemainingTimeMSec: ${newRemainingTimeMSec}`);
        return newRemainingTimeMSec;
      });
    }, fps);

    return () => clearInterval(updateTimerIntervalId.current);
  }, [progressBarIsReady, isPausing, isSuspended, goNext, goPrevious]);

  //
  // (9) Update oneIntervalProgress when
  //     - remainingTimeMSec was changed
  //     - related configurations (workMSec, nWorkBeforeLongBreak, longBreakMSec, shortBreakMSec) ware changed
  //     - progress bar became ready
  //
  useEffect(() => {
    if (!progressBarIsReady) {
      logger.warn(
        `Progress bar is not ready. Stop updating oneIntervalProgress.`
      );
      return;
    }

    const currentIntervalMSec = isWorking
      ? workMSec
      : workCount === nWorkBeforeLongBreak
      ? longBreakMSec
      : shortBreakMSec;

    const newOneIntervalProgress =
      (remainingTimeMSec / currentIntervalMSec) * 100;
    setOneIntervalProgress(newOneIntervalProgress);
  }, [
    remainingTimeMSec,
    workMSec,
    nWorkBeforeLongBreak,
    longBreakMSec,
    shortBreakMSec,
    progressBarIsReady,
  ]);

  //
  // (10) Update allIntervalProgress when remainingTimeMSec or related configurations
  //      (workMSec, nWorkBeforeLongBreak) are changed.
  //
  useEffect(() => {
    if (!progressBarIsReady) {
      logger.warn(
        `Progress bar is not ready. Stop updating allIntervalProgress.`
      );
      return;
    }

    if (isWorking) {
      const newAllIntervalProgress =
        (((nWorkBeforeLongBreak - workCount) * workMSec + remainingTimeMSec) /
          (nWorkBeforeLongBreak * workMSec)) *
        100;
      setAllIntervalProgress(newAllIntervalProgress);
    }
  }, [remainingTimeMSec, workMSec, nWorkBeforeLongBreak, progressBarIsReady]);

  //
  // (11) Set goNext and Send Notification when remainingTimeMSec became 0
  //
  useEffect(() => {
    if (timerIsReady === false) {
      return;
    }

    if (remainingTimeMSec > 0) {
      return;
    }

    // If goNext flag has already true, do nothing.
    if (goNext === true) {
      return;
    }

    logger.log(`Instruct to go to the next interval.`);
    setGoNext(true);

    // Send a notification
    if (notificationIsEnabled.current === false) {
      logger.warn(`Notification is not enabled. Skip sending a notification.`);
      return;
    }

    logger.log(`Send a notification.`);
    const longBreakMinutes = longBreakMSec / 1000 / 60;
    const shortBreakMinutes = shortBreakMSec / 1000 / 60;
    const workMinutes = workMSec / 1000 / 60;
    if (isWorking) {
      if (workCount === nWorkBeforeLongBreak) {
        const nextIntervalMinuteStr =
          longBreakMinutes >= 1
            ? `${longBreakMinutes} Minutes`
            : `${longBreakMSec / 1000} Seconds`;
        new Notification("Long Break", {
          body: nextIntervalMinuteStr,
          silent: true,
        });
      } else {
        const nextIntervalMinuteStr =
          shortBreakMinutes >= 1
            ? `${shortBreakMinutes} Minutes`
            : `${shortBreakMSec / 1000} Seconds`;
        new Notification("Short Break", {
          body: nextIntervalMinuteStr,
          silent: true,
        });
      }
    } else {
      const nextIntervalMinuteStr =
        workMinutes >= 1
          ? `${workMinutes} Minutes`
          : `${workMSec / 1000} Seconds`;
      new Notification("Work", {
        body: nextIntervalMinuteStr,
        silent: true,
      });
    }
    logger.log(`Play a bell.`);
    const bell = new Audio("notification.mp3");
    bell.currentTime = 0;
    bell.play();
  }, [remainingTimeMSec, timerIsReady]);

  //
  // (12) Clear interval when timer is pausing.
  //
  useEffect(() => {
    if (!isPausing) {
      // Raise a flag to notify the timer that it is resumed.
      resumed.current = true;
      return;
    }
    logger.log(`Timer became pausing. Clear interval that update timer.`);
    clearInterval(updateTimerIntervalId.current);
  }, [isPausing]);

  //
  // (13) Clear interval when computer is suspended.
  //
  useEffect(() => {
    if (!isSuspended) {
      // Raise a flag to notify the timer that it is resumed.
      resumed.current = true;
      return;
    }
    logger.log(`Computer was suspended. Clear interval that update timer.`);
    clearInterval(updateTimerIntervalId.current);
  }, [isSuspended]);

  //
  // (14) Go to the next interval.
  //
  useEffect(() => {
    if (!goNext) {
      return;
    }
    logger.log(`Go to the next interval.`);

    // update currentProgressBarBaseColor and currentProgressBarColors
    let nextProgressBarBaseColor = 0;
    let nextProgressBarColors: number[] = [];
    if (isWorking) {
      if (workCount === nWorkBeforeLongBreak) {
        nextProgressBarBaseColor = longBreakBaseColor;
        nextProgressBarColors = longBreakColors;
      } else {
        nextProgressBarBaseColor = shortBreakBaseColor;
        nextProgressBarColors = shortBreakColors;
      }
    } else {
      nextProgressBarBaseColor = workBaseColor;
      nextProgressBarColors = workColors;
    }
    logger.log(`Change the progress bar color and base color.`);
    setCurrentProgressBarBaseColor(nextProgressBarBaseColor);
    setCurrentProgressBarColors(nextProgressBarColors);

    // reset oneIntervalProgress
    if (oneIntervalProgressIntervalId !== undefined) {
      logger.log(`Cancel current animation of oneIntervalProgress.`);
      clearInterval(oneIntervalProgressIntervalId.current);
    }
    logger.log(
      `Start animating oneIntervalProgress from ${oneIntervalProgress}% to 100%.`
    );
    oneIntervalProgressIntervalId.current = moveProgressTo(
      100,
      oneIntervalProgress,
      setOneIntervalProgress,
      setOneIntervalProgressIsOnAnimation
    );

    // reset allIntervalProgress
    if (isWorking) {
      const nextPercentage =
        ((nWorkBeforeLongBreak - workCount) / nWorkBeforeLongBreak) * 100;

      if (allIntervalProgressIntervalId !== undefined) {
        logger.log(`Cancel current animation of allIntervalProgress.`);
        clearInterval(allIntervalProgressIntervalId.current);
      }
      logger.log(
        `Start animating allIntervalProgress from ${allIntervalProgress}% to ${nextPercentage}%.`
      );
      allIntervalProgressIntervalId.current = moveProgressTo(
        nextPercentage,
        allIntervalProgress,
        setAllIntervalProgress,
        setAllIntervalProgressIsOnAnimation
      );
    }
    if (!isWorking && workCount === nWorkBeforeLongBreak) {
      if (allIntervalProgressIntervalId !== undefined) {
        logger.log(`Cancel current animation of allIntervalProgress.`);
        clearInterval(allIntervalProgressIntervalId.current);
      }
      logger.log(
        `Start animating allIntervalProgress from ${allIntervalProgress}% to 100%.`
      );
      allIntervalProgressIntervalId.current = moveProgressTo(
        100,
        allIntervalProgress,
        setAllIntervalProgress,
        setAllIntervalProgressIsOnAnimation
      );
    }

    // update workCount
    if (!isWorking) {
      let nextWorkCount = workCount;
      if (workCount === nWorkBeforeLongBreak) {
        nextWorkCount = 1;
      } else {
        nextWorkCount++;
      }
      logger.log(`Update workCount to ${nextWorkCount}.`);
      setWorkCount(nextWorkCount);
    }

    // update isWorking
    logger.log(`Update isWorking to ${!isWorking}.`);
    setIsWorking(!isWorking);

    // update remainingTimeMSec
    let nextIntervalMSec = 0;
    if (isWorking) {
      if (workCount === nWorkBeforeLongBreak) {
        nextIntervalMSec = longBreakMSec;
      } else {
        nextIntervalMSec = shortBreakMSec;
      }
    } else {
      nextIntervalMSec = workMSec;
    }
    logger.log(`Set remainingTimeMSec to ${nextIntervalMSec}.`);
    setRemainingTimeMSec(nextIntervalMSec);

    logger.log(`Set goNext false.`);
    setGoNext(false);
  }, [goNext]);

  //
  // (15) Go to the start of this interval or previous interval.
  //
  useEffect(() => {
    if (!goPrevious) {
      return;
    }

    let currentIntervalMSec = 0;
    if (isWorking) {
      currentIntervalMSec = workMSec;
    } else if (workCount === nWorkBeforeLongBreak) {
      currentIntervalMSec = longBreakMSec;
    } else {
      currentIntervalMSec = shortBreakMSec;
    }

    if (currentIntervalMSec - remainingTimeMSec > 3000) {
      logger.log(`Go to the start of this interval.`);

      // reset oneIntervalProgress
      if (oneIntervalProgressIntervalId !== undefined) {
        logger.log(`Cancel current animation of oneIntervalProgress.`);
        clearInterval(oneIntervalProgressIntervalId.current);
      }
      logger.log(
        `Start animating oneIntervalProgress from ${oneIntervalProgress}% to 100%.`
      );
      oneIntervalProgressIntervalId.current = moveProgressTo(
        100,
        oneIntervalProgress,
        setOneIntervalProgress,
        setOneIntervalProgressIsOnAnimation
      );

      // reset allIntervalProgress
      if (isWorking) {
        const previousPercentage =
          ((nWorkBeforeLongBreak - (workCount - 1)) / nWorkBeforeLongBreak) *
          100;
        if (allIntervalProgressIntervalId !== undefined) {
          logger.log(`Cancel current animation of allIntervalProgress.`);
          clearInterval(allIntervalProgressIntervalId.current);
        }
        logger.log(
          `Start animating allIntervalProgress from ${allIntervalProgress}% to ${previousPercentage}%.`
        );
        allIntervalProgressIntervalId.current = moveProgressTo(
          previousPercentage,
          allIntervalProgress,
          setAllIntervalProgress,
          setAllIntervalProgressIsOnAnimation
        );
      }

      // update remainingTimeMSec
      setRemainingTimeMSec(currentIntervalMSec);
    } else {
      logger.log(`Go to the previous interval.`);

      // update currentProgressBarBaseColor and currentProgressBarColors
      let previousProgressBarBaseColor = 0;
      let previousProgressBarColors: number[] = [];
      if (isWorking) {
        if (workCount === 1) {
          previousProgressBarBaseColor = longBreakBaseColor;
          previousProgressBarColors = longBreakColors;
        } else {
          previousProgressBarBaseColor = shortBreakBaseColor;
          previousProgressBarColors = shortBreakColors;
        }
      } else {
        previousProgressBarBaseColor = workBaseColor;
        previousProgressBarColors = workColors;
      }
      setCurrentProgressBarBaseColor(previousProgressBarBaseColor);
      setCurrentProgressBarColors(previousProgressBarColors);

      // reset oneIntervalProgress
      if (oneIntervalProgressIntervalId !== undefined) {
        logger.log(`Cancel current animation of oneIntervalProgress.`);
        clearInterval(oneIntervalProgressIntervalId.current);
      }
      logger.log(
        `Start animating oneIntervalProgress from ${oneIntervalProgress}% to 100%.`
      );
      oneIntervalProgressIntervalId.current = moveProgressTo(
        100,
        oneIntervalProgress,
        setOneIntervalProgress,
        setOneIntervalProgressIsOnAnimation
      );

      // reset allIntervalProgress
      let nextPercentage = 0;
      if (isWorking && workCount === 1) {
        // the previous interval is long break.
        nextPercentage = 0;
      } else {
        nextPercentage =
          ((nWorkBeforeLongBreak - (workCount - 1)) / nWorkBeforeLongBreak) *
          100;
      }
      if (allIntervalProgressIntervalId !== undefined) {
        logger.log(`Cancel current animation of allIntervalProgress.`);
        clearInterval(allIntervalProgressIntervalId.current);
      }
      logger.log(
        `Start animating allIntervalProgress from ${allIntervalProgress}% to ${nextPercentage}%.`
      );
      allIntervalProgressIntervalId.current = moveProgressTo(
        nextPercentage,
        allIntervalProgress,
        setAllIntervalProgress,
        setAllIntervalProgressIsOnAnimation
      );

      // update workCount
      if (isWorking) {
        if (workCount === 1) {
          setWorkCount(nWorkBeforeLongBreak);
        } else {
          setWorkCount(workCount - 1);
        }
      }

      // update isWorking
      setIsWorking(!isWorking);

      // update remainingTimeMSec
      let previousIntervalMSec = 0;
      if (!isWorking) {
        previousIntervalMSec = workMSec;
      } else if (workCount === 1) {
        previousIntervalMSec = longBreakMSec;
      } else {
        previousIntervalMSec = shortBreakMSec;
      }
      setRemainingTimeMSec(previousIntervalMSec);
    }
    setGoPrevious(false);
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
      {timerIsReady && progressBarIsInitialized ? (
        <ProgressBar
          colors={currentProgressBarColors}
          baseColor={currentProgressBarBaseColor}
          oneIntervalProgress={oneIntervalProgress}
          allIntervalProgress={allIntervalProgress}
        />
      ) : undefined}

      {timerIsReady && progressBarIsReady ? (
        <Label
          isWorking={isWorking}
          isLongBreak={workCount === nWorkBeforeLongBreak}
          fontColor={fontColor}
        />
      ) : undefined}

      {timerIsReady && progressBarIsReady ? (
        <Timer
          timeSec={Math.floor(remainingTimeMSec / 1000)}
          fontColor={fontColor}
        />
      ) : undefined}

      {timerIsReady && progressBarIsReady ? (
        <Button
          isPausing={isPausing}
          setIsPausing={setIsPausing}
          setGoNext={setGoNext}
          setGoPrevious={setGoPrevious}
          fontColor={fontColor}
        />
      ) : undefined}
    </div>
  );
}

export default Pomodoro;
