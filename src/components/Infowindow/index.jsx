'use strict';

import './styles.postcss';

import React from 'react';

class InfoWindow extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden,
      content: this.props.content
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ isHidden: nextProps.isHidden });
  }

  render() {
    const classActive = this.state.isHidden ? '-hidden' : '';
    return(
      <div className={`m-modal ${classActive}`}>
        <div className="content">
          <button onClick={this.props.onClose} className="btn close-button">x</button>
          {this.state.content}
        </div>
      </div>
    );
  }

};

InfoWindow.propTypes = {
  isHidden: React.PropTypes.bool,
  content: React.PropTypes.node
};

InfoWindow.defaultProps = {
  isHidden: true,
  content: ''
};

export default InfoWindow;
