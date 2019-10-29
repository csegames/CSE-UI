/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: relative;
  flex: 1;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
`;

const SelectedItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: Lato;
  font-size: 18px;
  color: #C8C9C9;
  background-color: #353535;
  padding: 0 5px;
  height: 40px;
  cursor: pointer;
  filter: brightness(100%);
  transition: filter 0.2s;

  &:active {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.7);
  }

  &:hover {
    filter: brightness(130%);
  }
`;

const Chevron = styled.div`
  color: #9a9c9c;
  font-size: 18px;
`;

const DropdownContainer = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.2s;

  &.visible {
    opacity: 1;
    pointer-events: all;
  }
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-family: Lato;
  font-size: 18px;
  color: #C8C9C9;
  background-color: #353535;
  padding: 0 5px;
  height: 40px;
  cursor: pointer;
  filter: brightness(100%);
  transition: filter 0.2s;

  &:hover {
    filter: brightness(130%);
  }
`;

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
      isOpen: false,
    };
  }

  public render() {
    const { isOpen } = this.state;
    const dropdownClass = isOpen ? 'visible' : '';
    return (
      <Container className={this.props.containerStyles ? this.props.containerStyles : ''}>
        {isOpen && <Overlay onClick={this.toggleVisibility} />}
        <SelectedItem onClick={this.onClickSelected}>
          {this.props.selectedItem}
          <Chevron className={isOpen ? 'fas fa-caret-up' : 'fas fa-caret-down'} />
        </SelectedItem>

        <DropdownContainer className={dropdownClass}>
          {this.props.items.map((item, i) => {
            return (
              <Item key={i} onClick={() => this.onSelectItem(item)}>
                {this.props.formatItem ? this.props.formatItem(item) : item}
              </Item>
            );
          })}
        </DropdownContainer>
      </Container>
    );
  }

  private onClickSelected = () => {
    this.toggleVisibility();
  }

  private onSelectItem = (item: string) => {
    if (this.props.disableCloseOnSelect) {
      this.props.onSelectItem(item);
      return;
    }

    this.toggleVisibility();
    this.props.onSelectItem(item);
  }

  private toggleVisibility = () => {
    this.setState({ isOpen: !this.state.isOpen });
  }
}
