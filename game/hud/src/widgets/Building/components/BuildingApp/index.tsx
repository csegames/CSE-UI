/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { buildUIMode } from '@csegames/camelot-unchained';

import ActionBar from '../../widgets/Actionbar';
import BuildingPanel from '../../widgets/BuildPanel';
import SelectionView from '../../widgets/SelectionView';

import { BuildingItem } from '../../lib/BuildingItem';

export interface BuildingAppProps {
  dispatch: (action: any) => void;
  buildingMode: buildUIMode;
  selectedItem: BuildingItem;
}

export interface BuildingAppState {
  selectedItem: BuildingItem;
}

class BuildingApp extends React.Component<BuildingAppProps, BuildingAppState> {

  public name = 'building-app';

  constructor(props: BuildingAppProps) {
    super(props);
  }

  public render() {
    const active: boolean = this.props.buildingMode > 0;
    return (
      <div className='building'>
        {this.createActionButton(active)}
        {this.createBuildingPanel(active)}
        {this.createSelectionView(active)}
      </div>
    );
  }

  public componentDidMount() {

  }

  private createActionButton(active: boolean): JSX.Element {
    if (active) {
      return (<ActionBar />);
    }
    return null;
  }

  private createBuildingPanel(active: boolean): JSX.Element {
    if (active) {
      return (<BuildingPanel />);
    }
    return null;
  }

  private createSelectionView(active: boolean): JSX.Element {
    if (active) {
      return (<SelectionView item={this.props.selectedItem} />);
    }
    return null;
  }
}

function select(state: any): any {
  return {
    selectedItem: state.selection.selectedItem,
    buildingMode: state.building.mode,
  };
}

export default connect(select)(BuildingApp);
