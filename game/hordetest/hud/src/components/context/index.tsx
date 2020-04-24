/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

// Context
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
import { MyUserContextProvider } from './MyUserContext';

// Action Handlers
import { ActionHandlers } from './actionhandler';

export class SharedContextProviders extends React.Component<{}> {
  public render() {
    return (
      <FullScreenNavContextProvider>
        <ChampionInfoContextProvider>
          <MatchmakingContextProvider>
            <MyUserContextProvider>
              <ColossusProfileProvider>
                <StatusContextProvider>
                  <WarbandContextProvider>

                    <ActionHandlers />
                    {this.props.children}

                  </WarbandContextProvider>
                </StatusContextProvider>
              </ColossusProfileProvider>
            </MyUserContextProvider>
          </MatchmakingContextProvider>
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
              {this.props.children}
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
      <InputContextProvider disabled>
        {this.props.children}
      </InputContextProvider>
    );
  }
}
