/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import Spinner from './Spinner';

export interface LoadingContainerProps {
  wait?: number;
  loading: boolean;
}

export interface LoadingContainerState {
  hidden: boolean;
}

const Container = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0,0,0,0.5);
`;

export class LoadingContainer extends React.Component<LoadingContainerProps, LoadingContainerState> {
  constructor(props: LoadingContainerProps) {
    super(props);
    this.state = {
      hidden: true,
    };
  }

  public render() {
    return this.props.loading && !this.state.hidden && (
      <Container>
        <Spinner />
      </Container>
    );
  }

  public componentDidMount() {
    this.handleLoadingState(this.props);
  }

  public componentWillReceiveProps(nextProps: LoadingContainerProps) {
    this.handleLoadingState(nextProps);
  }

  private handleLoadingState = (nextProps: LoadingContainerProps) => {
    if (this.props.loading !== nextProps.loading) {
      this.setState({ hidden: true });
      if (this.props.wait) {
        setTimeout(() => {
          this.setState({ hidden: false });
        }, this.props.wait);
        return;
      }
      this.setState({ hidden: false });
    }
  }
}
