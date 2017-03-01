# HUD Module

The primary HUD elements for Camelot Unchained's in-game UI.

## Requires

* NodeJS 7.4.x

## Building

1. Navigate to the HUD module directory
    ```sh
    cd game/hud
    ```

1. Install npm packages.
    ```sh
    npm i
    ```

1. Now you can build the module, which has several options. You can view available options by running `npm start` to get help text.

    1. **Dev** - Will run the module in development mode, this will start a live reload server, open your browser to a localhost development address, and watch the source code directories for changes. In dev mode, a build will be triggered whenever you make a change to a source file and it will automatically reload the web page preview.
        ```sh
        npm start dev
        ```

    1. **Build** - Builds the project. Outputs to `dist/`, not very useful on it's own
        ```sh
        npm start build 
        ```

    1. **Build:Hatchery** - Builds and then copies the build output to the UI module override directory for any game client running on channel 4 (named Hatchery). This is the server / client channel that is used for Internal Testing. The override directory can be found at `%localappdata%\CSE\CamelotUnchained\4\INTERFACE\` Using this command you can then run the game client from the patcher on the correct channel / server and see the result live in the game client.
        ```sh
        npm start build.hatchery
        ```

    1. **Build:Wyrmling** - Like `build:hatchery` except will output to channel 10 (named Wyrmling).  This is the server / client typically used for alpha / beta tests.
        ```sh
        npm start build.wyrmling
        ```

    1. **Build:Cube** - Like `build:hatchery` except will output to channel 27 (named CUBE).  This is the CUBE client channel which has a slightly modified client specifically for CUBE.
        ```sh
        npm start build.cube
        ```

