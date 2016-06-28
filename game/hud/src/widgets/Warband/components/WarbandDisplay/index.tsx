/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {Player, archetype, signalr, WarbandMember} from 'camelot-unchained';
import {connect} from 'react-redux';

import {WarbandSessionState, WarbandState, LayoutState} from '../../services/session';
import WarbandMemberDisplay from '../WarbandMemberDisplay';

function select(state: WarbandSessionState): WarbandDisplayProps {
  return {
    layout: state.layout,
    warband: state.warband,
  }
}

export interface WarbandDisplayProps {
  layout: LayoutState;
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

  render() {
    return (
      <div className={`Warband ${this.props.containerClass}`}>
        {this.props.warband.activeMembers.map(this.renderMember)}
      </div>
    )
  }
}

export default connect(select)(WarbandDisplay);
