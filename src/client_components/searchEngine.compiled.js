const TopDocs = React.createClass({
  displayName: 'TopDocs',

  getInitialState: function () {
    return {
      results: {}
    };
  }, /*
     componentDidMount : function () {
     console.log("DID MOUNT");
     var query = {
       query : this.props.query
     }
     $.ajax({
        url: '/query',
        dataType: 'json',
        type: 'POST',
        data: query,
        success: function(data) {
          this.setState({results: results});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
     });
     },*/
  componentDidMount: function () {
    var query = {
      query: this.props.query
    };
    console.log("MOUNTED", query);
    $.ajax({
      url: '/query',
      dataType: 'json',
      type: 'POST',
      data: query,
      success: function (data) {
        this.setState({ results: data });
      }.bind(this),
      error: function (xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function () {
    console.log("Hello");
    return React.createElement('h1', null);
  }
});

const Init = React.createClass({
  displayName: 'Init',

  render: function () {
    return React.createElement(
      'div',
      { className: 'container center' },
      React.createElement('h1', null)
    );
  }
});

ReactDOM.render(React.createElement(Init, null), document.getElementById('markup'), function () {
  $('#search').on('keyup', function (event) {
    if (event.keyCode == 13) {
      console.log("ENTERED");
      var val = $(this).val();
      $(this).val(''); // clear the search query
      queryIndex(val);
    }
  });
});

function queryIndex(val) {
  console.log("Got it", val);
  ReactDOM.render(React.createElement(TopDocs, { query: val }), document.getElementById('markup'));
}
