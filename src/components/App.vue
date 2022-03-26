<template>
  <div id="app">
    <PomodoroTimer />
    <PreferencePanel />
  </div>
</template>

<script>
import PomodoroTimer from "./PomodoroTimer.vue";
import PreferencePanel from "./PreferencePanel.vue";
import * as colorUtils from "../utils/colorUtils";

export default {
  name: "App",
  components: {
    PomodoroTimer,
    PreferencePanel,
  },
  created() {
    document.body.style.background = colorUtils.ntos(
      this.$store.state.pomodoro.backgroundColor
    );
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
  width: 200px;
  font-family: Helvetica, Arial, sans-serif;
}
</style>
