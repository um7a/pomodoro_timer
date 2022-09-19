# PomodoroTimer

Pomodoro timer for Mac.

![node.js](https://github.com/um7a/pomodoro_timer/actions/workflows/node.js.yml/badge.svg?branch=main)
![daily_build](https://github.com/um7a/pomodoro_timer/actions/workflows/daily_build.yml/badge.svg?branch=main)

<div align="center">
  <img src="https://github.com/um7a/pomodoro_timer/raw/v0.4.1/docs/pomodoro_timer_on_desktop.png" width="500px">
</div>

## Install

If you use intel mac, you can download PomodoroTimer.app from [Release](https://github.com/um7a/pomodoro_timer/releases) page.  
Or you can also build PomodoroTimer.app for both intel mac and apple silicon mac from source code. **(Building from source code is recomended.)**

## Uninstall

You can uninstall this app by deleting PomodoroTimer.app file and remove the following directory.

```
$ rm -r ~/.pomodoroTimer
```

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

### Project setup

```bash
$ npm install
```

### Compile app

- for x64

```bash
$ npm run build:x64
```

Compiled app is in `dist/mac/`.

- for arm64

```bash
$ npm run build:arm64
```

Compiled app is in `dist/mac-arm64/`.

## Other commands

The following commands are useful when you edit the source code.

### Execute test

```bash
$ npm run test
```

### Compiles and start for development

```bash
$ npm run start
```
