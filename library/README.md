camelot-unchained
=======

> Camelot Unchained Client Library

---
*Notice: This library is under heavy development and is not guaranteed to be in a working state as this time.  This notice will be removed when the library is stable.*

##### [Documentation / Wiki](https://github.com/csegames/Camelot-Unchained-Client-Library/wiki)

---

Installation
------------

You can install the package as a npm package

```
npm install camelot-unchained
```

Usage
---------

Within a CU UI Component be sure to run 'tsd link' after installing cu-core so that the definition file reference is added to tsd.d.ts.

```javascript
import {race, channelId} from 'camelot-unchained';
console.log('Strm is #' + race.STRM);
console.log('Hatchery is channel #' + channelId.HATCHERY);
```


Development
-----------

Clone the Repository and run:

```
npm install
gulp install
```

Build using gulp

```
gulp build
```

or for builds as you develop

```
gulp
```
