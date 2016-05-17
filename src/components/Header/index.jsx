'use strict';

import './styles.postcss';

import React from 'react';

class Header extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    const isMap = this.props.currentRoute == 'map' ? '-current' : '';
    const isAbout = this.props.currentRoute == 'about' ? '-current' : '';

    return (
      <div className="l-header c-header">
        <div className="wrap">
          <div className="c-logo">
            <a href="/">
              <h1>Disarm core</h1><span className="beta">beta</span>
            </a>
          </div>
          <nav className="c-navigation">
            <ul>
              <li className={isMap}>
                <a onClick={ this.props.onChangeRoute.bind(this, 'map') }href="#map">Map</a>
              </li>
              <li className={isAbout}>
                <a onClick={ this.props.onChangeRoute.bind(this, 'about') } href="#about">About</a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    );
  }

};

export default Header;
