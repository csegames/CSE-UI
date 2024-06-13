/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

export interface DropDownItem {
  id: string;
  value: string;
}

const ListBoxContainer = 'MainScreen-DropDownField-ListBoxContainer';
const ListBox = 'MainScreen-DropDownField-ListBox';
const Caret = 'MainScreen-DropDownField-Caret';
const ListItems = 'MainScreen-DropDownField-ListItems';
const ListItem = 'MainScreen-DropDownField-ListItem';

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
  private ref: HTMLDivElement | null = null;

  constructor(props: DropDownProps<TValue>) {
    super(props);
    this.state = { open: false };
  }

  public render() {
    const { open } = this.state;
    const { selected, items } = this.props;
    return (
      <div
        ref={(ref) => {
          this.ref = ref;
        }}
        className={ListBoxContainer}
      >
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

  public componentDidMount(): void {
    addEventListener('mousedown', this.onWindowMousedown.bind(this));
  }

  public componentWillUnmount(): void {
    removeEventListener('mousedown', this.onWindowMousedown.bind(this));
  }

  private onWindowMousedown(e: MouseEvent): void {
    if (this.state.open && e.target instanceof HTMLElement && !this.isElementDescendant(e.target)) {
      this.setState({ open: false });
    }
  }

  private isElementDescendant(child: HTMLElement) {
    var node = child.parentNode;
    while (node != null) {
      if (node === this.ref) {
        return true;
      }
      node = node.parentNode;
    }
    return false;
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
