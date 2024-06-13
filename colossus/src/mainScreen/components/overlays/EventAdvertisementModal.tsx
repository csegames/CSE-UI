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
import { EventAdvertisementPanelMessageData } from '../../redux/notificationsSlice';

const Container = 'EventAdvertisementModal-Container';
const Background = 'EventAdvertisementModal-Background';
const Title = 'EventAdvertisementModal-Title';
const Body = 'EventAdvertisementModal-Body';
const ButtonRow = 'EventAdvertisementModal-ButtonRow';
const CloseButton = 'EventAdvertisementModal-CloseButton';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  eventAdvertisementPanelMessage: EventAdvertisementPanelMessageData;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AEventAdvertisementModal extends React.Component<Props> {
  public render() {
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)} heightOverride={'80vmin'}>
        <div className={Container}>
          <img className={Background} src={this.props.eventAdvertisementPanelMessage.image} />
          <div className={Title}>{this.props.eventAdvertisementPanelMessage.modal.title}</div>
          <div className={Body}>{this.props.eventAdvertisementPanelMessage.modal.body}</div>
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
    this.props.dispatch(hideOverlay(Overlay.EventAdvertisementModal));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { eventAdvertisementModalMessage: eventAdvertisementPanelMessage } = state.notifications;
  return {
    ...ownProps,
    stringTable,
    eventAdvertisementPanelMessage
  };
}

export const EventAdvertisementModal = connect(mapStateToProps)(AEventAdvertisementModal);
