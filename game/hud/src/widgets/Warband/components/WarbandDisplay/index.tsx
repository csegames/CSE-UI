/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-08-30 12:32:24
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-06 15:14:44
 */

import * as React from 'react';
import {WarbandMember} from 'camelot-unchained';
import {connect} from 'react-redux';

import {WarbandSessionState, WarbandState} from '../../services/session';
import {initialize as warbandInit} from '../../services/session/warband';
import WarbandMemberDisplay from '../WarbandMemberDisplay';

function select(state: WarbandSessionState): WarbandDisplayProps {
  return {
    warband: state.warband,
  };
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

  public render() {
    return (
      <div className={`WarbandDisplay ${this.props.containerClass}`}>
        {this.props.warband.activeMembers ? this.props.warband.activeMembers.map(this.renderMember) : null}
      </div>
    );
  }

  public componentDidMount() {
    setTimeout(() => this.props.dispatch(warbandInit()), 1000);
  }

  private renderMember = (member: WarbandMember): any => {
    return <WarbandMemberDisplay key={member.characterID} member={member} />;
  }

  private initSignalRHub = () => {
    this.props.dispatch(warbandInit());
  }
}

export default connect(select)(WarbandDisplay);
