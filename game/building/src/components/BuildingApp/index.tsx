/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {client} from 'camelot-unchained';

import ActionBar from '../../widgets/ActionBar';
import BuildingPanel from '../../widgets/BuildPanel';
import SelectionView from '../../widgets/SelectionView';

import {selectItem} from '../../services/session/selection';
import requester from '../../services/session/requester';

// test building item for selection

import {BuildingItem, BuildingItemType} from '../../lib/BuildingItem';

function select(state: any): any {
  return {
    selectedItem: state.selection.selectedItem,
  }
}

export interface BuildingAppProps {
  dispatch?: (action: any) => void;
}

export interface BuildingAppState {
  buildingMode: number;
  selectedItem: BuildingItem;
}

class BuildingApp extends React.Component<BuildingAppProps, BuildingAppState> {

  public name = 'building-app';

  private modeListener = (buildingMode: number) => {
    this.setState({ buildingMode: buildingMode } as BuildingAppState);
  };


  constructor(props: BuildingAppProps) {
    super(props);
    this.state = {
      buildingMode: 0,
      selectedItem: null
    }
  }

  componentDidMount() {
    requester.listenForModeChange(this.modeListener);
  }

  componentWillUnmount() {
    requester.unlistenForModeChange(this.modeListener);
  }

  createActionButton(active: boolean): JSX.Element {
    if (active) {
      return (<ActionBar />);
    }
    return null;
  }

  selectedItem = (item: BuildingItem) => {
    this.setState({ selectedItem: item } as BuildingAppState);
  }

  createBuildingPanel(active: boolean): JSX.Element {
    if (active) {
      return (<BuildingPanel onItemSelect={this.selectedItem}/>);
    }
    return null;
  }

  createSelectionView(active: boolean): JSX.Element {
    if (active) {
      return (<SelectionView item={this.state.selectedItem} />);
    }
    return null;
  }

  render() {
    const active: boolean = this.state.buildingMode > 0;
    const triggerMode: number = active ? 0 : 1;

    return (
      <div className='building'>
        <div id="building-button" className={active ? 'active' : ''}
          onClick={() => requester.changeMode(triggerMode) }>
          <div/>
        </div>
        {this.createActionButton(active) }
        {this.createBuildingPanel(active) }
        {this.createSelectionView(active) }
      </div>
    )
  }
}

export default connect(select)(BuildingApp);
