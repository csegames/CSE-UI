/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-23 11:20:43
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-23 17:59:07
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Input, InputProps, utils } from '..';
import { cloneDeep } from 'lodash';

const { KeyCodes } = utils;

export interface MultiSelectStyle extends StyleDeclaration {
  container: React.CSSProperties;
  input: React.CSSProperties;
  list: React.CSSProperties;
  listItem: React.CSSProperties;
  selectedItem: React.CSSProperties;
  selected: React.CSSProperties;
  removeSelected: React.CSSProperties;
  highlightItem: React.CSSProperties;
  selectedItemList: React.CSSProperties;
}

export const defaultMultiSelectStyle: MultiSelectStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'stretch',
    position: 'relative',
  },

  input: {
    flex: '0 0 auto',
  },

  list: {
    display: 'flex',
    flexWrap: 'wrap',
    flex: '1 1 auto',
    position: 'relative',
    minHeight: '0px',
    maxHeight: '300px',
    overflowX: 'hidden',
    overflowY: 'auto',
    userSelect: 'none',
    backgroundColor: '#444',
  },

  listItem: {
    flex: '1 1 auto',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },

  highlightItem: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },

  selectedItem: {
  },

  selectedItemList: {
    display: 'flex',
    flexWrap: 'wrap',
    userSelect: 'none',
    backgroundColor: '#777',
    position: 'relative',
  },

  selected: {
    display: 'flex',
    flex: '0 0 auto',
    backgroundColor: '#222',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '5px',
    cursor: 'pointer',
    ':hover': {
      backgroundColor: '#555',
    },
  },

  removeSelected: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
    fontSize: '0.8em',
    cursor: 'pointer',
    ':hover': {
      color: 'darkred',
    },
  },
};

export interface MultiSelectProps {
  items: any[];
  selectedItems: any[];
  // function used to filter items when entering text
  // into the text input, return true to remain in list
  // false to be removed
  filter: (text: string, item: any) => boolean;
  renderListItem: (item: any, renderData: any) => JSX.Element;
  renderSelectedItem: (item: any, renderData: any) => JSX.Element;
  itemComparison: <T>(a: T, b: T) => boolean;
  renderData?: any;
  styles?: Partial<MultiSelectStyle>;
  inputProps?: Partial<InputProps>;
}

export interface MultiSelectState {
  items: any[];
  filteredItems: any[];
  selectedItems: any[];
  filterText: string;
  keyboardIndex: number;  
}

export class MultiSelect extends React.Component<MultiSelectProps, MultiSelectState> {
  constructor(props: MultiSelectProps) {
    super(props);
    const items = cloneDeep(props.items);
    this.state = {
      items,
      filteredItems: items,
      selectedItems: cloneDeep(props.selectedItems),
      filterText: '',
      keyboardIndex: -1,
    };
  }

  onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (this.state.filterText == value) return;
    this.applyFilter(value);
  }

  onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode == KeyCodes.KEY_DownArrow || e.keyCode == KeyCodes.KEY_RightArrow) {
      if (this.state.keyboardIndex + 1 < this.state.filteredItems.length) {
        this.setState({
          keyboardIndex: this.state.keyboardIndex+1,
        });
        e.stopPropagation();
      }
    }

    // up or left
    if (e.keyCode == KeyCodes.KEY_UpArrow || e.keyCode == KeyCodes.KEY_LeftArrow) {
      if (this.state.keyboardIndex - 1 > -1) {
        this.setState({
          keyboardIndex: this.state.keyboardIndex-1,
        });
        e.stopPropagation();
      }
    }

    // enter
    if (e.keyCode == KeyCodes.KEY_Enter) {
      if (this.state.keyboardIndex > -1) {
        this.selectItem(this.state.filteredItems[this.state.keyboardIndex]);
        e.stopPropagation();
      }
    }
  }

  applyFilter = (s: string) => {

    const filteredItems: any[] = [];
    this.state.items.forEach(item => {
      if (this.props.filter(s, item)) filteredItems.push(item);
    });

    this.setState({
      filteredItems,
      filterText: s,
    });
  }

  selectItem = (item: any) => {
    this.setState({
      keyboardIndex: -1,
      selectedItems: this.state.selectedItems.concat([item]),
    });
  }

  unselectItem = (item: any) => {
    const index = utils.findIndexWhere(this.state.selectedItems, a => this.props.itemComparison(a, item));
    const selectedItems = cloneDeep(this.state.selectedItems);
    selectedItems.splice(index, 1);
    this.setState({
      keyboardIndex: -1,
      selectedItems,
    });
  }

  public selectedItems = () => {
    return cloneDeep(this.state.selectedItems);
  }

  inputRef: HTMLInputElement = null;

  render() {
    const ss = StyleSheet.create(defaultMultiSelectStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.container, custom.container)}>
        <Input inputRef={r => this.inputRef = r}
               onChange={this.onInputChanged}
               onKeyDown={this.onKeyDown}
               {...this.props.inputProps} />
        <div style={{position: 'relative'}}>
          <div style={{position: 'absolute', width: '100%', zIndex: 1,}}>
            <div className={css(ss.selectedItemList, custom.selectedItemList)}>
              {
              this.state.selectedItems.map(i => {
                return (
                  <div className={css(ss.selected, custom.selected)} onClick={() => this.unselectItem(i)}>
                  <div className={css(ss.selectedItem, custom.selectedItem)}>
                    {this.props.renderSelectedItem(i, this.props.renderData)}
                  </div>
                    <div className={css(ss.removeSelected, custom.removeSelected)}>
                      <i className='fa fa-times'></i>
                    </div>
                  </div>
                );
              })
            }
            </div>
            <div className={css(ss.list, custom.list)}>
              {
                this.state.filteredItems.map((item, index) => {
                  if (utils.findIndexWhere(this.state.selectedItems, (i) => this.props.itemComparison(i, item)) > -1) return null;
                  return (
                    <div key={index} 
                         className={
                         this.state.keyboardIndex == index ?
                           css(ss.listItem, ss.highlightItem, custom.listItem, custom.highlightItem) :
                           css(ss.listItem, custom.listItem)
                         }
                         onClick={() => this.selectItem(item)}>
                      {this.props.renderListItem(item, this.props.renderData)}
                    </div>
                  );
                })
              }
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default MultiSelect;
