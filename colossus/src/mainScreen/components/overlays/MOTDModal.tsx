/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Button } from '../shared/Button';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { Dispatch } from 'redux';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Overlay, hideOverlay } from '../../redux/navigationSlice';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { StringIDGeneralDone, getStringTableValue } from '../../helpers/stringTableHelpers';
import { MOTDMessageData, removeMOTDMessageData, setSeenMOTD } from '../../redux/notificationsSlice';

const Container = 'MOTDModal-Container';
const Background = 'MOTDModal-Background';
const Title = 'MOTDModal-Title';
const Body = 'MOTDModal-Body';
const ButtonRow = 'MOTDModal-ButtonRow';
const CloseButton = 'MOTDModal-CloseButton';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  motdMessage: MOTDMessageData;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AMOTDModal extends React.Component<Props> {
  public render() {
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride={'80vmin'}>
        <div className={Container}>
          <img className={Background} src={this.props.motdMessage.image} />
          <div className={Title}>{this.props.motdMessage.title}</div>
          <div className={Body}>{this.props.motdMessage.body}</div>
        </div>
        <div className={ButtonRow}>
          <Button
            type='blue'
            text={getStringTableValue(StringIDGeneralDone, this.props.stringTable)}
            styles={CloseButton}
            onClick={this.onClose.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }

  private async onClose(): Promise<void> {
    this.props.dispatch(hideOverlay(Overlay.MOTDModal));
    this.props.dispatch(setSeenMOTD(this.props.motdMessage.id));
    this.props.dispatch(removeMOTDMessageData(this.props.motdMessage.id));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { motdModalMessage: motdMessage } = state.notifications;
  return {
    ...ownProps,
    stringTable,
    motdMessage
  };
}

export const MOTDModal = connect(mapStateToProps)(AMOTDModal);
