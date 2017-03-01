# Camelot-Unchained

UI repository for [Camelot Unchained](http://camelotunchained.com/v3/).

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

## Private Registry

This project requires that you install and build npm packages from a private NPM registry. The registry is found at http://registry.camelotunchained.com:4873. .npmrc files are included alongside each npm project.json file so no setup is needed if you are just installing and building this project. If you are going to publish packages, talk to [@codecorsair](https://github.com/codecorsair) to get a user account set up on the registry.

