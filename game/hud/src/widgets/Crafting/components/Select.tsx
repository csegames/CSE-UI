/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, cssAphrodite, merge, select, SelectStyles } from '../styles';

export interface SelectProps {
  items: any[];
  selectedItem?: any;
  disabled?: boolean;
  renderActiveItem: (item: any) => any;
  renderListItem: (item: any) => any;
  onSelectedItemChanged: (item: any) => void;
  showActiveInList?: boolean;
  style?: Partial<SelectStyles>;
}

export interface SelectState {
  selectedIndex: number;
  showList: boolean;
}

class Select extends React.Component<SelectProps, SelectState> {
  private ss: any;

  constructor(props: SelectProps) {
    super(props);
    this.state = {
      selectedIndex: -1,
      showList: false,
    };
  }

  public render() {
    const ss = this.ss = StyleSheet.create(merge({}, select, this.props.style));
    if (this.props.items.length === 0) {
      // No items to display
      return (
        <div className={cssAphrodite(ss.select)}>
          <div className={cssAphrodite(ss.impl)}>
            <div className={cssAphrodite(ss.active)}>
              {this.props.renderActiveItem(null)}
            </div>
            <div className={cssAphrodite(ss.arrow)} style={{ opacity: 0.5 }}>
              <i className='fa fa-chevron-down' aria-hidden='true'></i>
            </div>
          </div>
        </div>
      );
    }
    // if selectedItem is undefined or null, we get -1 which is exactly what we want
    const selectedIndex = this.props.items.indexOf(this.props.selectedItem);
    return(
      <div className={cssAphrodite(ss.select)}>
        <div className={cssAphrodite(ss.impl)} style={this.state.showList ? { zIndex: 1000 } : {}}>
          <div
            className={this.state.showList ? cssAphrodite(ss.outside) : cssAphrodite(ss.outside, ss.outsideHidden)}
            onClick={(e) => { this.onClick(e, false); }} />
          <div className={cssAphrodite(ss.active)} onClick={(e) => { this.onClick(e, !this.state.showList); }}>
            {this.props.renderActiveItem(this.props.items[selectedIndex])}
          </div>
          <div className={cssAphrodite(ss.arrow)} onClick={(e) => { this.onClick(e, !this.state.showList); }}>
            <i className={`fa ${this.state.showList ? 'fa-chevron-up' : 'fa-chevron-down'}`} aria-hidden='true'></i>
          </div>
          <div className={this.state.showList ? cssAphrodite(ss.list) : cssAphrodite(ss.list, ss.listHidden)}>
            {this.props.items.map(this.buildListItem)}
          </div>
        </div>
      </div>
    );
  }

  private onClick = (e: React.MouseEvent<HTMLDivElement>, showList: boolean) => {
    if (!this.props.disabled) {
      this.showList(showList);
      // TODO COHERENT missing PLAY_UI_VOX_GENERICBUTTON sound event
      // game.playGameSound(SoundEvent.PLAY_UI_VOX_GENERICBUTTON);
    }
    e.stopPropagation();
  }

  private showList = (visible: boolean) => {
    this.setState({ showList: visible });
  }

  private onItemSelect = (item: any, itemIndex: number) => {
    // TODO COHERENT missing PLAY_UI_VOX_GENERICBUTTON sound event
    // game.playGameSound(SoundEvent.PLAY_UI_VOX_GENERICBUTTON);
    this.setState({
      selectedIndex: itemIndex,
      showList: false,
    });
    this.props.onSelectedItemChanged(item);
  }

  private buildListItem = (item: any, itemIndex: number) => {
    const ss = this.ss;
    const isSelectedItem = itemIndex === this.state.selectedIndex;
    if (this.props.showActiveInList && isSelectedItem) return null;
    return (
      <div
        key={itemIndex}
        onClick={this.onItemSelect.bind(this, item, itemIndex)}
        className={isSelectedItem ? cssAphrodite(ss.listItem, ss.listItemSelected) : cssAphrodite(ss.listItem)}>
        {this.props.renderListItem(item)}
      </div>
    );
  }
}

export default Select;
