/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { formatDuration } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { game } from '@csegames/library/dist/_baseGame';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getTokenizedStringTableValue } from '../../../helpers/stringTableHelpers';
import { GameOptionIDs } from '../../../redux/gameOptionsSlice';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';

const MatchInfoContainerAdvanced = 'MatchInfo-MatchInfoContainerAdvanced';
const AdvancedFirstLine = 'MatchInfo-AdvancedFirstLine';
const MatchInfoContainer = 'MatchInfo-MatchInfoContainer';
const Icon = 'MatchInfo-Icon';
const Item = 'MatchInfo-Item';

const MatchTimerStyle = 'MatchInfo-MatchTimer';

const StringIDHUDMatchInfoNPCS = 'HUDMatchInfoNPCS';
const StringIDHUDMatchInfoTeamKills = 'HUDMatchInfoTeamKills';
const StringIDHUDMatchInfoSoloKills = 'HUDMatchInfoSoloKills';
const StringIDHUDMatchInfoKills = 'HUDMatchInfoKills';
const StringIDHUDMatchInfoFPS = 'HUDMatchInfoFPS';

interface Props {
  fps?: number;
  worldTime?: number;
  roundStartTime?: number;
  totalKills?: number;
  teamKills?: number;
  npcCount?: number;
  stringTable: Dictionary<StringTableEntryDef>;
  gameOptions: Dictionary<GameOption>;
}

class AMatchInfo extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    const optAdvancedHud = this.props.gameOptions[GameOptionIDs.AdvancedHUD];
    const showAdvancedHud = optAdvancedHud && optAdvancedHud.value;

    if (showAdvancedHud) {
      return this.renderAdvancedInfo();
    } else {
      return this.renderBasicInfo();
    }
  }

  public renderAdvancedInfo(): JSX.Element {
    const itemStyle = 'advanced';
    const tokens = {
      NPC_COUNT: printWithSeparator(this.props.npcCount, ','),
      TEAM_KILLS: printWithSeparator(this.props.teamKills, ','),
      SOLO_KILLS: printWithSeparator(this.props.totalKills, ','),
      FPS: this.props.fps.toString()
    };

    return (
      <div className={MatchInfoContainerAdvanced}>
        <div className={AdvancedFirstLine}>
          <div className={`${Item} ${MatchTimerStyle} ${itemStyle}`}>
            <span className={`${Icon} fs-icon-misc-time`} />
            {isFinite(this.props.worldTime) && isFinite(this.props.roundStartTime)
              ? formatDuration(game.worldTime - this.props.roundStartTime)
              : '00:00'}
          </div>
          <div className={`${Item} ${itemStyle}`}>
            {getTokenizedStringTableValue(StringIDHUDMatchInfoFPS, this.props.stringTable, tokens)}
          </div>
        </div>

        <div className={`${Item} ${itemStyle}`}>
          {getTokenizedStringTableValue(StringIDHUDMatchInfoNPCS, this.props.stringTable, tokens)}
        </div>

        <div className={`${Item} ${itemStyle}`}>
          {getTokenizedStringTableValue(StringIDHUDMatchInfoTeamKills, this.props.stringTable, tokens)}
        </div>

        <div className={`${Item} ${itemStyle}`}>
          {getTokenizedStringTableValue(StringIDHUDMatchInfoSoloKills, this.props.stringTable, tokens)}
        </div>
      </div>
    );
  }

  public renderBasicInfo(): JSX.Element {
    const itemStyle = 'simple';
    const tokens = {
      SOLO_KILLS: printWithSeparator(this.props.totalKills, ',')
    };

    return (
      <div className={MatchInfoContainer}>
        <div className={`${Item} ${itemStyle}`}>
          {getTokenizedStringTableValue(StringIDHUDMatchInfoKills, this.props.stringTable, tokens)}
        </div>
        <div className={`${Item} ${MatchTimerStyle}`}>
          <span className={`${Icon} fs-icon-misc-time`} />
          {isFinite(this.props.worldTime) && isFinite(this.props.roundStartTime)
            ? formatDuration(game.worldTime - this.props.roundStartTime)
            : '00:00'}
        </div>
        <div className={`${Item} ${itemStyle}`}>{this.props.fps} FPS</div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState) {
  return {
    fps: Math.round(state.baseGame.fps),
    teamKills: state.player.teamKills,
    npcCount: state.baseGame.npcCount,
    worldTime: state.baseGame.worldTime,
    roundStartTime: state.player.scenarioRoundStateStartTime,
    totalKills: state.player.totalKills,
    stringTable: state.stringTable.stringTable,
    gameOptions: state.gameOptions.gameOptions
  };
}

export const MatchInfo = connect(mapStateToProps)(AMatchInfo);
