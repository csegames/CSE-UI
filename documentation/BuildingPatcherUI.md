# Building the Patcher UI
### <ins>Prerequisites</ins>
* Ensure you have **Node** installed
* Ensure you have the patcher already setup on your computer

### <ins>How to build a freshly cloned Patcher UI Repo</ins>
*Note: If you have done steps 1 and steps 2 already to build the CU or FSR UI, then skip to Step 3.*

#### Step 1: Get yarn
1. Ensure you have node installed on your computer by entering `node -v`
	- If you get "node is not recognized as an internal or external command" you must install node. If you think you have already installed node, try restarting the terminal to see if that fixes the issues
2. Run `npm install yarn -g`
3. Ensure you have yarn installed on your computer by entering `yarn -v`
  

#### Step 2: Setup *library*
1) Go into the **library/** folder in the terminal
2) Run `yarn` (Only need to do the first time)
3) Run `yarn build`
4) Run `yarn link` (Only need to do the first time)
5) --- Going forward, you only need to `yarn build` to update the library code.

#### Step 3: Make a junction / symlink to the root patcher directory
1) Go into the **patcher/** folder in the terminal
2) Run `mklink /j PatchClient "%programdata%\CSE\Camelot Unchained"` (*The default CU install is located at %programdata%\CSE\Camelot Unchained*)

#### Step 4: Setup patcher and build
1) In the patcher directory, run `yarn`
2) Run `yarn link @csegames/library`
3) Build the patcher by using...
	* `yarn start debug` to run the UI as a development build
	* `yarn start debugProduction` to run the UI as a production build