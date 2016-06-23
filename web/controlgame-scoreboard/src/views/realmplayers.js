var React = require('react');

var RealmPlayers = React.createClass({
    render: function() {
        return (<div className="players">{this.props.players} players</div>);
    }
});module.exports = RealmPlayers;