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
import { Error } from '../../Error';

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

export interface Props {
  warbandContextState: WarbandContextState;
  inputContext: InputContextState;
  matchmakingContext: MatchmakingContextState;
  isWaitingForRequest: boolean;

  onReady: () => void;
  onUnready: () => void;
  enterMatchmaking: () => Promise<RequestResult>;
  cancelMatchmaking:  () => Promise<RequestResult>;
}

export interface State {
  isSearching: boolean;
}

class ReadyButtonWithInjectedContext extends React.Component<Props, State> {
  private matchmakingEVH: EventHandle;
  constructor(props: Props) {
    super(props);

    this.state = {
      isSearching: false,
    };
  }

  public render() {
    const { inputContext, isWaitingForRequest } = this.props;
    const searchingClass = this.state.isSearching ? 'searching' : '';
    return (
      <Button
        type='primary'
        styles={`${searchingClass} ${ReadyButtonStyle}`}
        text={this.renderButton(inputContext.isConsole)}
        isLoading={isWaitingForRequest}
        onClick={this.onClick}>
          {this.renderButton(inputContext.isConsole)}
      </Button>
    );
  }

  private renderButton = (isConsole: boolean) => {
    if (this.props.matchmakingContext.isEntered && !this.props.warbandContextState.groupID) {
      return (
        isConsole ?
          <ConsoleButton>
            <ButtonIcon className='icon-xb-a'></ButtonIcon> Cancel
          </ConsoleButton> :
          'Cancel'
      );
    }

    const myMemberState = this.props.warbandContextState.groupMembers[game.characterID];
    if (myMemberState && myMemberState.isReady) {
      return (
        isConsole ?
          <ConsoleButton>
            <ButtonIcon className='icon-xb-a'></ButtonIcon> Unready
          </ConsoleButton> :
          'Unready'
      );
    }

    if (myMemberState && !myMemberState.isReady) {
      return (
        isConsole ?
          <ConsoleButton>
            <ButtonIcon className='icon-xb-a'></ButtonIcon> Ready
          </ConsoleButton> :
          'Ready'
      );
    }

    return (
      isConsole ?
        <ConsoleButton>
          <ButtonIcon className='icon-xb-a'></ButtonIcon> Play
        </ConsoleButton> :
        'Play'
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

  private readyUp = async () => {
    const res = await webAPI.GroupsAPI.ReadyUpV1(webAPI.defaultConfig, this.props.warbandContextState.groupID);
    if (res.ok) {
      this.props.onReady();
    } else {
      // Show error modal
      try {
        const data = JSON.parse(res.data).FieldCodes[0];
        this.showErrorModal('Failed To Ready', data.Message, data.Code);
      } catch (e) {
        this.showErrorModal('Failed To Ready', 'Unknown reason', -1);
      }
    }
  }

  private unready = async () => {
    const res = await webAPI.GroupsAPI.UnReadyV1(webAPI.defaultConfig, this.props.warbandContextState.groupID);
    if (res.ok) {
      this.props.onUnready();
    } else {
      // Show error modal
      try {
        const data = JSON.parse(res.data).FieldCodes[0];
        this.showErrorModal('Failed To Unready', data.Message, data.Code);
      } catch (e) {
        this.showErrorModal('Failed To Unready', 'Unknown reason', -1);
      }
    }
  }

  private enterMatchmaking = async () => {
    const res = await this.props.enterMatchmaking();
    if (res.ok) {
      this.props.matchmakingContext.onEnterMatchmaking();
    } else {
      // Show error modal
      try {
        const data = JSON.parse(res.data).FieldCodes[0];
        this.showErrorModal('Failed To Enter Matchmaking', data.Message, data.Code);
      } catch (e) {
        this.showErrorModal('Failed To Enter Matchmaking', 'Unknown reason', -1);
      }
    }
  }

  private cancelMatchmaking = async () => {
    // If solo, just cancel matchmaking
    const res = await this.props.cancelMatchmaking();
    if (res.ok) {
      this.props.matchmakingContext.onCancelMatchmaking();
    } else {
      // Show error modal
      try {
        const data = JSON.parse(res.data).FieldCodes[0];
        this.showErrorModal('Failed To Cancel Matchmaking', data.Message, data.Code);
      } catch (e) {
        this.showErrorModal('Failed To Cancel Matchmaking', 'Unknown reason', -1);
      }
    }
  }

  private showErrorModal = (title: string, message: string, errorCode: number) => {
    game.trigger('show-middle-modal', <Error title={title} message={message} errorCode={errorCode} />)
  }
}

export function ReadyButton(props: {
  onReady: () => void,
  onUnready: () => void,
  enterMatchmaking: () => Promise<RequestResult>,
  cancelMatchmaking:  () => Promise<RequestResult>,
  isWaitingForRequest: boolean,
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
      isWaitingForRequest={props.isWaitingForRequest}
    />
  )
}
