# Testing the Game UI

### <ins>Seeing your builds in-game</ins>

_If you want to refresh your build from inside a match after you have loaded, you can use `/reloadui` from the chat box to do so._

#### From the launcher UI (when using the patcher)

1. Confirm that the appropriate UI has been built following the instructions [here](Building.md).
2. Inside the project directory should now be a folder called `dist`. Copy the path for that folder to your clipboard. (e.g. `uirepo\colossus\dist`)
3. Start the launcher and select the shard you want to use for testing (both CU and FSR shards work with this process)
4. Hold down the Alt key when clicking the `Play` button to bring up a command line option dialog box
5. Inside the dialog box append `uiOverrideDirectory="<your pasted dist path>\<" overrideUI=1` to any other changes you've made (the quotes are important if you have a space in your path)

#### From Visual Studio

1. Confirm that the appropriate UI has been built following the instructions [here](Building.md).
2. Inside the project directory should now be a folder called `dist`. Copy the path for that folder to your clipboard. (e.g. `uirepo\colossus\dist`)
3. Modify the debug command line with the following additional parameters: `uiOverrideDirectory="<your pasted dist path>" overrideUI=1` (the quotes are important if you have a space in your path)
