/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { Input } from './Input';
import { cloneDeep } from 'lodash';

export interface FilterSelectStyle {
  container: React.CSSProperties;
  list: React.CSSProperties;
  listItem: React.CSSProperties;
  selectedItem: React.CSSProperties;
  highlightItem: React.CSSProperties;
}

const Container = styled('div')`
  position: relative;
  display: flex;
  flex-direction: column;
  align-content: stretch;
`;

const List = styled('div')`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  flex: 1;
  position: absolute;
  min-height: 0px;
  max-height: 300px;
  overflow-x: hidden;
  overflow-y: auto;
  user-select: none;
  background-color: #444;
  z-index: 8888;
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

const SelectedItem = styled('div')`
  background-color: rgba(220, 255, 230, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
`;

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

  private inputRef: HTMLInputElement = null;

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

  public render() {
    const customStyles = this.props.styles || {};
    return (
      <Container style={customStyles.container}>
        <Input
          inputRef={r => this.inputRef = r}
          onChange={this.onInputChanged}
          onKeyDown={this.onKeyDown}
        />
        <div>
          {
            this.state.selectedItem == null ? null :
              (
                <SelectedItem>
                  {this.props.renderItem(this.state.selectedItem, this.props.renderData)}
                </SelectedItem>
              )
          }
          <List>

            {
              this.state.filteredItems.map((item, index) => {
                if (item === this.state.selectedItem) return null;
                return (
                  <ListItem
                    key={index}
                    style={this.state.keyboardIndex === index ?
                      { ...customStyles.listItem, ...customStyles.highlightItem } : customStyles.listItem}
                    onClick={() => this.selectItem(item)}>
                      {this.props.renderItem(item, this.props.renderData)}
                  </ListItem>
                );
              })
            }
          </List>
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
    // down or right
    if (e.keyCode === 40 || e.keyCode === 39) {
      if (this.state.keyboardIndex + 1 < this.state.filteredItems.length) {
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
      selectedItem: item,
    });
  }
}

export default FilterSelect;
