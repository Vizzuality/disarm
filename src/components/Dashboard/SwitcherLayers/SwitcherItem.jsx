'use strict';

import './styles.postcss';

import React from 'react';
import Legend from './../Legend';

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

  // only updates if active state changes
  shouldComponentUpdate(nextProps, nextState) {
    return this.state.active !== nextState.active;
  }

  componentDidUpdate() {
    if (this.props.setLayer) {
      this.props.setLayer(this.state);
    }
  }

  render() {
    return (
      <div>
        <div className="c-switcher--wrapper">
          <div className="c-switcher">
            <input
            type="checkbox"
            name="layer-item"
            id={this.state.name}
            onChange={ this._toggleStatus.bind(this) }
            setLayer={this.props.setLayer.bind(this)}
            defaultChecked={this.state.active}
            />
            <label htmlFor={this.state.name}></label>
          </div>
          <span className="c-switcher--label"> { this.props.name }</span>
        </div>

        {this.state.active && <Legend
          slug={this.props.slug}
          name={this.props.name}
        />}

      </div>
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
