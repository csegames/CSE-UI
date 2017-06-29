# Camelot Unchained Patch Client UI

## Build Instructions
1. Navigate to the patcher directory.
      ```sh
      cd patcher
      ```
2. Install yarn
      ```
      npm i -g yarn
      ```

3. Install npm packages
      ```sh
      yarn
      ```

4. Build
      ```sh
      npm start build
      ```

## Debugging & Testing within the live Patch Client (Windows Only)
1. Make a junction / symlink named PatchClient in the root patcher directory that points to the root of the Camelot Unchained client install directory. (*The default CU install is located at %programdata%\CSE\Camelot Unchained*)

      ```
      cd patcher
      mklink /j PatchClient "%programdata%\CSE\Camelot Unchained"
      ```

2. Run the debug npm script.  This will build, copy files through the symlink into your live Patch Client directory, then start the patcher with ui output disabled.
      ```sh
      npm start debug
      ```
