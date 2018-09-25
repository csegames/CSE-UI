/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Input, InputProps, utils } from '..';
import { cloneDeep } from 'lodash';

const { KeyCodes } = utils;

export interface MultiSelectStyle {
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

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-content: stretch;
  position: relative;
`;

const InputView = styled('input')`
  flex: 0;
`;

const List = styled('div')`
  display: flex;
  flex-wrap: wrap;
  flex: 1;
  position: relative;
  min-height: 0;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  background-color: #444;
`;

const ListItem = styled('div')`
  flex: 1;
  cursor: pointer;
  &:hover {
    background: rgba(0, 0, 0, 0.2);
  }
`;

const HighlightItem = styled('div')`
  background-color: rgba(0, 0, 0, 0.2);
`;

const SelectedItemList = styled('div')`
  display: flex;
  flex-wrap: wrap;
  user-select: none;
  background-color: #777;
  position: relative;
`;

const Selected = styled('div')`
  display: flex;
  flex: 0;
  background-color: #222;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #555;
  }
`;

const RemoveSelected = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  font-size: 0.8em;
  cursor: pointer;
  &:hover {
    color: darkred;
  }
`;

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

  private inputRef: HTMLInputElement;

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

  public selectedItems = () => {
    return cloneDeep(this.state.selectedItems);
  }

  public render() {
    const customStyles = this.props.styles || {};
    return (
      <Container style={customStyles.container}>
        <Input
          inputRef={r => this.inputRef = r}
          onChange={this.onInputChanged}
          onKeyDown={this.onKeyDown}
          {...this.props.inputProps}
        />
        <div style={{ position: 'relative' }}>
          <div style={{ position: 'absolute', width: '100%', zIndex: 1 }}>
            <SelectedItemList style={customStyles.selectedItemList}>
              {
                this.state.selectedItems.map((i) => {
                  return (
                    <Selected style={customStyles.selected} onClick={() => this.unselectItem(i)}>
                      <div style={customStyles.selectedItem}>
                        {this.props.renderSelectedItem(i, this.props.renderData)}
                      </div>
                      <RemoveSelected style={customStyles.removeSelected}>
                        <i className='fa fa-times'></i>
                      </RemoveSelected>
                    </Selected>
                  );
                })
              }
            </SelectedItemList>
            <List style={customStyles.list}>
              {
                this.state.filteredItems.map((item, index) => {
                  if (utils.findIndexWhere(this.state.selectedItems, i => this.props.itemComparison(i, item)) > -1) {
                    return null;
                  }
                  return (
                    <div
                      key={index}
                      style={this.state.keyboardIndex === index ?
                        { ...customStyles.listItem, ...customStyles.highlightItem } : customStyles.listItem}
                      onClick={() => this.selectItem(item)}>
                        {this.props.renderListItem(item, this.props.renderData)}
                    </div>
                  );
                })
              }
            </List>
          </div>
        </div>
      </Container>
    );
  }

  private onInputChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (this.state.filterText === value) return;
    this.applyFilter(value);
  }

  private onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.keyCode === KeyCodes.KEY_DownArrow || e.keyCode === KeyCodes.KEY_RightArrow) {
      if (this.state.keyboardIndex + 1 < this.state.filteredItems.length) {
        this.setState({
          keyboardIndex: this.state.keyboardIndex + 1,
        });
        e.stopPropagation();
      }
    }

    // up or left
    if (e.keyCode === KeyCodes.KEY_UpArrow || e.keyCode === KeyCodes.KEY_LeftArrow) {
      if (this.state.keyboardIndex - 1 > -1) {
        this.setState({
          keyboardIndex: this.state.keyboardIndex - 1,
        });
        e.stopPropagation();
      }
    }

    // enter
    if (e.keyCode === KeyCodes.KEY_Enter) {
      if (this.state.keyboardIndex > -1) {
        this.selectItem(this.state.filteredItems[this.state.keyboardIndex]);
        e.stopPropagation();
      }
    }
  }

  private applyFilter = (s: string) => {

    const filteredItems: any[] = [];
    this.state.items.forEach((item) => {
      if (this.props.filter(s, item)) filteredItems.push(item);
    });

    this.setState({
      filteredItems,
      filterText: s,
    });
  }

  private selectItem = (item: any) => {
    this.setState({
      keyboardIndex: -1,
      selectedItems: this.state.selectedItems.concat([item]),
    });
  }

  private unselectItem = (item: any) => {
    const index = utils.findIndexWhere(this.state.selectedItems, a => this.props.itemComparison(a, item));
    const selectedItems = cloneDeep(this.state.selectedItems);
    selectedItems.splice(index, 1);
    this.setState({
      selectedItems,
      keyboardIndex: -1,
    });
  }
}

export default MultiSelect;
