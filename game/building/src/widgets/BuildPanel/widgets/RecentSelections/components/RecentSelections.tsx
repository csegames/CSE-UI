/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';

import {GlobalState} from '../services/session/reducer';

import {BuildingItem} from '../../../../../lib/BuildingItem';


function select(state: GlobalState): any {
  return {
    item: state.recents.selectedItem,
    items: state.recents.recentSelections
  }
}

interface RecentSelectionsProps {
  dispatch?: any,
  item?: BuildingItem
  items?: BuildingItem[],
  minimized?: boolean
}

interface RecentSelectionsState {
}

class RecentSelections extends React.Component<RecentSelectionsProps, RecentSelectionsState> {

  constructor(props: RecentSelectionsProps) {
    super(props);
  }

  selectItem(item: BuildingItem) {
    item.select();
  }

  isSelectedItem(item: BuildingItem, selection: BuildingItem) {
    if (selection == null) return false;

    return item.id == selection.id;
  }

  render() {
    const selection = this.props.item;

    return (
        <div className={`recent-selections ${this.props.minimized ? 'minimized' : ''}`}>
          { this.props.items.map((item: BuildingItem, index: number) => {
            if (item == null)
              return (<span key={'empty' + index}  className='icon'></span>)
            return (<span key={item.id}  className={this.isSelectedItem(item, selection) ? 'active icon' : 'icon'}
              onClick={() => this.selectItem(item) } >{item.element}</span>)
          })
          }
        </div>
    )
  }
}

export default connect(select)(RecentSelections);
