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
import { Dispatch } from '@reduxjs/toolkit';
import { GameStatsRequestState, ThumbsUp, revokeThumbsUp, setThumbsUp } from '../../../redux/gameStatsSlice';
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
  thumbsUp: ThumbsUp;
  overmindSummary: OvermindSummaryGQL;
  requests: GameStatsRequestState;
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
    const { accountID, onSameTeam, selfAccountID } = this.props;
    const isSelf = accountID === selfAccountID;
    const { numVotes, hasSelfVoted, hasSelfVotedForThis } = this.calcThumbsData();
    const animationClass = this.state.shouldPlayAnimation ? 'animation' : '';

    if (hasSelfVotedForThis) {
      return (
        <div
          className={VotedFor}
          onClick={this.onRevokeClick.bind(this)}
          onMouseEnter={this.onMouseOverSelfVote.bind(this)}
          onMouseLeave={this.onMouseLeaveSelfVote.bind(this)}
        >
          <div className={`${ButtonContent} ${animationClass}`}>
            <span>{numVotes}</span>
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
      const disable = hasSelfVoted || !onSameTeam;
      return (
        <Button
          type={disable ? 'blue-outline' : 'blue'}
          disabled={disable}
          styles={ThumbsupButton}
          onClick={this.onThumbsUpClick.bind(this)}
          text={
            <div className={`${ButtonContent} ${animationClass}`}>
              <span>{numVotes}</span>
              <span className={`${Icon} icon-thumbsup`} />
            </div>
          }
        />
      );
    }

    return (
      <div className={ThumbsupSelf}>
        <div className={`${ButtonContent} ${animationClass}`}>
          <span>{numVotes}</span>
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

  private playAnimation() {
    this.setState({ shouldPlayAnimation: true });

    window.setTimeout(() => {
      this.setState({ shouldPlayAnimation: false });
    }, ANIMATION_DURATION * 1000);
  }

  private calcThumbsData(): { numVotes: number; hasSelfVoted: boolean; hasSelfVotedForThis: boolean } {
    const { accountID, selfAccountID, thumbsUp, requests } = this.props;
    const thumbsForThis = thumbsUp?.[accountID];
    const requested = requests.queued?.setThumbsUp ?? requests.active?.setThumbsUp;
    const requestForThis = requested === accountID;
    // case #1 - we have no votes to check
    if (!thumbsForThis) {
      return { numVotes: 0, hasSelfVoted: !!requested, hasSelfVotedForThis: requestForThis };
    }

    // case #2 - we voted for this option, but may have revoked it
    let found = thumbsForThis.indexOf(selfAccountID) >= 0;
    let count = thumbsForThis.length;
    if (found) {
      if (requested && !requestForThis) {
        count -= 1;
        found = false;
      }
      return { numVotes: count, hasSelfVoted: true, hasSelfVotedForThis: found };
    }

    // case #3 - we voted for this option but the server hasn't acknowledged it yet
    if (requestForThis) {
      return { numVotes: count + (found ? 0 : 1), hasSelfVoted: true, hasSelfVotedForThis: true };
    }

    // case #4 - we have a vote in flight for something else (possibly a revoke)
    if (requested) {
      return { numVotes: count + (found ? -1 : 0), hasSelfVoted: true, hasSelfVotedForThis: false };
    }

    // case #5 - no request in flight, check if we've voted for something else
    let hasSelfVoted = false;
    for (const acct in thumbsUp) {
      const votes = thumbsUp[acct];
      if (votes.includes(selfAccountID)) {
        hasSelfVoted = true;
        break;
      }
    }

    return { numVotes: count, hasSelfVoted, hasSelfVotedForThis: false };
  }

  private onMouseOverSelfVote() {
    this.setState({ mouseOverSelfVote: true });
  }

  private onMouseLeaveSelfVote() {
    this.setState({ mouseOverSelfVote: false });
  }

  private async onThumbsUpClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
    this.props.dispatch(setThumbsUp(this.props.accountID));
  }

  private async onRevokeClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
    this.props.dispatch(revokeThumbsUp());
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { overmindSummary, thumbsUp, requests } = state.gameStats;
  return {
    ...ownProps,
    selfAccountID: state.user.id,
    thumbsUp,
    requests,
    overmindSummary
  };
}

export const ThumbsUpButton = connect(mapStateToProps)(AThumbsUpButton);
