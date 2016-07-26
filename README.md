# Camelot-Unchained
UI repository for Camelot Unchained, a tri-realm RvR MMORPG.

# Requires
* NodeJS 6.x.x or higher

# Private Registry
This project requires that you install and build npm packages from a private NPM registry. The registry is found at http://registry.camelotunchained.com:4873.  You can set up your project to use the custom registry with the follow command.

*I recommend using [nrm](https://www.npmjs.com/package/nrm) to manage the registry changes to make this simpler*

## Configure Registry
```
npm set registry http://registry.camelotunchained.com:4873
```

Login to the private CU registry with the command.
```
npm login --registry http://registry.camelotunchained.com:4873
```
*anonymous read is enabled, you only need an account to publish*


## Revert Registry setting
To change your registry back to the default NPM registry run this command:
```
npm set registry https://registry.npmjs.org
```

# Directory Structure
 
```
game\       -- In-game UI modules
library\    -- NPM published client library package `camelot-unchained` on npm
patcher\    -- Client Patcher UI
web\        -- Website projects
tools\      -- Tools to assist with development
shared\     -- Contains shared items that are used within multiple categories (ie. web & patcher & in-game)
  | components\     -- React components that have no session state / do not use redux, can contain sub-components
  | widgets\        -- React components that have session state, use redux, can contain child widgets and child components

``` 

# Building Projects
This project is split up into multiple sub projects, each as their own private npm package which must be compiled individually. For example, if you would like to work on the HUD UI module your process would be:

1. Navigate to the HUD module directory
    ```
    cd game/hud
    ```

2. Install npm packages.  (Ensure you've already set up the correct registry, *see above*)
    ```
    npm i 
    ```

3. Now you can build the module, which has several options.
    
    1. **Publish** - Will build the module ready to be deployed into the game client.  Outputs to `dist/`
        ```
        npm run publish
        ```
    
    2. **Dev** - Will run the module in development mode, this will start a live reload server, open your browser to a localhost development address, and watch the source code directories for changes. In dev mode, a build will be triggered whenever you make a change to a source file and it will automatically reload the web page preview.
        ```
        npm run dev
        ```
    
    3. **Build** - Builds the project. Outputs to `dist/`, not very useful on it's own
        ```
        npm run build 
        ```
    
    4. **Build:Hatchery** - Builds and then copies the build output to the UI module override directory for any game client running on channel 4 (named Hatchery). This is the server / client channel that is used for Internal Testing. The override directory can be found at `%localappdata%\CSE\CamelotUnchained\4\INTERFACE\` Using this command you can then run the game client from the patcher on the correct channel / server and see the result live in the game client.
        ```
        npm run build:hatchery
        ```
    
    5. **Build:Wyrmling** - Like `build:hatchery` except will output to channel 10 (named Wyrmling).  This is the server / client typically used for alpha / beta tests.
        ```
        npm run build:wyrmling
        ```
    
    6. **Build:Cube** - Like `build:hatchery` except will output to channel 27 (named CUBE).  This is the CUBE client channel which has a slightly modified client specifically for CUBE.
        ```
        npm run build:cube
        ```
    