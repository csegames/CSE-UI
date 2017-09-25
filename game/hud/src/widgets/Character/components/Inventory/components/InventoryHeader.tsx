/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-07-06 14:55:49
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-26 16:28:28
 */

import * as React from 'react';
import * as FilterButtonAPI from './FilterButtonAPI';

import {StyleSheet, css, StyleDeclaration} from 'aphrodite';
import {merge} from 'lodash';
import {Input, client} from 'camelot-unchained';

import InventoryFilterButton from './InventoryFilterButton';
import FilterSelectMenu from './FilterSelectMenu';
import {colors, InventoryFilterButton as FilterButtonDefinition} from '../../../lib/constants';

export interface InventoryHeaderStyle extends StyleDeclaration {
  InventoryHeader: React.CSSProperties;
  inputAndFilterMenuContainer: React.CSSProperties;
  filterInputWrapper: React.CSSProperties;
  filterInput: React.CSSProperties;
  filterButtons: React.CSSProperties;
}

export const defaultInventoryHeaderStyle: InventoryHeaderStyle = {
  InventoryHeader: {
    display: 'flex',
    flex: '0 0 auto',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'stretch',
    padding: '10px 5px 5px 5px',
    backgroundColor: colors.filterBackgroundColor,
    zIndex: 1,
  },

  inputAndFilterMenuContainer: {
    display: 'flex',
    alignItems: 'center',
  },

  filterInputWrapper: {
    flex: '1 1 auto',
  },

  filterInput: {
    flex: '1 1 auto',
    height: '30px',
    padding: '0 5px',
    fontSize: '24px',
    border: `1px solid ${colors.infoText}`,
    color: colors.infoText,
    backgroundColor: colors.searchInputBackgroundColor,
    '::-webkit-input-placeholder': {
      color: colors.infoText,
    },
    marginRight: '10px',
  },

  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    margin: '5px 0px',
  },
};

export interface InventoryHeaderProps {
  styles?: Partial<InventoryHeaderStyle>;

  // Text that is currently shown in the filter / search input box
  filterText: string;

  // Called when the user enters any text into the filter input box
  onFilterChanged: (text: string) => void;

  // Called when the user clicks on a filter button to activate it
  onFilterButtonActivated: (filter: FilterButtonDefinition) => void;

  // Called when the user clicks on a filter button to deactivate it
  onFilterButtonDeactivated: (filter: FilterButtonDefinition) => void;
}

export interface InventoryHeaderState extends FilterButtonAPI.FilterButtonState {
}

export class InventoryHeader extends React.Component<InventoryHeaderProps, InventoryHeaderState> {
  constructor(props: InventoryHeaderProps) {
    super(props);
    this.state = {
      ...FilterButtonAPI.getInitialFilterButtonState(),
    };
  }
  public render() {
    const ss = StyleSheet.create(defaultInventoryHeaderStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.InventoryHeader, custom.InventoryHeader)}>
        <div className={css(ss.inputAndFilterMenuContainer, custom.inputAndFilterMenuContainer)}>
          <Input
            styles={{
              input: merge(defaultInventoryHeaderStyle.filterInput,
                    this.props.styles ? this.props.styles.filterInput : {}),
              inputWrapper: merge(defaultInventoryHeaderStyle.filterInputWrapper,
                    this.props.styles ? this.props.styles.filterInputWrapper : {}),
            }}
            onFocus={() => client.RequestInputOwnership()}
            onBlur={() => client.ReleaseInputOwnership()}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.onFilterChanged(e.target.value)}
            value={this.props.filterText}
            placeholder={'Filter'}
          />
          <FilterSelectMenu
            selectedFilterButtons={this.state.filterButtons}
            onFilterButtonAdded={this.onFilterButtonAdded}
            onFilterButtonRemoved={this.onFilterButtonRemoved}
          />
        </div>
        <div className={css(ss.filterButtons, custom.filterButtons)}>
          {this.state.filterButtons.map((filter: FilterButtonDefinition, index: number) => (
            <InventoryFilterButton key={index}
                                  filterButton={filter}
                                  onActivated={this.props.onFilterButtonActivated}
                                  onDeactivated={this.props.onFilterButtonDeactivated} />
          ))}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.setState(FilterButtonAPI.initializeFilterButtons);
  }

  private onFilterButtonAdded = (filterButton: FilterButtonDefinition) => {
    this.setState(state => FilterButtonAPI.addFilterButton(filterButton, state));
  }

  private onFilterButtonRemoved = (filterButton: FilterButtonDefinition) => {
    this.setState(state => FilterButtonAPI.removeFilterButton(filterButton, state));
  }
}

export default InventoryHeader;
