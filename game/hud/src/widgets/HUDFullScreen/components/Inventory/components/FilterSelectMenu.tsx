/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { Input, IconButton, utils, events } from '@csegames/camelot-unchained';
import styled from 'react-emotion';

import FilterSelectListItem from './FilterSelectListItem';
import { colors, inventoryFilterButtons, InventoryFilterButton as FilterButtonInfo } from '../../../lib/constants';

const containerDimensions = {
  width: 300,
  height: 500,
};

const Container = styled('div')`
  position: relative;
  display: inline-block;
  z-index: 9999;
`;

const MenuContainer = styled('div')`
  position: absolute;
  top: -5px;
  left: -${containerDimensions.width}px;
  display: flex;
  flex-direction: column;
  background-color: #18130E;
  width: ${containerDimensions.width}px;
  height: ${containerDimensions.height}px;
  border: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)};
`;

const HeaderContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  border-bottom: 1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)};
  padding: 2px;
`;

const ButtonsContainer = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
  overflow: auto;
`;

const HeaderText = styled('header')`
  color: ${utils.lightenColor(colors.filterBackgroundColor, 100)};
  font-size: 18px;
`;

const InputStyle = {
  input: {
    height: '20px',
    backgroundColor: 'rgba(179, 183, 192, 0.3)',
    border: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)}`,
    color: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)}`,
    padding: '0 5px',
    '::-webkit-input-placeholder': {
      color: utils.lightenColor(colors.filterBackgroundColor, 100),
    },
  },
};

export interface FilterSelectMenuProps {
  onFilterButtonAdded: (filterButton: FilterButtonInfo) => void;
  onFilterButtonRemoved: (filterButton: FilterButtonInfo) => void;
  selectedFilterButtons: FilterButtonInfo[];
}

export interface FilterSelectMenuState {
  searchValue: string;
  menuVisible: boolean;
}

export class FilterSelectMenu extends React.Component<FilterSelectMenuProps, FilterSelectMenuState> {
  private mouseOver: boolean;

  constructor(props: FilterSelectMenuProps) {
    super(props);
    this.state = {
      searchValue: '',
      menuVisible: false,
    };
  }

  public render() {
    const filteredFilterButtons = _.filter(inventoryFilterButtons, (filterButton) => {
      return _.includes(filterButton.name.toLowerCase(), this.state.searchValue.toLowerCase());
    });

    return (
      <Container
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <IconButton
          iconClass={'fa-bars'}
          active={this.state.menuVisible}
          activeColor={'white'}
          onClick={this.toggleMenuVisibility}
          color={'#897866'}
          styles={{
            buttonIcon: {
              fontSize: '20px',
            },
          }}
        />
        {this.state.menuVisible &&
          <MenuContainer>
            <HeaderContainer>
              <HeaderText>Edit Filters</HeaderText>
              <Input
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                onChange={this.onSearchChange}
                placeholder={'Search'}
                value={this.state.searchValue}
                styles={InputStyle}
              />
            </HeaderContainer>
            <ButtonsContainer>
              {filteredFilterButtons.map((filterButton) => {
                const active = _.findIndex(this.props.selectedFilterButtons, activeButton =>
                  activeButton.name === filterButton.name) !== -1;
                return (
                  <FilterSelectListItem
                    key={filterButton.name}
                    active={active}
                    filterButton={filterButton}
                    onActivated={filterButton => this.props.onFilterButtonAdded(filterButton)}
                    onDeactivated={filterButton => this.props.onFilterButtonRemoved(filterButton)} />
                );
              })}
            </ButtonsContainer>
          </MenuContainer>
        }
      </Container>
    );
  }

  public componentDidMount() {
    window.addEventListener('mousedown', this.onMouseDownListener);
  }

  public shouldComponentUpdate(nextProps: FilterSelectMenuProps, nextState: FilterSelectMenuState) {
    return !_.isEqual(nextProps.selectedFilterButtons, this.props.selectedFilterButtons) ||
    !_.isEqual(nextState, this.state);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.onMouseDownListener);
  }

  private onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: e.target.value });
  }

  private toggleMenuVisibility = () => {
    this.setState((state, props) => ({ menuVisible: !state.menuVisible }));
  }

  private onMouseDownListener = () => {
    if (this.mouseOver) return;
  }

  private onMouseEnter = () => {
    this.mouseOver = true;
  }

  private onMouseLeave = () => {
    this.mouseOver = false;
  }

  private onInputFocus = () => {
    events.fire('hudfullscreen--inputaction', 'focus');
  }

  private onInputBlur = () => {
    events.fire('hudfullscreen--inputaction', 'blur');
  }
}

export default FilterSelectMenu;
