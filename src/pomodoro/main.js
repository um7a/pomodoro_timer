import { createApp } from "vue";

import App from "../components/PomodoroTimer.vue";

const app = createApp(App);

app.mount("#app");
app.config.productionTip = false;
