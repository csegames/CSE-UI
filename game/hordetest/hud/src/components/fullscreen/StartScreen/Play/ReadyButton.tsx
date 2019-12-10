/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
// import gql from 'graphql-tag';
// import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/hordetest';
import { IMatchmakingUpdate, MatchmakingUpdateType } from '@csegames/library/lib/hordetest/graphql/schema';

import { InputContext, InputContextState } from 'context/InputContext';
import { MatchmakingContext, MatchmakingContextState, onMatchmakingUpdate } from 'context/MatchmakingContext';
import { WarbandContext, WarbandContextState } from 'context/WarbandContext';
// import { Button } from '../../Button';

const ReadyButtonStyle = styled.div`
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

  onReady: () => void;
  onUnready: () => void;
  enterMatchmaking: () => void;
}

export interface State {
  isReady: boolean;
  isSearching: boolean;
}

class ReadyButtonWithInjectedContext extends React.Component<Props, State> {
  private matchmakingEVH: EventHandle;
  constructor(props: Props) {
    super(props);

    this.state = {
      isReady: false,
      isSearching: false,
    };
  }

  public render() {
    const { inputContext } = this.props;
    const searchingClass = this.state.isSearching ? 'searching' : '';
    return (
      <ReadyButtonStyle
        className={searchingClass}
        onClick={this.onClick}>
          {this.renderButton(inputContext.isConsole)}
      </ReadyButtonStyle>
    );
  }

  private renderButton = (isConsole: boolean) => {
    if (this.state.isSearching) {
      return 'Searching...';
    }

    if (this.state.isReady) {
      return (
        isConsole ?
          <ConsoleButton>
            <ButtonIcon className='icon-xb-a'></ButtonIcon> Unready
          </ConsoleButton> :
          'Unready'
      );
    }

    return (
      isConsole ?
        <ConsoleButton>
          <ButtonIcon className='icon-xb-a'></ButtonIcon> Ready
        </ConsoleButton> :
        'Ready'
    )
  }

  public componentDidMount() {
    this.matchmakingEVH = onMatchmakingUpdate(this.handleMatchmakingUpdate);

    const myMemberState = this.props.warbandContextState.groupMembers[hordetest.game.selfPlayerState.characterID];
    if (myMemberState && myMemberState.isReady) {
      this.setState({ isReady: true });
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const prevMemberState = prevProps.warbandContextState.groupMembers[hordetest.game.selfPlayerState.characterID];
    const myMemberState = this.props.warbandContextState.groupMembers[hordetest.game.selfPlayerState.characterID];

    const prevIsReady = prevMemberState && prevMemberState.isReady;
    const myIsReady = myMemberState && myMemberState.isReady;
    if (prevIsReady !== myIsReady) {
      this.setState({ isReady: myIsReady });
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
    if (this.state.isReady) {
      this.setState({ isReady: false });
      this.unready();
    } else {
      this.setState({ isReady: true });
      this.readyUp();
    }
  }

  private readyUp = async () => {
    if (!this.props.warbandContextState.groupID) {
      this.props.enterMatchmaking();
      return;
    }

    const res = await webAPI.GroupsAPI.ReadyUpV1(webAPI.defaultConfig, this.props.warbandContextState.groupID);
    if (!res.ok) {
      // TODO: Handle error
      this.setState({ isReady: false });
    } else {
      this.props.onReady();
    }
  }

  private unready = async () => {
    const res = await webAPI.GroupsAPI.UnReadyV1(webAPI.defaultConfig, this.props.warbandContextState.groupID);
    if (!res.ok) {
      // TODO: Handle error
      this.setState({ isReady: true });
    } else {
      this.props.onUnready();
    }
  }
}

export function ReadyButton(props: { onReady: () => void, onUnready: () => void, enterMatchmaking: () => void }) {
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
    />
  )
}
