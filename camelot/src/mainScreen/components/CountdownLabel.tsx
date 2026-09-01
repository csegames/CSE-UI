/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { formatDuration } from '@csegames/library/dist/_baseGame/utils/timeUtils';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  expiryTimestamp: number;
}

export class CountdownLabel extends React.Component<Props> {
  private tickInterval: number;

  constructor(props: Props) {
    super(props);

    this.tickInterval = this.getSecondsRemaining(props) > 0 ? window.setInterval(this.onTick.bind(this), 1000) : 0;
  }

  render(): React.ReactNode {
    return <div {...this.props}>{formatDuration(this.getSecondsRemaining())}</div>;
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<{}>, snapshot?: any): void {
    const secondsRemaining = this.getSecondsRemaining();
    if (secondsRemaining > 0 && this.tickInterval === 0) {
      this.tickInterval = window.setInterval(this.onTick.bind(this), 1000);
    } else if (secondsRemaining <= 0 && this.tickInterval !== 0) {
      window.clearInterval(this.tickInterval);
      this.tickInterval = 0;
    }
  }

  componentWillUnmount(): void {
    if (this.tickInterval !== 0) {
      window.clearInterval(this.tickInterval);
      this.tickInterval = 0;
    }
  }

  private onTick(): void {
    const secondsRemaining = this.getSecondsRemaining();

    // Updates at zero seconds, but not at negative seconds.
    if (secondsRemaining < 0) {
      window.clearInterval(this.tickInterval);
      this.tickInterval = 0;
    } else {
      this.forceUpdate();
    }
  }

  private getSecondsRemaining(props?: Props): number {
    const expiryTimestamp = (props ?? this.props).expiryTimestamp;
    const msRemaining = Math.max(0, expiryTimestamp - Date.now());
    const sRemaining = Math.floor(msRemaining / 1000);
    return sRemaining;
  }
}
