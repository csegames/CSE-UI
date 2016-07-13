/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import TabbedPane from '../TabbedPane';

import Blocks from '../../widgets/Blocks';
import RecentSelections from '../../widgets/RecentSelections';
import DropLight from '../../widgets/DropLight';
import Blueprints from '../../widgets/Blueprints';

import {BuildingItem} from '../../../../lib/BuildingItem'


export interface BuildPanelProps {
  onItemSelect?: (item: BuildingItem) => void;
}

export interface BuildPanelState {
  minimized: boolean;
  item: BuildingItem;
  recentitems: BuildingItem[];
}

class BuildPanel extends React.Component<BuildPanelProps, BuildPanelState> {

  constructor(props: BuildPanelProps) {
    super(props);
    this.state = {
      minimized: false,
      recentitems: this.buildRecentItemList(null, []),
      item: null
    }
  }

  onMinMax() {
    this.setState({
      minimized: !this.state.minimized,
    } as BuildPanelState);
  }

  selectItem = (item: BuildingItem) => {
    this.props.onItemSelect(item);

    const newItems: BuildingItem[] = this.buildRecentItemList(item, this.state.recentitems);

    this.setState({
      item: item,
      recentitems: newItems,
    } as BuildPanelState);
  }

  buildRecentItemList(item: BuildingItem, items: BuildingItem[]) {
    const newItems: BuildingItem[] = [];
    newItems.push(item);
    for (let i = 0; i < 11; i++) {
      let current: BuildingItem = items[i];
      let add: boolean = current == null || !(current.id == item.id && current.type == item.type);
      if (add) {
        newItems.push(current);
      }
    }
    return newItems;
  }

  render() {
    return (
      <div className={`build-panel ${this.state.minimized ? 'minimized' : ''}`}>
        <header>
          <span className='min-max' onClick={() => this.onMinMax() }>
            {this.state.minimized ? '<<' : '>>'}
          </span>
          <span className='info'>?</span>
        </header>

        <Blocks minimized={this.state.minimized} onItemSelect={this.selectItem}/>
        <RecentSelections minimized={this.state.minimized} onItemSelect={this.props.onItemSelect}
          item={this.state.item}
          items={this.state.recentitems} />
        <Blueprints minimized={this.state.minimized} onItemSelect={this.selectItem}/>
        <DropLight minimized={this.state.minimized} onItemSelect={this.selectItem}/>
      </div>
    )
  }
}

export default BuildPanel;
