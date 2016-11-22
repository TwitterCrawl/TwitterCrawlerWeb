const Nav = React.createClass({
  submitQuery : function (event) {
    if(event.keyCode != 13) {

    } else {
      query = {
        query : $("#search").val()
      }
      $("#search").val('') // clear the search query
      $.ajax({
         url: '/query',
         dataType: 'json',
         type: 'POST',
         data: query,
         success: function(data) {
           this.props.passResults(data);
         }.bind(this),
         error: function(xhr, status, err) {
           console.error(this.props.url, status, err.toString());
         }.bind(this)
      });
    }
  },
  render : function () {
    return (
      <nav>
        <div className="nav-wrapper">
          <div className="input-field">
            <input id="search" type="search" onKeyUp={this.submitQuery}required />
            <label htmlFor="search"><i className="material-icons">search</i></label>
            <i className="material-icons">close</i>
          </div>
        </div>
      </nav>
    );
  }
});

const TopDocs = React.createClass({
  getInitialState : function () {
    return {
      results : {}
    }
  },
  render : function () {
    console.log("WE passed", this.props.results);
    return (
      <h1></h1>
    );
  }
});

const SEContainer = React.createClass({
  getInitialState : function () {
    return {
      results : {}
    }
  },
  parseResults : function (results) {
    this.setState({results : results})
  },
  render : function () {
    return (
      <div>
      <Nav passResults={this.parseResults}/>
      <TopDocs results={this.state.results}/>
      </div>
    );
  }
});

ReactDOM.render(<SEContainer />, document.getElementById('markup')/*, function() {
  $('#search').on('keyup', function(event) {
    if (event.keyCode == 13) {
      console.log("ENTERED");
      var val = $(this).val()
      $(this).val('') // clear the search query
    }
  });
}*/);
/*
function queryIndex(val) {
  console.log("Got it", val)
  ReactDOM.render(<TopDocs query={val} />, document.getElementById('markup'), function() {
    $('#search').on('keyup', function(event) {
      if (event.keyCode == 13) {
        console.log("ENTERED");
        var val = $(this).val()
        $(this).val('') // clear the search query
        queryIndex(val)
      }
    });
  })
}
*/
