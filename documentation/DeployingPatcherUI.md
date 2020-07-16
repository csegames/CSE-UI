# Deploying the Patcher UI with Jenkins

### <ins>Prerequisites</ins>
* Ensure you have **Node** installed
* Ensure you have the patcher already setup on your computer

### <ins>How to build a freshly cloned Patcher UI Repo</ins>
*Note: If you have done steps 1 and steps 2 already to build the CU or FSR UI, then skip to Step 3.*

#### Step 1: Build the UI
1. In the patcher/ directory, run `yarn start debugProduction`

#### Step 2: Get patcher UI build onto Avalon
1. Go to `repo\patcher\PatchClient\cpui` and zip the `ui` folder
2. Go to your avalon user folder, and copy and paste this zip folder to it.
3. Extract the zip folder in your user avalon folder
4. Rename the extracted folder to something describing what the folder accomplished. (e.g. patcher-fixBug)

#### Step 3: Deploy the build through Jenkins
1. Go to Jenkins
2. Click on the `Patcher` tab
3. Click on `Patch UI Deploy`
4. Click on `Build with Parameters`
5. In the CLIENTTOSERVER field, select `CLIENT`
6. In the ROOTPATH field, write the path of the extracted folder on avalon (e.g Z:\users\username\patcher-fixBug)
7. In the CHANNEL field, select one of the following:
	* `12` (**Dev Patcher UI**): This channel is only used by devs. This is a good place to test changes which might be unstable or break backwards compatibility.
	* `11` (**Experimental Patcher UI**): This channel is used by the whole studio. We use it to test the UI internally before releasing a new version.
	* `1` (**Live Patcher UI**): This is the channel used by real customers. **Make sure your build has been thoroughly tested on experimental and that you coordinate with leads before deploying to this channel!**
8. Deselect DRYRUN
9. Click Build. Once the build is finished in Jenkins, just start up your patcher and you will see updates. The `uiChannel` commandline setting controls which channel the patcher will use.
