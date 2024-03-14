/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as Raven from 'raven-js';

export function reportException(error: Error) {
  Raven.captureException(error);
}

export class ErrorBoundary extends React.Component {
  public componentDidCatch(error: Error, info: { componentStack: string }): void {
    console.error(error, info);
    reportException(error);
  }

  // required for react to process the error properly
  static getDerivedStateFromError(error: any): {} {
    return {};
  }

  public render() {
    return this.props.children;
  }
}
