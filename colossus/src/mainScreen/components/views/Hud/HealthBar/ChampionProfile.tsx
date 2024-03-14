/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getSpeakingIcon } from '../../../../redux/voiceChatSlice';
import { CharacterRaceDef } from '@csegames/library/dist/hordetest/game/types/CharacterDef';
import {
  VoiceChatMemberSettings,
  VoiceChatMemberStatus
} from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';

const ChampionProfileContainer = 'HealthBar-ChampionProfile-ChampionProfileContainer';
const Image = 'HealthBar-ChampionProfile-Image';
const DeadX = 'HealthBar-ChampionProfile-DeadX';

const VoiceChatIcon = 'HealthBar-ChampionProfile-VoiceChatIcon';

interface ReactProps {
  accountID: string;
  raceID: number;
  name: string;
  isAlive: boolean;
  voiceChatIconSizeVmin: number;
  containerStyles?: string;
  portraitURL: string;
}

interface InjectedProps {
  raceDef: CharacterRaceDef;
  voiceChatSettings: VoiceChatMemberSettings;
}

type Props = ReactProps & InjectedProps;

export interface State {}

class AChampionProfile extends React.Component<Partial<Props>, State> {
  constructor(props: Props) {
    super(props);
  }

  public render() {
    let containerClasses: string = `ChampionProfileContainer ${ChampionProfileContainer} `;

    if (this.props.containerStyles) {
      containerClasses = `${containerClasses} ${this.props.containerStyles}`;
    }

    return (
      <div className={containerClasses}>
        <img className={Image} src={this.getProfileImage()} />
        {this.getDeathIndicator()}
        {this.getVoiceChatIndicator()}
      </div>
    );
  }

  private getProfileImage() {
    if (this.props.portraitURL) {
      return this.props.portraitURL;
    }

    if (this.props.raceDef && this.props.raceDef.thumbnailURL) {
      return this.props.raceDef.thumbnailURL;
    }

    return 'images/fullscreen/character-select/face.png';
  }

  private getDeathIndicator(): JSX.Element {
    if (this.props.isAlive) {
      return;
    }

    return <img className={DeadX} src={'images/hud/dead-x.svg'} />;
  }

  private getVoiceChatIndicator(): JSX.Element {
    if (!this.props.voiceChatSettings) {
      return null;
    }

    let icon = null;
    let color = null;

    switch (this.props.voiceChatSettings.status) {
      case VoiceChatMemberStatus.Enabled:
      case VoiceChatMemberStatus.Disabled:
        return null;
      case VoiceChatMemberStatus.Muted:
        icon = 'fs-icon-misc-speaker-mute';
        color = 'red';
        break;
      case VoiceChatMemberStatus.Speaking:
        color = '#28ff00';
        icon = getSpeakingIcon(this.props.voiceChatSettings.volume);
        break;

      default:
        console.warn('Non supported voice chat participant state ' + this.props.voiceChatSettings.status);
        break;
    }

    if (icon) {
      const iconStyle: React.CSSProperties = {
        fontSize: `${this.props.voiceChatIconSizeVmin}vmin`,
        color: `${color}`
      };

      return <div className={`${VoiceChatIcon} ${icon}`} style={iconStyle} />;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    raceDef: state.game.characterRaceDefs[ownProps.raceID],
    voiceChatSettings: state.voiceChat.members[ownProps.accountID],
    ...ownProps
  };
}

export const ChampionProfile = connect(mapStateToProps)(AChampionProfile);
