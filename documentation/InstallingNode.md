# Different ways to install Node on Windows

* [https://nodejs.org/en/download/](https://nodejs.org/en/download/) - Downloading node from the Windows Installer. This is pretty self-explanatory, the setup guides you through the things you need to know.

* [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows) - NVM stands for Node Version Manager. It's a *tool* to help you with installing and changing different versions of node. This is incredibly helpful if you're trying to ensure your project is compatible with different versions of Node.
	* Once you have nvm installed, open a new terminal. (At the time of writing this documentation, I was using version 10.19.0. You can use any version that is compatible with the project.)
	 ```
	 nvm install 10.19.0
	 nvm use 10.19.0
   ```

	If you run into the issue that seems similar to this
	```
	PS C:\Users\User name> nvm use 10.19.0 exit status 1: 'C:\Users\User' is
	not recognized as an internal or external command, operable program or batch file.
	```
	There is a bug in version the latest version available at the time of writing this documentation where nvm fails to be recognized as an internal or external command if there is a whitespace in the filepath. The solutions is
	```
	Open Cmd, go to the Users directory, type dir /x and you will see the shortened 
	version of the name of the users. (ALEXKA~1 in my case) Inside the nvm installation 
	(AppData\Roaming\nvm in my case) there is a settings file, edit the first line and 
	instead of having the space name put that shortened version and leave the rest the 
	same like this : root: C:\Users\ALEXKA~1\AppData\Roaming\nvm
	```
You can read more about the issue with NVM here. https://github.com/coreybutler/nvm-windows/issues/405.