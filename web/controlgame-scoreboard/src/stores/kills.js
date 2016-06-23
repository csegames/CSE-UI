var Rest = require('../lib/cu-rest.js');
var Reflux = require('reflux');
var ScoreStore = require('../stores/score.js');
var RouteAction = require('../actions/route.js');

var Kills = Reflux.createStore({
    listenables: [ RouteAction ],
    lastGameState: undefined,
    server: undefined,
    fetchFrom: 0,
    cache: [],

    init: function() {
        // Listen to ScoreStore changes
        this.listenTo(ScoreStore, this.trackGameState);
    },

    // Monitor the game state to determine when a round starts and when it ends
    // and start/stop monitoring the kills API as necessary.
    trackGameState: function(args) {
        if (args.game.state != this.lastGameState) {
            var gameStart;
            // new game state, are we moving from waiting to basic or advanced?
            if (this.lastGameState === 1 && args.game.state > 1) {
                // game starting
                gameStart = args.game.now;
                console.log('GAME START ' + (new Date(gameStart)).toISOString());
                this.start(gameStart);
            } else if (args.game.state > 1) {
                // already started, guestimate the game start time
                if (this.server.toUpperCase() === 'WYRMLING') {
                    gameStart = args.game.now - (((3600 - args.game.countdown)|0)*1000);
                } else if (this.server.toUpperCase() === 'HATCHERY') {
                    gameStart = args.game.now - (((6000 - args.game.countdown)|0)*1000);
                }
                console.log('GAME START ' + (new Date(gameStart)).toISOString());
                this.start(gameStart);
            } else if (args.game.state === 1 && this.lastGameState > 1) {
                // game has just finished
                console.log('GAME ENDED');
                this.stop();
            } else {
                // game is not running, we have to wait until game start
                // to start showing kills
                console.log('GAME WAITING TO START');
            }
            this.lastGameState = args.game.state;
        }
    },

    // clear the kills cache
    clearCache: function() {
        this.cache = [];
        this.lastGameState = undefined;
        this.fetchFrom = 0;
    },

    // Listen for route changes, and if the server has changed, reset the
    // kill stats cache
    setRoute: function(route) {
        if (route.server !== this.server) {
            this.reset();
            this.clearCache();
            this.server = route.server;
        }
    },

    // Parse the data from the kills API which is a chronological list of kills
    // since a point in time.  Group the kill details into kills and deaths for
    // each player.  From that, build a list of people with kills, and those with
    // deaths including a count of how many, then sort into ranked order.
    //
    //  leaderboard: {
    //      kills: [
    //          name: "Player Name",
    //          count: 10, // kill count
    //          info: [
    //              killdata, ...       // kill data (kills API record)
    //          ]
    //      ],
    //      deaths: [
    //          name: "Player Name",
    //          count: 10, // death count
    //          info: [
    //              deathdata, ...       // death data (kills API record)
    //          ]
    //      ]
    //  }
    //
    parseKills: function(kills) {
        var players = {};

        // count kills and deaths per player
        for (var i = 0; i < kills.length; i++) {
            var k = kills[i].killer, v = kills[i].victim;
            if (k && v && k.id !== v.id) {        // ignore suicides
                (players[k.name] = players[k.name] || { player: k, kills: [], deaths: [] }).kills.push(kills[i]);
                (players[v.name] = players[v.name] || { player: v, kills: [], deaths: [] }).deaths.push(kills[i]);
            }
        }

        // reset leaderboards (we re-calculate them each time)
        var leaderboard = this.leaderboard = {
            kills: [], deaths: []
        };

        // split players into kills and deaths tables
        for (var name in players) {
            if (players[name].kills.length) {
                leaderboard.kills.push({
                    name: name,
                    count: players[name].kills.length,
                    info: players[name]
                });
            }
            if (players[name].deaths.length) {
                leaderboard.deaths.push({
                    name: name,
                    count: players[name].deaths.length,
                    info: players[name]
                });
            }
        }

        // sort player tables
        function compare(a, b) {
            return b.count - a.count;
        }
        leaderboard.kills.sort(compare);
        leaderboard.deaths.sort(compare);

        // notify listeners
        this.trigger(this.leaderboard);
    },

    // clear kills tables
    reset: function() {
        if (this.leaderboard) {
            this.leaderboard.kills = [];
            this.leaderboard.deaths = [];
            this.trigger(this.leaderboard);
        }
    },

    // Fetch latest kills, and maintain a cache of kills since the last game
    // was started.  Each fetch only fetches kills since the last kill received
    // or from game start if we have no kills yet.
    fetchKills: function() {
        var store = this;
        function rejected(e) {
            // silently ignore
        }

        // add start param
        var q = {};
        if (this.fetchFrom) {
            q.start = (new Date(this.fetchFrom)).toISOString();
            console.log("FETCH TIME " + q.start);
        }

        // run kills query
        Rest.getKills(q).then(function(kills) {
            // workaround bug in kills API returning kills in reverse chronological order
            kills.sort(function (a, b) { return a.time < b.time ? -1 : a.time > b.time ? 1 : 0; });

            // Append the new kills to the kill cache
            store.cache = store.cache.concat(kills);

            // If we have some kills, set fetchFrom to just after the last kill received
            if (store.cache.length) {
                console.log("FIRST KILL " + (new Date(store.cache[0].time)).toISOString());
                console.log("LAST KILL " + (new Date(store.cache[store.cache.length-1].time)).toISOString());
                store.fetchFrom = (new Date(store.cache[store.cache.length-1].time)).valueOf() + 1;
            }

            // Parse kill data
            store.parseKills(store.cache);
        }, rejected);
    },

    // Start monitoring kills
    start: function(start) {
        // reset scores
        this.reset();

        // set start point and clear cache
        this.fetchFrom = start;
        this.cache = [];

        // Make sure interval timer is running
        if (!this.timer) {
            var store = this;
            this.timer = setInterval(function() {
                store.fetchKills();
            }, 10000);

            // fetch data immediately
            store.fetchKills();
        }
    },

    // stop monitoring kills
    stop: function() {
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }
});

module.exports = Kills;
