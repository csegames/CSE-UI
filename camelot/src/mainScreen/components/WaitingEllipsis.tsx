/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const Root = 'HUD-WaitingEllipsis-Root';
const Text = 'HUD-WaitingEllipsis-Text';
const Dots = 'HUD-WaitingEllipsis-Dots';

const MAX_DOTS = 3;
const DOT_INTERVAL_MS = 400;

interface ReactProps {
  label: string;
}

interface State {
  dots: number;
}

export class WaitingEllipsis extends React.Component<ReactProps, State> {
  private timer: number | undefined;

  constructor(props: ReactProps) {
    super(props);
    this.state = { dots: 0 };
  }

  componentDidMount(): void {
    this.timer = window.setInterval(() => {
      this.setState((prev) => ({ dots: (prev.dots + 1) % (MAX_DOTS + 1) }));
    }, DOT_INTERVAL_MS);
  }

  componentWillUnmount(): void {
    if (this.timer !== undefined) {
      window.clearInterval(this.timer);
    }
  }

  render(): React.ReactNode {
    return (
      <div className={Root}>
        <span className={Text}>
          {this.props.label}
          <span className={Dots}>{'.'.repeat(this.state.dots)}</span>
        </span>
      </div>
    );
  }
}
