# Building the UI



### <ins>Prerequisites</ins>
Ensure you have *Node* installed (https://github.com/coreybutler/nvm-windows is a good tool for installing node and dealing with different versions.) Refer to InstallingNode documentation.


### <ins>How to build a freshly cloned Camelot Unchained UI Repo</ins>



#### Step 1: Get yarn
1. Ensure you have node installed on your computer by entering `node -v`
  - If you get "node is not recognized as an internal or external command" you must install node. If you think you have already installed node, try restarting the terminal to see if that fixes the issue.
2. Run `npm install yarn -g`
3. Ensure you have yarn installed on your computer by entering `yarn -v`



#### Step 2: Setup *library*
1. Go into the **library/** folder in the terminal
2. Run `yarn` (Only need to do the first time)
  - If you fail to run yarn and see an error talking about "unexprected end of file" for some node module, then just try to `yarn` again.  There is an issue where the yarnpkg server closes connections. [https://github.com/yarnpkg/yarn/issues/7521](https://github.com/yarnpkg/yarn/issues/7521)
3. Run `yarn start build`
  - If you fail to build because of some definitions, a quick workaround would be to revert git changes to the definitions.ts and try building again. The real workaround would be to fix the typescript generation on the API server.
4. Run `yarn link` (Only need to do the first time)
5. --- Going forward, you only need to `yarn start build` to update the library code.



#### Step 3: Setup *hud*
1. Go into the **game/camelotunchained/hud/** folder in the terminal
2. Run `yarn`
  - If you fail to run yarn and see an error talking about "unexprected end of file" for some node module, then just try to `yarn` again.  There is an issue where the yarnpkg server closes connections. [https://github.com/yarnpkg/yarn/issues/7521](https://github.com/yarnpkg/yarn/issues/7521)
4. Go up 2 folders to **game/**
5. Run `yarn` again
6. Run `yarn link @csegames/library`
7. Run `yarn start build.cuhud`
8. --- Going forward, you only need to `yarn start build.cuhud` inside of the game/ folder to update the hud code.

  

#### Step 4: Setup *loadingScreen*
1. Go into the **game/camelotunchained/loadingScreen/** folder in the terminal
2. Run `yarn`
  - If you fail to run yarn and see an error talking about "unexprected end of file" for some node module, then just try to `yarn` again.  There is an issue where the yarnpkg server closes connections. [https://github.com/yarnpkg/yarn/issues/7521](https://github.com/yarnpkg/yarn/issues/7521)
4. Go up 2 folders to **game/**
5. Run `yarn start build.cuhud.loadingScreen`
6. --- Going forward, you only need to `yarn start build.cuhud.loadingScreen` inside of the game/ folder to update the loadingScreen code.

  

### <ins>How to build a freshly cloned Final Stand: Ragnarok UI Repo</ins>

  

#### Step 1: Do step 1 and step 2 from above if you have not already done so. If you have, skip this step.

  

#### Step 2: Setup *hud*
1. Go into the **game/hordetest/hud** folder in the terminal
2. Run `yarn`
  - If you fail to run yarn and see an error talking about "unexprected end of file" for some node module, then just try to `yarn` again.  There is an issue where the yarnpkg server closes connections. [https://github.com/yarnpkg/yarn/issues/7521](https://github.com/yarnpkg/yarn/issues/7521)
4. Go up 2 folders to **game/**
5. Run `yarn` again
6. Run `yarn link @csegames/library`
7. Run `yarn start build.hordetest`
8. --- Going forward, you only need to `yarn start build.hordetest` inside of the game/ folder to update the hud code.

  

#### Step 3: Setup *loadingScreen*
1. Go into the **game/hordetest/loadingScreen** folder in the terminal
2. Run `yarn`
  - If you fail to run yarn and see an error talking about "unexprected end of file" for some node module, then just try to `yarn` again.  There is an issue where the yarnpkg server closes connections. [https://github.com/yarnpkg/yarn/issues/7521](https://github.com/yarnpkg/yarn/issues/7521)
3. Run `yarn link @csegames/library`
4. Go up 2 folders to **game/**
5. Run `yarn start build.hordetest.loadingScreen`
6. --- Going forward, you only need to `yarn start build.hordetest.loadingScreen` inside of the game/ folder to update the loadingScreen code.

  

#### Step 4: Setup *worldspace-ui*
1. Go into the **game/hordetest/worldspace-ui** folder in the terminal
2. Run `yarn`
  - If you fail to run yarn and see an error talking about "unexprected end of file" for some node module, then just try to `yarn` again.  There is an issue where the yarnpkg server closes connections. [https://github.com/yarnpkg/yarn/issues/7521](https://github.com/yarnpkg/yarn/issues/7521)
3. Run `yarn link @csegames/library`
4. Go up 2 folders to **game/**
5. Run `yarn start build.hordetest.worldspace`
6. --- Going forward, you only need to `yarn start build.hordetest.worldspace` inside of the game/ folder to update the worldspace code.

  

### <ins>Seeing your builds in-game</ins>

  

Builds are outputted to folders within the **repo/game/build/** folder. All of the projects follow the same pattern.

  

*To see the updates, reload your UI in-game by using the slash command `/reloadui`. Slash commands can be typed in the chat. The only exception to this at the time of writing this is the worldspace-ui*

  

#### CU

1) Open file explorer
2) Hop on Hatchery (or any CU server... these instructions are for Hatchery which is channel 4)
3) Go to `%localappdata%\CSE\CamelotUnchained\4\INTERFACE\` (If you don't have an INTERFACE folder, just create one).
  - To update the **hud**, put the contents of `repo/game/build/camelotunchained/hud/` into `%localappdata%\CSE\CamelotUnchained\4\INTERFACE\hud-new`.
  - To update the **loadingScreen**, put the contents of `repo/game/build/camelotunchained/loadingScreen/` into `%localappdata%\CSE\CamelotUnchained\4\INTERFACE\loadingscreen-new`.
4) Reload your UI to see updates.

  

#### FSR

1) Open file explorer
2) In the patcher, select/create a character on Omelette (or any FSR server)
3) Alt+Click the Play, a dialog box should popup.
4) Type `uiOverrideDirectory=yourOverrideDirectory overrideUI=1` An example of yourOverrideDirectory would be `C:\Users\testuser\AppData\Local\CSE\FinalStand\Ragnarok\2100`. *Ensure there are no spaces in the override directory file path, otherwise, it won't work.*
5) Click ok and hop onto Omelette (or any FSR server)
6) Now, go to your override directory, inside the `INTERFACE/` folder (If you don't have an INTERFACE folder, just create one).
  - To update the **hud**, put the contents of `repo/game/build/hordetest/hud` into `yourOverrideDirectory/INTERFACE/hud-new`.
  - To update the **worldspace-ui**, put the contents of `repo/game/build/hordetest/worldspace-ui` into `yourOverrideDirectory/INTERFACE/worldspace-new`.
  - To update the **loadingScreen** put the contents of `repo/game/build/hordetest/loadingScreen` into `yourOverrideDirectory/INTERFACE/loadingScreen`.
7) Reload your UI to see updates (Except for worldspace-ui, you must relaunch your client)