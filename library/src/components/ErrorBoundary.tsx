/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface ErrorBoundaryProps {
  renderError?: () => (JSX.Element | React.ReactNode);
}

export interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends React.PureComponent<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
    };
  }

  public componentDidCatch(error, info) {
    this.setState({ hasError: true });
    console.error(error, info);
  }

  public render() {
    if (this.state.hasError) {
      return this.props.renderError ? this.props.renderError() : <h2>Unhandled UI Error: Reload UI</h2>;
    }
    return this.props.children as any;
  }
}
