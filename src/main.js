import Vue from 'vue';
import Vuex from 'vuex';

import pomodoroStore from './store/modules/pomodoro';
import preferenceStore from './store/modules/preference';

import App from './components/App.vue';

Vue.use(Vuex);

Vue.config.productionTip = false;

// Create Vuex store.
const store = new Vuex.Store({
  modules: {
    pomodoro: pomodoroStore,
    preference: preferenceStore,
  },
});

// Create Vue instance
new Vue({
  store,
  render: h => h(App),
}).$mount('#app');
