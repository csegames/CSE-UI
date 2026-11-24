/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { ProgressionTrackDef } from '../../dataSources/manifest/progressionTrackManifest';
import { getTrackDisplayLevel } from '../../helpers/abilityBookHelpers';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralFraction,
  StringIDGeneralHyphen,
  StringIDGeneralMax
} from '../../helpers/stringTableHelpers';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { ProgressionInfoPosition } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { FactionData, getFactionData } from '../../gameData/factionData';
import { TooltipSource } from '../TooltipSource';

// CSS classes
const Root = 'HUD-ProgressionLevelBar-Root';
const TextRow = 'HUD-ProgressionLevelBar-TextRow';
const TextGroup = 'HUD-ProgressionLevelBar-TextGroup';
const Label = 'HUD-ProgressionLevelBar-Label';
const InfoIcon = 'HUD-ProgressionLevelBar-InfoIcon';
const TooltipMessage = 'HUD-ProgressionLevelBar-TooltipMessage';
const Bar = 'HUD-ProgressionLevelBar-Bar';
const Fill = 'HUD-ProgressionLevelBar-Fill';
const End = 'HUD-ProgressionLevelBar-End';
const Segment = 'HUD-ProgressionLevelBar-Segment';
const Bling = 'HUD-ProgressionLevelBar-Bling';

// CSS state modifier classes
const ModGreyscale = 'greyscale';
const ModInfoAlwaysShown = 'infoAlwaysShown';

// String IDs
const StringIDStatNameXP = 'StatName_XP';

export const LEVEL_UP_BLING_DURATION_MS = 3000;

const TOOLTIP_MAX_WIDTH = '30vmin';

// The bar still shows a single level, just split visually into this many pieces.
const SEGMENT_COUNT = 10;
// Each segment is pinned by both edges instead of laid out with flex, since the game rounds flex widths down
// and leaves a sliver of the bar showing past the last segment.
const SEGMENT_POSITIONS: React.CSSProperties[] = Array.from({ length: SEGMENT_COUNT }, (_, index) => ({
  left: `${(index * 100) / SEGMENT_COUNT}%`,
  right: `${((SEGMENT_COUNT - 1 - index) * 100) / SEGMENT_COUNT}%`
}));
// Once a track is capped, the server reports this as the XP needed for the next level.
const MAX_LEVEL_XP_TOTAL = 2000000000;

interface State {
  characterID: string;
  level: number;
  isLevelUp: boolean;
  /** How much of the bar is filled, from 0 to 1. */
  progressPercent: number;
}

interface ReactProps {
  trackDef: ProgressionTrackDef;
  /** Takes the display level as its LEVEL token. */
  levelStringID: string;
  /** Shown before the level text, such as the class name. */
  nameKey?: string;
  /** What the bar is for and how to earn its XP, shown when hovering the info icon. */
  infoTooltipStringID: string;
  isGreyscale: boolean;
  /** Otherwise the level and XP text only shows while the bar is hovered. */
  isInfoAlwaysShown: boolean;
  infoPosition: ProgressionInfoPosition;
}

// Progress is held as plain numbers so entity updates that leave this track unchanged don't re-render the bar.
interface InjectedProps {
  characterID: string;
  level: number;
  current: number;
  total: number;
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps;

function isTrackCapped(total: number): boolean {
  return total >= MAX_LEVEL_XP_TOTAL;
}

function getProgressPercent(props: Props, isLevelUp: boolean): number {
  // The bar stays full through the level-up bling, even though the data has already reset it.
  if (isLevelUp || isTrackCapped(props.total)) {
    return 1;
  }
  return Math.min(1, props.current / props.total);
}

class AProgressionLevelBar extends React.Component<Props, State> {
  private levelUpTimeout: number | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      characterID: '',
      level: 0,
      isLevelUp: false,
      progressPercent: 0
    };
  }

  public static getDerivedStateFromProps(props: Props, state: State): State {
    // The bar can carry over from the previous character, which isn't a level-up.
    if (props.characterID !== state.characterID) {
      return {
        characterID: props.characterID,
        level: props.level,
        isLevelUp: false,
        progressPercent: getProgressPercent(props, false)
      };
    }

    // Detected here rather than after the update, so the first render after a level-up already shows a full bar.
    const isLevelUp = state.isLevelUp || props.level > state.level;
    return {
      characterID: state.characterID,
      level: props.level,
      isLevelUp,
      progressPercent: getProgressPercent(props, isLevelUp)
    };
  }

  render(): React.ReactNode {
    const isInfoOnTop = this.props.infoPosition === ProgressionInfoPosition.Top;
    const greyscaleClass = this.props.isGreyscale ? ` ${ModGreyscale}` : '';
    const infoAlwaysShownClass = this.props.isInfoAlwaysShown ? ` ${ModInfoAlwaysShown}` : '';
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div className={`${Root}${greyscaleClass}${infoAlwaysShownClass}`}>
        {isInfoOnTop && this.renderInfo(factionData)}
        {this.renderBar(factionData)}
        {!isInfoOnTop && this.renderInfo(factionData)}
      </div>
    );
  }

  componentDidUpdate(_prevProps: Readonly<Props>, prevState: Readonly<State>): void {
    // A level-up while the bling is already playing restarts it.
    if (!this.state.isLevelUp || (prevState.isLevelUp && this.state.level === prevState.level)) {
      return;
    }

    if (this.levelUpTimeout !== null) {
      window.clearTimeout(this.levelUpTimeout);
    }
    this.levelUpTimeout = window.setTimeout(() => {
      this.levelUpTimeout = null;
      this.setState({ isLevelUp: false });
    }, LEVEL_UP_BLING_DURATION_MS);
  }

  componentWillUnmount(): void {
    if (this.levelUpTimeout !== null) {
      window.clearTimeout(this.levelUpTimeout);
    }
  }

  private renderInfo(factionData: FactionData): React.ReactNode {
    const current = this.state.isLevelUp ? this.props.total : this.props.current;
    return (
      <div className={TextRow}>
        <div className={TextGroup}>
          <div className={Label}>{this.getLevelText()}</div>
          <TooltipSource
            className={InfoIcon}
            style={{ borderColor: factionData.borderColor }}
            tooltipID={`ProgressionLevelBarInfo${this.props.trackDef.id}`}
            positionType='mouse'
            maxWidth={TOOLTIP_MAX_WIDTH}
            content={() => (
              <div className={TooltipMessage}>
                {getStringTableValue(this.props.infoTooltipStringID, this.props.stringTable)}
              </div>
            )}
          >
            !
          </TooltipSource>
        </div>
        <div className={Label}>
          {isTrackCapped(this.props.total)
            ? getStringTableValue(StringIDGeneralMax, this.props.stringTable)
            : this.getXPText(current)}
        </div>
      </div>
    );
  }

  private renderBar(factionData: FactionData): React.ReactNode {
    const fillImage = `url(${factionData.progressBarImage})`;
    return (
      <div className={Bar} style={{ backgroundImage: `url(${factionData.backgroundProgressBarImage})` }}>
        <div className={Fill} style={{ width: `${this.state.progressPercent * 100}%`, backgroundImage: fillImage }}>
          <div className={End} />
        </div>
        {Array.from({ length: SEGMENT_COUNT }, (_, index) => (
          <div
            key={index}
            className={Segment}
            style={{ ...SEGMENT_POSITIONS[index], borderColor: factionData.borderColor }}
          />
        ))}
        {this.state.isLevelUp && (
          <div key={this.state.level} className={Bling} style={{ backgroundImage: fillImage }} />
        )}
      </div>
    );
  }

  private getLevelText(): string {
    const { stringTable } = this.props;
    const levelText = getTokenizedStringTableValue(this.props.levelStringID, stringTable, {
      LEVEL: getTrackDisplayLevel(this.props.trackDef, this.props.level).toFixed(0)
    });
    if (!this.props.nameKey) {
      return levelText;
    }
    const name = getStringTableValue(this.props.nameKey, stringTable);
    return `${name} ${getStringTableValue(StringIDGeneralHyphen, stringTable)} ${levelText}`;
  }

  private getXPText(current: number): string {
    const { stringTable } = this.props;
    const fraction = getTokenizedStringTableValue(StringIDGeneralFraction, stringTable, {
      NUMERATOR: addCommasToNumber(current.toFixed(0)),
      DENOMINATOR: addCommasToNumber(this.props.total.toFixed(0))
    });
    return `${fraction} ${getStringTableValue(StringIDStatNameXP, stringTable)}`;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): InjectedProps => {
  const self = state.entities.self;
  const progress = self?.progression[ownProps.trackDef.id];
  return {
    characterID: self?.characterID ?? '',
    level: progress?.level ?? 0,
    current: progress?.progress ?? 0,
    total: progress?.total ?? 1,
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID
  };
};

export const ProgressionLevelBar = connect(mapStateToProps)(AProgressionLevelBar);
