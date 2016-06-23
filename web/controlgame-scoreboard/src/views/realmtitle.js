var React = require('react');

var RealmTitle = React.createClass({
    render: function() {
        return (<div className="title">{this.props.title}</div>);
    }
});

module.exports = RealmTitle;
