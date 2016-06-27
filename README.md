# Camelot-Unchained
UI repository for Camelot Unchained, a tri-realm RvR MMORPG.

## Directory Structure
 
```
game\       -- In-game UI modules
library\    -- NPM published client library package `camelot-unchained` on npm
patcher\    -- Client patcher UI
web\        -- Website projects
shared\     -- Contains shared items that can be used with multiple categories (ie. web & patcher & in-game)
  | components\     -- React components that have no session state / do not use redux, can contain sub-components
  | widgets\        -- React components that have a session state, use redux, can contain child widgets and child components

``` 

## Compilation
Each category contains projects that handle their own compilation, please see the README within each section for instructions on that particular project.

## Library Definitions
Are uploaded to git on the definitions branch to be referenced through Typings. To compile them run the command `npm run definitions -- remote`. With remote being the remote repository to push to, ie. master.