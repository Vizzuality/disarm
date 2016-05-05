'use strict';

import React from 'react';

class SwitcherItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: this.props.name,
      active: this.props.active,
      slug: this.props.slug
    };
  }

  _toggleStatus() {
    this.setState({active: !this.state.active});
  }

  componentDidUpdate() {
    if (this.props.setLayer) {
      this.props.setLayer(this.state);
    }
  }

  render() {
    return (
      <li className="c-switcher-item">
        <label for="layer-item">
          <input
            type="radio"
            name="layer-item"
            onChange={ this._toggleStatus.bind(this) }
            setLayer={this.props.setLayer.bind(this)}
            defaultChecked={this.state.active}
          />
          {this.state.name}
        </label>
      </li>
    );
  }

};

SwitcherItem.propTypes = {
  onChange: React.PropTypes.func,
  active: React.PropTypes.bool
};

SwitcherItem.defaultProps = {
  active: false
};

export default SwitcherItem;
