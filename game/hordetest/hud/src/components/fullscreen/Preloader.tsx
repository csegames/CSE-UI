/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

export const preloadQueryEvents = {
  championInfoContext: 'preload-gql-championInfoContext',
  colossusProfileContext: 'preload-gql-colossusProfileContext',
  myUserContext: 'preload-gql-myUserContext',
  statusContext: 'preload-gql-statusContext',
  warbandContext: 'preload-gql-warbandContext',
  matchmakingContext: 'preload-gql-matchmakingContext',
}

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export interface Props {
  onTotalApiNetworkFailure: () => void;
  onPartialApiNetworkFailure: () => void;
  onLoadComplete: () => void;
}

export interface State {
}

export class Preloader extends React.Component<Props, State> {
  private evhList: EventHandle[] = [];
  private gqlDataLoaded: { [queryID: string]: boolean } = {
    [preloadQueryEvents.championInfoContext]: false,
    [preloadQueryEvents.colossusProfileContext]: false,
    [preloadQueryEvents.myUserContext]: false,
    [preloadQueryEvents.statusContext]: false,
    [preloadQueryEvents.warbandContext]: false,
    [preloadQueryEvents.matchmakingContext]: false,
  };
  private successfulGQLQueries: { [queryID: string]: boolean } = {};

  public render() {
    return (
      <Container>

      </Container>
    );
  }

  public componentDidMount() {
    this.initializeEventHandlers();
  }

  public componentWillUnmount() {
    this.evhList.forEach((evh) => {
      evh.clear();
    });
  }

  private initializeEventHandlers = () => {
    Object.values(preloadQueryEvents).forEach((eventName) => {
      this.evhList.push(game.on(eventName, (isSuccessful) => this.handlePreloadEvent(eventName, isSuccessful)));
    });
  }

  private handlePreloadEvent = (eventName: string, isSuccessful: boolean) => {
    // Regardless of if successful or not, we say that it's loaded so we can move on to
    // another screen where we can decide what to do with unsuccessful gql queries.

    if (isSuccessful) {
      this.successfulGQLQueries[eventName] = true;
    }

    this.gqlDataLoaded[eventName] = true;
    this.checkForLoadCompletion();
  }

  private checkForLoadCompletion = () => {
    let isAllGQLDataLoaded = false;
    if (!Object.values(this.gqlDataLoaded).includes(false)) {
      isAllGQLDataLoaded = true;
    }

    if (!isAllGQLDataLoaded) return;

    this.props.onLoadComplete();

    const successfulGQLQueryList = Object.keys(this.successfulGQLQueries);
    if (successfulGQLQueryList.length === 0) {
      this.props.onTotalApiNetworkFailure();
      return;
    }

    const gqlDataLoadedList = Object.keys(this.gqlDataLoaded);
    if (successfulGQLQueryList.length < gqlDataLoadedList.length) {
      this.props.onPartialApiNetworkFailure();
    }
  }
}
