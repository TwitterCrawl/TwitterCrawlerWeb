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
      $("#search").val(''); // clear the search query
      console.log("YOUR QUERY", query);
      $.ajax({
        url: '/query',
        dataType: 'json',
        type: 'POST',
        data: query,
        success: function (data) {
          this.props.passResults(data);
        }.bind(this),
        error: function (xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  render: function () {
    return React.createElement(
      "nav",
      null,
      React.createElement(
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
      )
    );
  }
});

const TopDocs = React.createClass({
  displayName: "TopDocs",

  /*getInitialState : function () {
    return {
      results : {}
    }
  },*/
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
              "filter_drama"
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
              "filter_drama"
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
        Results.push(ParseFullResults(this.props.results[i].substring(1, this.props.results[i].length)));
        console.log('~~~~~~~~~~~~~~~~~~~~~END~~~~~~~~~~~~~~~~~~~~');
      }
      console.log(Results);
      var docNodes = Results.map(function (result, index) {
        return React.createElement(
          "li",
          { key: index },
          React.createElement(
            "div",
            { className: "collapsible-header" },
            React.createElement(
              "i",
              { className: "material-icons" },
              "filter_drama"
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
              result.name
            )
          )
        );
      });
      var markup = React.createElement(
        "div",
        null,
        React.createElement(
          "ul",
          { className: "collapsible", "data-collapsible": "accordion" },
          docNodes
        )
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
      results: {}
    };
  },
  parseResults: function (results) {
    var docs = results.substring(results.indexOf("~STRT~") + 7, results.indexOf("~END~")).split("}\n");
    this.setState({ results: docs });
  },
  render: function () {
    return React.createElement(
      "div",
      null,
      React.createElement(Nav, { passResults: this.parseResults }),
      React.createElement(TopDocs, { results: this.state.results })
    );
  }
});

var escape = function (match) {
  match = "\\" + match;
  return match;
};

function clean(word) {
  word = word.replace(/"/g, escape);
  return word.slice(0, word.length - 1);
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
        message = clean(message.substring(0, message.length - 2));
        jsonResult.message = jQuery.parseJSON('{"message" : "' + message + '"}').message;
        break;
      case 3:
        if (docArray[i].indexOf('[]') != -1) jsonResult.hashtags = jQuery.parseJSON('{"hashtags" : "null"}').hashtags;else {
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
        break;
      case 5:
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
