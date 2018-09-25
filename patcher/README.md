# Patcher

> The Patcher UI


## Requirements

* NodeJS 9.x.x
* Yarn 1.9.x

## Installation

To get started run:

```sh
yarn
```

## Developing

Run the following:

```sh
yarn start dev
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
