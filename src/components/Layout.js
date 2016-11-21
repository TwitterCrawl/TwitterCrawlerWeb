const React = require('react');
var Link = require('react-router').Link;
var Nav = require('./Nav.js');
var Layout = React.createClass({

  render: function () {
    return (
      <body >
        <Nav />
        <main className="app">{this.props.children}</main>
      </body>
    );
  }
});

module.exports = Layout;
