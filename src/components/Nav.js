const React = require('react');

const Nav = React.createClass({
  render : function () {
    return (
      <nav>
        <div className="nav-wrapper">
          <div className="input-field">
            <input id="search" type="search" required />
            <label htmlFor="search"><i className="material-icons">search</i></label>
            <i className="material-icons">close</i>
          </div>
        </div>
      </nav>
    );
  }
});

module.exports = Nav;
