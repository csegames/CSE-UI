var React = require('react');

// Views
var RealmBackground = require('./realmbackground.js');
var RealmPoints = require('./realmpoints.js');
var RealmTitle = require('./realmtitle.js');
var RealmPlayers = require('./realmplayers.js');

var RealmScore = React.createClass({
    render: function() {
        return(
            <div className={"realm-score " + this.props.realm}>
                <RealmBackground realm={this.props.realm}/>
                <RealmTitle title={this.props.title}/>
                <RealmPoints score={this.props.score}/>
                <RealmPlayers players={this.props.players}/>
            </div>
        );
    }
});

module.exports = RealmScore;
