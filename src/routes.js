var React          = require('react');
var Route          = require('react-router').Route;
var IndexRoute     = require('react-router').IndexRoute;
var Layout = require('./components/Layout.js');
var Index  = require('./components/Index.js');

var routes = function(data) {
  return (
    <Route path="/" component={Layout}>
      <IndexRoute component={Index} />
    </Route>
  );
};

module.exports = routes;
