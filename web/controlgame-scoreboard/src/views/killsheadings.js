var React = require('react');
var KillsHeading = require('./killsheading.js');

var KillsHeadings = React.createClass({
    render: function() {
        var filter, cols = [], columns = this.props.columns;
        for (var i = 0; i < columns.length; i++) {
            var key = columns[i].filter;
            if (key) {
                filter = {
                    key: key,
                    values: this.props.filters[key]
                };
            } else {
                filter = undefined;
            }
            var col = (<KillsHeading className={columns[i].className} width={columns[i].width} title={columns[i].title} filter={filter}/>);
            cols.push(col);
        }
        return (<div className="heading">{cols}</div>);
    }
});

module.exports = KillsHeadings;
