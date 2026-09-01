/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import SearchIconURL from '../../images/search-icon.png';

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue, StringIDGeneralSearch } from '../helpers/stringTableHelpers';
import { FactionBorder, BorderType, BorderBackground } from './FactionBorder';
import { getFactionData } from '../gameData/factionData';
import { requestAddImagesToCache } from '../dataSources/imageCacheService';

const DEFAULT_HEIGHT_VMIN = 4;
const DEFAULT_FONT_SIZE_REM = 1.75;

// CSS classes
const Root = 'HUD-FactionSearchBar-Root';
const IconContainer = 'HUD-FactionSearchBar-IconContainer';
const SearchIcon = 'HUD-FactionSearchBar-SearchIcon';
const BarContainer = 'HUD-FactionSearchBar-BarContainer';
const SearchBar = 'HUD-FactionSearchBar-SearchBar';
const ClearButton = 'HUD-FactionSearchBar-ClearButton';

requestAddImagesToCache(Root, [SearchIconURL]);

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string;
  onValueChanged: (newValue: string) => void;
  factionIDOverride?: string;
  heightOverrideVmin?: number;
}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AFactionSearchBar extends React.Component<Props> {
  render(): JSX.Element {
    const { value, onValueChanged, uiFactionID, stringTable, className, style, ...otherProps } = this.props;
    const scale = this.props.heightOverrideVmin ? this.props.heightOverrideVmin / DEFAULT_HEIGHT_VMIN : 1;
    const factionData = getFactionData(uiFactionID);
    const sizeVmin = `${DEFAULT_HEIGHT_VMIN * scale}vmin`;

    const borderColor = factionData.borderColor;
    return (
      <div className={`${Root} ${className ?? ''}`} {...otherProps}>
        <style>{`.HUD-FactionSearchBar-ClearButton { background-color: ${borderColor}80; } .HUD-FactionSearchBar-ClearButton::before, .HUD-FactionSearchBar-ClearButton::after { background-color: ${borderColor}; } .HUD-FactionSearchBar-ClearButton:hover { background-color: ${borderColor}cc; }`}</style>
        <FactionBorder
          className={IconContainer}
          type={BorderType.Secondary}
          style={{ width: sizeVmin, height: sizeVmin }}
        >
          <img className={SearchIcon} src={SearchIconURL} />
        </FactionBorder>
        <FactionBorder
          className={BarContainer}
          style={{ height: sizeVmin }}
          type={BorderType.Secondary}
          background={BorderBackground.Leather}
          includeLeft={false}
        >
          <input
            className={SearchBar}
            style={{
              width: `${DEFAULT_HEIGHT_VMIN * 5 * scale}vmin`,
              height: sizeVmin,
              backgroundColor: factionData.searchBackgroundColor,
              fontSize: `${DEFAULT_FONT_SIZE_REM * scale}rem`
            }}
            placeholder={getStringTableValue(StringIDGeneralSearch, stringTable)}
            value={value}
            onChange={this.handleSearchChange.bind(this)}
          />
          {value.length > 0 && <div className={ClearButton} onClick={() => onValueChanged('')} />}
        </FactionBorder>
      </div>
    );
  }

  private handleSearchChange(e: React.ChangeEvent<HTMLInputElement>): void {
    this.props.onValueChanged(e.target.value);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable
  };
};

export const FactionSearchBar = connect(mapStateToProps)(AFactionSearchBar);
