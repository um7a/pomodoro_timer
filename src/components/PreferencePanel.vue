<template>
  <div id="preference">
    <div class="preference" v-if="preferenceIsOpened">
      <!-- Title Pomodoro -->
      <div class="title">
        <p>Pomodoro</p>
      </div>
      <!-- Work Interval -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Work interval</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="text" class="invalid" v-model="workIntervalMinute" v-if="isInvalid.workIntervalMinute"/>
            <input type="text" v-model="workIntervalMinute" v-else/>
          </p>
        </div>
        <div class=unitSpace>
          <p class="unit">minutes</p>
        </div>
      </div>
      <!-- Short Break Interval -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Short break interval</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="text" class="invalid" v-model="shortBreakIntervalMinute" v-if="isInvalid.shortBreakIntervalMinute"/>
            <input type="text" v-model="shortBreakIntervalMinute" v-else/>
          </p>
        </div>
        <div class=unitSpace>
          <p class="unit">minutes</p>
        </div>
      </div>
      <!-- Long Break Interval -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Long break interval</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="text" class="invalid" v-model="longBreakIntervalMinute" v-if="isInvalid.longBreakIntervalMinute"/>
            <input type="text" v-model="longBreakIntervalMinute" v-else/>
          </p>
        </div>
        <div class=unitSpace>
          <p class="unit">minutes</p>
        </div>
      </div>
      <!-- Number of work -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Number of work before long break</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="text" class="invalid" v-model="nWorkBeforeLongBreak" v-if="isInvalid.nWorkBeforeLongBreak"/>
            <input type="text" v-model="nWorkBeforeLongBreak" v-else/>
          </p>
        </div>
        <div class=unitSpace>
          <p class="unit">times</p>
        </div>
      </div>
      <!-- Title Graphic -->
      <div class="title">
        <p>Graphic</p>
      </div>
      <!-- Frame per sec -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Frame per sec</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="text" class="invalid" v-model="fps" v-if="isInvalid.fps"/>
            <input type="text" v-model="fps" v-else/>
          </p>
        </div>
        <div class=unitSpace>
          <p class="unit">fps</p>
        </div>
      </div>
      <!-- Title Color -->
      <div class="title">
        <p>Color</p>
      </div>
      <!-- Work Color -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Work Color ( Left / Right )</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="color" v-model="workColorLeft"/>
            <input type="color" v-model="workColorRight"/>
          </p>
        </div>
      </div>
      <!-- Short Break Color -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Short Break Color ( Left / Right )</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="color" v-model="shortBreakColorLeft"/>
            <input type="color" v-model="shortBreakColorRight"/>
          </p>
        </div>
      </div>
      <!-- Long Break Color -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Long Break Color ( Left / Right )</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="color" v-model="longBreakColorLeft"/>
            <input type="color" v-model="longBreakColorRight"/>
          </p>
        </div>
      </div>
      <!-- Background Color -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Background Color</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="color" v-model="backgroundColor"/>
          </p>
        </div>
      </div>
      <!-- Ring Base Color -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Ring Base Color</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="color" v-model="ringBaseColor"/>
          </p>
        </div>
      </div>
      <!-- Ring Label Color -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Ring Label Color</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="color" v-model="ringLabelColor"/>
          </p>
        </div>
      </div>
      <!-- Ring Font Color -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Ring Font Color</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="color" v-model="ringFontColor"/>
          </p>
        </div>
      </div>
      <!-- Preference Button Color -->
      <div class="content">
        <div class="keySpace">
          <p class="key">Preference Button Color</p>
        </div>
        <div class="valueSpace">
          <p class="value">
            <input type="color" v-model="preferenceButtonColor"/>
            <input type="color" v-model="preferenceButtonHoverColor"/>
          </p>
        </div>
      </div>

      <!-- Footer -->
      <div class="footer">
        <p class="button" @click="submit()" :style="{ '--preference-button-hover-color': savedPreferenceButtonHoverColor, }">Submit</p>
      </div>
    </div>
    <!-- Preference Open/Close Button -->
    <p class="openButton"
      v-if="!preferenceIsOpened" @click="openPreference()" :style="{
        '--preference-button-color': savedPreferenceButtonColor,
        '--preference-button-hover-color': savedPreferenceButtonHoverColor,
      }">Preference</p>
    <p class="closeButton" v-else @click="closePreference()" :style="{
      '--preference-button-hover-color': savedPreferenceButtonHoverColor,
    }">Close</p>
  </div>
</template>

<script>
import { ipcRenderer } from 'electron';
import * as os from 'os';

import * as colorUtils from '../utils/colorUtils';
import { ConfigFileAccessor } from '../utils/configFileAccessor';
export default {
  name: 'PreferencePanel',
  data() {
    return {
      isInvalid: {},
      configFileAccessor: undefined,
      workIntervalMinute: 0,
      shortBreakIntervalMinute: 0,
      longBreakIntervalMinute: 0,
      nWorkBeforeLongBreak: 0,
      fps: 0,
      workColorLeft: '#000000',
      workColorRight : '#000000',
      shortBreakColorLeft: '#000000',
      shortBreakColorRight: '#000000',
      longBreakColorLeft: '#000000',
      longBreakColorRight: '#000000',
      backgroundColor: '#000000',
      ringBaseColor: '#000000',
      ringLabelColor: '#000000',
      ringFontColor: '#000000',
      preferenceButtonColor: '#000000',
      preferenceButtonHoverColor: '#000000',
    };
  },
  computed: {
    preferenceIsOpened() {
      return this.$store.state.preference.preferenceIsOpened;
    },
    savedPreferenceButtonColor() {
      return colorUtils.ntos(this.$store.state.preference.preferenceButtonColor);
    },
    savedPreferenceButtonHoverColor() {
      const preferenceButtonHoverColor = colorUtils.ntos(this.$store.state.preference.preferenceButtonHoverColor);
      return preferenceButtonHoverColor;
    },
  },
  methods: {
    openPreference() {
      this.$store.commit('openPreference');
      ipcRenderer.send('open-preference');
    },
    closePreference() {
      this.$store.commit('closePreference');
      ipcRenderer.send('close-preference');
    },
    validate() {
      let isValid = true;
      const isInvalid = {};

      if (!/^[1-9][0-9]*$/.test(this.workIntervalMinute)) {
        isInvalid.workIntervalMinute = true;
        isValid = false;
      }
      if (!/^[1-9][0-9]*$/.test(this.shortBreakIntervalMinute)) {
        isInvalid.shortBreakIntervalMinute = true;
        isValid = false;
      }
      if (!/^[1-9][0-9]*$/.test(this.longBreakIntervalMinute)) {
        isInvalid.longBreakIntervalMinute = true;
        isValid = false;
      }
      if (!/^[1-9][0-9]*$/.test(this.nWorkBeforeLongBreak)) {
        isInvalid.nWorkBeforeLongBreak= true;
        isValid = false;
      }
      if (!/^[1-9][0-9]*$/.test(this.fps)) {
        isInvalid.fps= true;
        isValid = false;
      }
      this.isInvalid = isInvalid;
      return isValid;
    },
    submit() {
      // Validate new settings.
      if (!this.validate()) {
        return;
      }
      // Set new settings to store.
      this.$store.commit('setWorkIntervalSec', this.workIntervalMinute * 60);
      this.$store.commit('setShortBreakIntervalSec', this.shortBreakIntervalMinute * 60);
      this.$store.commit('setLongBreakIntervalSec', this.longBreakIntervalMinute * 60);
      this.$store.commit('setNWorkBeforeLongBreak', Number.parseInt(this.nWorkBeforeLongBreak));
      this.$store.commit('setFps', Number.parseInt(this.fps));
      this.$store.commit('setWorkColors', [ colorUtils.ston(this.workColorRight), colorUtils.ston(this.workColorLeft), ]);
      this.$store.commit('setShortBreakColors', [ colorUtils.ston(this.shortBreakColorRight), colorUtils.ston(this.shortBreakColorLeft), ]);
      this.$store.commit('setLongBreakColors', [ colorUtils.ston(this.longBreakColorRight), colorUtils.ston(this.longBreakColorLeft), ]);
      this.$store.commit('setBackgroundColor',colorUtils.ston(this.backgroundColor));
      this.$store.commit('setRingBaseColor',colorUtils.ston(this.ringBaseColor));
      this.$store.commit('setRingLabelColor',colorUtils.ston(this.ringLabelColor));
      this.$store.commit('setRingFontColor',colorUtils.ston(this.ringFontColor));
      this.$store.commit('setPreferenceButtonColor',colorUtils.ston(this.preferenceButtonColor));
      this.$store.commit('setPreferenceButtonHoverColor',colorUtils.ston(this.preferenceButtonHoverColor));
      // Restart refresh loop.
      this.$store.commit('stopRefreshLoop');
      this.$store.commit('startRefreshLoop');
      // Save the new settings to the config file.
      const configFileAccessor = new ConfigFileAccessor(os.homedir()+'/.pomodoroTimer/config.json');
      configFileAccessor.save('workIntervalSec',            this.workIntervalMinute * 60);
      configFileAccessor.save('shortBreakIntervalSec',      this.shortBreakIntervalMinute * 60);
      configFileAccessor.save('longBreakIntervalSec',       this.longBreakIntervalMinute * 60);
      configFileAccessor.save('nWorkBeforeLongBreak',       this.nWorkBeforeLongBreak);
      configFileAccessor.save('fps',                        this.fps);
      configFileAccessor.save('workColors',                 [ colorUtils.ston(this.workColorRight), colorUtils.ston(this.workColorLeft), ]);
      configFileAccessor.save('shortBreakColors',           [ colorUtils.ston(this.shortBreakColorRight), colorUtils.ston(this.shortBreakColorLeft), ]);
      configFileAccessor.save('longBreakColors',            [ colorUtils.ston(this.longBreakColorRight), colorUtils.ston(this.longBreakColorLeft), ]);
      configFileAccessor.save('backgroundColor',            colorUtils.ston(this.backgroundColor));
      configFileAccessor.save('ringBaseColor',              colorUtils.ston(this.ringBaseColor));
      configFileAccessor.save('ringLabelColor',             colorUtils.ston(this.ringLabelColor));
      configFileAccessor.save('ringFontColor',              colorUtils.ston(this.ringFontColor));
      configFileAccessor.save('preferenceButtonColor',      colorUtils.ston(this.preferenceButtonColor));
      configFileAccessor.save('preferenceButtonHoverColor', colorUtils.ston(this.preferenceButtonHoverColor));
    },
  },
  mounted: function() {
    this.configFileAccessor = new ConfigFileAccessor(os.homedir()+'/.pomodoroTimer/config.json');
    // Create new file with default values.
    if (!this.configFileAccessor.configFileExists()) {
      this.configFileAccessor.save('workIntervalSec',            25 * 60);
      this.configFileAccessor.save('shortBreakIntervalSec',      5 * 60);
      this.configFileAccessor.save('longBreakIntervalSec',       20 * 60);
      this.configFileAccessor.save('nWorkBeforeLongBreak',       4);
      this.configFileAccessor.save('fps',                        8);
      this.configFileAccessor.save('workColors',                 [ 0xd38312, 0xa83279, ]);
      this.configFileAccessor.save('shortBreakColors',           [ 0x00b09b, 0x96c93d, ]);
      this.configFileAccessor.save('longBreakColors',            [ 0x43cea2, 0x1e90ff, ]);
      this.configFileAccessor.save('backgroundColor',            0x000000);
      this.configFileAccessor.save('ringBaseColor',              0x131313);
      this.configFileAccessor.save('ringLabelColor',             0x4d4d4d);
      this.configFileAccessor.save('ringFontColor',              0xc0c0c0);
      this.configFileAccessor.save('preferenceButtonColor',      0x0e0e0e);
      this.configFileAccessor.save('preferenceButtonHoverColor', 0xff6767); // pink
      //this.configFileAccessor.save('preferenceButtonHoverColor', 0xb3ff66); // green
      //this.configFileAccessor.save('preferenceButtonHoverColor', 0x454545); // gray
    }

    const {
      // Setting about pomodoro
      workIntervalSec,
      shortBreakIntervalSec,
      longBreakIntervalSec,
      nWorkBeforeLongBreak,
      fps,
      workColors,
      shortBreakColors,
      longBreakColors,
      backgroundColor,
      ringBaseColor,
      ringLabelColor,
      ringFontColor,
      // Setting about preference
      preferenceButtonColor,
      preferenceButtonHoverColor,
    } = this.configFileAccessor.getConfigObject();

    // The following data properties are used to save temporary settings of preference panel.
    // When the preferences are submitted, these values are copied to the store and the config file.
    this.workIntervalMinute = workIntervalSec / 60;
    this.shortBreakIntervalMinute = shortBreakIntervalSec / 60;
    this.longBreakIntervalMinute = longBreakIntervalSec / 60;
    this.nWorkBeforeLongBreak = nWorkBeforeLongBreak;
    this.fps = fps;
    this.workColorLeft = colorUtils.ntos(workColors[1]);
    this.workColorRight = colorUtils.ntos(workColors[0]);
    this.shortBreakColorLeft = colorUtils.ntos(shortBreakColors[1]);
    this.shortBreakColorRight = colorUtils.ntos(shortBreakColors[0]);
    this.longBreakColorLeft = colorUtils.ntos(longBreakColors[1]);
    this.longBreakColorRight = colorUtils.ntos(longBreakColors[0]);
    this.backgroundColor = colorUtils.ntos(backgroundColor);
    this.ringBaseColor = colorUtils.ntos(ringBaseColor);
    this.ringLabelColor = colorUtils.ntos(ringLabelColor);
    this.ringFontColor = colorUtils.ntos(ringFontColor);
    this.preferenceButtonColor = colorUtils.ntos(preferenceButtonColor);
    this.preferenceButtonHoverColor = colorUtils.ntos(preferenceButtonHoverColor);

    // The following data of vuex store are used by every vue components to set intervals, colors, and etc.
    this.$store.commit('setWorkIntervalSec', this.workIntervalMinute * 60);
    this.$store.commit('setShortBreakIntervalSec', this.shortBreakIntervalMinute * 60);
    this.$store.commit('setLongBreakIntervalSec', this.longBreakIntervalMinute * 60);
    this.$store.commit('setNWorkBeforeLongBreak', Number.parseInt(this.nWorkBeforeLongBreak));
    this.$store.commit('setFps', Number.parseInt(this.fps));
    this.$store.commit('setWorkColors', [ colorUtils.ston(this.workColorRight), colorUtils.ston(this.workColorLeft), ]);
    this.$store.commit('setShortBreakColors', [ colorUtils.ston(this.shortBreakColorRight), colorUtils.ston(this.shortBreakColorLeft), ]);
    this.$store.commit('setLongBreakColors', [ colorUtils.ston(this.longBreakColorRight), colorUtils.ston(this.longBreakColorLeft), ]);
    this.$store.commit('setBackgroundColor',colorUtils.ston(this.backgroundColor));
    this.$store.commit('setRingBaseColor',colorUtils.ston(this.ringBaseColor));
    this.$store.commit('setRingLabelColor',colorUtils.ston(this.ringLabelColor));
    this.$store.commit('setRingFontColor',colorUtils.ston(this.ringFontColor));
    this.$store.commit('setPreferenceButtonColor',colorUtils.ston(this.preferenceButtonColor));
    this.$store.commit('setPreferenceButtonHoverColor',colorUtils.ston(this.preferenceButtonHoverColor));
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.openButton, .closeButton {
  cursor : pointer;
  position: absolute;
  bottom: 0;
  color: #4d4d4d;
  font-size: 12px;
  height: 30px;
  width: 100%;
  margin: 0;
  background: var(--preference-button-color);
  transition: all  0.5s ease;
  border-radius: 2px;
  /*
   * Make this class to flexible box layout.
   * I want to use justify-content which is
   * the sub property of the flexible box layout.
   */
  display: flex;
  /* Horizontal Middle */
  justify-content: center;
  /* Vertical Middle */
  align-items: center;  
}

.openButton:hover, .closeButton {
  background: var(--preference-button-hover-color);
  color: #000000;
}

.preference {
  position: absolute;
  width: 370px;
  background: #0e0e0e;
  color: #4d4d4d;
  right: 0;
  bottom: 30px;
  top: 0;
  animation-name: fade;
  animation-duration: 1.5s;
}

/* Title */
.preference .title {
  background: #171717;
  margin: 0 0 4px;
  border-radius: 2px;
  padding: 5px 10px;
}

.preference .title p {
  font-size: 12px;
  margin: 0;
}

/* Content */
.preference .content {
  border-bottom: #000000;
  margin: 0;
}

.preference .content .keySpace {
  display: inline-block;
  margin-left: 10px;
  width: 210px;
}

.preference .content .valueSpace {
  display: inline-block;
  margin: 0 5px;
}

.preference .content .unitSpace {
  display: inline-block;
  margin: 0 5px;
  margin-left: 0;
}
.preference .content .key {
  margin: 10px 10px;
  padding: 0 10px;
  font-size: 12px;
  margin: 0;
}
.preference .content .key2Line {
  margin: 10px 10px;
  padding: 0 10px;
  font-size: 11px;
  margin: 0;
}
.preference .content .value {
  padding: 10px 5px;
  font-size: 12px;
  margin: 0;
}

.preference .content .unit {
  padding: 10px 0;
  font-size: 12px;
  margin: 0;
}

.preference .content input[type=text] {
  background: #0e0e0e;
	border: 1px solid #222222;
	border-radius: 4px;
  color: #4d4d4d;
	outline: none;
  width: 60px;
  height: 20px;
  top: 0;
}

.preference .content input[type="text"][class="invalid"] {
  background: #1a1010;
	border: 1px solid #540000;
	border-radius: 4px;
  color: #9b0043;
	outline: none;
  width: 60px;
  height: 20px;
  top: 0;
}

.preference .content input[type="color"] {
  background: none;
	border: none;
  color: #4d4d4d;
	outline: none;
  width: 40px;
  height: 22px;
  top: 0;
  vertical-align: -3px;
  padding: 0;
  margin-left: 13px;
}

/* Footer */
.preference .footer {
  position: absolute;
  bottom: 0;
  background: #171717;
  width: 100%;
  padding: 8px 0px;
}

.preference .footer .button {
  color: #000000;
  font-size: 11px;
  background: var(--preference-button-hover-color);
  float: right;
  margin: 0 12px;
  padding: 3px 10px;
  border-radius: 3px;
  cursor : pointer;
}

@keyframes fade{
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}

</style>
