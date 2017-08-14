/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-30 16:45:59
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-14 10:24:06
 */

import * as React from 'react';
// import { utils } from 'camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import InventoryHeader from './components/InventoryHeader';
import InventoryBody from './components/InventoryBody';
import { colors, InventoryFilterButton } from '../../lib/constants';
import { InventoryItemFragment } from '../../../../gqlInterfaces';
// import reducer from '../../services/session/reducer';

export interface InventoryStyle extends StyleDeclaration {
  inventory: React.CSSProperties;
  infoContainer: React.CSSProperties;
  searchInput: React.CSSProperties;
}

export const defaultInventoryStyle: InventoryStyle = {
  inventory: {
    display: 'flex',
    flexDirection: 'column',
    userSelect: 'none',
    width: '100%',
    height: '100%',
  },
  
  infoContainer: {
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: '10px 5px 15px 5px',
    backgroundColor: colors.filterBackgroundColor,
    zIndex: 1,
  },

  searchInput: {
    height: '30px',
    padding: '0 5px',
    fontSize: '24px',
    border: `1px solid ${colors.infoText}`,
    color: colors.infoText,
    backgroundColor: colors.searchInputBackgroundColor,
    '::-webkit-input-placeholder': {
      color: colors.infoText,
    },
  },
};

export interface InventoryProps {
  styles?: Partial<InventoryStyle>;
  visibleComponent: string;
  onChangeInventoryItems: (inventoryItems: InventoryItemFragment[]) => void;
  inventoryItems: InventoryItemFragment[];
}

export interface ActiveFilters {
  [id: string]: InventoryFilterButton;
}

export interface InventoryState {
  filterText: string;
  activeFilters: ActiveFilters;
}

class Inventory extends React.Component<InventoryProps, InventoryState> {
  constructor(props: InventoryProps) {
    super (props);
    this.state = {
      filterText: '',
      activeFilters: {},
    };
  }

  public render() {
    const ss = StyleSheet.create({ ...defaultInventoryStyle, ...this.props.styles });
    return (
      <div className={css(ss.inventory)}>
        <InventoryHeader filterText={this.state.filterText}
                          onFilterChanged={this.onFilterTextChanged}
                          onFilterButtonActivated={this.onFilterButtonActivated}
                          onFilterButtonDeactivated={this.onFilterButtonDeactivated} />
        <InventoryBody  inventoryItems={this.props.inventoryItems}
                        onChangeInventoryItems={this.props.onChangeInventoryItems}
                        searchValue={this.state.filterText}
                        activeFilters={this.state.activeFilters}
                        visibleComponent={this.props.visibleComponent} />
      </div>
    );
  }

  private onFilterTextChanged = (filterText: string) => {
    this.setState({ filterText });
  }

  private onFilterButtonActivated = (filter: InventoryFilterButton) => {
    this.setState((state) => {
      const activeFilters = Object.assign({}, state.activeFilters);
      activeFilters[filter.name] = filter;
      return {
        ...state,
        activeFilters,
      };
    });
  }

  private onFilterButtonDeactivated = (filter: InventoryFilterButton) => {
    this.setState((state) => {
      const activeFilters = Object.assign({}, state.activeFilters);
      delete activeFilters[filter.name];
      return {
        ...state,
        activeFilters,
      };
    });
  }
}

export default Inventory;
