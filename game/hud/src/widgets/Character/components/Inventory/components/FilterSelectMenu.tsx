/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-07-14 11:49:30
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-28 18:02:52
 */

import * as React from 'react';
import * as _ from 'lodash';

import { Input, IconButton, utils, events } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import FilterSelectListItem from './FilterSelectListItem';
import { colors, inventoryFilterButtons, InventoryFilterButton as FilterButtonInfo } from '../../../lib/constants';

export interface FilterSelectMenuStyle extends StyleDeclaration {
  FilterSelectMenu: React.CSSProperties;
  menuContainer: React.CSSProperties;
  headerContainer: React.CSSProperties;
  buttonsContainer: React.CSSProperties;
  searchInput: React.CSSProperties;
  buttonSpacing: React.CSSProperties;
}

const containerDimensions = {
  width: 300,
  height: 215,
};

export const defaultFilterSelectMenuStyle: FilterSelectMenuStyle = {
  FilterSelectMenu: {
    position: 'relative',
    display: 'inline-block',
  },

  menuContainer: {
    position: 'absolute',
    top: -5,
    left: -containerDimensions.width - 5, // position left of containerDimension + padding and add small margin of 5
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#18130E',
    width: `${containerDimensions.width}px`,
    height: `${containerDimensions.height}px`,
    border: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)}`,
    zIndex: 9999,
  },

  headerContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: '0 0 auto',
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)}`,
    padding: '2px',
  },

  buttonsContainer: {
    display: 'flex',
    flexDirection: 'column',    
    alignItems: 'stretch',
    flex: '1 1 auto',
    overflow: 'auto',
  },

  searchInput: {
    height: '20px',
    backgroundColor: 'rgba(179, 183, 192, 0.3)',
    border: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)}`,
    color: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 100)}`,
    padding: '0 5px',
    '::-webkit-input-placeholder': {
      color: utils.lightenColor(colors.filterBackgroundColor, 100),
    },
  },

  headerText: {
    color: utils.lightenColor(colors.filterBackgroundColor, 100),
    fontSize: '18px',
  },

  buttonSpacing: {
    marginRight: '5px',
  },
};

export interface FilterSelectMenuProps {
  styles?: Partial<FilterSelectMenuStyle>;
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
    const ss = StyleSheet.create(defaultFilterSelectMenuStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const filteredFilterButtons = _.filter(inventoryFilterButtons, (filterButton) => {
      return _.includes(filterButton.name.toLowerCase(), this.state.searchValue.toLowerCase());
    });

    return (
      <div
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        className={css(ss.FilterSelectMenu, custom.FilterSelectMenu)}>
        <IconButton
          iconClass={'fa-cogs'}
          active={this.state.menuVisible}
          activeColor={'white'}
          onClick={this.toggleMenuVisibility}
          color={utils.lightenColor(colors.filterBackgroundColor, 100)}
          styles={{
            buttonIcon: {
              fontSize: '24px',
            },
          }}
        />
        {this.state.menuVisible &&
          <div className={css(ss.menuContainer, custom.menuContainer)}>
            <div className={css(ss.headerContainer, custom.headerContainer)}>
              <header className={css(ss.headerText, custom.headerText)}>Edit Filters</header>
              <Input
                onFocus={this.onInputFocus}
                onBlur={this.onInputBlur}
                onChange={this.onSearchChange}
                placeholder={'Search'}
                value={this.state.searchValue}
                styles={{ input: defaultFilterSelectMenuStyle.searchInput }}
              />
            </div>
            <div className={css(ss.buttonsContainer, custom.buttonsContainer)}>
              {filteredFilterButtons.map((filterButton) => {
                const active = _.findIndex(this.props.selectedFilterButtons, (activeButton) =>
                  activeButton.name === filterButton.name) !== -1;
                return (
                  <FilterSelectListItem
                    key={filterButton.name}
                    active={active}
                    filterButton={filterButton}
                    onActivated={(filterButton) => this.props.onFilterButtonAdded(filterButton)}
                    onDeactivated={filterButton => this.props.onFilterButtonRemoved(filterButton)} />
                );
              })}
            </div>
          </div>
        }
      </div>
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
