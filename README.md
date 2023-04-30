# PomodoroTimer

Pomodoro timer for Mac.

![node.js](https://github.com/um7a/pomodoro_timer/actions/workflows/node.js.yml/badge.svg?branch=main)
![daily_build](https://github.com/um7a/pomodoro_timer/actions/workflows/daily_build.yml/badge.svg?branch=main)

<div align="center">
  <img src="https://github.com/um7a/pomodoro_timer/raw/main/docs/pomodoro_timer_on_desktop.png" width="500px">
</div>

- [1. Install](#1-install)
- [2. Uninstall](#2-uninstall)
- [3. Build](#3-build)
  - [3.1. Prerequisites](#31-prerequisites)
  - [3.2. Download the source code](#32-download-the-source-code)
  - [3.3. Project setup](#33-project-setup)
  - [3.4. Compile app](#34-compile-app)
    - [3.4.1. Compile app for x64](#341-compile-app-for-x64)
    - [3.4.2. Compile app for arm64](#342-compile-app-for-arm64)
- [4. Other commands](#4-other-commands)
  - [4.1. Execute test](#41-execute-test)
  - [4.2. Compiles and start for development](#42-compiles-and-start-for-development)

## 1. Install

If you use intel mac, you can download PomodoroTimer.app from [Release](https://github.com/um7a/pomodoro_timer/releases) page.  
Or you can also build PomodoroTimer.app for both intel mac and apple silicon mac from source code. **(Recomended)**

## 2. Uninstall

You can uninstall this app by the following steps.

1. Delete PomodoroTimer.app file.
2. Remove the following directory.

```
$ rm -r ~/.pomodoroTimer
```

## 3. Build

You can build PomodoroTimer.app from source code by the following steps.

### 3.1. Prerequisites

- git
- node
- npm

### 3.2. Download the source code

```bash
$ git clone https://github.com/um7a/pomodoro_timer.git
$ cd pomodoro_timer
```

### 3.3. Project setup

```bash
$ npm install
```

### 3.4. Compile app

#### 3.4.1. Compile app for x64

```bash
$ npm run build:x64
```

Compiled app is in `dist/mac/`.

#### 3.4.2. Compile app for arm64

```bash
$ npm run build:arm64
```

Compiled app is in `dist/mac-arm64/`.

## 4. Other commands

The following commands are useful when you edit the source code.

### 4.1. Execute test

```bash
$ npm run test
```

### 4.2. Compiles and start for development

```bash
$ npm run start
```
