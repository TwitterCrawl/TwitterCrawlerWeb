const path    = require('path')         // makes paths easy to resolve
const express = require('express') // http server
const exec = require('child_process').exec;
const morgan = require("morgan");
const bodyParser = require('body-parser');
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

app.use(bodyParser.json( { limit: '50mb' } ) );
app.use(bodyParser.urlencoded({ limit : '50mb', extended : true}));
app.use(express.static(path.join( __dirname, './src/views')));
app.use(express.static(path.join( __dirname, './node_modules/')))
app.use(express.static(path.join( __dirname, '../node_modules/'))) /*for production*/
app.use(express.static(path.join( __dirname, './')))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, './src/views'));

app.get('/', function (req, res) {
  /*exec('./script.sh', function(error, stdout, stderr) {
    console.log(stdout);
  });*/
  match( {routes : routes({}), location: req.url},
    function(err, redirectLocation, renderProps) {
      if(err) {
        return res.status(500).send(err.message);
      }
      if(redirectLocation) {
        return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
      }

      let markup;
      if(renderProps) {
        markup = renderToString(<RouterContext {...renderProps} />);
      }
      else {
        markup = renderToString(<PageNotFound/>);
        res.status(404);
      }
      return res.render('index', { markup });
    });
});

app.get('/render', function (req, res) {
  res.sendFile(__dirname + "/src/client_components/searchEngine.compiled.js", function(err) {
    if(err)
      console.log(err);
  });

});

app.post('/query', function(req, res) {
  console.log("SERVER", req.body);
  res.json(req.body);
});

app.listen(port, function(err) {
  if(err) {
    console.log("There was an error", err)
  }
  console.info('Server running on http://localhost:' + port)
});
