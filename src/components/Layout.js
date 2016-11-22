const React = require('react');
var Link = require('react-router').Link;
var Layout = React.createClass({

  render: function () {
    return (
      <body >
        <main className="app">{this.props.children}</main>
      </body>
    );
  }
});

module.exports = Layout;
