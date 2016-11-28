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
      )
    }
    else if(this.props.results[0] == "")  {
      var markup = (
        <h1>NO RESULTS!</h1>
      )
    }
    else {
      var Results = []
      for(var i = 0; i < this.props.results.length; i++) {
        ParseFullResults(this.props.results[i].substring(1, this.props.results[i].length));
      }
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

var escape = function(match) {
  match = "\\" + match;
  return match;
}

function bashify(word) {
  word = word.replace(/"/g, escape);
  return word.slice(0, word.length - 1);
}

function ParseFullResults(document) {
  var docArray = document.split(", {");
  var jsonResult = {};
  for(var i = 0; i < docArray.length; i++) {
    switch(i) {
      case 0:
      jsonResult.score = jQuery.parseJSON(docArray[i]).score
      break;
      case 1:
      jsonResult.name = jQuery.parseJSON('{' + docArray[i]).name
      console.log(jsonResult.name);
      break;
      case 2:
      break;
      case 3:
      break;
      case 4:
      break;
      case 5:
      break;
      case 6:
      break;
    }
  }
}
ReactDOM.render(<SEContainer />, document.getElementById('markup'));
