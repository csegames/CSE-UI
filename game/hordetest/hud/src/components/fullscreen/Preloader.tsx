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
}

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

export interface Props {
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
  };

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
      this.evhList.push(game.on(eventName, () => this.handlePreloadEvent(eventName)));
    });
  }

  private handlePreloadEvent = (eventName: string) => {
    this.gqlDataLoaded[eventName] = true;
    this.checkForLoadCompletion();
  }

  private checkForLoadCompletion = () => {
    let isAllGQLDataLoaded = false
    if (!Object.values(this.gqlDataLoaded).find(isLoaded => !isLoaded)) {
      isAllGQLDataLoaded = true;
    }

    if (isAllGQLDataLoaded) {
      this.props.onLoadComplete();
    }
  }
}
