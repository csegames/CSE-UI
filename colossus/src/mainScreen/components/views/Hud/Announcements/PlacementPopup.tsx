/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';

const Container = 'PlacementPopup-Container';
const ContainerMinimized = 'PlacementPopup-ContainerMinimized';
const Label = 'PlacementPopup-Label';
const Value = 'PlacementPopup-Value';

const StringIDPlacementPopupLabel = 'HUDPlacementPopupLabel';
const StringIDPlacementPopupValue = 'HUDPlacementPopupValue';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  rank: number;
}

type Props = ReactProps & InjectedProps;

interface State {
  isMinimized: boolean;
}

class APlacementPopup extends React.Component<Props, State> {
  private minimizeTimeout: number | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      isMinimized: false
    };
  }

  public render() {
    if (!this.props.rank || this.props.rank === 1) return null;
    return (
      <div className={this.state.isMinimized ? `${Container} ${ContainerMinimized}` : Container}>
        <div className={Label}>{getStringTableValue(StringIDPlacementPopupLabel, this.props.stringTable)}</div>
        <div className={Value}>
          {getTokenizedStringTableValue(StringIDPlacementPopupValue, this.props.stringTable, {
            PLACE: String(this.props.rank)
          })}
        </div>
      </div>
    );
  }

  public componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (prevProps.rank === 0 && this.props.rank !== 0 && this.props.rank !== 1) {
      this.minimizeTimeout = window.setTimeout(() => {
        this.setState({ isMinimized: true });
        this.minimizeTimeout = null;
      }, 2500);
    }
  }

  public componentWillUnmount(): void {
    if (this.minimizeTimeout) {
      clearTimeout(this.minimizeTimeout);
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    rank: state.player.rank
  };
}

export const PlacementPopup = connect(mapStateToProps)(APlacementPopup);
