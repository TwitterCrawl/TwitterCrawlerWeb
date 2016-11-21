var React = require('react');
var Router = require('react-router').Router;
var BrowserHistory = require('react-router').browserHistory;
var Routes = require('../routes.js');

var AppRoutes = React.createClass({
  render: function () {
    return (<Router history={BrowserHistory} routes={Routes} onUpdate={() => window.scrollTo(0, 0)} />)
  }
});

module.exports = AppRoutes;
