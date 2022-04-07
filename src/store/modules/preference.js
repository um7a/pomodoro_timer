const state = () => ({
  preferenceIsOpened: false,
  // The following fields are initialized by the values of config file.
  preferenceBackgroundColor: 0x000000,
  preferenceLineColor: 0x000000,
  preferenceLabelBackgroundColor: 0x000000,
  preferenceLabelFontColor: 0x000000,
  preferenceFontColor: 0x000000,
  preferenceFontInvalidColor: 0x000000,
  preferenceButtonColor: 0x000000,
  preferenceButtonHoverColor: 0x000000,
  preferenceButtonFontColor: 0x000000,
  preferenceButtonFontHoverColor: 0x000000,
  checkMarkColor: 0x000000,
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
  setPreferenceBackgroundColor(state, color) {
    state.preferenceBackgroundColor = color;
  },
  setPreferenceLineColor(state, color) {
    state.preferenceLineColor = color;
  },
  setPreferenceLabelBackgroundColor(state, color) {
    state.preferenceLabelBackgroundColor = color;
  },
  setPreferenceLabelFontColor(state, color) {
    state.preferenceLabelFontColor = color;
  },
  setPreferenceFontColor(state, color) {
    state.preferenceFontColor = color;
  },
  setPreferenceFontInvalidColor(state, color) {
    state.preferenceFontInvalidColor = color;
  },
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
  setCheckMarkColor(state, color) {
    state.checkMarkColor = color;
  },
};

export default {
  state,
  mutations,
};
