/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { RequestResult } from '@csegames/library/lib/_baseGame';
import { webAPI } from '@csegames/library/lib/hordetest';
import { IMatchmakingUpdate, MatchmakingUpdateType } from '@csegames/library/lib/hordetest/graphql/schema';

import { InputContext, InputContextState } from 'context/InputContext';
import { MatchmakingContext, MatchmakingContextState, onMatchmakingUpdate } from 'context/MatchmakingContext';
import { WarbandContext, WarbandContextState } from 'context/WarbandContext';
import { Button } from '../../Button';
import { ErrorComponent } from '../../Error';
import { formatTime } from 'lib/timeHelpers';

const ReadyButtonStyle = css`
  position: relative;
  cursor: pointer;
  color: white;
  text-transform: uppercase;
  text-align: center;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  width: 250px;
  height: 90px;
  font-size: 35px;
  color: white;
  box-shadow: inset 0 5px 50px 5px rgba(255, 150, 0, 0.5);
  background: linear-gradient(to bottom, #ffd200, #a53d13);
  border: 2px solid #ff9e57;
  font-family: Colus;
  outline: 1px solid rgba(255, 216, 65, 1);
  outline-offset: -4px;

  &.searching {
    pointer-events: none;
    filter: grayscale(100%);
  }

  div, span {
    cursor: pointer;
  }

  &:hover {
    filter: brightness(120%);
  }

  &:active {
    filter: brightness(90%);
  }

  &:disabled {
    pointer-events: none;
    filter: grayscale(100%) brightness(70%);
    opacity: 1;
  }
}

`;

// const QueueTimerText = styled.div`
//   font-size: 20px;
// `;

const ConsoleButton = styled.div`
  display: flex;
  align-items: center;
`;

// const QueuedButton = styled.div`
//   display: flex;
//   flex-direction: column;
// `;

const ButtonIcon = styled.span`
  font-size: 24px;
  margin-right: 5px;
`;

const SearchingTimerText = styled.div`
  position:absolute;
  top: 60px;
  left:0;
  font-size: 12px;
  width:100%;
`;

export interface Props {
  warbandContextState: WarbandContextState;
  inputContext: InputContextState;
  matchmakingContext: MatchmakingContextState;

  onReady: () => void;
  onUnready: () => void;
  enterMatchmaking: () => Promise<RequestResult>;
  cancelMatchmaking:  () => Promise<RequestResult>;
}

export interface State {
  isSearching: boolean;
  disabled: boolean;
}

interface SearchingTimerStateProps {
  matchmakingContext: MatchmakingContextState;
}

class SearchingTimer extends React.Component<SearchingTimerStateProps,{}> {
  constructor(props: SearchingTimerStateProps) {
    super(props);
  }

  public render() {
    return (
      <SearchingTimerText>
        Searching {formatTime(this.props.matchmakingContext.timeSearching)}
      </SearchingTimerText>
    );
  }
}

class ReadyButtonWithInjectedContext extends React.Component<Props, State> {
  private matchmakingEVH: EventHandle;

  constructor(props: Props) {
    super(props);

    this.state = {
      isSearching: false,
      disabled: false,
    };
  }

  public render() {
    const { inputContext } = this.props;
    const searchingClass = this.state.isSearching ? 'searching' : '';

    const matchmakingContext = this.props.matchmakingContext
    if (this.props.matchmakingContext.isEntered && !this.props.warbandContextState.groupID) {
      return (
        <Button
          type='primary'
          styles={`${searchingClass} ${ReadyButtonStyle}`}
          disabled={this.state.disabled}
          text={
            inputContext.isConsole ?
            <ConsoleButton>
              <ButtonIcon className='icon-xb-a'></ButtonIcon> Cancel
            </ConsoleButton> :
            <span>
              Cancel
              <SearchingTimer matchmakingContext={matchmakingContext} />
            </span>
          }
          onClick={this.onClick}
        />
      );
    }

    const myMemberState = this.props.warbandContextState.groupMembers[game.characterID];
    if (myMemberState && myMemberState.isReady) {
      return (
        <Button
          type='primary'
          styles={`${searchingClass} ${ReadyButtonStyle}`}
          disabled={this.state.disabled}
          text={
            inputContext.isConsole ?
            <ConsoleButton>
              <ButtonIcon className='icon-xb-a'></ButtonIcon> Unready
            </ConsoleButton> :
            'Unready'
          }
          onClick={this.onClick}
        />
      );
    }

    if (myMemberState && !myMemberState.isReady) {
      return (
        <Button
          type='primary'
          styles={`${searchingClass} ${ReadyButtonStyle}`}
          disabled={this.state.disabled}
          text={
            inputContext.isConsole ?
            <ConsoleButton>
              <ButtonIcon className='icon-xb-a'></ButtonIcon> Ready
            </ConsoleButton> :
            'Ready'
          }
          onClick={this.onClick}
        />
      );
    }

    return (
      <Button
        type='primary'
        styles={`${searchingClass} ${ReadyButtonStyle}`}
        disabled={this.state.disabled}
        text={
          inputContext.isConsole ?
          <ConsoleButton>
            <ButtonIcon className='icon-xb-a'></ButtonIcon> Play
          </ConsoleButton> :
          'Play'
        }
        onClick={this.onClick}
      />
    );
  }

  public componentDidMount() {
    this.matchmakingEVH = onMatchmakingUpdate(this.handleMatchmakingUpdate);

    const myMemberState = this.props.warbandContextState.groupMembers[game.characterID];
    if (myMemberState && myMemberState.isReady) {
      this.props.matchmakingContext.onEnterMatchmaking();
    }
  }

  public componentWillUnmout() {
    this.matchmakingEVH.clear();
  }

  private handleMatchmakingUpdate = (matchmakingUpdate: IMatchmakingUpdate) => {
    switch (matchmakingUpdate.type) {
      case MatchmakingUpdateType.Entered: {
        this.setState({ isSearching: true });
        break;
      }
    }
  }

  private onClick = () => {
    const { warbandContextState, matchmakingContext } = this.props;
    if (warbandContextState.groupID) {
      const myMemberState = warbandContextState.groupMembers[game.characterID];
      if (!myMemberState) {
        console.error('We are in a group but we dont have myMemberState. Group ID: ' + warbandContextState.groupID);
        return;
      }

      if (myMemberState && myMemberState.isReady) {
        this.unready();
      } else {
        this.readyUp();
      }
    } else {
      if (matchmakingContext.isEntered) {
        this.cancelMatchmaking();
      } else {
        this.enterMatchmaking();
      }
    }
  }

  private hitButton = async (makeCall: () => Promise<RequestResult>, onSuccess: () => void, failureMessage: string) => {
    try {
      this.setState({disabled: true});
      const res = await makeCall();
      this.setState({disabled: false});

      if (res.ok) {
        onSuccess();
      } else {
        try {
          const data = JSON.parse(res.data).FieldCodes[0];
          this.showErrorModal(failureMessage, data.Message, data.Code);
        } catch (e) {
          this.showErrorModal(failureMessage, 'A problem ocurred. Please try again later', 19107);
        }
      }

    } catch (err) {
      this.showErrorModal(failureMessage, 'A problem ocurred. Please try again later', 19107);
      this.setState({disabled: false});
    }
  }

  private readyUp = async () => {
    console.log("Readying up...");
    await this.hitButton(async () => webAPI.GroupsAPI.ReadyUpV1(webAPI.defaultConfig, this.props.warbandContextState.groupID), this.props.onReady, 'Failed To Ready');
  }

  private unready = async () => {
    console.log("Unreadying...");
    await this.hitButton(async () => webAPI.GroupsAPI.UnReadyV1(webAPI.defaultConfig, this.props.warbandContextState.groupID), this.props.onUnready, 'Failed To Unready');
  }

  private enterMatchmaking = async () => {
    console.log("Entering matchmaking...")
    await this.hitButton(async () => this.props.enterMatchmaking(), this.props.matchmakingContext.onEnterMatchmaking, 'Failed To Enter Matchmaking');
  }

  private cancelMatchmaking = async () => {
    // If solo, just cancel matchmaking
    console.log("Canceling matchmaking...")
    await this.hitButton(async () => this.props.cancelMatchmaking(), this.props.matchmakingContext.onCancelMatchmaking, 'Failed To Cancel Matchmaking');
  }

  private showErrorModal = (title: string, message: string, errorCode: number) => {
    console.error(`Triggering error popup with ${title} ${message} ${errorCode}`);
    console.error(new Error().stack)
    game.trigger('show-middle-modal', <ErrorComponent title={title} message={message} errorCode={errorCode} />, true)
  }
}

export function ReadyButton(props: {
  onReady: () => void,
  onUnready: () => void,
  enterMatchmaking: () => Promise<RequestResult>,
  cancelMatchmaking:  () => Promise<RequestResult>,
}) {
  const inputContextState = useContext(InputContext);
  const matchmakingContextState = useContext(MatchmakingContext);
  const warbandContextState = useContext(WarbandContext);

  return (
    <ReadyButtonWithInjectedContext
      warbandContextState={warbandContextState}
      inputContext={inputContextState}
      matchmakingContext={matchmakingContextState}
      onReady={props.onReady}
      onUnready={props.onUnready}
      enterMatchmaking={props.enterMatchmaking}
      cancelMatchmaking={props.cancelMatchmaking}
    />
  )
}
