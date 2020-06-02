# Deploying the Patcher UI with Jenkins

### <ins>Prerequisites</ins>
* Ensure you have **Node** installed
* Ensure you have the patcher already setup on your computer

### <ins>How to build a freshly cloned Patcher UI Repo</ins>
*Note: If you have done steps 1 and steps 2 already to build the CU or FSR UI, then skip to Step 3.*

#### Step 1: Build the UI
1) In the patcher/ directory, run `yarn start debugProduction`

#### Step 2: Get patcher UI build onto Avalon
1) Go to `repo\patcher\PatchClient\cpui` and zip the `ui` folder
2) Go to your avalon user folder, and copy and paste this zip folder to it.
3) Extract the zip folder in your user avalon folder
4) Rename the extracted folder to something describing what the folder accomplished. (e.g. patcher-fixBug)

#### Step 3: Deploy the build through Jenkins
1) Go to Jenkins
2) Click on the `Patcher` tab
3) Click on `Patch UI Deploy`
4) Click on `Build with Parameters`
5) In the CLIENTTOSERVER field, select `CLIENT`
6) In the ROOTPATH field, write the path of the extracted folder on avalon (e.g Z:\users\username\patcher-fixBug)
7) In the CHANNEL field, select `11` (Experimental patcher UI)
8) Deselect DRYRUN
9) Click Build. Once the build is finished in Jenkins, just start up your experimental patcher and you will see updates.
