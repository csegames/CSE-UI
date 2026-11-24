/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { TooltipSource } from '../TooltipSource';

// CSS classes
const Text = 'HUD-UnitFrameTextTooltip-Text';

interface Props {
  className: string;
  tooltipID: string;
  text: string;
}

// PureComponent so the frame's resource ticks skip this.
export class UnitFrameTextTooltip extends React.PureComponent<Props> {
  render(): JSX.Element {
    return (
      <TooltipSource
        className={this.props.className}
        tooltipID={this.props.tooltipID}
        positionType='mouse'
        content={this.renderTooltip.bind(this)}
      />
    );
  }

  private renderTooltip(): React.ReactNode {
    return <div className={Text}>{this.props.text}</div>;
  }
}
