# Debugging the UI

### <ins>How to get the Coherent Debugger</ins>
You need to follow these steps on every channel you are trying to use the debugger with.

1. Open up a file explorer and go to where the game is installed. e.g. `%programdata%\CSE\Camelot Unchained\bin\4\Client` would be Hatchery.
2. In a separate file explorer, go into the `UI/CoherentDebugging` folder in Avalon (if you are part of ModSquad, ask a CSE employee to help you with this process)
3. Under the `ResourcesNeeded/` folder, you will find 3 things. `CoherentDebugger.zip`, `CoherentUIGTDevelopment.dll`, and `inspector.zip`
	- Copy, paste, and extract the CoherentDebugger.zip to a place on your PC (e.g. Desktop).
	- Copy, paste, and extract the inspector.zip to where the game is installed (in the same directory as the Client.exe)
	- Copy and paste the CoherentUIGTDevelopment.dll to where the game is installed (in the same directory as the Client.exe)
4. Launch the client and run the `Debugger.exe` found in the extracted `CoherentDebugger` folder.
5. Choose which project you want to debug (e.g. hud-new, loadingscreen-new, worldspace, etc.)

The debugger is similar to the webkit debugger.

More documentation can be found on how to actually use the debugger here [https://coherent-labs.com/Documentation/cpp-gt/dd/d68/debugging.html#Debugger](https://coherent-labs.com/Documentation/cpp-gt/dd/d68/debugging.html#Debugger)