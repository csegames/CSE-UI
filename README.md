# Camelot-Unchained
UI repository for Camelot Unchained, a tri-realm RvR MMORPG.

## Directory Structure
 
```
game\       -- In-game UI modules
library\    -- NPM published client library package `camelot-unchained` on npm
patcher\    -- Client patcher UI
web\        -- Website projects
shared\     -- Contains shared items that are used within multiple categories (ie. web & patcher & in-game)
  | components\     -- React components that have no session state / do not use redux, can contain sub-components
  | widgets\        -- React components that have session state, use redux, can contain child widgets and child components

``` 

## Compilation
Each category has projects that handle their own compilation, please see the README within each section for instructions on that particular project.
