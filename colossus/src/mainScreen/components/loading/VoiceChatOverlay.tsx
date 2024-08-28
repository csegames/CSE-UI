/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { game } from '@csegames/library/dist/_baseGame';
import { getVoiceChatStyle } from '../../redux/voiceChatSlice';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { Member, Match, Roster } from '@csegames/library/dist/hordetest/graphql/schema';
import {
  VoiceChatMemberSettings,
  VoiceChatMemberStatus
} from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

const VoiceChatContainer = 'LoadingScreen-VoiceChat-Container';
const VoiceChatItem = 'LoadingScreen-VoiceChat-Item';
const VoiceChatNameContainer = 'LoadingScreen-VoiceChat-NameContainer';
const VoiceChatName = 'LoadingScreen-VoiceChat-Name';
const VoiceChatTeamJoinIcon = 'LoadingScreen-VoiceChat-TeamJoinIcon';

interface MemberRenderData {
  accountID: string;
  displayName: string;
  isTeammate: boolean;
}

interface InjectedProps {
  voiceChatMembers: Dictionary<VoiceChatMemberSettings>;
  members: Member[];
  match: Match;
  selfAccountID: string;
}

type Props = ReactProps & InjectedProps;

interface ReactProps {}

class AVoiceChatOverlay extends React.Component<Props> {
  public render() {
    // Only include voice chat participants that are not the current player.
    const membersToDisplay: MemberRenderData[] = [];
    for (const accountID of Object.keys(this.props.voiceChatMembers)) {
      if (accountID == this.props.selfAccountID) {
        continue;
      }

      const displayName = this.getDisplayName(accountID);
      membersToDisplay.push({ accountID, displayName, isTeammate: this.isTeammate(accountID) });
    }

    // Sort members by alphabetical order.
    membersToDisplay.sort((a, b) => a.displayName.localeCompare(b.displayName));

    return (
      <div className={VoiceChatContainer}>
        {membersToDisplay.map((data, index) => this.renderInGamePlayerItem(data, index))}
      </div>
    );
  }

  private renderInGamePlayerItem(data: MemberRenderData, index: number): JSX.Element {
    const settings = this.props.voiceChatMembers[data.accountID];

    if (!settings) {
      console.error(`Tried to render a voice chat participant ${data.accountID}, but there's no such participant.`);
      return <div className={VoiceChatItem} />;
    }

    const [icon, iconStyle] = getVoiceChatStyle(settings, true);

    return (
      <div key={index}>
        <div className={VoiceChatItem}>
          <div className={VoiceChatNameContainer}>
            <span className={VoiceChatName}>{data.displayName}</span>
            {data.isTeammate && <span className={VoiceChatTeamJoinIcon}></span>}
          </div>
          <span
            className={icon}
            style={iconStyle}
            onMouseEnter={() => this.onMouseEnter()}
            onClick={() => this.toggleMute(data.accountID)}
          />
        </div>
      </div>
    );
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
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

  private getDisplayName(accountID: string): string {
    if (this.props.match && this.props.match.rosters) {
      for (let rosterIDX = 0; rosterIDX < this.props.match.rosters.length; ++rosterIDX) {
        const roster: Roster = this.props.match.rosters[rosterIDX];
        if (roster.members) {
          for (let memberIDX = 0; memberIDX < roster.members.length; ++memberIDX) {
            const member = roster.members[memberIDX];
            if (member.id == accountID) {
              return member.displayName;
            }
          }
        }
      }
    }

    return accountID;
  }

  private isTeammate(accountID: string): boolean {
    for (const member of this.props.members) {
      if (member.id == accountID) return true;
    }
    return false;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const members = state.teamJoin.group ? state.teamJoin.group.members : [];
  const voiceChatMembers = state.voiceChat.members;

  return {
    ...ownProps,
    voiceChatMembers: voiceChatMembers,
    members,
    match: state.match?.matches[0],
    selfAccountID: state.user.id
  };
}

export const VoiceChatOverlay = connect(mapStateToProps)(AVoiceChatOverlay);
