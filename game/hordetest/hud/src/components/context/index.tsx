/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { InputContextProvider } from './InputContext';
import { ViewBearingContextProvider } from './ViewBearingContext';
import { ObjectivesContextProvider } from './ObjectivesContext';
import { PlayerPositionContextProvider } from './PlayerPositionContext';
import { ChampionInfoContextProvider } from './ChampionInfoContext';
import { WarbandContextProvider } from './WarbandContext';
import { MatchmakingContextProvider } from './MatchmakingContext';
import { StatusContextProvider } from './StatusContext';
import { ColossusProfileProvider } from './ColossusProfileContext';
import { FullScreenNavContextProvider } from './FullScreenNavContext';

export class SharedContextProviders extends React.Component<{}> {
  public render() {
    return (
      <FullScreenNavContextProvider>
        <ChampionInfoContextProvider>
          {this.props.children}
        </ChampionInfoContextProvider>
      </FullScreenNavContextProvider>
    );
  }
}

export class ContextProviders extends React.Component<{}> {
  public render() {
    return (
      <InputContextProvider>
        <ViewBearingContextProvider>
          <ObjectivesContextProvider>
            <PlayerPositionContextProvider>
              <StatusContextProvider>
                {this.props.children}
              </StatusContextProvider>
            </PlayerPositionContextProvider>
          </ObjectivesContextProvider>
        </ViewBearingContextProvider>
      </InputContextProvider>
    );
  }
}

export class FullScreenContextProviders extends React.Component<{}> {
  public render() {
    return (
      <ChampionInfoContextProvider>
        <MatchmakingContextProvider>
          <WarbandContextProvider>
            <InputContextProvider disabled>
              <ColossusProfileProvider>
                {this.props.children}
              </ColossusProfileProvider>
            </InputContextProvider>
          </WarbandContextProvider>
        </MatchmakingContextProvider>
      </ChampionInfoContextProvider>
    );
  }
}
