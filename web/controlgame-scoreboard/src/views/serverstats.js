var React = require('react');
var Reflux = require('reflux');
var RouteHandler = require('react-router').RouteHandler;
var Rest = require('../lib/cu-rest.js');

// Datastores
var ScoreStore = require('../stores/score.js');
var PopulationStore = require('../stores/population.js');
var KillsStore = require('../stores/kills.js');
var RouteStore = require('../stores/route.js');

// Views
var GameState = require('./gamestate.js');
var GameStats = require('./gamestats.js');
var Leaderboard = require('./leaderboard.js');

var ServerStats = React.createClass({
    mixins: [
        Reflux.connect(ScoreStore, 'score'),
        Reflux.connect(PopulationStore, 'population'),
        Reflux.connect(KillsStore, 'leaderboard'),
        Reflux.connect(RouteStore, 'route')
    ],
    getInitialState: function() {
        return {
            mode: "leaderboards",
            events: {},
            population: { tdd: 0, arthurian: 0, viking: 0 },
            score: {
                tdd: 0, arthurian: 0, viking: 0,
                game: { countdown: 0 }
            },
            leaderboard: {
                kills: [],
                deaths: []
            },
            route: RouteStore.route || { server: "", mode: "" }
        };
    },
    getGameStateText: function() {
        var game = this.state.score.game;
        if (game) {
            switch(game.type) {
                case "offline":
                    return 'Offline';
                case "inactive":
                    return 'Game is Inactive';
                case "waiting":
                    return 'Waiting for Next Round';
                case "basic": case "advanced":
                    return 'Round In Progress';
            }
        }
        return "";
    },
    render: function() {
        var state = this.state, route = state.route,
            population = state.population,
            game = state.score.game,
            count = population.arthurian + population.tdd + population.viking,
            remain = game.countdown|0;
        remain = ((remain/60)|0) + ' min. ' + (remain%60) + ' sec.';
        return(
            <div className="server-stats">
                <GameState state={this.getGameStateText()} remain={remain} count={count}/>
                <GameStats score={this.state.score} population={this.state.population}/>
                <Leaderboard mode={route.mode} kills={this.state.leaderboard.kills} deaths={this.state.leaderboard.deaths}/>
            </div>
        );
    }
});

module.exports = ServerStats;
