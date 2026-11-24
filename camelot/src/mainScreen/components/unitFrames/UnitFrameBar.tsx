/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';

// CSS classes
const Root = 'HUD-UnitFrameBar-Root';
const Content = 'HUD-UnitFrameBar-Content';

const BAR_CORNER_SIZE = '0.9vmin';

type UnitFrameBarSlot = 'name' | 'health' | 'secondary';
export type UnitFrameBarLayout = 'two-bars' | 'three-bars';

interface Props {
  slot: UnitFrameBarSlot;
  layout: UnitFrameBarLayout;
  factionID: string;
}

export class UnitFrameBar extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <FactionBorder
        className={`${Root} ${this.props.slot} ${this.props.layout}`}
        type={BorderType.Secondary}
        cornerSize={BAR_CORNER_SIZE}
        background={BorderBackground.PatternSmall}
        factionIDOverride={this.props.factionID}
      >
        <div className={Content}>{this.props.children}</div>
      </FactionBorder>
    );
  }
}
