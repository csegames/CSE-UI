/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

const Container = styled('div')`
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export interface DataUnavailableProps {
  wait?: number;
}

export interface DataUnavailableState {
  hidden: boolean;
}

class DataUnavailable extends React.Component<DataUnavailableProps, DataUnavailableState> {
  private waitTimeout: any;
  constructor(props: DataUnavailableProps) {
    super(props);
    this.state = {
      hidden: true,
    };
  }

  public render() {
    return !this.state.hidden && (
      <Container>
        {this.props.children}
      </Container>
    );
  }

  public componentDidMount() {
    this.waitTimeout = setTimeout(() => {
      this.setState({ hidden: false });
    }, this.props.wait || 0);
  }

  public componentWillUnmount() {
    clearTimeout(this.waitTimeout);
  }
}

export default DataUnavailable;
