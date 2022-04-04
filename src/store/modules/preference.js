const state = () => ({
  preferenceIsOpened: false,
  // The following fields are initialized by the values of config file.
  preferenceButtonColor: 0x000000,
  preferenceButtonHoverColor: 0x000000,
  preferenceButtonFontColor: 0x000000,
  preferenceButtonFontHoverColor: 0x000000,
});

const mutations = {
  closePreference(state) {
    state.preferenceIsOpened = false;
  },
  openPreference(state) {
    state.preferenceIsOpened = true;
  },
  //
  // The following mutations are called
  // when settings are updated from preference.
  //
  setPreferenceButtonColor(state, color) {
    state.preferenceButtonColor = color;
  },
  setPreferenceButtonHoverColor(state, color) {
    state.preferenceButtonHoverColor = color;
  },
  setPreferenceButtonFontColor(state, color) {
    state.preferenceButtonFontColor = color;
  },
  setPreferenceButtonFontHoverColor(state, color) {
    state.preferenceButtonFontHoverColor = color;
  },
};

export default {
  state,
  mutations,
};
