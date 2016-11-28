const Nav = React.createClass({
  submitQuery : function (event) {
    if(event.keyCode != 13) {

    } else {
      query = {
        query : $("#search").val()
      }
      $("#search").val('') // clear the search query
      console.log("YOUR QUERY", query)
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
  /*getInitialState : function () {
    return {
      results : {}
    }
  },*/
  render : function () {
    console.log("WE passed", this.props.results);
    if(jQuery.isEmptyObject(this.props.results)) {
      var markup = (
        <h1>YOU HAVE NOT QUERIED!</h1>

    else if(this.props.results[0] == "")  {
      var markup = (
        <h1>NO RESULTS!</h1>
      )
    }
    else {
      var Results = ParseFullResults(this.props.results);
      var markup = (
        <h1>QUERIED!</h1>
      )
    }
    return (
      <div>
        {markup}
      </div>
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
    var docs = results.substring(results.indexOf("~STRT~") + 7, results.indexOf("~END~")).split("}\n");
    this.setState({results : docs})
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
      $(this).val('');
    }
  });
}*/);
