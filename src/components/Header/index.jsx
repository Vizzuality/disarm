'use strict';

import './styles.postcss';

import React from 'react';

class Header extends React.Component {

  constructor(props) {
    super(props)
  }

  render() {
    return (
      <div id="header" className="l-header">
        <div className="wrap">
          <a href="/" className="logo">
            <h1>Disarm core</h1><span className="beta">beta</span>
          </a>

          <div className="m-main-menu">
            <button
              className="btn-menu-toggle"
              onClick={ this.props.toggleMenuFn }
            >
              <svg className="icon icon-menu">
                <use xlinkHref="#icon-menu"></use>
              </svg>
            </button>

            <ul className="menu">
              <li className={ this.props.currentRoute == 'map' ? 'is-active menu-link' : '' }>
                <a onClick={ this.props.onChangeRoute.bind(this, 'map') } className="menu-link" href="/" >Map</a></li>
              <li className={ this.props.currentRoute == 'about' ? 'is-active menu-link' : '' }>
                <a onClick={ this.props.onChangeRoute.bind(this, 'about') }  className="menu-link" href="#about" >About</a></li>
            </ul>
          </div>

        </div>
      </div>
    );
  }

};

export default Header;
