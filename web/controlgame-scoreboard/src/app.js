var React = require('react');
var Rest = require('./lib/cu-rest.js');
var ServerStats = require('./views/serverstats.js');
var Score = require('./actions/score.js');
var RouteAction = require('./actions/route.js');
var Population = require('./actions/population.js');

var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var routes = (
    <Route handler={ServerStats} path="/">
        <DefaultRoute handler={ServerStats}/>
        <Route path="/:server" handler={ServerStats} />
        <Route path="/:server/" handler={ServerStats} />
        <Route path="/:server/:mode" handler={ServerStats} name="go" />
        <Route path="/:server/:mode/" handler={ServerStats} />
        <Route path="/:server/:mode/:filter/:value" handler={ServerStats} name="filter" />
        <Route path="/:server/:mode/:filter/:value/" handler={ServerStats} />
    </Route>
);

var App = function(params) {
    this.container = params.container;
    return this;
};

App.prototype.render = function() {
    var container = this.container;
    Router.run(routes, Router.HashLocation, function(Root, state) {
        state.params.server = state.params.server || "hatchery";
        RouteAction.setRoute(state.params);
        console.log('SELECT SERVER ' + state.params.server);
        Rest.selectServer(state.params.server);
        React.render(<Root/>, container);
    });
};

App.prototype.run = function() {

    // Render UI
    this.render();

    // What to do every tick
    function tick() {
        Score.fetchScore();
        Population.fetchPopulation();
    }

    // Start ticks
    tick(); setInterval(tick, 1000);
};

module.exports = App;
