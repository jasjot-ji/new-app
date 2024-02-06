import React, {Component} from 'react';
import AppRoutes from './src/AppRoutes';
import store from './store';
import { Provider } from 'react-redux';

export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <AppRoutes />
      </Provider>
    );
  }
}
