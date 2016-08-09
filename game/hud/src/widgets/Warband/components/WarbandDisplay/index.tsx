/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-08-30 12:32:24
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-12 14:11:49
 */

import * as React from 'react';
import {Player, archetype, signalr, WarbandMember, cu, client} from 'camelot-unchained';
import {connect} from 'react-redux';

import {WarbandSessionState, WarbandState} from '../../services/session';
import {initialize as warbandInit} from '../../services/session/warband';
import WarbandMemberDisplay from '../WarbandMemberDisplay';

function select(state: WarbandSessionState): WarbandDisplayProps {
  return {
    warband: state.warband,
  }
}

export interface WarbandDisplayProps {
  dispatch?: (action: any) => void;
  warband: WarbandState;
  containerClass?: string;
  isMini?: boolean;
}

export interface WarbandDisplayState {
}

class WarbandDisplay extends React.Component<WarbandDisplayProps, WarbandDisplayState> {

  constructor(props: WarbandDisplayProps) {
    super(props);
  }

  renderMember = (member: WarbandMember): any => {
    return <WarbandMemberDisplay key={member.characterID} member={member} />;
  }

  // TESTING

  createWarband = () => {
    cu.api.createWarband(client.shardID, client.characterID);
  }

  quitWarband = () => {
    cu.api.quitWarband(client.shardID, client.characterID);
  }

  initSignalRHub = () => {
    this.props.dispatch(warbandInit());
  }

  componentDidMount() {
    setTimeout(() => this.props.dispatch(warbandInit()), 1000);
  }

  // END TESTING

  render() {
    return (
      <div className={`Warband ${this.props.containerClass}`}>
        {this.props.warband.activeMembers ? this.props.warband.activeMembers.map(this.renderMember) : null}
      </div>
    )
  }
}

export default connect(select)(WarbandDisplay);
