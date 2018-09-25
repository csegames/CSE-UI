# <%= name %> Module

> The primary <%= nameSlug %> elements for Camelot Unchained's in-game UI.


## Requirements

* NodeJS 9.x.x
* Yarn 1.9.x

## Installation

To get started run:

```sh
yarn
```

You will then be ready to develop the <%= name %>.

## Developing In Browser

It is possible to develop parts of the <%= name %> within a local browser,
however some client specific functionality will not work.

Run the following:

```sh
yarn start dev
```

## Developing In CU Client

To develop directly within the client run **one** of the following:

```sh
yarn start dev.hatchery
yarn start dev.fledgling
yarn start dev.hatchery
yarn start dev.wyrmling
yarn start dev.wyrmlingPrep
yarn start dev.nuada
yarn start dev.nuadaPrep
yarn start dev.wolfhere
yarn start dev.cube
```

These command swill start building & watching source files for changes.

The build output will go to `%localappdata%\CSE\CamelotUnchained\?\INTERFACE\<%= nameSlug %>` where `?` depends on
your chosen target e.g. `hatchery` is `4`

When you make a change wait for it to finish compiling and then run `/reloadui <%= nameSlug %>` in the client.

## Single Run Production Builds

It is possible to run a production build, without any watching/reloading.

Here is a full list of available single run production builds:

```sh
yarn start build
yarn start build.browser
yarn start build.hatchery
yarn start build.fledgling
yarn start build.hatchery
yarn start build.wyrmling
yarn start build.wyrmlingPrep
yarn start build.nuada
yarn start build.nuadaPrep
yarn start build.wolfhere
yarn start build.cube
```

## Single Run Development Builds

It is possible to run a development build, without any watching/reloading.

Here is a full list of available single run development builds:

```sh
yarn start build.dev
yarn start build.browser.dev
yarn start build.hatchery.dev
yarn start build.fledgling.dev
yarn start build.hatchery.dev
yarn start build.wyrmling.dev
yarn start build.wyrmlingPrep.dev
yarn start build.nuada.dev
yarn start build.nuadaPrep.dev
yarn start build.wolfhere.dev
yarn start build.cube.dev
```

## Environment Variables

Environment variables are defined in dotenv files `.env`. These variables will be injected
into the build, and can be used to toggle different features.

Dotenv files ending in `.local` are ignored by git, and can be used to override things locally.

For `development` the build system will look for `.env` files in the following order:

```sh
.env.development.local
.env.development
.env.local
.env
```

For `production` the build system will look for `.env` files in the following order:

```sh
.env.production.local
.env.production
.env.local
.env
```

To override environment variables locally, you can make any of the following files:

```
.env.local
.env.development.local
.env.production.local
```

*NOTE: if you make changes to `.env` files you will need to restart any running `dev` commands*
