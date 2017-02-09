/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-23 11:20:43
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-23 14:30:34
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Input } from './Input';
import { cloneDeep } from 'lodash';

export interface FilterSelectStyle extends StyleDeclaration {
  container: React.CSSProperties;
  input: React.CSSProperties;
  list: React.CSSProperties;
  listItem: React.CSSProperties;
  selectedItem: React.CSSProperties;
  highlightItem: React.CSSProperties;
}

export const defaultFilterSelectStyle: FilterSelectStyle = {
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
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: '1 1 auto',
    position: 'absolute',
    minHeight: '0px',
    maxHeight: '300px',
    overflowX: 'hidden',
    overflowY: 'auto',
    userSelect: 'none',
    backgroundColor: '#444',
    zIndex: 8888,
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
    backgroundColor: 'rgba(220, 255, 230, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  },
};

export interface FilterSelectProps {
  items: any[];
  // function used to filter items when entering text
  // into the text input, return true to remain in list
  // false to be removed
  filter: (text: string, item: any) => boolean;
  renderItem: (item: any, renderData: any) => JSX.Element;
  renderData?: any;
  styles?: Partial<FilterSelectStyle>;
}

export interface FilterSelectState {
  items: any[];
  filteredItems: any[];
  selectedItem: any;
  filterText: string;
  keyboardIndex: number;  
}

export class FilterSelect extends React.Component<FilterSelectProps, FilterSelectState> {
  constructor(props: FilterSelectProps) {
    super(props);
    const items = cloneDeep(this.props.items);
    this.state = {
      items,
      filteredItems: items,
      selectedItem: null,
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
    // down or right
    if (e.keyCode == 40 || e.keyCode == 39) {
      if (this.state.keyboardIndex + 1 < this.state.filteredItems.length) {
        this.setState({
          keyboardIndex: this.state.keyboardIndex+1,
        });
        e.stopPropagation();
      }
    }

    // up or left
    if (e.keyCode == 38 || e.keyCode == 37) {
      if (this.state.keyboardIndex - 1 > -1) {
        this.setState({
          keyboardIndex: this.state.keyboardIndex-1,
        });
        e.stopPropagation();
      }
    }

    // enter
    if (e.keyCode == 13) {
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
      selectedItem: item
    });
  }

  inputRef: HTMLInputElement = null;

  render() {
    const ss = StyleSheet.create(defaultFilterSelectStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.container, custom.container)}>
        <Input inputRef={r => this.inputRef = r}
               onChange={this.onInputChanged}
               onKeyDown={this.onKeyDown} />
        <div>
          {
            this.state.selectedItem == null ? null :
            (
              <div className={css(ss.selectedItem, custom.selectedItem)}>
                {this.props.renderItem(this.state.selectedItem, this.props.renderData)}
              </div>
            )
          }
        <div className={css(ss.list, custom.list)}>
          
          {
            this.state.filteredItems.map((item, index) => {
              if (item === this.state.selectedItem) return null;
              return (
                <div key={index} 
                     className={
                     this.state.keyboardIndex == index ?
                       css(ss.listItem, ss.highlightItem, custom.listItem, custom.highlightItem) :
                       css(ss.listItem, custom.listItem)
                     }
                     onClick={() => this.selectItem(item)}>
                  {this.props.renderItem(item, this.props.renderData)}
                </div>
              );
            })
          }
        </div>
        </div>
      </div>
    )
  }
}

export default FilterSelect;
