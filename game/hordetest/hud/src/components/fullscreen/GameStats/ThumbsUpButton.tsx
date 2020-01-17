/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from '../Button';

const ANIMATION_DURATION = 0.2;

const ThumbsupButton = css`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30px;
  width: 56px;
  font-size: 16px;
  padding: 0;
  cursor: pointer;

  &.disabled {
    opacity: 1;
  }
`;

const VotedFor = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  width: 56px;
  cursor: pointer;
  transition: filter 0.2s;
  color: white;

  &:hover {
    filter: brightness(130%);
  }
`;

const ThumbsupSelf = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 26px;
  width: 56px;
  color: white;
  border: 2px solid #77a5f2;
  font-size: 16px;
  padding: 0;
  pointer-events: none;

  &.disabled {
    opacity: 1;
  }
`;

const ButtonContent = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;

  &.animation {
    animation: pop ${ANIMATION_DURATION}s;
  }

  @keyframes pop {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.7);
    }

    100% {
      transform: scale(1);
    }
  }
`;

const Icon = styled.span`
  cursor: pointer;
  margin-left: 10px;

  &.icon-close {
    color: red;
    margin-bottom: -4px;
  }

  &.self-voted {
    color: #3363c6;
  }
`;

export interface Props {
  characterID: string;
  thumbsUp: { [characterID: string]: string[] };
  onThumbsUpClick: () => void;
  onRevokeClick: () => void;
}

export interface State {
  mouseOverSelfVote: boolean;
  shouldPlayAnimation: boolean;
}

export class ThumbsUpButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mouseOverSelfVote: false,
      shouldPlayAnimation: false,
    };
  }

  public render() {
    const { thumbsUp, characterID } = this.props;
    const isSelf = hordetest.game.selfPlayerState ? characterID === hordetest.game.selfPlayerState.characterID :
      characterID === game.characterID;
    const thisThumbsUp = thumbsUp[characterID] || [];
    const selfHasVoted = this.selfHasVoted();
    const selfHasVotedFor = thisThumbsUp.includes(game.characterID);
    const thumbsUpAmount = thisThumbsUp.length;
    const animationClass = this.state.shouldPlayAnimation ? 'animation' : '';

    if (selfHasVotedFor) {
      return (
        <VotedFor
          onClick={this.props.onRevokeClick}
          onMouseEnter={this.onMouseOverSelfVote}
          onMouseLeave={this.onMouseLeaveSelfVote}>
          <ButtonContent className={animationClass}>
            <span>{thumbsUpAmount}</span>
            {this.state.mouseOverSelfVote ?
              <Icon className='icon-close'></Icon> :
              <Icon className='icon-thumbsup self-voted'></Icon>
            }
          </ButtonContent>
        </VotedFor>
      );
    }

    if (!isSelf) {
      return (
        <Button
          type={selfHasVoted ? 'gray' : 'blue'}
          disabled={selfHasVoted}
          styles={`${ThumbsupButton} ${isSelf ? 'self' : ''}`}
          onClick={this.props.onThumbsUpClick}
          text={
            <ButtonContent className={animationClass}>
              <span>{thumbsUpAmount}</span>
              <Icon className='icon-thumbsup'></Icon>
            </ButtonContent>
          }
        />
      );
    }

    return (
      <ThumbsupSelf>
        <ButtonContent className={animationClass}>
          <span>{thumbsUpAmount}</span>
          <Icon className='icon-thumbsup'></Icon>
        </ButtonContent>
      </ThumbsupSelf>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    const { characterID } = this.props;
    const prevLength = prevProps.thumbsUp[characterID] ? prevProps.thumbsUp[characterID].length : 0;
    const thisLength = this.props.thumbsUp[characterID] ? this.props.thumbsUp[characterID].length : 0;
    if (prevLength < thisLength) {
      this.playAnimation();
    }
  }

  private playAnimation = () => {
    this.setState({ shouldPlayAnimation: true });

    window.setTimeout(() => {
      this.setState({ shouldPlayAnimation: false });
    }, ANIMATION_DURATION * 1000);
  }

  private selfHasVoted = () => {
    let selfHasVoted = false;
    Object.values(this.props.thumbsUp).forEach((charIDList) => {
      if (charIDList.includes(game.characterID)) {
        selfHasVoted = true;
      }
    });

    return selfHasVoted;
  }

  private onMouseOverSelfVote = () => {
    this.setState({ mouseOverSelfVote: true });
  }

  private onMouseLeaveSelfVote = () => {
    this.setState({ mouseOverSelfVote: false });
  }
}
