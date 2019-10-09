/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { InputContextProvider } from './InputContext';
import { ScreenContextProvider } from './ScreenContext';
import { ViewBearingContextProvider } from './ViewBearingContext';
import { ActiveObjectivesContextProvider } from './ActiveObjectivesContext';
import { PlayerPositionContextProvider } from './PlayerPositionContext';

export class ContextProviders extends React.Component<{}> {
  public render() {
    return (
      <InputContextProvider>
        <ScreenContextProvider>
          <ViewBearingContextProvider>
            <ActiveObjectivesContextProvider>
              <PlayerPositionContextProvider>
                {this.props.children}
              </PlayerPositionContextProvider>
            </ActiveObjectivesContextProvider>
          </ViewBearingContextProvider>
        </ScreenContextProvider>
      </InputContextProvider>
    );
  }
}
