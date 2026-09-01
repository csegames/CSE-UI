/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Match, Member } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Round } from '../../../mainScreen/redux/matchSlice';
import {
  VoiceChatMemberSettings,
  VoiceChatMemberStatus
} from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';
import { getVoiceChatStyle } from '../../redux/voiceChatSlice';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ChampionDef } from '../../dataSources/manifest/championManifest';
import { PerkDef } from '../../dataSources/manifest/perkManifest';

const Champions = 'LoadingScreen-Champions';
const ChampionsCentered = 'LoadingScreen-ChampionsCentered';
const Champion = 'LoadingScreen-Champion';
const ChampionPortrait = 'LoadingScreen-ChampionPortrait';
const ChampionPortraitImage = 'LoadingScreen-ChampionPortraitImage';
const ChampionPortraitShadow = 'LoadingScreen-ChampionPortraitShadow';
const ChampionPortraitName = 'LoadingScreen-ChampionPortraitName';
const ChampionNameContainer = 'LoadingScreen-ChampionNameContainer';
const ChampionName = 'LoadingScreen-ChampionName';
const VoiceChatTeamJoinIcon = 'LoadingScreen-VoiceChat-TeamJoinIcon';

interface InjectedProps {
  currentRound: Round;
  championIDToChampion: Dictionary<ChampionDef>;
  perksByID: Dictionary<PerkDef>;
  teamJoinMembers: Member[];
  voiceChatMembers: Dictionary<VoiceChatMemberSettings>;
  voiceChannelScope: string;
}

type Props = ReactProps & InjectedProps;

interface ReactProps {}

class AChampionCards extends React.Component<Props> {
  public render(): JSX.Element {
    const rosters = (this.props.currentRound as Match)?.rosters ?? [];
    const roster = rosters.find((roster) => roster.teamID === 'Players');
    if (!roster) return null;
    const cappedMembers = roster.members.slice(0, 8);
    return (
      <div className={cappedMembers.length <= 4 ? `${Champions} ${ChampionsCentered}` : Champions}>
        {cappedMembers.map((member) => {
          const image = this.props.perksByID[member.champion?.portraitID]?.iconURL;
          const championName = this.props.championIDToChampion[member.champion?.championID]?.name;
          const isTeammate = this.isTeammate(member.id);
          const settings = this.props.voiceChatMembers[member.id];
          let icon = null;
          let iconStyle = null;
          if (settings) {
            [icon, iconStyle] = getVoiceChatStyle(settings, true);
          }

          return (
            <div className={Champion} key={member.id}>
              <div className={ChampionPortrait}>
                <img className={ChampionPortraitImage} src={image} />
                <div className={ChampionPortraitShadow} />
                <div className={ChampionPortraitName}>{championName}</div>
              </div>
              <div className={ChampionNameContainer}>
                <div className={ChampionName}>{member.displayName}</div>
                {isTeammate && <span className={VoiceChatTeamJoinIcon}></span>}
                {settings && (
                  <span
                    className={icon}
                    style={iconStyle}
                    onMouseEnter={() => this.onMouseEnter()}
                    onClick={() => this.toggleMute(member.id)}
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  private onMouseEnter() {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
  }

  private toggleMute(accountID: string) {
    const settings = this.props.voiceChatMembers[accountID];
    if (!settings) {
      console.error(`Tried to toggle mute of a voice chat participant ${accountID}, but there's no such participant.`);
      return;
    }
    const shouldMute = settings.status != VoiceChatMemberStatus.Muted;
    clientAPI.setVoiceChatMemberMuted(accountID, shouldMute);
  }

  private isTeammate(accountID: string): boolean {
    for (const member of this.props.teamJoinMembers) {
      if (member.id == accountID) return true;
    }
    return false;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentRound } = state.match;
  const { championIDToChampion } = state.championInfo;
  const { perksByID } = state.store;
  const teamJoinMembers = state.teamJoin.group ? state.teamJoin.group.members : [];
  const voiceChatMembers = state.voiceChat.members;
  const voiceChannelScope = state.voiceChat.scope;

  return {
    ...ownProps,
    currentRound,
    championIDToChampion,
    perksByID,
    teamJoinMembers,
    voiceChatMembers,
    voiceChannelScope
  };
}

export const ChampionCards = connect(mapStateToProps)(AChampionCards);
