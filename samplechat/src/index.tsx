import 'normalize.css/normalize.css';
import './style.css';
import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Provider as ReduxProvider } from 'react-redux';
import { store } from './redux/store';
import { App } from './components/App';

const rootElement = document.createElement('div');
rootElement.id = 'app';
document.body.appendChild(rootElement);

ReactDom.render(
  <ReduxProvider store={store}>
    <App />
  </ReduxProvider>,
  rootElement
);
