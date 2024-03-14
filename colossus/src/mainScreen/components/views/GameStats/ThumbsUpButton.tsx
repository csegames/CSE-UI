/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../../shared/Button';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { Dispatch } from '@reduxjs/toolkit';
import { setThumbsUp } from '../../../redux/gameStatsSlice';
import { ScenarioAPI } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { webConf } from '../../../dataSources/networkConfiguration';
import { OvermindSummaryGQL } from '@csegames/library/dist/hordetest/graphql/schema';

const ANIMATION_DURATION = 0.2;
const ThumbsupButton = 'GameStats-ThumbsupButton';
const VotedFor = 'GameStats-ThumbsUpButton-VotedFor';
const ThumbsupSelf = 'GameStats-ThumbsUpButton-ThumbsupSelf';
const ButtonContent = 'GameStats-ThumbsUpButton-ButtonContent';

const Icon = 'GameStats-ThumbsUpButton-Icon';

interface ReactProps {
  accountID: string;
  onSameTeam: boolean;
}

interface InjectedProps {
  selfAccountID: string;
  thumbsUp: { [accountID: string]: string[] };
  overmindSummary: OvermindSummaryGQL;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

export interface State {
  mouseOverSelfVote: boolean;
  shouldPlayAnimation: boolean;
}

export class AThumbsUpButton extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      mouseOverSelfVote: false,
      shouldPlayAnimation: false
    };
  }

  public render() {
    const { thumbsUp, accountID } = this.props;
    const isSelf = this.props.accountID == this.props.selfAccountID;
    const thisThumbsUp = thumbsUp?.[accountID] || [];
    const selfHasVoted = this.selfHasVoted();
    const selfHasVotedFor = thisThumbsUp.includes(this.props.selfAccountID);
    const thumbsUpAmount = thisThumbsUp.length;
    const animationClass = this.state.shouldPlayAnimation ? 'animation' : '';

    if (selfHasVotedFor) {
      return (
        <div
          className={VotedFor}
          onClick={this.onRevokeClick.bind(this)}
          onMouseEnter={this.onMouseOverSelfVote}
          onMouseLeave={this.onMouseLeaveSelfVote}
        >
          <div className={`${ButtonContent} ${animationClass}`}>
            <span>{thumbsUpAmount}</span>
            {this.state.mouseOverSelfVote ? (
              <span className={`${Icon} icon-close`} />
            ) : (
              <span className={`${Icon} icon-thumbsup self-voted`} />
            )}
          </div>
        </div>
      );
    }

    if (!isSelf) {
      return (
        <Button
          type={selfHasVoted || !this.props.onSameTeam ? 'blue-outline' : 'blue'}
          disabled={selfHasVoted || !this.props.onSameTeam}
          styles={`${ThumbsupButton} ${isSelf ? 'self' : ''}`}
          onClick={this.onThumbsUpClick.bind(this)}
          text={
            <div className={`${ButtonContent} ${animationClass}`}>
              <span>{thumbsUpAmount}</span>
              <span className={`${Icon} icon-thumbsup`} />
            </div>
          }
        />
      );
    }

    return (
      <div className={ThumbsupSelf}>
        <div className={`${ButtonContent} ${animationClass}`}>
          <span>{thumbsUpAmount}</span>
          <span className={`${Icon} icon-thumbsup`} />
        </div>
      </div>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    const { accountID } = this.props;
    const prevLength = prevProps.thumbsUp?.[accountID] ? prevProps.thumbsUp?.[accountID].length : 0;
    const thisLength = this.props.thumbsUp?.[accountID] ? this.props.thumbsUp?.[accountID].length : 0;
    if (prevLength < thisLength) {
      this.playAnimation();
    }
  }

  private playAnimation = () => {
    this.setState({ shouldPlayAnimation: true });

    window.setTimeout(() => {
      this.setState({ shouldPlayAnimation: false });
    }, ANIMATION_DURATION * 1000);
  };

  private selfHasVoted = () => {
    let selfHasVoted = false;
    Object.values(this.props.thumbsUp ?? []).forEach((charIDList) => {
      if (charIDList.includes(this.props.selfAccountID)) {
        selfHasVoted = true;
      }
    });

    return selfHasVoted;
  };

  private onMouseOverSelfVote = () => {
    this.setState({ mouseOverSelfVote: true });
  };

  private onMouseLeaveSelfVote = () => {
    this.setState({ mouseOverSelfVote: false });
  };

  private async onThumbsUpClick() {
    const { accountID } = this.props;
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);

    // TODO : track this click explicitly until it is applied by the server, do not allow other clicks until this one is complete
    const thumbsUp = cloneDeep(this.props.thumbsUp);
    if (thumbsUp) {
      if (thumbsUp[accountID]) {
        if (!thumbsUp[accountID].includes(this.props.accountID)) {
          thumbsUp[accountID].push(this.props.accountID);
        }
      } else {
        thumbsUp[accountID] = [this.props.accountID];
      }
      this.props.dispatch(setThumbsUp(thumbsUp));
      await ScenarioAPI.RewardThumbsUp(webConf, this.props.overmindSummary.id, accountID);
    } else {
      await ScenarioAPI.RewardThumbsUp(webConf, this.props.overmindSummary.id, accountID);
      return;
    }
  }

  private async onRevokeClick() {
    const { accountID } = this.props;
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);

    // TODO : track this revoke explicitly until it is applied by the server, do not allow other clicks until this one is complete
    const thumbsUp = cloneDeep(this.props.thumbsUp);
    thumbsUp[accountID] = thumbsUp[accountID].filter((id: any) => id !== this.props.accountID);

    this.props.dispatch(setThumbsUp(thumbsUp));
    await ScenarioAPI.RevokeThumbsUp(webConf, this.props.overmindSummary.id);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { overmindSummary, thumbsUp } = state.gameStats;
  return {
    ...ownProps,
    selfAccountID: state.user.id,
    thumbsUp,
    overmindSummary
  };
}

export const ThumbsUpButton = connect(mapStateToProps)(AThumbsUpButton);
