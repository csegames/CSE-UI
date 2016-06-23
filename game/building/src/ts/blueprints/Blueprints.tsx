/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client } from 'camelot-unchained';
import { store, BuildingState } from '../stores/Building';
import { blueprints, Blueprint } from '../stores/BlueprintStore';
import BlueprintIcon from './BlueprintIcon';
import Loading from '../common/Loading';
import BlueprintFilter from './BlueprintFilter';
import SaveBlueprint from './SaveBlueprint';
import BlueprintActions from './BlueprintActions';

export interface BlueprintsProps {
  state: BuildingState;
};
export interface BlueprintsState {

};

class Blueprints extends React.Component<BlueprintsProps, BlueprintsState> {
  public name: string = 'Blueprints';

  constructor(props: BlueprintsProps) {
    super(props);
  }

  select = (blueprint: Blueprint): void => {
    client.SelectBlueprint(blueprint.id);
    store.dispatch({ type: 'SELECT_BLUEPRINT', id: blueprint.id } as any);
  }

  render() {
    const state: BuildingState = this.props.state;
    const content: JSX.Element[] = [];
    let actions: JSX.Element;
    if (!state.blocks.blueprintsLoaded) {
      blueprints.init();
      content.push(<Loading key="0" message="Loading Blueprints..."/>);
    } else {
      const bps: Blueprint[] = blueprints.getBlueprints();
      const filter: string = state.filter.blueprints;
      bps.forEach((blueprint: Blueprint, i: number): void => {
        if (!filter || blueprint.name.toLowerCase().indexOf(filter) !== -1) {
          content.push(
            <BlueprintIcon key={i}
              blueprint={blueprint}
              select={this.select}
              selected={blueprint.id == state.selection.blueprint}
              />
          );
        }
      });
    }
    if (state.ui.saving) {
      actions = <SaveBlueprint/>;
    } else {
      const blueprint: Blueprint = blueprints.getBlueprint(state.selection.blueprint);
      actions = <BlueprintActions blueprint={blueprint}
                  buildingMode={state.ui.mode}
                  copied={state.blocks.blueprintCopied}
                  />;
    }
    return (
      <div className="blueprints">
        <BlueprintFilter/>
        <div className="blueprint-actions">
          {actions}
        </div>
        <div className="blueprint-browser scrollable">
          {content}
        </div>
      </div>
    );
  }
}

export default Blueprints;
