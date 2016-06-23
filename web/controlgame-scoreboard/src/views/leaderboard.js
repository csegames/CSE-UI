var React = require('react');

// Views
var KillsHeadings = require('./killsheadings.js');
var KillsTable = require('./killstable.js');

var columns = {
    "kills": [
        { title: "Rank", width: 70, className: "rank" },
        { title: "Name", width: 302 },
        { title: "Kills", width: 90, className: "count" }
    ],
    "deaths": [
        { title: "Rank", width: 70, className: "rank" },
        { title: "Name", width: 302 },
        { title: "Deaths", width: 90, className: "count" }
    ],
    "detail": [
        { title: "Rank", width: 70, className: "rank" },
        { title: "Name", width: 320 },
        { title: "Realm", width: 100, filter: "faction" },
        { title: "Race", width: 100, filter: "race" },
        { title: "Arch.", width: 100, filter: "archetype" },
        { title: "Kills", width: 80, className: "count" },
        { title: "Deaths", width: 80, className: "count" },
        { title: "KDR", width: 80, className: "number" }
    ]
};

var Leaderboard = React.createClass({
    getFilters: function(cols, data) {
        // build up distinct values lists for filters (required by headings with filters)
        var filters = {};
        for (var i = 0; i < cols.length; i++) {
            var key = cols[i].filter;
            if (key) {
                var filter = filters[key] = [];
                for (var k = 0; k < data.length; k++) {
                    var v = data[k].info.player[key];
                    if (filter.indexOf(v) === -1) {
                        filter.push(v);
                    }
                }
            }
        }
        return filters;
    },
    render: function() {

        var self = this, title;

        function makeTable(type, mode, data) {
            var layout = mode === 'leaderboards' ? type : 'detail';
            var filters = self.getFilters(columns[layout], data);
            return (
                <div className={'board ' + type + (mode === 'leaderboards' ? ' summary' : ' detail')}>
                    <KillsHeadings columns={columns[layout]} filters={filters}/>
                    <KillsTable type={layout} columns={columns[layout]} data={data} />
                </div>
            );
        }

        // mode is either kills (detail) deaths (detail) or leaderboards (summaries)
        var kills, deaths, mode = this.props.mode;
        if (mode !== 'deaths') {        // kills or leaderboards
            kills = makeTable('kills', mode, this.props.kills);
        }
        if (mode !== 'kills') {
            deaths = makeTable('deaths', mode, this.props.deaths);
        }

        // Create title from mode
        title = mode.length ? mode[0].toUpperCase() + mode.substr(1) : "";

        return (
            <div className="leaderboards">
                <div className="title">{title}</div>
                {kills}
                {deaths}
            </div>
        );
    }

});

module.exports = Leaderboard;
