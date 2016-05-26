'use strict';

import './styles.postcss';
import React from 'react';

class MenuDevice extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className={ this.props.deviceMenuOpen ?  "is-visible m-menu--device"  : "m-menu--device" }
           ref="menuDevice">
        <div className={ this.props.deviceMenuOpen ?  "is-visible background-viel"  : "background-viel" } onClick={ this.props.toggleMenuFn }></div>
        <div className="menu-content">
          <button className="btn-close-menu" onClick={ this.props.toggleMenuFn } >
            <svg className="icon icon-close">
              <use xlinkHref="#icon-close"></use>
            </svg>
          </button>
          <div className="wrap">
            <ul className="menu">
              <li className={ this.props.currentRoute == "map" && 'is-active' } ><a href="/" className='menu-link text text-module-title -dark'>Map</a></li>
              <li className={ this.props.currentRoute == "about" && 'is-active' } ><a href="about.html" className='menu-link text text-module-title -dark'>About</a></li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default MenuDevice;
