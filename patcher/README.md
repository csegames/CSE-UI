cu-patcher-ui
=============

> Camelot Unchained Patcher UI

---
*Notice: This project is currently under heavy development and is not guaranteed to be in a working state as this time.  This notice will be removed when the library is stable.*

Installation
------------
### 1. clone this repository
```
git clone https://github.com/CUModSquad/cu-patcher-ui.git
```

### 2. Install
```sh
npm install
typings install
```

### 3. Build
Windows:
```sh
npm run build
```
OSX/Linux:
```sh
npm run build:nix
```

### 4. Serve
```sh
npm run serve
```

### 5. Preview
Navigate to http://localhost:9000

### 6. Testing with Live Patcher
1. Make a link (junction) named PatchClient in the local repository folder.

      ```
      C:
      CD \path-to\your-git-clone
      mklink /j PatchClient C:\path-to\game-install
      ```

2. Build the patcher using `````npm run debug````` to compile the UI and run it in the live patcher.

Software Requirements
---------------------
- Git
- NodeJs 5.x.x
- NPM 3.5.x
