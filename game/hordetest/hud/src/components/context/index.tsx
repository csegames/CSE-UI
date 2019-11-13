/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { InputContextProvider } from './InputContext';
import { ScreenContextProvider } from './ScreenContext';
import { ViewBearingContextProvider } from './ViewBearingContext';
import { ObjectivesContextProvider } from './ObjectivesContext';
import { PlayerPositionContextProvider } from './PlayerPositionContext';
import { ChampionInfoContextProvider } from './ChampionInfoContext';

export class ContextProviders extends React.Component<{}> {
  public render() {
    return (
      <InputContextProvider>
        <ScreenContextProvider>
          <ChampionInfoContextProvider>
            <ViewBearingContextProvider>
              <ObjectivesContextProvider>
                <PlayerPositionContextProvider>
                  {this.props.children}
                </PlayerPositionContextProvider>
              </ObjectivesContextProvider>
            </ViewBearingContextProvider>
          </ChampionInfoContextProvider>
        </ScreenContextProvider>
      </InputContextProvider>
    );
  }
}
