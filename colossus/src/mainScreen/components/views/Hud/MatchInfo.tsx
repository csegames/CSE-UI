/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { formatDuration } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { printWithSeparator } from '@csegames/library/dist/_baseGame/utils/numberUtils';
import { StringTableEntryDef } from '../../../dataSources/manifest/stringTableManifest';
import { Dictionary } from '@reduxjs/toolkit';
import { getTokenizedStringTableValue } from '../../../helpers/stringTableHelpers';
import { GameOptionIDs } from '../../../redux/gameOptionsSlice';
import { GameOption } from '@csegames/library/dist/_baseGame/types/Options';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';

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
  roundStartTime?: number;
  totalKills?: number;
  teamKills?: number;
  npcCount?: number;
  stringTable: Dictionary<StringTableEntryDef>;
  gameOptions: Dictionary<GameOption>;
}

interface State {
  animationHandle: ListenerHandle | null;
  fps: string;
  duration: string;
}

class AMatchInfo extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animationHandle: clientAPI.startAnimation(this.animate.bind(this)),
      fps: '',
      duration: ''
    };
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

  componentWillUnmount(): void {
    this.state.animationHandle?.close();
  }

  public renderAdvancedInfo(): JSX.Element {
    const itemStyle = 'advanced';
    const tokens = {
      NPC_COUNT: printWithSeparator(this.props.npcCount, ','),
      TEAM_KILLS: printWithSeparator(this.props.teamKills, ','),
      SOLO_KILLS: printWithSeparator(this.props.totalKills, ','),
      FPS: this.state.fps
    };

    return (
      <div className={MatchInfoContainerAdvanced}>
        <div className={AdvancedFirstLine}>
          <div className={`${Item} ${MatchTimerStyle} ${itemStyle}`}>
            <span className={`${Icon} fs-icon-misc-time`} />
            {this.state.duration}
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
      SOLO_KILLS: printWithSeparator(this.props.totalKills, ','),
      FPS: this.state.fps
    };

    return (
      <div className={MatchInfoContainer}>
        <div className={`${Item} ${itemStyle}`}>
          {getTokenizedStringTableValue(StringIDHUDMatchInfoKills, this.props.stringTable, tokens)}
        </div>
        <div className={`${Item} ${MatchTimerStyle}`}>
          <span className={`${Icon} fs-icon-misc-time`} />
          {this.state.duration}
        </div>
        <div className={`${Item} ${itemStyle}`}>
          {getTokenizedStringTableValue(StringIDHUDMatchInfoFPS, this.props.stringTable, tokens)}
        </div>
      </div>
    );
  }

  public animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    const elapsed = data.worldTime - this.props.roundStartTime;

    const duration = isNaN(elapsed) ? '' : formatDuration(elapsed);
    const fps = data.fps.toFixed(0);
    if (fps != this.state.fps || duration != this.state.duration) {
      this.setState({ fps, duration });
    }
  }
}

function mapStateToProps(state: RootState) {
  const { teamKills, totalKills, scenarioRoundStateStartTime } = state.entities.self;
  const { npcCount } = state.baseGame;
  return {
    teamKills: teamKills,
    npcCount: npcCount,
    roundStartTime: scenarioRoundStateStartTime,
    totalKills: totalKills,
    stringTable: state.stringTable.stringTable,
    gameOptions: state.gameOptions.gameOptions
  };
}

export const MatchInfo = connect(mapStateToProps)(AMatchInfo);
