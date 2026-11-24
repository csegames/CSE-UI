/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { NameplateDecorFlags } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { UnitFrameBarLayout } from './UnitFrameBar';

// CSS classes
const IconDiamond = 'HUD-UnitFrameChromeFront-IconDiamond';
const Icon = 'HUD-UnitFrameChromeFront-Icon';
const DecorBoxCorners = 'HUD-UnitFrameChromeFront-DecorBoxCorners';

const ICON_DIAMOND_CORNER_SIZE = '1.6vmin';
const DECOR_BOX_CORNER_SIZE = '2.5vmin';
const NO_SIZE = '0vmin';

interface Props {
  factionID: string;
  iconURL: string | null;
  layout: UnitFrameBarLayout;
  decor?: NameplateDecorFlags;
}

// The parts of the nameplate that sit over the bars. Owners render it last.
export class UnitFrameChromeFront extends React.PureComponent<Props> {
  render(): JSX.Element {
    const hasDecorBox = !!this.props.decor?.background;

    return (
      <>
        {hasDecorBox && (
          // Only the corners, so the box's background and lines can stay behind the bars.
          <FactionBorder
            className={`${DecorBoxCorners} ${this.props.layout}`}
            type={BorderType.Primary}
            cornerSize={DECOR_BOX_CORNER_SIZE}
            borderSize={NO_SIZE}
            factionIDOverride={this.props.factionID}
          />
        )}
        <FactionBorder
          className={IconDiamond}
          type={BorderType.Secondary}
          cornerSize={ICON_DIAMOND_CORNER_SIZE}
          background={BorderBackground.PatternSmall}
          factionIDOverride={this.props.factionID}
        />
        {this.props.iconURL && <img className={Icon} src={this.props.iconURL} />}
      </>
    );
  }
}
