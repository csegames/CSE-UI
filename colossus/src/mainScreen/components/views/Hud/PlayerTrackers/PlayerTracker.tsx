/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { EntityDirection } from '@csegames/library/dist/hordetest/game/types/EntityDirection';
import { RootState } from '../../../../redux/store';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { getSpeakingIcon } from '../../../../redux/voiceChatSlice';
import { EntityResource, findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
import {
  VoiceChatMemberSettings,
  VoiceChatMemberStatus
} from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';

const Container = 'PlayerTrackers-PlayerTracker-Container';
const DownContainer = 'PlayerTrackers-PlayerTracker-DownContainer';
const NameAndIconContainer = 'PlayerTrackers-PlayerTracker-NameAndIconContainer';
const DirectionDiamond = 'PlayerTrackers-PlayerTracker-DirectionArrow';
const DownIcon = 'PlayerTrackers-PlayerTracker-DownIcon';
const DownName = 'PlayerTrackers-PlayerTracker-DownName';
const SpeakingName = 'PlayerTrackers-PlayerTracker-SpeakingName';
const SpeakerIcon = 'PlayerTrackers-PlayerTracker-SpeakerIcon';

interface PlayerTrackStyles {
  left: string | number;
  right: string | number;
  top: string | number;
  bottom: string | number;
  width: string;
  height: string;
  transition: string;
  flexDirection: 'column' | 'row';
  justifyContent: 'flex-start' | 'flex-end';
}

type PlayerTrackerOrientation = 'left' | 'right' | 'top' | 'bottom';

interface PlayerTrackerAlignment {
  alignmentStyle: PlayerTrackStyles;
  orientation: PlayerTrackerOrientation;
}

interface InjectedProps {
  direction: EntityDirection;
  voiceChatSettings: VoiceChatMemberSettings;
  lifeState: LifeState;
  resources: ArrayMap<EntityResource>;
}

interface ReactProps {
  playerName: string;
}

type Props = InjectedProps & ReactProps;

const FLUSH_MARGIN = 0;
const TOP_BOTTOM_MARGIN_DISPLACMENT = '-1.25vmin';

class APlayerTracker extends React.Component<Props, {}> {
  constructor(props: Props) {
    super(props);
  }

  private getAlignment() {
    const screenPos = this.props.direction?.screenPos ?? { x: 0, y: 0 };

    let xFlush = false;
    let yFlush = false;

    let left: string | number = 'auto';
    let right: string | number = 'auto';
    let top: string | number = 'auto';
    let bottom: string | number = 'auto';
    let transition = '';
    let flexDirection: 'column' | 'row';
    let justifyContent: 'flex-start' | 'flex-end';
    let width = 'auto';
    let height = 'auto';
    let orientation: PlayerTrackerOrientation = 'left';

    if (screenPos.x <= 0) {
      left = FLUSH_MARGIN;
      flexDirection = 'row';
      justifyContent = 'flex-start';
      xFlush = true;
      width = '25vmin';
    }

    if (screenPos.x > 1) {
      right = FLUSH_MARGIN;
      flexDirection = 'row';
      justifyContent = 'flex-end';
      xFlush = true;
      width = '25vmin';
      orientation = 'right';
    }

    if (screenPos.y <= 0) {
      top = TOP_BOTTOM_MARGIN_DISPLACMENT;
      flexDirection = 'column';
      justifyContent = 'flex-start';
      yFlush = true;
      height = '25vmin';
      orientation = 'top';
    }

    if (screenPos.y > 1) {
      bottom = TOP_BOTTOM_MARGIN_DISPLACMENT;
      flexDirection = 'column';
      justifyContent = 'flex-end';
      yFlush = true;
      height = '25vmin';
      orientation = 'bottom';
    }

    if (!xFlush) {
      left = `${screenPos.x * 100}%`;
    }

    if (!yFlush) {
      top = `${screenPos.y * 100}%`;
    }

    const ret: PlayerTrackerAlignment = {
      alignmentStyle: { top, right, bottom, left, width, height, transition, flexDirection, justifyContent },
      orientation: orientation
    };

    return ret;
  }

  public render() {
    const isSpeaking = this.props.voiceChatSettings?.status === VoiceChatMemberStatus.Speaking;
    const isDowned = this.props.lifeState === LifeState.Downed;

    //No PlayerTracker if a player is dead, not talking, or not downed.
    if (this.props.lifeState == LifeState.Dead || (!isSpeaking && !isDowned)) {
      return null;
    }

    const alignment = this.getAlignment();
    const arrowColor: string = isDowned ? '#C00' : '#28FF00';

    if (
      alignment.alignmentStyle.right === FLUSH_MARGIN ||
      alignment.alignmentStyle.bottom === TOP_BOTTOM_MARGIN_DISPLACMENT
    ) {
      return (
        <div className={this.getContainer(isDowned, alignment)} style={alignment.alignmentStyle}>
          {this.getNameContainerRightOrdered(isDowned, isSpeaking)}
          {this.getDirectionDiamond(alignment.alignmentStyle, arrowColor, isSpeaking)}
        </div>
      );
    } else {
      return (
        <div className={this.getContainer(isDowned, alignment)} style={alignment.alignmentStyle}>
          {this.getDirectionDiamond(alignment.alignmentStyle, arrowColor, isSpeaking)}
          {this.getNameContainerLeftOrdered(isDowned, isSpeaking)}
        </div>
      );
    }
  }

  private getNameContainerRightOrdered(isDowned: boolean, isSpeaking: boolean): JSX.Element {
    const Name: string = isDowned ? DownName : SpeakingName;
    return (
      <div className={NameAndIconContainer}>
        <span className={Name}>{this.props.playerName}</span>
        {isDowned && <div className={`${DownIcon} ${this.getDownedIconStyle()} fs-icon-misc-revive-player`} />}
        {isSpeaking && <div className={`${SpeakerIcon} ${getSpeakingIcon(this.props.voiceChatSettings.volume)}`} />}
      </div>
    );
  }

  private getNameContainerLeftOrdered(isDowned: boolean, isSpeaking: boolean): JSX.Element {
    const Name: string = isDowned ? DownName : SpeakingName;
    return (
      <div className={NameAndIconContainer}>
        {isSpeaking && <div className={`${SpeakerIcon} ${getSpeakingIcon(this.props.voiceChatSettings.volume)}`} />}
        {isDowned && <div className={`${DownIcon} ${this.getDownedIconStyle()} fs-icon-misc-revive-player`} />}
        <span className={Name}>{this.props.playerName}</span>
      </div>
    );
  }

  private getContainer(isDowned: boolean, alignment: PlayerTrackerAlignment): string {
    if (isDowned) {
      return `${DownContainer} ${alignment.orientation}`;
    } else {
      return Container;
    }
  }

  private getDownedIconStyle(): string {
    const reviveProgress = findEntityResource(this.props.resources, EntityResourceIDs.ReviveProgress);
    const startedReviving: boolean = reviveProgress.current > 0;
    return startedReviving ? 'reviving' : 'down';
  }

  private getDirectionDiamond(alignment: PlayerTrackStyles, arrowColor: string, isSpeaking: boolean): JSX.Element {
    let classList: string = `${DirectionDiamond} `;
    if (isSpeaking) {
      classList += 'Speaking ';
    }
    let rotation = '0deg';
    if (alignment.top === TOP_BOTTOM_MARGIN_DISPLACMENT) {
      rotation = '-90deg';
    } else if (alignment.bottom === TOP_BOTTOM_MARGIN_DISPLACMENT) {
      rotation = '90deg';
    } else if (alignment.left === FLUSH_MARGIN) {
      rotation = '180deg';
    }
    return (
      <div className={classList} style={{ transform: `rotate(${rotation})` }}>
        <div
          className={DirectionDiamond}
          style={{ border: '2vmin solid transparent', borderLeft: `2vmin solid ${arrowColor}`, right: '0.25vmin' }}
        />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const friend = state.entities.friends[ownProps.playerName];
  const direction = state.game.playerDirections[ownProps.playerName];
  return {
    ...ownProps,
    direction,
    voiceChatSettings: friend ? state.voiceChat.members[friend.accountID] : null,
    lifeState: friend?.lifeState,
    resources: friend?.resources
  };
}

export const PlayerTracker = connect(mapStateToProps)(APlayerTracker);
