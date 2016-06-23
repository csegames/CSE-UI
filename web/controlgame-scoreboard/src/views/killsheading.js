var React = require('react');
var Filter = require('./filter.js');
var Reflux = require('reflux');
var RouteStore = require('../stores/route.js');

var KillsHeading = React.createClass({
    mixins: [
        Reflux.connect(RouteStore, 'route')
    ],
    getInitialState: function() {
        return { clicked: false, route: RouteStore.route };
    },
    render: function() {
        var filter = this.props.filter,
            route = this.state.route,
            element,
            className = [];
        if (filter && filter.key && filter.values.length) {
            if (this.state.clicked) {
                element = (<Filter filter={filter}/>);
            }
            className.push('has-filter');
            if (filter.key === route.filter) {
                className.push('is-on');
            }
        }
        if (this.props.className) {
            className.push(this.props.className);
        }
        return (
            <span className={className.join(' ')} style={{ width: this.props.width }} onClick={this.onclick}>
                {this.props.title}
                {element}
            </span>
        );
    },

    onclick: function() {
        if (this.props.filter) {
            this.setState({ clicked: !this.state.clicked });
        }
    }
});

module.exports = KillsHeading;
