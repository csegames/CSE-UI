var React = require('react');

var RealmPoints = React.createClass({
    render: function() {
        return (
            <div>
            <div className="label">Score</div>
            <div className="points">{this.props.score}</div>
            </div>
        );
    }
});

module.exports = RealmPoints;
