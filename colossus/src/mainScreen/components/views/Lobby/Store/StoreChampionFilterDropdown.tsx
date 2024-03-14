/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Dispatch } from 'redux';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { ChampionInfo, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { updateStoreChampionIDFilter } from '../../../../redux/storeSlice';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { Dictionary } from '@reduxjs/toolkit';

const ChampionDropdownContainer = 'StartScreen-Store-StoreChampionFilterDropdown-ChampionDropdownContainer';
const ChampionDropdownSelectionContainer =
  'StartScreen-Store-StoreChampionFilterDropdown-ChampionDropdownSelectionContainer';
const ChampionSelectionLabel = 'StartScreen-Store-StoreChampionFilterDropdown-ChampionSelectionLabel';
const ChampionOptionLabel = 'StartScreen-Store-StoreChampionFilterDropdown-ChampionOptionLabel';
const ChampionDropdownContentContainer =
  'StartScreen-Store-StoreChampionFilterDropdown-ChampionDropdownContentContainer';
const DropdownArrow = 'StartScreen-Store-StoreChampionFilterDropdown-DropdownArrow';

const StringIDStoreAllChampions = 'StoreAllChampions';

interface ReactProps {
  styles?: string;
}

interface InjectedProps {
  championIDFilter: string | null;
  dispatch?: Dispatch;
  champions: ChampionInfo[];
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

interface State {
  isOpen: boolean;
}

class AStoreChampionFilterDropdown extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  render(): JSX.Element {
    let sortedChampions: ChampionInfo[] = this.props.champions.slice().sort((c1, c2) => c1.name.localeCompare(c2.name));

    return (
      <div
        className={`${ChampionDropdownContainer} ${this.props.styles || ''}`}
        onClick={this.toggleOpenness.bind(this)}
      >
        <div className={ChampionDropdownSelectionContainer}>
          <span className={ChampionSelectionLabel}>{this.getNameForChampion(this.props.championIDFilter)}</span>
          <span className={DropdownArrow} />
        </div>
        <div className={`${ChampionDropdownContentContainer} ${this.state.isOpen ? 'Open' : ''}`}>
          {this.renderChampionOption(null)}
          {sortedChampions.map((champion) => {
            return this.renderChampionOption(champion.id);
          })}
        </div>
      </div>
    );
  }

  private getNameForChampion(championID: string): string {
    if (!championID) {
      return getStringTableValue(StringIDStoreAllChampions, this.props.stringTable);
    }

    const champion = this.props.champions.find((champion) => champion.id == championID);
    if (champion) {
      return champion.name.toUpperCase();
    }

    return null;
  }

  private renderChampionOption(championID: string): JSX.Element {
    const optionName = this.getNameForChampion(championID);
    return (
      optionName && (
        <div className={ChampionOptionLabel} onClick={this.onOptionClick.bind(this, championID)}>
          {optionName}
        </div>
      )
    );
  }

  private toggleOpenness(): void {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  private onOptionClick(championID: string | null): void {
    this.props.dispatch(updateStoreChampionIDFilter(championID));
    this.toggleOpenness();
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { championIDFilter } = state.store;
  const { champions } = state.championInfo;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    championIDFilter,
    champions,
    stringTable
  };
}

export const StoreChampionFilterDropdown = connect(mapStateToProps)(AStoreChampionFilterDropdown);
