import { createApp } from "vue";
import { createStore } from "vuex";

import pomodoroStore from "../store/modules/pomodoro";
import preferenceStore from "../store/modules/preference";

import App from "../components/PreferencePanel.vue";

// Create Vuex store.
const store = createStore({
  modules: {
    pomodoro: pomodoroStore,
    preference: preferenceStore,
  },
});

const app = createApp(App);

app.use(store);
app.mount("#app");
app.config.productionTip = false;
