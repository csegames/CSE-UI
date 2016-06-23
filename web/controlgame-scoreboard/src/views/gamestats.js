var React = require('react');

// Views
var RealmScore = require('./realmscore.js');

var GameStats = React.createClass({
    render: function() {
        return (
            <div className="realm-scores">
                <RealmScore
                    realm="tdd" title="Tuatha De Danann"
                    score={this.props.score.tdd}
                    players={this.props.population.tdd}
                    />
                <RealmScore
                    realm="arthurian" title="Arthurians"
                    score={this.props.score.arthurian}
                    players={this.props.population.arthurian}
                    />
                <RealmScore
                    realm="viking" title="Vikings"
                    score={this.props.score.viking}
                    players={this.props.population.viking}
                    />
            </div>
        );
    }
});

module.exports = GameStats;
