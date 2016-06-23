# Camelot Unchained Game Server Stats

Displays the game score and kill counts for the current game of capture the ducks.

## Installation

    git clone https://github.com/CUModSquad/cu-web-serverstats
    cd cu-web-serverstats
    npm install
    gulp

## Testing

    http://localhost:9000/

## Demo

A work in progress demo can be viewed here: http://tracker.sorcerer.co.uk/gamestats

## Deployment

Copy the contents of the dist folder to your web server.  Either uses as-is with index.html
or include serverstats.css and main.js and Cinzel font in your existing page and define a
div id="server-stats-container" that will contain the content.  Use index.html as reference.

# Todo

- [x] Detect and handle end-game.
- [x] Add routing.  Initially just for server and view selection.
- [ ] Server selection
- [x] Filter by Realm, Race, Archetype
- [ ] Drill down into player stats [ need some graphics! ]

## Routing (goal)

    /gamestats/#<server>/<view>/period/filter/value

Server will select the server to display stats for.
View will be one of "leaderboards", "kills", "deaths" (leaderboards will be the default)
Period would be the time period to show stats for, being "game" (or perhaps "current"), "today", "24h" ...
filter/value are used to filter the tables on a column, such as faction/TDD

## Handling End Game

Kills API polling should stop at game end and start again when game starts.  The exception to this might be when loading the page during waiting or inactive periods, a different time period could be selected (e.g. todays kills)

## Drill down into player stats

The thought here is that when a players name is clicked, an overlay view is presented with details about the player, their kills and their death lists.  Need to sketch up what I think it could look like and the info it could display. This information is made available for each player entry (see src/stores/kills.js) with a pointer back to the players info including kills/deaths list.
