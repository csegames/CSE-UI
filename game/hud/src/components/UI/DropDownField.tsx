/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Box } from './Box';
import { Field } from './Field';

export interface DropDownItem {
  id: string;
  value: string;
}

const ListBoxContainer = styled('div')`
  position: relative;
`;

const ListBox = styled('div')`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  height: 33px;
  padding: 0 5px;
  background-color: black;
  text-align: center;
  i {
    position: absolute;
    right: 8px;
    top: 8px;
  }
`;

const ListItems = styled('ul')`
  position: absolute;
  bottom: 100%;
  min-width: 100%;
  box-shadow: 0 0 20px black;
  z-index: 1000;
`;

const ListItem = styled('li')`
  padding: 2px 5px;
  color: white;
  background-color: rgba(31, 31, 31, 1);
  &:hover {
    background-color: rgba(51, 51, 51, 1);
  }
`;

interface DropDownProps {
  items: string[];
  selected: string;
  onSelect: (item: string) => void;
}
interface DropDownState {
  open: boolean;
}

class DropDown extends React.PureComponent<DropDownProps, DropDownState>{
  constructor(props: DropDownProps) {
    super(props);
    this.state = { open: false };
  }
  public render() {
    const { open } = this.state;
    const { selected, items } = this.props;
    return (
      <ListBoxContainer>
        <ListBox onClick={this.toggleOpen}>
          {selected}
          <i className={`fa ${ open ? 'fa-caret-down' : 'fa-caret-up' }`}></i>
        </ListBox>
        { open &&
          <ListItems>
            { items.map((item, index) =>
              <ListItem key={index} onClick={(e: React.MouseEvent) => this.selectItem(e, item)}>
                {item}
              </ListItem>,
            )}
          </ListItems>
        }
      </ListBoxContainer>
    );
  }
  private toggleOpen = (e: React.MouseEvent) => {
    this.setState({ open: !this.state.open });
  }
  private selectItem = (e: React.MouseEvent, item: string) => {
    const { onSelect } = this.props;
    this.setState({ open: false });
    if (onSelect) onSelect(item);
  }
}

export interface DropDownFieldProps {
  id: string;
  label: string;
  selectedItem: string;
  items: string[];
  onSelectItem: (item: DropDownItem) => void;
}

export interface DropDownFieldState {
}

export class DropDownField extends React.Component<DropDownFieldProps, DropDownFieldState> {
  public render() {
    const { id, label, items, selectedItem, onSelectItem } = this.props;
    return (
      <Box>
        <Field style={{ width: '85%' }}>{label}</Field>
        <Field style={{ width: '15%' }}>
        <DropDown
          selected={selectedItem} items={items}
          onSelect={value => onSelectItem({ id, value })}/>
        </Field>
      </Box>
    );
  }
}
