var React = require('react');
var Reflux = require('reflux');
var RouteStore = require('../stores/route.js');
var Link = require('react-router').Link;

var Filter = React.createClass({
    mixins: [
        Reflux.connect(RouteStore, 'route')
    ],
    getInitialState: function() {
        return { route: RouteStore.route };
    },
    render: function() {
        var opts = [],
            filter = this.props.filter,
            route = this.state.route;

        // If filter actice, add option to remove it
        if (route.filter === filter.key) {
            opts.push(<li className="clear"><Link to="go" params={{
                    server: route.server,
                    mode: route.mode
            }}>( off )</Link></li>);
        }

        // Add each distinct time to the filter menu
        for (var i = 0; i < filter.values.length; i++) {
            opts.push(<li><Link to="filter" params={{
                server: route.server,
                mode: route.mode,
                filter: filter.key,
                value: filter.values[i]
            }}>{filter.values[i]}</Link></li>)
        }

        // Render the filter menu
        return (
            <ul className="filter">
            {opts}
            </ul>
        );
    }
});

module.exports = Filter;
