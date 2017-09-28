/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Input } from './Input';
import { cloneDeep } from 'lodash';

export interface DropDownSelectStyle extends StyleDeclaration {
  container: React.CSSProperties;
  list: React.CSSProperties;
  listMinimized: React.CSSProperties;
  listItem: React.CSSProperties;
  selectedItem: React.CSSProperties;
  highlightItem: React.CSSProperties;
  selected: React.CSSProperties;
  caret: React.CSSProperties;
  listWrapper: React.CSSProperties;
}

export const defaultDropDownSelectStyle: DropDownSelectStyle = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'stretch',
    position: 'relative',
    userSelect: 'none',
  },

  listWrapper: {
    position: 'relative',
    flex: '1 1 auto',
    display: 'flex',
    width: '100%',
  },

  list: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
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
    transition: 'all 0.5s',
  },

  listMinimized: {
    maxHeight: '0px',
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

  selected: {
    display: 'flex',
    cursor: 'pointer',
    userSelect: 'none',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },

  caret: {
    display: 'flex',
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    flex: '0 0 auto',
    padding: '10px',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    },
  },

  selectedItem: {
    flex: '1 1 auto',
  },
};

export interface DropDownSelectProps<ItemType, DataType extends {}> {
  items: ItemType[];
  selectedItem?: ItemType;
  renderListItem: (item: ItemType, renderType: DataType) => JSX.Element;
  renderSelectedItem: (item: ItemType, renderData: DataType) => JSX.Element;
  renderData?: DataType;
  styles?: Partial<DropDownSelectStyle>;
  onSelectedItemChaned?: (item: ItemType) => void;
}

export interface DropDownSelectState<ItemType> {
  items: ItemType[];
  selectedItem: ItemType;
  keyboardIndex: number;
  dropDownOpen: boolean;
}

export class DropDownSelect<ItemType, DataType extends {} = {}> 
  extends React.Component<DropDownSelectProps<ItemType, DataType>, DropDownSelectState<ItemType>> {
  constructor(props: DropDownSelectProps<ItemType, DataType>) {
    super(props);
    const items = cloneDeep(this.props.items);
    this.state = {
      items,
      selectedItem: this.props.selectedItem || items[0],
      keyboardIndex: -1,
      dropDownOpen: false,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultDropDownSelectStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.container, custom.container)}
           onKeyDown={this.onKeyDown}>
        <div className={css(ss.selected, custom.selected)}
             onClick={() => this.setState({ dropDownOpen: !this.state.dropDownOpen })}>
          <div className={css(ss.selectedItem, custom.selectedItem)}>
            {this.props.renderSelectedItem(this.state.selectedItem, this.props.renderData)}
          </div>
          <div className={css(ss.caret, custom.caret)}>
            <i className={`fa fa-caret-${this.state.dropDownOpen ? 'up' : 'down'}`}></i>
          </div>
        </div>
        <div className={css(ss.listWrapper, custom.listWrapper)}>
          <div className={this.state.dropDownOpen ?
            css(ss.list, custom.list) : css(ss.list, custom.list, ss.listMinimized, custom.listMinimized)}>
            {
              this.state.items.map((item, index) => {
                if (item === this.state.selectedItem) return null;
                return (
                  <div key={index}
                       className={
                         this.state.keyboardIndex === index ?
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
    );
  }

  public selectedItem = () => {
    return this.state.selectedItem;
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // down or right
    if (e.keyCode === 40 || e.keyCode === 39) {
      if (this.state.keyboardIndex + 1 < this.state.items.length) {
        this.setState({
          keyboardIndex: this.state.keyboardIndex + 1,
        });
        e.stopPropagation();
      }
    }

    // up or left
    if (e.keyCode === 38 || e.keyCode === 37) {
      if (this.state.keyboardIndex - 1 > -1) {
        this.setState({
          keyboardIndex: this.state.keyboardIndex - 1,
        });
        e.stopPropagation();
      }
    }

    // enter
    if (e.keyCode === 13) {
      if (this.state.keyboardIndex > -1) {
        this.selectItem(this.state.items[this.state.keyboardIndex]);
        e.stopPropagation();
      }
    }
  }

  private selectItem = (item: ItemType) => {
    this.setState({
      keyboardIndex: -1,
      selectedItem: item,
      dropDownOpen: false,
    });
    this.props.onSelectedItemChaned(item);
  }
}

export default DropDownSelect;
