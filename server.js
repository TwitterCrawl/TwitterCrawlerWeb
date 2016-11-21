const path    = require('path')         // makes paths easy to resolve
const express = require('express') // http server

const app   = express();
const port  = process.env.port || 8080;
const env = process.env.NODE_ENV || 'production';

const React           = require('react');
const ReactDOM        = require('react-dom');
const ReactRouter     = require('react-router');
const match           = ReactRouter.match;
const RouterContext   = ReactRouter.RouterContext
const renderToString = require('react-dom/server').renderToString;

const routes = require('./src/routes.js');

app.use(express.static(path.join( __dirname, './src/views')));
app.use(express.static(path.join( __dirname, './node_modules/')))
app.use(express.static(path.join( __dirname, '../node_modules/'))) /*for production*/
app.use(express.static(path.join( __dirname, './')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

app.get('/', function () {

});

app.get('/render', function () {

});
