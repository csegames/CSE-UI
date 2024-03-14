/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const Container = 'Dropdown-Container';
const Overlay = 'Dropdown-Overlay';
const SelectedItem = 'Dropdown-SelectedItem';
const Chevron = 'Dropdown-Chevron';
const DropdownContainer = 'Dropdown-DropdownContainer';

const Item = 'Dropdown-Item';

export interface Props {
  selectedItem: string;
  items: string[];
  onSelectItem: (item: string) => void;
  formatItem?: (item: string) => string;

  containerStyles?: string;
  disableCloseOnSelect?: boolean;
}

export interface State {
  isOpen: boolean;
}

export class Dropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  public render() {
    const { isOpen } = this.state;
    const dropdownClass = isOpen ? 'visible' : '';
    return (
      <div className={`${Container} ${this.props.containerStyles ? this.props.containerStyles : ''}`}>
        {isOpen && <div className={Overlay} onClick={this.toggleVisibility} />}
        <div className={SelectedItem} onClick={this.onClickSelected}>
          {this.props.selectedItem}
          <div className={`${Chevron} ${isOpen ? 'fs-icon-misc-caret-up' : 'fs-icon-misc-caret-down'}`} />
        </div>

        <div className={`${DropdownContainer} ${dropdownClass}`}>
          {this.props.items.map((item, i) => {
            return (
              <div key={i} className={Item} onClick={() => this.onSelectItem(item)}>
                {this.props.formatItem ? this.props.formatItem(item) : item}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  private onClickSelected = () => {
    this.toggleVisibility();
  };

  private onSelectItem = (item: string) => {
    if (this.props.disableCloseOnSelect) {
      this.props.onSelectItem(item);
      return;
    }

    this.toggleVisibility();
    this.props.onSelectItem(item);
  };

  private toggleVisibility = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
}
