cu-ui
=====

> Camelot Unchained UI 2.0

This is the repository for the official UI modules in [Camelot Unchained](http://camelotunchained.com).
This is the entire front-end UI for the game, not a partial stripped-down version.
This is what we're going to ship and we will take pull requests from the community seriously.

---

##### [Documentation / Wiki](https://github.com/csegames/cu-ui/wiki)

---

Installation
------------

Clone this repository:

```sh
git clone https://github.com/csegames/cu-ui.git
```

Setup

```sh
#install required global npm packages
npm i -g babel-cli babel-core babel-preset-es2015 node-sass browserify typescript@1.8.0 typings mkdirp http-server

# install development packages
npm install
```

Install & Build UI Modules

```sh
# Install & Build all UI modules
npm start
```

---

Development
-----------

To develop the UI you have the following commands

#### `npm start clean`

This will delete the 'publish' directory.

#### `npm start build`

This will build all the modules into the 'publish' directory.

#### `npm start build.install`

This will run npm install within each module.

#### `npm start build.hatchery`

This will build all the modules into the user-ui override directory for Hatchery. '%localappdata%/CSE/CamelotUnchained/4/INTERFACE'

#### `npm start build.wyrmling`

This will build all the modules into the user-ui override directory for Wyrmling. '%localappdata%/CSE/CamelotUnchained/10/INTERFACE'

#### `npm start build.cube`

This will build all the modules into the user-ui override directory for C.U.B.E. '%localappdata%/CSE/CamelotUnchained/27/INTERFACE'

#### `npm start clean.hatchery`

This will delete the user-ui override directory for Hatchery. '%localappdata%/CSE/CamelotUnchained/4/INTERFACE'


#### `npm start clean.wyrmling`

This will delete the user-ui override directory for Wyrmling. '%localappdata%/CSE/CamelotUnchained/10/INTERFACE'

#### `npm start clean.cube`

This will delete the user-ui override directory for C.U.B.E. '%localappdata%/CSE/CamelotUnchained/27/INTERFACE'

---

Chromium Embedded Framework Version
-----------------------------------

CEF Version: 3  - revision 1749

Chrome Version: 35.0 - build 1916 - patch 138

---

UI Discussions
--------------

For discussion with your fellow intrepid modders, hang out in our backer forums at:

> https://forums.camelotunchained.com/forum/63-ui-modding-api/

Or visit us on the CSE XMPP chat server in the _modsquad room

---

Licensing
---------

The code is licensed under the Mozilla Public License, version 2.0:

> https://www.mozilla.org/MPL/2.0/
