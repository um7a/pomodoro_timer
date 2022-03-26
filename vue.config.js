module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        mac: {
          icon: "public/pomodoroTimer.png"
        },
      },
      // To use common js module from electron
      nodeIntegration: true,
    },
  },
};
