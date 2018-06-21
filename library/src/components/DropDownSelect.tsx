/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { cloneDeep } from 'lodash';

export interface DropDownSelectStyle {
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

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  align-content: stretch;
  position: relative;
  user-select: none;
`;

const ListWrapper = styled('div')`
  position: relative;
  flex: 1;
  display: flex;
  width: 100%;
`;

const List = css`
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap
  flex: 1 1 auto;
  position: absolute;
  min-height: 0px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  background-color: #444;
  z-index: 8888;
  transition: all 0.5s;
`;

const ListMinimized = css`
  max-height: 0px;
`;

const ListItem = styled('div')`
  flex: 1;
  cursor: pointer;
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const HighlightItem = css`
  background-color: rgba(0, 0, 0, 0.2);
`;

const Selected = styled('div')`
  display: flex;
  cursor: pointer;
  user-select: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const Caret = styled('div')`
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: center;
  flex: 0;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
  }
`;

const SelectedItem = styled('div')`
  flex: 1;
`;

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
    const customStyles = this.props.styles || {};

    return (
      <Container style={customStyles.container} onKeyDown={this.onKeyDown}>
        <Selected style={customStyles.selected} onClick={() => this.setState({ dropDownOpen: !this.state.dropDownOpen })}>
          <SelectedItem style={customStyles.selectedItem}>
            {this.props.renderSelectedItem(this.state.selectedItem, this.props.renderData)}
          </SelectedItem>
          <Caret style={customStyles.caret}>
            <i className={`fa fa-caret-${this.state.dropDownOpen ? 'up' : 'down'}`}></i>
          </Caret>
        </Selected>
        <ListWrapper style={customStyles.listWrapper}>
          <div
            className={this.state.dropDownOpen ? List : ListMinimized}
            style={this.state.dropDownOpen ? customStyles.list : customStyles.listMinimized}>
            {
              this.state.items.map((item, index) => {
                if (item === this.state.selectedItem) return null;
                return (
                  <ListItem
                    key={index}
                    className={this.state.keyboardIndex === index ? HighlightItem : ''}
                    style={this.state.keyboardIndex === index ?
                      { ...customStyles.listItem, ...customStyles.highlightItem } : customStyles.listItem}
                    onClick={() => this.selectItem(item)}>
                      {this.props.renderListItem(item, this.props.renderData)}
                  </ListItem>
                );
              })
            }
          </div>
        </ListWrapper>
      </Container>
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
