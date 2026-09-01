/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../redux/store';
import { getFactionData } from '../gameData/factionData';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue, StringIDGeneralPage } from '../helpers/stringTableHelpers';

const Root = 'HUD-FactionPageSwitcher-Root';
const Arrow = 'HUD-FactionPageSwitcher-Arrow';
const Content = 'HUD-FactionPageSwitcher-Content';
const Text = 'HUD-FactionPageSwitcher-Text';

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  currentPage: number;
  pageCount: number;
  factionIDOverride?: string;
  onPageChanged?: (newPage: number) => void;
}

interface InjectedProps {
  uiFactionID: string;
  stringTable: Record<string, StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AFactionPageSwitcher extends React.Component<Props> {
  render(): JSX.Element {
    const {
      currentPage,
      pageCount,
      onPageChanged,
      stringTable,
      uiFactionID,
      factionIDOverride,
      dispatch,
      className,
      ...otherProps
    } = this.props;

    if (currentPage < 0) {
      // If the currentPage is invalid, set it to the first page.
      onPageChanged(0);
      return null;
    } else if (currentPage < 0 || currentPage >= pageCount) {
      // If the number of pages decrease (e.g. user deleted the only message on the last page),
      // switch to the last valid page, or first page if no messages at all.
      onPageChanged(Math.max(0, pageCount - 1));
      return null;
    }

    const factionData = getFactionData(this.props.uiFactionID);

    const canPageDecrease = currentPage > 0;
    const canPageIncrease = currentPage < pageCount - 1;

    return (
      <div {...otherProps} className={`${Root} ${className}`}>
        <img
          className={`${Arrow} ${canPageDecrease ? '' : 'disabled'}`}
          src={factionData.arrowLeftImage}
          onClick={this.onDecrementClicked.bind(this)}
        />
        <div className={Content}>
          <div className={Text}>{getStringTableValue(StringIDGeneralPage, this.props.stringTable)}</div>
          <div className={Text}>{`${currentPage + 1}/${Math.max(pageCount, 1)}`}</div>
        </div>
        <img
          className={`${Arrow} right ${canPageIncrease ? '' : 'disabled'}`}
          src={factionData.arrowLeftImage}
          onClick={this.onIncrementClicked.bind(this)}
        />
      </div>
    );
  }

  private onDecrementClicked(): void {
    this.props.onPageChanged(this.props.currentPage - 1);
  }

  private onIncrementClicked(): void {
    this.props.onPageChanged(this.props.currentPage + 1);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: ownProps.factionIDOverride ?? state.hud.uiFactionID,
    stringTable: state.stringTable.stringTable
  };
};

export const FactionPageSwitcher = connect(mapStateToProps)(AFactionPageSwitcher);
