# Camelot-Unchained

UI repository for Camelot Unchained, a tri-realm RvR MMORPG.

## Requires

* NodeJS 7.4.x

## Directory Structure

```sh
game\       -- In-game UI modules
library\    -- NPM published client library package `camelot-unchained` on npm
patcher\    -- Client Patcher UI
web\        -- Website projects
tools\      -- Tools to assist with development
widgets\    -- Standalone projects that are built to be shared and used within multiple other projects or externally. These widgets are published to the CU Private Registry.
shared\     -- Contains shared items that are used within multiple categories (ie. web & patcher & in-game)
  | components\     -- React components that have no session state / do not use redux, can contain sub-components

```

## Building Projects

This project is split up into multiple sub projects, each as their own private npm package which must be compiled individually. For example, if you would like to work on the HUD UI module your process would be:

1. Navigate to the HUD module directory
    ```sh
    cd game/hud
    ```

1. Install npm packages.  (Ensure you've already set up the correct registry, *see above*)
    ```sh
    npm i
    ```

1. Now you can build the module, which has several options.

    1. **Publish** - Will build the module ready to be deployed into the game client.  Outputs to `dist/`
        ```sh
        npm run publish
        ```

    1. **Dev** - Will run the module in development mode, this will start a live reload server, open your browser to a localhost development address, and watch the source code directories for changes. In dev mode, a build will be triggered whenever you make a change to a source file and it will automatically reload the web page preview.
        ```sh
        npm run dev
        ```

    1. **Build** - Builds the project. Outputs to `dist/`, not very useful on it's own
        ```sh
        npm run build 
        ```

    1. **Build:Hatchery** - Builds and then copies the build output to the UI module override directory for any game client running on channel 4 (named Hatchery). This is the server / client channel that is used for Internal Testing. The override directory can be found at `%localappdata%\CSE\CamelotUnchained\4\INTERFACE\` Using this command you can then run the game client from the patcher on the correct channel / server and see the result live in the game client.
        ```sh
        npm run build:hatchery
        ```

    1. **Build:Wyrmling** - Like `build:hatchery` except will output to channel 10 (named Wyrmling).  This is the server / client typically used for alpha / beta tests.
        ```sh
        npm run build:wyrmling
        ```

    1. **Build:Cube** - Like `build:hatchery` except will output to channel 27 (named CUBE).  This is the CUBE client channel which has a slightly modified client specifically for CUBE.
        ```sh
        npm run build:cube
        ```

## Private Registry

This project requires that you install and build npm packages from a private NPM registry. The registry is found at http://registry.camelotunchained.com:4873. .npmrc files are included with each project so no setup is needed if you are just installing and building this project. If you are going to publish packages, talk to @codecorsair to get a user account set up on our registry.

