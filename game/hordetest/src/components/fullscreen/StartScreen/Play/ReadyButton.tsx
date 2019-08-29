/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import gql from 'graphql-tag';
// import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import * as webAPI from '@csegames/library/lib/camelotunchained/webAPI';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';

import { InputContext, InputContextState } from 'context/InputContext';
// import { Button } from '../../Button';
import { Match } from '@csegames/library/lib/_baseGame/graphql/schema';

const query = gql`
  query ReadyButtonQuery {
    myScenarioQueue {
      availableMatches {
        id
        name
        isQueued
        isInScenario
      }
    }
  }
`;

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

const QueueTimerText = styled.div`
  font-size: 20px;
`;

const ConsoleButton = styled.div`
  display: flex;
  align-items: center;
`;

const QueuedButton = styled.div`
  display: flex;
  flex-direction: column;
`;

const ButtonIcon = styled.span`
  font-size: 24px;
  margin-right: 5px;
`;

export interface Props {
  onReady: () => void;
}

export interface State {
  match: Match;
  inQueueTimer: number;
  isCancelling: boolean;
}

export class ReadyButton extends React.Component<Props, State> {
  private pollIntervalHandle: number;
  private graphql: GraphQLResult<any>;

  constructor(props: Props) {
    super(props);
    this.state = {
      match: null,
      inQueueTimer: 0,
      isCancelling: false,
    }
  }

  public render() {
    return (
      <InputContext.Consumer>
        {(inputContext: InputContextState) => (
            <>
              <GraphQL query={query} onQueryResult={this.handleQueryResult} />
              <ReadyButtonStyle onClick={this.onClick}>{this.renderButton(inputContext.isConsole)}</ReadyButtonStyle>
            </>
        )}
      </InputContext.Consumer>
    );
  }

  private renderButton = (isConsole: boolean) => {
    if (this.state.isCancelling) {
      return <ConsoleButton>Cancelling...</ConsoleButton>;
    }

    if (this.state.match && this.state.match.isQueued) {
      return (
        <QueuedButton>
          {isConsole ? <ConsoleButton><ButtonIcon className='icon-xb-a' /> Cancel</ConsoleButton> : 'Cancel'}
          <QueueTimerText>{this.state.inQueueTimer}s</QueueTimerText>
        </QueuedButton>
      )
    }

    return (
      isConsole ?
        <ConsoleButton>
          <ButtonIcon className='icon-xb-a'></ButtonIcon> Ready
        </ConsoleButton> :
        'Ready'
    )
  }

  public componentWillUnmount() {
    this.stopPollCheck();
  }

  private onClick = () => {
    // TEMP
    this.props.onReady();
    return;

    // Real matchmaking logic
    const { match } = this.state;

    if (match && match.isQueued) {
      this.removeFromQueue();
    } else {
      this.addToQueue();
    }
  }

  private handleQueryResult = (gql: GraphQLResult<any>) => {
    this.graphql = gql;
    if (!gql || !gql.data || !gql.data.myScenarioQueue) return gql;

    const availableMatches = gql.data.myScenarioQueue.availableMatches;
    const availableMatch: Match = availableMatches.find((match: Match) => match.name === 'Horde Test');

    if (!availableMatch) {
      return gql;
    }

    if (!this.state.match && availableMatch.isQueued) {
      this.startPollCheck();
    }

    this.setState({ match: availableMatch });
    return gql;
  }

  private addToQueue = async () => {
    const { match } = this.state;
    if (!match.id || match.isQueued || match.isInScenario) return;

    const res = await webAPI.ScenarioAPI.AddToQueue(
      webAPI.defaultConfig,
      game.shardID,
      hordetest.game.selfPlayerState.characterID,
      match.id,
    );

    if (res.ok) {
      this.setState({ match: { ...this.state.match, isQueued: true } });
      this.startPollCheck();
    }
  }

  private removeFromQueue = async () => {
    const { match } = this.state;
    if (!match.id) return;

    const res = await webAPI.ScenarioAPI.RemoveFromQueue(
      webAPI.defaultConfig,
      game.shardID,
      hordetest.game.selfPlayerState.characterID,
      match.id,
    );

    if (res.ok) {
      this.setState({ isCancelling: true });
    }
  }

  private startPollCheck = () => {
    this.pollIntervalHandle = window.setInterval(this.handlePollCheck, 1000);
  }

  private stopPollCheck = () => {
    if (this.pollIntervalHandle) {
      window.clearInterval(this.pollIntervalHandle);
      this.pollIntervalHandle = null;
    }
  }

  private handlePollCheck = () => {
    if (this.state.match.isInScenario) {
      this.stopPollCheck();
      this.setState({ inQueueTimer: 0 });
      this.props.onReady();
      return;
    }

    if (!this.state.match.isQueued) {
      this.stopPollCheck();
      this.setState({ isCancelling: false, inQueueTimer: 0 });
      return;
    }

    const newTime = this.state.inQueueTimer + 1;

    if (this.graphql && newTime % 2 === 0) {
      // refetch every 5 seconds
      this.graphql.refetch();
    }

    this.setState({ inQueueTimer: newTime });
  }
}
