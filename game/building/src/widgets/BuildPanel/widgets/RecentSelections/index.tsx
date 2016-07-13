/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {BuildPaneProps} from '../../lib/BuildPane';
import {BuildingItem} from '../../../../lib/BuildingItem';
import TabbedPane from '../../components/TabbedPane';

interface RecentSelectionsProps extends BuildPaneProps {
  item: BuildingItem
  items: BuildingItem[],
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
      <TabbedPane tabs={[this.props.minimized ? 'Recent' : 'Recently Used']}>
        <div className={`recent-selections ${this.props.minimized ? 'minimied' : ''}`}>
          { this.props.items.map((item: BuildingItem, index: number) => {
            if (item == null)
              return (<span key={'empty' + index}  className='icon'></span>)
            return (<span key={item.id}  className={this.isSelectedItem(item, selection) ? 'active icon' : 'icon'}
              onClick={() => this.selectItem(item) } >{item.element}</span>)
          })
          }
        </div>
      </TabbedPane>
    )
  }
}

export default RecentSelections;
