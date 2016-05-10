'use strict';

/**
 * doc: http://docs.cartodb.com/cartodb-platform/torque/torquejs-getting-started/
 */
class TorqueLayer {

  constructor(props) {
    this.options = props;
  }

  createLayer(callback) {
    console.log(this.options);
    this.layer = new L.TorqueLayer({
      user: this.options.account,
      table: this.options.tablename,
      // sql: this.options.sql,
      cartocss: this.options.cartocss
    });
    // this.layer.error((err) => {
    //   console.warn(err);
    // });
    if (callback && typeof callback === 'function') {
      callback(this.layer);
    }
  }

  play() {
    if (this.layer) {
      this.layer.play();
    }
  }

}

export default TorqueLayer;
