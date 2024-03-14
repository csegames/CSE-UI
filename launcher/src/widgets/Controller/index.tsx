/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Routes } from '../../services/session/routes';

import { ContentPhase } from '../../services/ContentPhase';
import { ControllerContext, ControllerContextProvider } from './ControllerContext';
import { ControllerDisplay } from './components/ControllerDisplay';

export interface ControllerProps {
  phase: ContentPhase;
  activeRoute: Routes;
}

export class Controller extends React.Component<ControllerProps, {}> {
  public render() {
    return (
      <ControllerContextProvider shouldConnect={this.props.phase != ContentPhase.Login}>
        <ControllerContext.Consumer>
          {({ servers, selectedServer, selectedCharacter, onUpdateState }) => (
            <ControllerDisplay
              {...this.props}
              servers={servers}
              selectedServer={selectedServer}
              selectedCharacter={selectedCharacter}
              onUpdateState={onUpdateState}
            />
          )}
        </ControllerContext.Consumer>
      </ControllerContextProvider>
    );
  }
}
