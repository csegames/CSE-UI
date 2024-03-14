[Back to Main](../README.md)

# Prerequisites

Ensure you have **Node 10.19** installed by following the steps in the [Installing Node](./InstallingNode.md) documentation.

# Building the Game UI

## Step 1: Build the library

1. Go to the `library/` folder in the terminal
2. Run `npm ci` (Only need to do this after pulling new code)
3. Run `npm pack`

## Step 2: Build the project you want to work on

1. Go to the project folder in the terminal:
   - Camelot Unchained is at `camelot/`
   - Final Stand: Ragnarok is at `colossus/`
2. Run `npm ci` (Only need to do this after pulling new code)
3. Run `npm run build`

# Building the Launcher UI

## Step 1: Build the launche project
1. Go to the `launcher/` project folder in the terminal
2. Run `npm ci` (Only need to do this after pulling new code)
3. Run `npm run build`
