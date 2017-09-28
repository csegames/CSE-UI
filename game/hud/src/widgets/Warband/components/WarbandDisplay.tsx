/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import { WarbandSessionState, WarbandState } from '../services/session';
import { initialize as warbandInit } from '../services/session/warband';
import WarbandMemberDisplay from './WarbandMemberDisplay';

function select(state: WarbandSessionState) {
  return {
    warband: state.warband,
  };
}

export interface Style extends StyleDeclaration {
  WarbandDisplay: React.CSSProperties;
}

export const defaultStyle: Style = {
  WarbandDisplay: {
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
  },
};

export interface WarbandDisplayProps {
  dispatch: (action: any) => void;
  warband: WarbandState;
  isMini?: boolean;
}

export interface WarbandDisplayState {
}

class WarbandDisplay extends React.Component<WarbandDisplayProps, WarbandDisplayState> {

  constructor(props: WarbandDisplayProps) {
    super(props);
  }

  public render() {
    const style = StyleSheet.create(defaultStyle);
    const members = this.props.warband && this.props.warband.activeMembers;
    return (
      <div className={css(style.WarbandDisplay)}>
        {members ? members.map(m => <WarbandMemberDisplay key={m.characterID} member={m} />) : null}
      </div>
    );
  }

  public componentDidMount() {
    setTimeout(() => this.props.dispatch(warbandInit()), 2000);
  }
}

export default connect(select)(WarbandDisplay);
