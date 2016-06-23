var React = require('react');

var KillsRow = React.createClass({
    render: function() {
        var rest, cols = [], columns = this.props.columns;
        if (columns) {
            for (var i = 0; i < columns.length; i++) {
                var value, props = this.props, info = props.info, player = info.player;
                switch(columns[i].title) {
                    case "Rank": value = props.rank; break;
                    case "Name": value = props.name; break;
                    case "Realm": value =player.faction; break;
                    case "Race": value = player.race; break;
                    case "Arch.": value = player.archetype; break;
                    case "Kills": value = info.kills.length; break;
                    case "Deaths": value = info.deaths.length; break;
                    case "KDR":
                        var kills = info.kills, deaths = info.deaths;
                        value = deaths.length ? (kills.length/deaths.length).toFixed(2) : kills.length.toFixed(2);
                        break;
                }
                var col = (<span className={columns[i].className} style={{ width: columns[i].width }}>{value}</span>);
                cols.push(col);
            }
        }
        return (
            <div className={'row ' + this.props.rank}>
                {cols}
            </div>
        );
    }
});

module.exports = KillsRow;
