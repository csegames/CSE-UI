var React = require('react');
var Reflux = require('reflux');
var RouteStore = require('../stores/route.js');
var Link = require('react-router').Link;

var ShowMore = React.createClass({
    mixins: [
        Reflux.connect(RouteStore, 'route')
    ],
    getInitialState: function() {
        return { route: RouteStore.route || { server: "", mode: "" } };
    },
    render: function() {
        var route = this.state.route;
        var link;
        switch(this.props.type) {
            case "detail":
                link = (<Link to="go" params={{ server: route.server, mode: "leaderboards" }}>Show Less</Link>);
                break;
            case "kills":
                link = (<Link to="go" params={{ server: route.server, mode: "kills" }}>Show More</Link>);
                break;
            case "deaths":
                link = (<Link to="go" params={{ server: route.server, mode: "deaths" }}>Show More</Link>);
                break;
        }
        return (
            <div className="row more disable-selection">{link}</div>
        );
    }
});

module.exports = ShowMore;
