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

// test building item for selection

import {BuildingItem, BuildingItemType} from '../../lib/BuildingItem';
var selectedItem = {
  type: BuildingItemType.Block,
  icon: 'images/cube.png',
  name: '',
  description: '',
} as BuildingItem;


function select(state: any): any {
  return {
    selectedItem: state.selection.selectedItem,
  }
}

export interface BuildingAppProps {
  dispatch?: (action: any) => void;
  selectedItem?: BuildingItem;
}

export interface BuildingAppState {
  buildingMode: number;
}

class BuildingApp extends React.Component<BuildingAppProps, BuildingAppState> {

  public name = 'building-app';

  constructor(props: BuildingAppProps) {
    super(props);
    this.state = {
      buildingMode: 1
    }
  }
  
  componentWillMount() {
    this.props.dispatch(selectItem(selectedItem));
  }

  componentDidMount() {
    client.OnBuildingModeChanged((buildingMode: number) => {
      console.log(buildingMode);
      this.setState({buildingMode: buildingMode});
    });
  }


  render() {

    if (this.state.buildingMode == 0) {
      return (
        <div classname='building'>
          <div id="building-button" onClick={() => this.state.buildingMode == 0 ? client.SetBuildingMode(1) : client.SetBuildingMode(0)}>
            <div/>
          </div>
        </div>
      )
    }

    return (
      <div className='building'>
        <div id="building-button" onClick={() => this.state.buildingMode == 0 ? client.SetBuildingMode(1) : client.SetBuildingMode(0)}>
          <div/>
        </div>
      <ActionBar />
      <BuildingPanel onItemSelect={(item: BuildingItem) => this.props.dispatch(selectItem(item))}/>
      <SelectionView item={this.props.selectedItem} />  
    </div>
    )
  }
}

export default connect(select)(BuildingApp);
