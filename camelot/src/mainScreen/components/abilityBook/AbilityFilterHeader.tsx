/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { AbilityNetworkDefData, AbilityDisplayData } from '../../redux/gameDefsSlice';
import { AbilityFilterDropdown } from './AbilityFilterDropdown';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import Check from '../../../images/abilitybook/check.png';
import MagnifyingGlass from '../../../images/abilitybook/search.png';
import Close from '../../../images/abilitybook/close.png';

const Root = 'HUD-AbilityFilterHeader-Root';
const CheckContainer = 'HUD-AbilityFilterHeader-CheckContainer';
const CheckText = 'HUD-AbilityFilterHeader-CheckText';
const CheckBox = 'HUD-AbilityFilterHeader-CheckBox';
const CheckImage = 'HUD-AbilityFilterHeader-CheckImage';
const SearchContainer = 'HUD-AbilityFilterHeader-SearchContainer';
const SearchInput = 'HUD-AbilityFilterHeader-SearchInput';
const SearchIcon = 'HUD-AbilityFilterHeader-SearchIcon';
const ResetFiltersButton = 'HUD-AbilityFilterHeader-ResetFiltersButton';

export interface AbilityFilterHeaderState {
  filterUnassigned: boolean;
  searchText: string;
  selectedComponentNames: string[];
}

interface ReactProps {
  bookTab: string;
  onFilterChanged: (state: AbilityFilterHeaderState) => void;
}

interface InjectedProps {
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  abilityDisplayData: Dictionary<AbilityDisplayData>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityFilterHeader extends React.Component<Props, AbilityFilterHeaderState> {
  constructor(props: Props) {
    super(props);
    this.state = { filterUnassigned: false, searchText: '', selectedComponentNames: [] };
  }

  render(): JSX.Element {
    const isSearching = this.state.searchText.length > 0;
    return (
      <div className={Root}>
        <div className={CheckContainer}>
          <div className={CheckBox} onClick={this.onUnassignedClicked.bind(this)}>
            {this.state.filterUnassigned && <img className={CheckImage} src={Check} />}
          </div>
          <div className={CheckText}>Unassigned</div>
        </div>
        <AbilityFilterDropdown
          bookTab={this.props.bookTab}
          selectedComponentNames={this.state.selectedComponentNames}
          onSelectionChanged={(selectedComponentNames) => {
            this.setState({ selectedComponentNames });
          }}
        />
        <div className={SearchContainer}>
          <input
            className={SearchInput}
            type={'text'}
            value={this.state.searchText}
            onChange={(e) => {
              this.setState({ searchText: e.target.value });
            }}
            placeholder={'Filter by name'}
          />
          <img
            className={`${SearchIcon} ${isSearching ? 'close' : ''}`}
            src={isSearching ? Close : MagnifyingGlass}
            onClick={this.onSearchIconClicked.bind(this, isSearching)}
          />
        </div>
        <div className={ResetFiltersButton} onClick={this.onResetFiltersClicked.bind(this)}>
          Reset Filters
        </div>
      </div>
    );
  }

  private onResetFiltersClicked(): void {
    this.setState({ filterUnassigned: false, searchText: '', selectedComponentNames: [] });
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<AbilityFilterHeaderState>, snapshot?: any): void {
    if (
      this.state.filterUnassigned !== prevState.filterUnassigned ||
      this.state.searchText !== prevState.searchText ||
      this.state.selectedComponentNames !== prevState.selectedComponentNames
    ) {
      this.props.onFilterChanged?.(this.state);
    }
  }

  private onSearchIconClicked(isSearching: boolean): void {
    if (isSearching) {
      this.setState({ searchText: '' });
    }
  }

  private onUnassignedClicked(): void {
    this.setState({ filterUnassigned: !this.state.filterUnassigned });
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityNetworks, abilityDisplayData } = state.gameDefs;
  return {
    ...ownProps,
    abilityNetworks,
    abilityDisplayData
  };
};

export const AbilityFilterHeader = connect(mapStateToProps)(AAbilityFilterHeader);
