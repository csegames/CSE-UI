/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ItemContainer } from './ItemContainer';
import { Input } from '../../Input';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';

const StringIDSettingsSearch = 'SettingsSearch';

export interface ReactProps {
  searchValue: string;
  onSearchValueChange: (searchValue: string) => void;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class ASearchBar extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private onChange(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.onSearchValueChange(e.target.value);
  }

  render(): React.ReactNode {
    return (
      <div className={ItemContainer}>
        <input
          className={Input}
          placeholder={getStringTableValue(StringIDSettingsSearch, this.props.stringTable)}
          value={this.props.searchValue}
          onChange={this.onChange.bind(this)}
        />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const SearchBar = connect(mapStateToProps)(ASearchBar);
