/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { getStringTableValue, StringIDGeneralSearch } from '../../helpers/stringTableHelpers';
import { FactionBorder, BorderType, BorderBackground } from '../FactionBorder';
import { getFactionData } from '../../gameData/factionData';
import { requestAddImagesToCache } from '../../dataSources/imageCacheService';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import SearchIconURL from '../../../images/search-icon.png';

// CSS classes
const Root = 'HUD-InventorySearchBar-Root';
const BarRow = 'HUD-InventorySearchBar-BarRow';
const IconContainer = 'HUD-InventorySearchBar-IconContainer';
const SearchIcon = 'HUD-InventorySearchBar-SearchIcon';
const BarContainer = 'HUD-InventorySearchBar-BarContainer';
const SearchBar = 'HUD-InventorySearchBar-SearchBar';
const TaperBar = 'HUD-InventorySearchBar-TaperBar';

requestAddImagesToCache(Root, [SearchIconURL]);

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChanged: (newValue: string) => void;
}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AInventorySearchBar extends React.Component<Props> {
  render(): JSX.Element {
    const { value, onValueChanged, uiFactionID, stringTable, dispatch, className, ...otherProps } = this.props;

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={`${Root} ${className ?? ''}`} {...otherProps}>
        <div className={BarRow}>
          <FactionBorder className={IconContainer} type={BorderType.Secondary}>
            <img className={SearchIcon} src={SearchIconURL} />
          </FactionBorder>
          <FactionBorder
            className={BarContainer}
            type={BorderType.Secondary}
            background={BorderBackground.Leather}
            includeLeft={false}
          >
            <input
              className={SearchBar}
              style={{
                backgroundColor: factionData.searchBackgroundColor
              }}
              placeholder={getStringTableValue(StringIDGeneralSearch, this.props.stringTable)}
              onChange={this.handleSearchChange.bind(this)}
            />
          </FactionBorder>
        </div>
        <img className={TaperBar} src={factionData.taperBarImage} />
      </div>
    );
  }

  private handleSearchChange(e: Event): void {
    const target = e.target as HTMLInputElement;
    this.props.onValueChanged(target.value);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable
  };
};

export const InventorySearchBar = connect(mapStateToProps)(AInventorySearchBar);
