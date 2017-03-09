/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-25 11:32:24
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-28 16:55:40
 */

import * as React from 'react';
import { events } from 'camelot-unchained';

enum QuickSelectDirection {
  DOWN,
  UP,
  LEFT,
  RIGHT
}

export interface QuickSelectProps {
  items: any[];
  selectedItemIndex?: any;
  activeViewComponentGenerator: (item: any) => any;
  listViewComponentGenerator: (item: any) => any;
  itemHeight: number;
  onSelectedItemChanged: (item: any) => void;
  containerClass?: string;
  showActiveInList?: boolean;
}

export interface QuickSelectState {
  selectedIndex: number;
  showList: boolean;
}

class QuickSelect extends React.Component<QuickSelectProps, QuickSelectState> {
  private static idCounter: number = 0;
  private uniqueId: string = 'QuickSelect-' + QuickSelect.idCounter++;

  constructor(props: QuickSelectProps) {
    super(props);
    this.state = {
      selectedIndex: 0,
      showList: false,
    };
  }

  showList = (visible: boolean) => {
    if (visible) events.fire('play-sound', 'select-change');
    this.setState({showList: visible});
  }

  onItemSelect = (item: any, itemIndex: number) => {
    this.setState({
      selectedIndex: itemIndex,
      showList: false
    });
    this.props.onSelectedItemChanged(item);
  }

  buildListItem = (item: any, itemIndex: number) => {
    const isSelectedItem = itemIndex === this.state.selectedIndex;
    if (this.props.showActiveInList && isSelectedItem) return null;
    return (
      <div key={itemIndex} onClick={this.onItemSelect.bind(this, item, itemIndex)} className={`QuickSelect__listItem ${isSelectedItem ? 'QuickSelect__listItem--selected': ''}`}>
        {this.props.listViewComponentGenerator(item)}
      </div>
    );
  }

  render() {
    if (this.props.items.length == 0) {
      // No items to display
      return (
        <div className={`QuickSelect ${this.props.containerClass || ''}`}>
          <div className='QuickSelect__activeView'>
            {this.props.activeViewComponentGenerator(null)}
          </div>
          <div className='QuickSelect__arrow'><i className="fa fa-chevron-up" aria-hidden="true"></i></div>
        </div>
      );
    }
    const selectedIndex = this.props.selectedItemIndex !== undefined ? this.props.selectedItemIndex : this.state.selectedIndex;
    return(
      <div className={`QuickSelect ${this.props.containerClass || ''}`} style={this.state.showList ? {zIndex: '1000'} : {}} >
        <div className={`QuickSelect__outside ${this.state.showList ? '' : 'QuickSelect__outside--hidden'}`} onClick={e => {
            this.showList(false);
            e.stopPropagation();
          }} />
        <div className='QuickSelect__activeView' onClick={e => {
          this.showList(!this.state.showList);
          e.stopPropagation();
        }}>
          {this.props.activeViewComponentGenerator(this.props.items[selectedIndex])}
        </div>
        <div className='QuickSelect__arrow' onClick={e => {
            this.showList(!this.state.showList);
            e.stopPropagation();
          }} ><i className={`fa ${this.state.showList ? 'fa-chevron-down' : 'fa-chevron-up'}`} aria-hidden="true"></i></div>
        <div className={`QuickSelect__listView ${this.state.showList ? '' : 'QuickSelect__listView--hidden'}`}
             style={this.props.items.length > ((420/(this.props.itemHeight+1))|0) ? {} : {overflow: 'hidden'}} >
          {this.props.items.map(this.buildListItem)}
        </div>
      </div>
    );
  }
}

export default QuickSelect;
