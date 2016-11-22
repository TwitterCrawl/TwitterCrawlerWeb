const Nav = React.createClass({
  displayName: "Nav",

  submitQuery: function (event) {
    if (event.keyCode != 13) {} else {
      query = {
        query: $("#search").val()
      };
      $("#search").val(''); // clear the search query
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

  getInitialState: function () {
    return {
      results: {}
    };
  },
  render: function () {
    console.log("WE passed", this.props.results);
    return React.createElement("h1", null);
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
    this.setState({ results: results });
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

ReactDOM.render(React.createElement(SEContainer, null), document.getElementById('markup') /*, function() {
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
