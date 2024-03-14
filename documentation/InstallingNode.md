[Back to Main](../README.md)

# Recommended method for installing Node on Windows

- Get the current version of node in use from the [Building](Building.md) instructions.
- Download and install Node Version Manager from its website: [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
- _If you installed nvm into a path containing spaces_
  - Open up the <code>settings.txt</code> file at your install path
  - _If the <code>root:</code> path has a space_
    1. open a cmd window and cd to the root path
  2.  run <code>dir /x</code> to print the legacy (no-space) name of the path
  3.  paste the friendly path into your <code>settings.txt</code> file
- Open up a terminal and enter the following commands to grab and select the NPM version this repo uses:
  - <code>npm install</code> **&lt;current version&gt;**
  - <code> npm use</code> **&lt;current version&gt;**

You can read more about the issue with NVM here. https://github.com/coreybutler/nvm-windows/issues/405.
