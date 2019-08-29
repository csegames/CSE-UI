/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Panel from './components/BuildPanel';

export interface ContainerProps {
}

export interface ContainerState {
}

class Container extends React.Component<ContainerProps, ContainerState> {
  public render() {
    return (
      <Panel  />
    );
  }
}

export default Container;
