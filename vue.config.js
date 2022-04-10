module.exports = {
  pages: {
    index: "src/pomodoro/main.js",
    preference: "src/preference/main.js",
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        mac: {
          icon: "public/pomodoroTimer.png",
        },
      },
      // To use common js module from electron
      nodeIntegration: true,
    },
  },
};
