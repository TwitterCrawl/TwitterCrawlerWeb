const Nav = React.createClass({
  displayName: "Nav",

  getInitialState: function () {
    return {
      searching: false
    };
  },
  submitQuery: function (event) {
    if (event.keyCode != 13) {} else {
      query = {
        query: $("#search").val()
      };
      console.log("YOUR QUERY", query);
      $.ajax({
        url: '/query',
        dataType: 'json',
        type: 'POST',
        data: query,
        success: function (data) {
          //this.setState({searching : false});
          $("#search").val(''); // clear the search query
          this.props.passResults(data, query.query);
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
      console.log("REACHE END");
      this.props.setLoad();
    }
  },
  render: function () {
    if (this.props.searching == false) {
      var search = React.createElement(
        "div",
        { className: "nav-wrapper" },
        React.createElement(
          "div",
          { className: "input-field" },
          React.createElement("input", { id: "search", type: "search", onKeyUp: this.submitQuery, required: true }),
          React.createElement(
            "label",
            { htmlFor: "search" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "search"
            )
          ),
          React.createElement(
            "i",
            { className: "material-icons" },
            "close"
          )
        )
      );
    } else {
      var search = React.createElement(
        "div",
        { className: "nav-wrapper" },
        React.createElement(
          "div",
          { className: "input-field" },
          React.createElement("input", { id: "search", type: "search", onKeyUp: this.submitQuery, required: true, disabled: true }),
          React.createElement(
            "label",
            { htmlFor: "search" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "search"
            )
          ),
          React.createElement(
            "i",
            { className: "material-icons" },
            "close"
          )
        ),
        React.createElement(
          "div",
          { className: "progress" },
          React.createElement("div", { className: "indeterminate" })
        )
      );
    }

    return React.createElement(
      "nav",
      null,
      search
    );
  }
});

const TopDocs = React.createClass({
  displayName: "TopDocs",

  render: function () {
    if (jQuery.isEmptyObject(this.props.results)) {
      var markup = React.createElement(
        "ul",
        { className: "collapsible", "data-collapsible": "accordion" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: "collapsible-header center" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "search"
            ),
            React.createElement(
              "h1",
              null,
              "Search for a tweet!"
            )
          )
        )
      );
    } else if (this.props.results[0] == "") {
      var markup = React.createElement(
        "ul",
        { className: "collapsible", "data-collapsible": "accordion" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: "collapsible-header center" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "error"
            ),
            React.createElement(
              "h1",
              null,
              "No results found!"
            )
          )
        )
      );
    } else {
      var Results = [];
      for (var i = 0; i < this.props.results.length - 1; i++) {
        console.log('--------------------RESULT:' + this.props.results.length + '/' + (i + 1) + '--------------------');
        Results.push(ParseFullResults(this.props.results[i].substring(1, this.props.results[i].length).replace(/\n/g, " ")));
        console.log('~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~');
      }
      console.log(Results);
      var docNodes = Results.map(function (result, index) {
        var hashtags = result.hashtags.toString();
        return React.createElement(
          "li",
          { key: index },
          React.createElement(
            "div",
            { className: "collapsible-header" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "info"
            ),
            "Score: ",
            result.score,
            React.createElement("br", null),
            " Date: ",
            result.timestamp
          ),
          React.createElement(
            "div",
            { className: "collapsible-body" },
            React.createElement(
              "p",
              null,
              "Name: ",
              result.name,
              React.createElement("br", null),
              "Message: ",
              result.message,
              React.createElement("br", null),
              "Location: ",
              result.location,
              React.createElement("br", null),
              "hashtags: ",
              hashtags,
              React.createElement("br", null),
              "url-titles: ",
              result.url_titles
            )
          )
        );
      });
      var markup = React.createElement(
        "ul",
        { className: "collapsible", "data-collapsible": "accordion" },
        React.createElement(
          "li",
          null,
          React.createElement(
            "div",
            { className: "collapsible-header center" },
            "Search results for \"",
            this.props.query,
            "\""
          )
        ),
        docNodes
      );
    }
    return React.createElement(
      "div",
      { className: "container" },
      markup
    );
  }
});

const SEContainer = React.createClass({
  displayName: "SEContainer",

  getInitialState: function () {
    return {
      results: {},
      searching: false,
      query: "null"
    };
  },
  parseResults: function (results, query) {
    var docs = results.substring(results.indexOf("~STRT~") + 7, results.indexOf("~END~")).split("}\n");
    this.setState({ results: docs, searching: false, query: query });
  },
  loader: function () {
    if (this.state.searching == true) this.setState({ searching: false });else this.setState({ searching: true });
  },
  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(Nav, { setLoad: this.loader, passResults: this.parseResults, searching: this.state.searching }),
      React.createElement("br", null),
      React.createElement(TopDocs, { query: this.state.query, results: this.state.results, searching: this.state.searching })
    );
  }
});

var escape = function (match) {
  match = "\\" + match;
  return match;
};

function clean(word) {
  word = word.replace(/"/g, escape);
  return word.slice(0, word.length);
}

function ParseFullResults(document) {
  var docArray = document.split(", {");
  var jsonResult = {};
  for (var i = 0; i < docArray.length; i++) {
    console.log(i);
    switch (i) {
      case 0:
        jsonResult.score = jQuery.parseJSON(docArray[i]).score;
        break;
      case 1:
        jsonResult.name = jQuery.parseJSON('{' + docArray[i]).name;
        break;
      case 2:
        var message = docArray[i].split(': "')[1];
        console.log("a", message);
        message = clean(message.substring(0, message.length - 2));
        console.log("b", message);
        jsonResult.message = jQuery.parseJSON('{"message" : "' + message + '"}').message;
        break;
      case 3:
        if (docArray[i].indexOf('[]') != -1) jsonResult.hashtags = jQuery.parseJSON('{"hashtags" : "none"}').hashtags;else {
          var hashtags = docArray[i].split(': [')[1];
          hashtags = hashtags.substring(0, hashtags.length - 2).split(', ');
          var jsonHashtags = '{"hashtags" : [';
          for (var j = 0; j < hashtags.length; j++) {
            if (j < hashtags.length - 1) jsonHashtags += '"' + hashtags[j] + '", ';else jsonHashtags += '"' + hashtags[j] + '"]}';
          }
          jsonResult.hashtags = jQuery.parseJSON(jsonHashtags).hashtags;
        }
        break;
      case 4:
        jsonResult.location = jQuery.parseJSON('{' + docArray[i]).location;
        if (jsonResult.location == "") jsonResult.location = "not shown";
        break;
      case 5:
        console.log(docArray[i]);
        if (docArray[i].indexOf(': null') != -1) {
          console.log('a');
          jsonResult.url_titles = jQuery.parseJSON('{"url_titles" : "none"}').url_titles;
        } else if (docArray[i].indexOf(': [') != -1) {
          console.log('b');
        } else {
          console.log('c');
          var url_title = docArray[i].split('" : ')[1];
          url_title = '"' + clean(url_title.substring(0, url_title.length - 1)) + '"';
          console.log(url_title);
          jsonResult.url_titles = jQuery.parseJSON('{"url_titles" : ' + url_title + '}').url_titles;
          console.log('{"url_titles" : ' + url_title + '}');
        }
        break;
      case 6:
        jsonResult.timestamp = jQuery.parseJSON('{' + docArray[i]).timestamp;
        break;
    }
  }
  console.log(jsonResult);
  return jsonResult;
}
ReactDOM.render(React.createElement(SEContainer, null), document.getElementById('markup'));
