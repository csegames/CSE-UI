/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { Input } from 'cseshared/components/Input';
import { IconButton } from 'cseshared/components/IconButton';
import { styled } from '@csegames/linaria/react';

import FilterSelectListItem from './FilterSelectListItem';
import { inventoryFilterButtons } from 'fullscreen/lib/utils';
import { InventoryFilterButton as FilterButtonInfo } from 'fullscreen/lib/itemInterfaces';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  display: inline-block;
  z-index: 9999;
`;

// #region MenuContainer constants
const MENU_CONTAINER_TOP = -10;
const MENU_CONTAINER_WIDTH = 600;
const MENU_CONTAINER_HEIGHT = 1000;
// #endregion
const MenuContainer = styled.div`
  position: absolute;
  top: ${MENU_CONTAINER_TOP}px;
  left: -${MENU_CONTAINER_WIDTH}px;
  width: ${MENU_CONTAINER_WIDTH}px;
  height: ${MENU_CONTAINER_HEIGHT}px;
  display: flex;
  flex-direction: column;
  background-color: #18130E;
  border: 1px solid #413735;

  @media (max-width: 2560px) {
    top: ${MENU_CONTAINER_TOP * MID_SCALE}px;
    left: -${MENU_CONTAINER_WIDTH * MID_SCALE}px;
    width: ${MENU_CONTAINER_WIDTH * MID_SCALE}px;
    height: ${MENU_CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${MENU_CONTAINER_TOP * HD_SCALE}px;
    left: -${MENU_CONTAINER_WIDTH * HD_SCALE}px;
    width: ${MENU_CONTAINER_WIDTH * HD_SCALE}px;
    height: ${MENU_CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

// #region HeaderContainer
const HEADER_CONTAINER_PADDING = 4;
// #endregion
const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 0 0 auto;
  border-bottom: 1px solid #413735;
  padding: ${HEADER_CONTAINER_PADDING}px;

  @media (max-width: 2560px) {
    padding: ${HEADER_CONTAINER_PADDING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${HEADER_CONTAINER_PADDING * HD_SCALE}px;
  }
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
  overflow: auto;
`;

// #region HeaderText constants
const HEADER_TEXT_FONT_SIZE = 36;
// #endregion
const HeaderText = styled.header`
  color: #413735;
  font-size: ${HEADER_TEXT_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${HEADER_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${HEADER_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

const InputStyle = {
  input: {
    height: '20px',
    backgroundColor: 'rgba(179, 183, 192, 0.3)',
    border: `1px solid #413735`,
    color: `1px solid #413735`,
    padding: '0 5px',
    '::-webkit-input-placeholder': {
      color: '#413735',
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
      <UIContext.Consumer>
        {(uiContext: UIContext) => (
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
                  fontSize: uiContext.isUHD() ? '40px' : '20px',
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
        )}
      </UIContext.Consumer>
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
    game.trigger('hudfullscreen--inputaction', 'focus');
  }

  private onInputBlur = () => {
    game.trigger('hudfullscreen--inputaction', 'blur');
  }
}

export default FilterSelectMenu;
