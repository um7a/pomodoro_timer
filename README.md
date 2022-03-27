# PomodoroTimer

Pomodoro timer for Mac.  

![node.js](https://github.com/um7a/pomodoro_timer/actions/workflows/node.js.yml/badge.svg?branch=main)
![daily_build](https://github.com/um7a/pomodoro_timer/actions/workflows/daily_build.yml/badge.svg?branch=main)

<div align="center">
  <img src="https://github.com/um7a/pomodoro_timer/raw/main/docs/pomodoroTimer.png" width="350px">
</div>


## Install
If you use intel mac, you can download PomodoroTimer.app from [Release](https://github.com/um7a/pomodoro_timer/releases) page.  
Or you can also build PomodoroTimer.app for both intel mac and apple silicon mac from source code. __(Building from source code is recomended.)__

## Build
You can build PomodoroTimer.app from source code by the following steps.

### Prerequisites
- git
- node
- npm

### Download the source code
```bash
$ git clone https://github.com/um7a/pomodoro_timer.git
$ cd pomodoro_timer
```
If you want to build a specific version, please checkout into the tag.  
For example, if you want to build the version v0.1.0, you should execute the following.
```bash
$ git checkout v0.1.0
```

### Project setup
```bash
$ npm install
```

### Compile app
* For Intel Mac
```bash
$ npm run electron:build -- --x64 --mac
```
Compiled app is in `dist_electron/mac/`.


* For Apple silicon Mac
```bash
$ npm run electron:build -- --arm64 --mac
```
Compiled app is in `dist_electron/mac-arm64/`.


## Other commands
The following commands are useful when you edit the source code.

## Lints files
```bash
$ npm run lint
```

## Execute test
```bash
$ npm run test
```

## Compiles and hot-reloads for development
```bash
$ npm run electron:serve
```
