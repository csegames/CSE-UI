var Rest = require('../lib/cu-rest.js');
var Reflux = require('reflux');
var PopulationAction = require('../actions/population.js');

var Population = Reflux.createStore({
    listenables: [ PopulationAction ],
    fetchPopulation: function() {
        var store = this;
        function rejected(e) {
            store._population = {
                arthurian: 0,
                tdd: 0,
                viking: 0
            };
            store.trigger(store._population);
        }
        Rest.getPlayers().then(function(args) {
            store._population = {
                arthurian: args.arthurians,
                tdd: args.tuathaDeDanann,
                viking: args.vikings
            };
            store.trigger(store._population);
        }, rejected);
    }
});

module.exports = Population;
