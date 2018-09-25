/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import client from '../core/client';

export interface ErrorBoundaryProps {
  renderError?: (error: Error, info: { componentStack: string }) => (JSX.Element | React.ReactNode);
  reloadUIOnError?: boolean;
  onError?: (error: Error, info: { componentStack: string }) => void;
  outputErrorToConsole?: boolean;
}

export interface ErrorBoundaryState {
  hasError: boolean;
  error: Error;
  info: { componentStack: string };
}

export class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      info: null,
    };
  }

  public componentDidCatch(error: Error, info: { componentStack: string }) {
    if (this.props.outputErrorToConsole) {
      console.error(error, info);
    }
    if (this.props.onError) {
      this.props.onError(error, info);
    }
    if (this.props.reloadUIOnError && !client.debug) {
      client.ReloadAllUI();
    }
    this.setState({
      error,
      info,
      hasError: true,
    });
  }

  public render() {
    if (this.state.hasError) {
      return this.props.renderError ?
        this.props.renderError(this.state.error, this.state.info) :
        <h2>Unhandled UI Error! <button onClick={this.onReloadUI}>Reload UI</button></h2>;
    }
    return this.props.children as any;
  }

  private onReloadUI = () => {
    client.ReloadAllUI();
  }
}
