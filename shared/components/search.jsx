import React from 'react';

/**
 * Search field.
 * TODO: Should be implemented once there are at least
 * 2 or 3 different trips.
 */

export default class Search extends React.Component {
  render() {
    return (
      <span className="search">
        <i className="fa fa-search"></i>
        <input type="text" placeholder="Search me..." />
      </span>
    );
  }
}
