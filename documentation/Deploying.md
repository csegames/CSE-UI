[Back to Main](../README.md)

# Deploying the Game UI

## Prerequisites

You must have the main repository cloned onto your computer.

## Deploying Camelot Unchained UI

1. [Build the game UI](Building.md)
2. Open 2 file explorers
3. In one of them, navigate to `mainrepo\MMO\Client\CamelotUnchainedUI\interface`
4. In the other, navigate to `uirepo\camelot\dist`
5. Delete all files in `mainrepo\MMO\Client\CamelotUnchainedUI\interface`
6. Copy and paste the UI repo files inside of the (now empty) main repository files
7. Commit and push changes to main repo

## Deploying Final Stand: Ragnarok UI

1. [Build the game UI](Building.md)
2. Open 2 file explorers
3. In one of them, navigate to `mainrepo\MMO\Client\ColossusUI\interface`
4. In the other, navigate to `uirepo\colossus\dist`
5. Delete all files in `mainrepo\MMO\Client\ColossusUI\interface`
6. Copy and paste the UI repo files inside of the (now empty) main repository files
7. Commit and push changes to main repo

# Deploying the Launcher UI

The built launcher UI is located at `uirepo\launcher\dist` (there may be log files in there that should not be copied).

For UCE employees, see the instructions at https://docs.google.com/document/d/1dshPdkqrfcLXt85DevTi13sTU24B865GPEnNusLUpuM/edit?usp=sharing for how to distribute updates.