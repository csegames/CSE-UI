/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * Materialize dropdown inspired quickselect list.
 *
 * *requires materialize js & css to be included on your html page.
 *
 * USAGE:
 *
 * class MyQuickSelect extends React.Component<any, any> {
 *   generateActiveView = (item: any) => {
 *     return <div>{item.foo}</div>;
 *   }
 *   generateListView = (item: any) => {
 *     return <div>{item.foo}</div>;
 *   }
 *   onSelectedItemChanged = (item: any) => {
 *     console.log('selected item is ' + item.foo);
 *   }
 *   render() {
 *     let items = [{foo:'Hello'},{foo:'World'}];
 *     return <QuickSelect items={items} activeViewComponentGenerator={this.generateActiveView}
          listViewComponentGenerator={this.generateListView} onSelectedItemChanged={this.onSelectedChannelChanged} />;
 *   }
 * }
 *
 */

import * as React from 'react';

export interface QuickSelectProps {
  items: any[];
  selectedItemIndex?: any;
  activeViewComponentGenerator: (item: any) => any;
  listViewComponentGenerator: (item: any) => any;
  onSelectedItemChanged: (item: any) => void;
}

export interface QuickSelectState {
  selectedIndex: number;
}

class QuickSelect extends React.Component<QuickSelectProps, QuickSelectState> {
  private static idCounter: number = 0;
  private uniqueId: string = 'QuickSelect-' + QuickSelect.idCounter++;

  constructor(props: QuickSelectProps) {
    super(props);
    this.state = {
      selectedIndex: 0,
    };
  }

  public render() {
    if (this.props.items.length === 0) return <div>No Elements</div>;
    const selectedIndex = this.props.selectedItemIndex !== undefined ? this.props.selectedItemIndex :
      this.state.selectedIndex;
    return(
      <div>
        <div className={'dropdown-button quickselect-auto-width'} data-beloworigin='true'
          data-constrainwidth='false' data-verticaloffset='0' data-activates={this.uniqueId}
          data-style={'quickselect-default'}>
          {this.props.activeViewComponentGenerator(this.props.items[selectedIndex])}
        </div>
        <div id={this.uniqueId} className='quickselect-default'>
          {this.props.items.map(this.buildListItem)}
        </div>
      </div>
    );
  }

  private onItemSelect = (item: any, itemIndex: number) => {
    this.setState({ selectedIndex: itemIndex });
    this.props.onSelectedItemChanged(item);
  }

  private buildListItem = (item: any, itemIndex: number) => {
    return (
      <div key={itemIndex} onClick={this.onItemSelect.bind(this, item, itemIndex)} className='quickselect-auto-width'>
        {this.props.listViewComponentGenerator(item)}
      </div>
    );
  }
}

export default QuickSelect;
