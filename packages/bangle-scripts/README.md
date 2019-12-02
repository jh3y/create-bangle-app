bangle-scripts
==============

CLI for devloping bangle.js apps

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/bangle-scripts.svg)](https://npmjs.org/package/bangle-scripts)
[![Downloads/week](https://img.shields.io/npm/dw/bangle-scripts.svg)](https://npmjs.org/package/bangle-scripts)
[![License](https://img.shields.io/npm/l/bangle-scripts.svg)](https://github.com/jh3y/create-bangle-app/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g bangle-scripts
$ bangle-scripts COMMAND
running command...
$ bangle-scripts (-v|--version|version)
bangle-scripts/0.0.2 darwin-x64 node-v12.10.0
$ bangle-scripts --help [COMMAND]
USAGE
  $ bangle-scripts COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`bangle-scripts start`](#bangle-scripts-start)
* [`bangle-scripts upload`](#bangle-scripts-upload)
* [`bangle-scripts help [COMMAND]`](#bangle-scripts-help-command)

## `bangle-scripts start`

Starts the app development process.

```
USAGE
  $ bangle-scripts start

OPTIONS
  -e, --emulate=emulate  run on electron emulator
```

_See code: [src/commands/start.js](https://github.com/jh3y/create-bangle-app/blob/v0.0.2/src/commands/hello.js)_

## `bangle-scripts upload`

Starts the upload to device process.

```
USAGE
  $ bangle-scripts upload
```

_See code: [src/commands/upload.js](https://github.com/jh3y/create-bangle-app/blob/v0.0.2/src/commands/upload.js)_

## `bangle-scripts help [COMMAND]`

display help for bangle-scripts

```
USAGE
  $ bangle-scripts help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_
<!-- commandsstop -->
