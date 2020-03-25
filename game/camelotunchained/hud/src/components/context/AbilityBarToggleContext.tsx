/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export function getDefaultAbilityBarToggleContextState(): State {
  return {
    showNewAbilityBar: true,
  }
}

export interface State {
  showNewAbilityBar: boolean;
}

export const AbilityBarToggleContext = React.createContext(getDefaultAbilityBarToggleContextState());

export class AbilityBarToggleContextProvider extends React.Component<{}, State> {
  private toggleEVH: EventHandle;
  constructor(props: {}) {
    super(props);

    this.state = {
      ...getDefaultAbilityBarToggleContextState()
    };
  }

  public render() {
    return (
      <AbilityBarToggleContext.Provider value={this.state}>
        {this.props.children}
      </AbilityBarToggleContext.Provider>
    );
  }

  public componentDidMount() {
    this.toggleEVH = game.on('toggleAbilityBar', this.handleToggleAbilityBar);
  }

  public componentWillUnmount() {
    this.toggleEVH.clear();
  }

  private handleToggleAbilityBar = () => {
    this.setState({ showNewAbilityBar: !this.state.showNewAbilityBar });
  }
}
