'use strict';

import './styles.postcss';

import React from 'react';

class Header extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div className="l-header c-header">
        <div className="wrap">
          <div className="c-logo">
            <h1>Disarm core</h1><span className="beta">beta</span>
          </div>
          <nav className="c-navigation">
            <ul>
              <li>
                <a href="#map">Map</a>
              </li>
              <li>
                <a href="#">About</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }

};

export default Header;
