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
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { getTradeskillTitle } from '../../helpers/abilityBookHelpers';
import { getFactionData } from '../../gameData/factionData';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import ContextMenuSource from '../ContextMenuSource';
import { ContextMenuItem } from '../../redux/contextMenuSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { LEVEL_UP_BLING_DURATION_MS } from '../levelBars/ProgressionLevelBar';

const Root = 'HUD-TradeskillTrackerRow-Root';
const IconContainer = 'HUD-TradeskillTrackerRow-IconContainer';
const Icon = 'HUD-TradeskillTrackerRow-Icon';
const Details = 'HUD-TradeskillTrackerRow-Details';
const NameLabel = 'HUD-TradeskillTrackerRow-NameLabel';
const BarContainer = 'HUD-TradeskillTrackerRow-BarContainer';
const BarClipper = 'HUD-TradeskillTrackerRow-BarClipper';
const BarContent = 'HUD-TradeskillTrackerRow-BarContent';
const BarFill = 'HUD-TradeskillTrackerRow-BarFill';
const BarEnd = 'HUD-TradeskillTrackerRow-BarEnd';
const BarBling = 'HUD-TradeskillTrackerRow-BarBling';
const BarText = 'HUD-TradeskillTrackerRow-BarText';

const CONTEXT_MENU_ID_PREFIX = 'TradeskillTrackerRow_';

const StringIDVendorUntrack = 'VendorUntrack';

interface State {
  isLevelUp: boolean;
}

interface ReactProps {
  trackID: string;
  isExiting: boolean;
}

// Progress is held as plain numbers so entity updates that leave this track unchanged don't re-render the row.
interface InjectedProps {
  characterID: string;
  level: number;
  current: number;
  total: number;
  trackDef: ProgressionTrackDef | undefined;
  stringTable: Record<string, StringTableEntryDef>;
  uiFactionID: string;
}

type Props = ReactProps & InjectedProps;

class ATradeskillTrackerRow extends React.Component<Props, State> {
  private levelUpTimeout: number | null = null;

  constructor(props: Props) {
    super(props);

    this.state = {
      isLevelUp: false
    };
  }

  render(): React.ReactNode {
    const { trackDef } = this.props;
    if (!trackDef) {
      return null;
    }

    const factionData = getFactionData(this.props.uiFactionID);
    // The bar stays full through the level-up bling, even though the data has already reset it.
    const current = this.state.isLevelUp ? this.props.total : this.props.current;

    return (
      <ContextMenuSource
        className={`${Root}${this.props.isExiting ? ' exiting' : ''}`}
        menuParams={{ id: `${CONTEXT_MENU_ID_PREFIX}${this.props.trackID}`, content: this.getContextMenu() }}
      >
        <FactionBorder className={IconContainer} type={BorderType.Secondary} background={BorderBackground.PatternSmall}>
          <img className={Icon} src={trackDef.iconURL} />
        </FactionBorder>
        <div className={Details}>
          <div className={NameLabel}>{getTradeskillTitle(trackDef, this.props.level, this.props.stringTable)}</div>
          <FactionBorder className={BarContainer} type={BorderType.Secondary} background={BorderBackground.ProgressBar}>
            <div className={BarClipper}>
              <div className={BarContent}>
                <img
                  className={BarFill}
                  src={factionData.progressBarImage}
                  style={{ width: `${Math.min(1, current / this.props.total) * 100}%` }}
                />
                <div className={BarEnd} />
              </div>
            </div>
            {this.state.isLevelUp && (
              <img key={this.props.level} className={BarBling} src={factionData.progressBarImage} />
            )}
            <div className={BarText}>{`${current} / ${this.props.total}`}</div>
          </FactionBorder>
        </div>
      </ContextMenuSource>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>): void {
    // Rows are keyed by track ID, so the same row can carry over from the previous character.
    if (this.props.characterID !== prevProps.characterID || this.props.level <= prevProps.level) {
      return;
    }

    if (this.levelUpTimeout !== null) {
      window.clearTimeout(this.levelUpTimeout);
    }
    this.setState({ isLevelUp: true });
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

  private getContextMenu(): ContextMenuItem[] {
    return [
      {
        title: getStringTableValue(StringIDVendorUntrack, this.props.stringTable),
        onClick: () => {
          clientAPI.playGameSound(SoundEvents.PLAY_UI_TRACK_SELECT);
          clientAPI.setProgressionTrackTracked(this.props.characterID, this.props.trackID, false);
        }
      }
    ];
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): InjectedProps => {
  const progress = state.entities.self.progression[ownProps.trackID];
  return {
    characterID: state.entities.self.characterID,
    level: progress?.level ?? 0,
    current: progress?.progress ?? 0,
    total: progress?.total ?? 1,
    trackDef: state.gameDefs.progressionTracks[ownProps.trackID],
    stringTable: state.stringTable.stringTable,
    uiFactionID: state.hud.uiFactionID
  };
};

export const TradeskillTrackerRow = connect(mapStateToProps)(ATradeskillTrackerRow);
