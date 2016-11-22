const TopDocs = React.createClass({
  getInitialState : function () {
    return {
      results : {}
    }
  },
  componentDidMount : function () {
    var query = {
      query : this.props.query
    }
    console.log("MOUNTED", query);
    $.ajax({
       url: '/query',
       dataType: 'json',
       type: 'POST',
       data: query,
       success: function(data) {
         this.setState({results: data});
       }.bind(this),
       error: function(xhr, status, err) {
         console.error(this.props.url, status, err.toString());
       }.bind(this)
    });
  },
  render : function () {
    console.log("Hello");
    return (
      <h1></h1>
    );
  }
});

const Init = React.createClass({
  render : function () {
    return (
      <div className="container center">
        <h1></h1>
      </div>
    );
  }
});

ReactDOM.render(<Init />, document.getElementById('markup'), function() {
  $('#search').on('keyup', function(event) {
    if (event.keyCode == 13) {
      console.log("ENTERED");
      var val = $(this).val()
      $(this).val('') // clear the search query
      queryIndex(val)
    }
  });
});

function queryIndex(val) {
  console.log("Got it", val)
  ReactDOM.render(<TopDocs query={val} />, document.getElementById('markup'))
}
