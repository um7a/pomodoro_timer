# PomodoroTimer
Pomodoro timer for Mac.


## Project setup
```bash
$ npm install
```

## Lints files
```bash
$ npm run lint
```

## Compiles and hot-reloads for development
```bash
$ npm run electron:serve
```

## Compile production electron app
* For Intel CPU.
Compile app for Intel Mac.  
```bash
$ npm run electron:build -- --x64 --mac
```
Compiled app is in `dist_electron/mac/`.


* For Apple silicon Mac.
Compile app for Apple silicon Mac.  
```bash
$ npm run electron:build -- --arm64 --mac
```
Compiled app is in `dist_electron/mac-arm64/`.