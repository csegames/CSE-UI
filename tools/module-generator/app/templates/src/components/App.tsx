/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface AppProps {}

export interface AppState {}

class App extends React.PureComponent<AppProps, AppState> {

  public render() {
    return (
      <div>
        <h1>{process.env.NAME}</h1>
      </div>
    );
  }
}

export default App;
