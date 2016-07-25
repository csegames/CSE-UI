# Camelot-Unchained
UI repository for Camelot Unchained, a tri-realm RvR MMORPG.

## Requires
* NodeJS 6.x.x or higher

## Private Registry
This project requires that you install and build off a private NPM registry. The registry is found at http://registry.camelotunchained.com:1337.  You can set up your project to use the custom registry with the follow command.

### Configure Registry
```
npm set registry http://registry.camelotunchained.com:1337
```

Create a user for the private CU registry with the command
```
npm adduser --registry http://registry.camelotunchained.com:1337
```


### Revert Registry setting
To change your registry back to the default NPM registry run this command:
```
npm set registry https://registry.npmjs.org
```

## Directory Structure
 
```
game\       -- In-game UI modules
library\    -- NPM published client library package `camelot-unchained` on npm
patcher\    -- Client patcher UI
web\        -- Website projects
tools\      -- Tools to assist with development
shared\     -- Contains shared items that are used within multiple categories (ie. web & patcher & in-game)
  | components\     -- React components that have no session state / do not use redux, can contain sub-components
  | widgets\        -- React components that have session state, use redux, can contain child widgets and child components

``` 

## Compilation
Each category has projects that handle their own compilation, please see the README within each section for instructions on that particular project.
