const TopsDocs = React.createClass({
  render : function () {
    return (
      <h1>You queried</h1>
    );
  }
});

const Init = React.createClass({
  render : function () {
    return (
      <div className="container center">
        <h1>You have not ran a query!</h1>
      </div>
    );
  }
});

ReactDOM.render(<Init />, document.getElementById('markup'), function() {
  $('#search').on('keyup', function(event) {
    console.log("jQuery");
    if (event.keyCode == 13){
      queryIndex("Poop")
    }
  });
});

function queryIndex(val) {
  ReactDom.render(<TopDocs query={val}/>, document.getElementById('markup'))
}
