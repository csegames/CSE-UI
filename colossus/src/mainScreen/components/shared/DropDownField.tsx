/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { Box } from './Box';
import { SelectValue } from '@csegames/library/dist/_baseGame/types/Options';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';

export interface DropDownItem {
  id: string;
  value: string;
}

const ListBoxContainer = 'MainScreen-DropDownField-ListBoxContainer';
const ListBox = 'MainScreen-DropDownField-ListBox';
const Caret = 'MainScreen-DropDownField-Caret';
const ListItems = 'MainScreen-DropDownField-ListItems';
const ListItem = 'MainScreen-DropDownField-ListItem';
const Field = 'MainScreen-Field';

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

export class DropDown<TValue> extends React.PureComponent<DropDownProps<TValue>, DropDownState> {
  constructor(props: DropDownProps<TValue>) {
    super(props);
    this.state = { open: false };
  }
  public render() {
    const { open } = this.state;
    const { selected, items } = this.props;
    return (
      <div className={ListBoxContainer}>
        <div className={`${ListBox} ${this.props.listBoxStyles}`} onClick={this.toggleOpen}>
          {this.props.renderItem ? this.props.renderItem(selected) : selected + ''}
          <div className={`${Caret} ${open ? 'fs-icon-misc-caret-down' : 'fs-icon-misc-caret-up'}`} />
        </div>
        {open && (
          <ul className={ListItems}>
            {items.map((item, index) => (
              <li key={index} className={ListItem} onClick={(e: React.MouseEvent) => this.selectItem(e, item)}>
                {this.props.renderItem ? this.props.renderItem(item) : item + ''}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  }
  private toggleOpen = (e: React.MouseEvent) => {
    this.setState({ open: !this.state.open });
  };
  private selectItem = (e: React.MouseEvent, item: TValue) => {
    const { onSelect } = this.props;
    this.setState({ open: false });
    if (onSelect) onSelect(item);
  };
}

export interface DropDownFieldProps {
  label: string;
  selectedItem: SelectValue;
  items: SelectValue[];
  onSelectItem: (value: SelectValue) => void;
}

export interface DropDownFieldState {}

export class DropDownField extends React.Component<DropDownFieldProps, DropDownFieldState> {
  public render() {
    const { label, items, selectedItem, onSelectItem } = this.props;
    return (
      <Box>
        <div className={Field} style={{ width: '85%' }}>{toTitleCase(label)}</div>
        <div className={Field} style={{ width: '15%' }}>
          <DropDown
            selected={selectedItem}
            items={items}
            onSelect={(value) => onSelectItem(value)}
            renderItem={(item) => <div>{item.description}</div>}
          />
        </div>
      </Box>
    );
  }
}
