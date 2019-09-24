/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { Box } from './Box';
import { Field } from './Field';

export interface DropDownItem {
  id: string;
  value: string;
}

const ListBoxContainer = styled.div`
  position: relative;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }
`;

const ListBox = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: white;
  height: 33px;
  padding: 0 5px;
  background-color: black;
  text-align: center;
  cursor: pointer;

  div {
    cursor: pointer;
  }
`;

const Caret = styled.div`
  margin-left: 5px;
`;

const ListItems = styled.ul`
  position: absolute;
  bottom: 100%;
  min-width: 100%;
  box-shadow: 0 0 20px black;
  z-index: 1000;
`;

const ListItem = styled.li`
  padding: 2px 5px;
  color: white;
  background-color: rgba(31, 31, 31, 1);
  cursor: pointer;

  div {
    cursor: pointer;
  }

  &:hover {
    background-color: rgba(51, 51, 51, 1);
  }
`;

interface DropDownProps<TValue> {
  items: TValue[];
  selected: TValue;
  onSelect: (item: TValue) => void;
  renderItem?: (item: TValue) => JSX.Element;

  listBoxStyles?: string;
}
interface DropDownState {
  open: boolean;
}

export class DropDown<TValue> extends React.PureComponent<DropDownProps<TValue>, DropDownState>{
  constructor(props: DropDownProps<TValue>) {
    super(props);
    this.state = { open: false };
  }
  public render() {
    const { open } = this.state;
    const { selected, items } = this.props;
    return (
      <ListBoxContainer>
        <ListBox className={this.props.listBoxStyles} onClick={this.toggleOpen}>
          {this.props.renderItem ? this.props.renderItem(selected) : selected + ''}
          <Caret className={`fa ${ open ? 'fa-caret-down' : 'fa-caret-up' }`}></Caret>
        </ListBox>
        { open &&
          <ListItems>
            { items.map((item, index) =>
              <ListItem key={index} onClick={(e: React.MouseEvent) => this.selectItem(e, item)}>
                {this.props.renderItem ? this.props.renderItem(item) : item + ''}
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
  private selectItem = (e: React.MouseEvent, item: TValue) => {
    const { onSelect } = this.props;
    this.setState({ open: false });
    if (onSelect) onSelect(item);
  }
}

export interface DropDownFieldProps {
  label: string;
  selectedItem: SelectValue;
  items: SelectValue[];
  onSelectItem: (value: SelectValue) => void;
}

export interface DropDownFieldState {
}

export class DropDownField extends React.Component<DropDownFieldProps, DropDownFieldState> {
  public render() {
    const { label, items, selectedItem, onSelectItem } = this.props;
    return (
      <Box>
        <Field style={{ width: '85%' }}>{label.toTitleCase()}</Field>
        <Field style={{ width: '15%' }}>
        <DropDown
          selected={selectedItem} items={items}
          onSelect={value => onSelectItem(value)}
          renderItem={item => <div>{item.description}</div>}
          />
        </Field>
      </Box>
    );
  }
}
