/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { getFactionData } from '../../gameData/factionData';
import { NameplateAlignment, NameplateDecorFlags } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { UnitFrameBarLayout } from './UnitFrameBar';

// CSS classes
const Diamond = 'HUD-UnitFrameChrome-Diamond';
const Renown = 'HUD-UnitFrameChrome-Renown';
const ClassLevel = 'HUD-UnitFrameChrome-ClassLevel';
const Gem = 'HUD-UnitFrameChrome-Gem';
const GemPanicGlow = 'HUD-UnitFrameChrome-GemPanicGlow';
const Bookend = 'HUD-UnitFrameChrome-Bookend';
const DecorBox = 'HUD-UnitFrameChrome-DecorBox';
const Decor = 'HUD-UnitFrameChrome-Decor';
const NameplateAlignRight = 'nameplate-align-right';

const MAX_CLASS_LEVEL = 10;

export type UnitFrameGemState = 'dead' | 'panicked' | 'veil';

const GEM_STATE_IMAGES: Record<UnitFrameGemState, string> = {
  dead: '/dynamic/factions/assets/unit-frame-gem-dead.png',
  panicked: '/dynamic/factions/assets/unit-frame-gem-panicked.png',
  veil: '/dynamic/factions/assets/unit-frame-gem-veil.png'
};

const SIDE_DIAMOND_CORNER_SIZE = '1.3vmin';
const GEM_DIAMOND_CORNER_SIZE = '0.8vmin';
const NO_SIZE = '0vmin';

type DiamondPosition = 'renown' | 'bottom' | 'gem';

export function isClassLevelNumberShown(classLevel: number | undefined): boolean {
  return classLevel != null && classLevel < MAX_CLASS_LEVEL;
}

export function getNameplateAlignmentClass(alignment: NameplateAlignment | undefined): string {
  return alignment === 'right' ? ` ${NameplateAlignRight}` : '';
}

interface Props {
  factionID: string;
  realmRenown?: string;
  // Below max, the class level replaces the realm gem.
  classLevel?: number;
  // Replaces both the class level and the realm gem, at any level.
  gemState?: UnitFrameGemState;
  hasBottomDiamond: boolean;
  layout: UnitFrameBarLayout;
  decor?: NameplateDecorFlags;
}

// Static back layer of the nameplate. Owners render the often-updating bars and bottom diamond contents
// over it, then UnitFrameChromeFront.
export class UnitFrameChrome extends React.PureComponent<Props> {
  render(): JSX.Element {
    const factionData = getFactionData(this.props.factionID);
    const { classLevel, gemState, realmRenown, decor, layout } = this.props;
    const hasDecorBox = !!decor?.background;

    return (
      <>
        {decor?.decor1 && <img className={`${Decor} decor1`} src={factionData.unitFrameDecor1Image} />}
        {decor?.decor2 && <img className={`${Decor} decor2`} src={factionData.unitFrameDecor2Image} />}
        {hasDecorBox && (
          <FactionBorder
            className={`${DecorBox} ${layout}`}
            type={BorderType.Primary}
            cornerSize={NO_SIZE}
            background={BorderBackground.PatternSmall}
            factionIDOverride={this.props.factionID}
          />
        )}
        <img className={`${Bookend} top`} src={factionData.headerFancyBookendImage} />
        <img className={`${Bookend} bottom`} src={factionData.headerFancyBookendImage} />
        {realmRenown && (
          <>
            {this.renderDiamond('renown', SIDE_DIAMOND_CORNER_SIZE)}
            <div className={Renown}>{realmRenown}</div>
          </>
        )}
        {this.props.hasBottomDiamond && this.renderDiamond('bottom', SIDE_DIAMOND_CORNER_SIZE)}
        {!gemState && isClassLevelNumberShown(classLevel) ? (
          <>
            {this.renderDiamond('gem', GEM_DIAMOND_CORNER_SIZE)}
            <div className={ClassLevel}>{classLevel}</div>
          </>
        ) : (
          // Inside the rotated diamond so both share one transform and round to the same pixels.
          this.renderDiamond(
            'gem',
            GEM_DIAMOND_CORNER_SIZE,
            <>
              {gemState === 'panicked' && <div className={GemPanicGlow} />}
              <img className={Gem} src={gemState ? GEM_STATE_IMAGES[gemState] : factionData.unitFrameClassGemImage} />
            </>
          )
        )}
      </>
    );
  }

  private renderDiamond(position: DiamondPosition, cornerSize: string, content?: React.ReactNode): JSX.Element {
    return (
      <FactionBorder
        className={`${Diamond} ${position}`}
        type={BorderType.Secondary}
        cornerSize={cornerSize}
        background={BorderBackground.PatternSmall}
        factionIDOverride={this.props.factionID}
      >
        {content}
      </FactionBorder>
    );
  }
}
