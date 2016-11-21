const React = require('react');
var Link = require('react-router').Link;
var Nav = require('./Nav.js');
var Index = React.createClass({

  render: function () {
    return (
      <div>
      <div id="markup"></div>
      <script src="/render"></script>
      </div>
    );
  }
});

module.exports = Index;
