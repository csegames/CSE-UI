var React = require('reflux');
var Reflux = require('reflux');
var RouteAction = require('../actions/route.js');

var RouteState = Reflux.createStore({
    listenables: [ RouteAction ],
    setRoute: function(params) {
        this.route = {
            server: params.server || "hatchery",
            mode: params.mode || "leaderboards",
            filter: params.filter || "",
            value: params.value || ""
        };
        this.trigger(this.route);
    }
});

module.exports = RouteState;
