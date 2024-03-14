/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HealthBar } from '../HealthBar';
import { RootState } from '../../../../redux/store';
import { PlayerEntityStateModel } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import {
  VoiceChatMemberSettings,
  VoiceChatMemberStatus
} from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';

const Container = 'FriendlyHealthBars-FriendlyHealthBar-Container';
const PlayerName = 'FriendlyHealthBars-FriendlyHealthBar-PlayerName';
const ChampionProfileStyle = 'FriendlyHealthBars-FriendlyHealthBar-ChampionProfile';

const VOICE_CHAT_ICON_SIZE_VMIN = 1.5;

interface ReactProps {
  friendName: string;
}

interface InjectedProps {
  friend: PlayerEntityStateModel;
  voiceChatMembers: Dictionary<VoiceChatMemberSettings>;
}

type Props = ReactProps & InjectedProps;

class AFriendlyHealthBar extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    if (!this.props.friend) return null;
    const {
      resources,
      currentDeaths,
      isAlive,
      maxDeaths,
      race,
      portraitURL,
      lifeState,
      deathStartTime,
      downedStateEndTime
    } = this.props.friend;
    const numHearts = maxDeaths - currentDeaths;
    const resourcesHeightVmin = lifeState == LifeState.Downed ? 1.5 : 0.75;

    return (
      <div className={Container}>
        <div className={PlayerName} style={this.getPlayerNameStyle()}>
          {this.props.friendName}
        </div>
        <HealthBar
          hideMax
          hideChampionResource
          isAlive={isAlive}
          resourcesWidthVmin={'auto'}
          resourcesHeightVmin={resourcesHeightVmin}
          championProfileStyles={ChampionProfileStyle}
          raceID={race}
          hideCurrent
          showChampionLives={true}
          currentLives={numHearts}
          name={this.props.friendName}
          voiceChatIconSizeVmin={VOICE_CHAT_ICON_SIZE_VMIN}
          lifeState={lifeState}
          deathStartTime={deathStartTime}
          downedStateEndTime={downedStateEndTime}
          isSelfHealthBar={false}
          portraitURL={portraitURL}
          resources={resources}
        />
      </div>
    );
  }

  private getPlayerNameStyle(): React.CSSProperties {
    const voiceSettings = this.props.voiceChatMembers[this.props.friend.accountID];
    const color = voiceSettings?.status === VoiceChatMemberStatus.Speaking ? '#28ff00' : 'white';
    return { color };
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    friend: state.entities.friends[ownProps.friendName],
    voiceChatMembers: state.voiceChat.members
  };
}

export const FriendlyHealthBar = connect(mapStateToProps)(AFriendlyHealthBar);
