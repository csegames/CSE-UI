/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {events, buildUIMode} from 'camelot-unchained';

import ActionBar from '../../widgets/ActionBar';
import BuildingPanel from '../../widgets/BuildPanel';
import SelectionView from '../../widgets/SelectionView';

import requester from '../../services/session/requester';
import {BuildingItem, BuildingItemType} from '../../lib/BuildingItem';

function select(state: any): any {
  return {
    selectedItem: state.selection.selectedItem,
    buildingMode: state.building.mode
  }
}

export interface BuildingAppProps {
  dispatch?: (action: any) => void;
  buildingMode?: buildUIMode;
  selectedItem?: BuildingItem;
}

export interface BuildingAppState {
}

class BuildingApp extends React.Component<BuildingAppProps, BuildingAppState> {

  public name = 'building-app';

  constructor(props: BuildingAppProps) {
    super(props);
  }

  createActionButton(active: boolean): JSX.Element {
    if (active) {
      return (<ActionBar buildingMode={this.props.buildingMode}/>);
    }
    return null;
  }

  selectedItem = (item: BuildingItem) => {
    this.setState({ selectedItem: item } as BuildingAppState);
  }

  createBuildingPanel(active: boolean): JSX.Element {
    if (active) {
      return (<BuildingPanel />);
    }
    return null;
  }

  createSelectionView(active: boolean): JSX.Element {
    if (active) {
      return (<SelectionView item={this.props.selectedItem} />);
    }
    return null;
  }

  render() {
    const active: boolean = this.props.buildingMode > 0;
    const triggerMode: buildUIMode = active ? buildUIMode.NOTBUILDING : buildUIMode.PLACINGPHANTOM;
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
