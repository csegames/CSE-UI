/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { AbilityBarToggleContextProvider } from './AbilityBarToggleContext';
import { AbilityBookContextProvider } from './AbilityBookContext';
import { ActionViewContextProvider } from './ActionViewContext';
import { WarbandContextProvider } from './WarbandContext';

export class GlobalProviders extends React.Component<{}> {
  public render() {
    return (
      <AbilityBarToggleContextProvider>
        <AbilityBookContextProvider>
          <ActionViewContextProvider>
            <WarbandContextProvider>
              {this.props.children}
            </WarbandContextProvider>
          </ActionViewContextProvider>
        </AbilityBookContextProvider>
      </AbilityBarToggleContextProvider>
    );
  }
}
