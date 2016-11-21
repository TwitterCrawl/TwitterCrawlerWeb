const TopsDocs = React.createClass({
  displayName: 'TopsDocs',

  render: function () {
    return React.createElement(
      'h1',
      null,
      'You queried'
    );
  }
});

const Init = React.createClass({
  displayName: 'Init',

  render: function () {
    return React.createElement(
      'div',
      { className: 'container center' },
      React.createElement(
        'h1',
        null,
        'You have not ran a query!'
      )
    );
  }
});

ReactDOM.render(React.createElement(Init, null), document.getElementById('markup'), function () {
  $('#search').on('keyup', function (event) {
    console.log("jQuery");
    if (event.keyCode == 13) {
      queryIndex("Poop");
    }
  });
});

function queryIndex(val) {
  ReactDom.render(React.createElement(TopDocs, { query: val }), document.getElementById('markup'));
}
