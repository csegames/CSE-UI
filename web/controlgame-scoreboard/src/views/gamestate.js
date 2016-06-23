var React = require('react');

var GameState = React.createClass({
    render: function() {
        var offline = this.props.state === 'Offline' ? ' offline' : 'online';
        return(<div className="game-state">
                <span className="state">Game State: <span className={offline}>{this.props.state}</span></span>
                <span className="time">Time Remaining: {this.props.remain}</span>
                <span className="pop">Current Player Count: {this.props.count}</span>
                </div>
            );
    }
});

module.exports = GameState;
