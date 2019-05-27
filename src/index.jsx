import React from 'react';

const rect = (femo) => (deps, callback) => (Component) => {
  class FemoComponent extends React.Component {
    constructor(props) {
      super(props);
      this.state = {};
      this.flag = 0;
      this.callback = (...args) => {
        const state = callback(...args);
        if (this.flag === 0) {
          this.state = state;
          this.flag += 1;
        }
        if (Object.prototype.toString.call(state) === '[object Object]') {
          this.setState({
            ...state
          });
        } else if (state === undefined) {
          console.error('you returned "undefined" from callback');
        } else {
          console.error('callback should return plain object data');
        }
      };
      this.unsubscribe = femo.subscribe(deps, this.callback);
    }

    componentWillUnmount() {
      this.unsubscribe();
    }

    render() {
      return <Component { ...this.props } { ...this.state } />
    }
  }
  FemoComponent.displayName = Component.displayName || Component.name;
  return FemoComponent;
};

rect.exposeName = 'react';

export default rect;
