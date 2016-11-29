const Nav = React.createClass({
  getInitialState : function() {
    return {
      searching : false
    }
  },
  submitQuery : function (event) {
    if(event.keyCode != 13) {

    } else {
      query = {
        query : $("#search").val()
      }
      $("#search").val('') // clear the search query
      console.log("YOUR QUERY", query);
      $.ajax({
         url: '/query',
         dataType: 'json',
         type: 'POST',
         data: query,
         success: function(data) {
           this.setState({searching : false});
           this.props.passResults(data);
         }.bind(this),
         error: function(xhr, status, err) {
           console.error(this.props.url, status, err.toString());
         }.bind(this)
      });
      console.log("REACHE END");
      this.setState({searching : true});
      this.props.setLoad();
    }
  },
  render : function () {
    if(this.state.searching == false)
      var search = <input id="search" type="search" onKeyUp={this.submitQuery} required/>
    else
      var search = <input id="search" type="search" onKeyUp={this.submitQuery} required disabled/>
    return (
      <nav>
        <div className="nav-wrapper">
          <div className="input-field">
            {search}
            <label htmlFor="search"><i className="material-icons">search</i></label>
            <i className="material-icons">close</i>
          </div>
        </div>
      </nav>
    );
  }
});

const TopDocs = React.createClass({
  render : function () {
    if(this.props.searching == true) {
      var markup = (
        <div className="center">
          <h1>Searching...</h1>
          <div className="preloader-wrapper big active">
            <div className="spinner-layer spinner-blue-only">
              <div className="circle-clipper left">
                <div className="circle"></div>
              </div><div className="gap-patch">
                <div className="circle"></div>
              </div><div className="circle-clipper right">
                <div className="circle"></div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    else if(jQuery.isEmptyObject(this.props.results)) {
      var markup = (
        <ul className="collapsible" data-collapsible="accordion">
        <li>
         <div className="collapsible-header center"><i className="material-icons">search</i><h1>Search for a tweet!</h1></div>
        </li>
        </ul>
      )
    }
    else if(this.props.results[0] == "")  {
      var markup = (
        <ul className="collapsible" data-collapsible="accordion">
        <li>
         <div className="collapsible-header center"><i className="material-icons">error</i><h1>No results found!</h1></div>
        </li>
        </ul>
      )
    }
    else {
      var Results = []
      for(var i = 0; i < this.props.results.length - 1; i++) {
        console.log('--------------------RESULT:' + this.props.results.length + '/' + (i + 1) + '--------------------');
        Results.push(ParseFullResults(this.props.results[i].substring(1, this.props.results[i].length).replace(/\n/g, " ")));
        console.log('~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~');
      }
      console.log(Results);
      var docNodes = Results.map(function(result, index) {
        var hashtags = result.hashtags.toString();
        return (
          <li key={index}>
           <div className="collapsible-header"><i className="material-icons">info</i>Score: {result.score}<br /> Date: {result.timestamp}</div>
           <div className="collapsible-body">
            <p>Name: {result.name}<br />
               Message: {result.message}<br />
            </p>
              </div>
          </li>
        )
      });
      var markup = (
          <ul className="collapsible" data-collapsible="accordion">
          {docNodes}
          </ul>
      )
    }
    return (
      <div className="container">
        {markup}
      </div>
    );
  }
});

const SEContainer = React.createClass({
  getInitialState : function () {
    return {
      results : {},
      searching : false
    }
  },
  parseResults : function (results) {
    var docs = results.substring(results.indexOf("~STRT~") + 7, results.indexOf("~END~")).split("}\n");
    this.setState({results : docs, searching : false});
  },
  loader : function() {
    this.setState({searching : !(this.state.searching)})
  },
  render : function () {
    return (
      <div>
      <Nav setLoad={this.loader} passResults={this.parseResults} searching={this.state.searching}/>
      <TopDocs results={this.state.results} searching={this.state.searching}/>
      </div>
    );
  }
});

var escape = function(match) {
  match = "\\" + match;
  return match;
}

function clean(word) {
  word = word.replace(/"/g, escape);
  return word.slice(0, word.length);
}

function ParseFullResults(document) {
  var docArray = document.split(", {");
  var jsonResult = {};
  for(var i = 0; i < docArray.length; i++) {
    console.log(i);
    switch(i) {
      case 0:
      jsonResult.score = jQuery.parseJSON(docArray[i]).score
      break;
      case 1:
      jsonResult.name = jQuery.parseJSON('{' + docArray[i]).name
      break;
      case 2:
      var message = docArray[i].split(': "')[1];
      console.log("a", message);
      message = clean(message.substring(0, message.length - 2));
      console.log("b", message);
      jsonResult.message = jQuery.parseJSON('{"message" : "' + message + '"}').message
      break;
      case 3:
      if(docArray[i].indexOf('[]') != -1)
        jsonResult.hashtags = jQuery.parseJSON('{"hashtags" : "null"}').hashtags;
      else {
        var hashtags = docArray[i].split(': [')[1];
        hashtags = hashtags.substring(0, hashtags.length - 2).split(', ');
        var jsonHashtags = '{"hashtags" : [';
        for(var j = 0; j < hashtags.length; j++) {
          if(j < hashtags.length - 1)
            jsonHashtags += ('"' + hashtags[j] + '", ')
          else
            jsonHashtags += ('"' + hashtags[j] + '"]}')
        }
        jsonResult.hashtags = jQuery.parseJSON(jsonHashtags).hashtags;
      }
      break;
      case 4:
      jsonResult.location = jQuery.parseJSON('{' + docArray[i]).location
      break;
      case 5:
      break;
      case 6:
      jsonResult.timestamp = jQuery.parseJSON('{' + docArray[i]).timestamp
      break;
    }
  }
  console.log(jsonResult)
  return jsonResult;
}
ReactDOM.render(<SEContainer />, document.getElementById('markup'));
