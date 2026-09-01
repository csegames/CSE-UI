import * as React from 'react';
import { Header } from './Header';
import { Main } from './Main';

import './App.css';

export class App extends React.Component {
  render(): React.ReactNode {
    return (
      <div className='screen'>
        <Header />
        <Main />
      </div>
    );
  }
}
