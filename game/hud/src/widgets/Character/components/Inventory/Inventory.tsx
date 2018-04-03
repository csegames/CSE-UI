/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import InventoryHeader from './components/InventoryHeader';
import InventoryBody from './components/InventoryBody';
import { colors, InventoryFilterButton } from '../../lib/constants';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../gqlInterfaces';
import { ContainerIdToDrawerInfo } from './components/InventoryBase';

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
  inventoryItems: InventoryItemFragment[];
  equippedItems: EquippedItemFragment[];
  containerIdToDrawerInfo: ContainerIdToDrawerInfo;
  onChangeInventoryItems: (inventoryItems: InventoryItemFragment[]) => void;
  onChangeContainerIdToDrawerInfo: (newObj: ContainerIdToDrawerInfo) => void;
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
        <InventoryHeader
          filterText={this.state.filterText}
          onFilterChanged={this.onFilterTextChanged}
          onFilterButtonActivated={this.onFilterButtonActivated}
          onFilterButtonDeactivated={this.onFilterButtonDeactivated}
        />
        <InventoryBody
          equippedItems={this.props.equippedItems}
          inventoryItems={this.props.inventoryItems}
          containerIdToDrawerInfo={this.props.containerIdToDrawerInfo}
          onChangeContainerIdToDrawerInfo={this.props.onChangeContainerIdToDrawerInfo}
          onChangeInventoryItems={this.props.onChangeInventoryItems}
          searchValue={this.state.filterText}
          activeFilters={this.state.activeFilters}
          visibleComponent={this.props.visibleComponent}
        />
      </div>
    );
  }

  public componentDidCatch(error: Error, info: any) {
    console.error(error);
    console.log(info);
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
