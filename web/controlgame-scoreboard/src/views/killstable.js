var React = require('react');
var Reflux = require('reflux');

// Stores
var RouteStore = require('../stores/route.js');

// Views
var KillsRow = require('./killsrow.js');
var ShowMore = require('./showmore.js');


var KillsTable = React.createClass({
    mixins: [
        Reflux.connect(RouteStore, 'route')
    ],
    getInitialState: function() {
        return { route: RouteStore.route };
    },
    render: function() {
        var rows = [], data = this.props.data, filter, value;
        if (this.state && this.state.route) {
            filter = this.state.route.filter;
            value = this.state.route.value;
        }
        for (var i = 0; i < data.length && i < 9; i++) {
            var entry = data[i];
            if (filter && value) {
                if (entry.info.player[filter] !== value) continue;
            }
            rows.push(<KillsRow columns={this.props.columns} rank={i+1} name={entry.name} count={entry.count} info={entry.info}/>);
        }
        for (i = rows.length; i < 9; i++) {
            rows.push(<KillsRow/>);
        }
        rows.push(<ShowMore type={this.props.type}/>);
        return (<div className="table">{rows}</div>);
    }
});

module.exports = KillsTable;
