/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { parseAnnouncementText } from './Utils';
import { CSSTransitionGroup } from 'react-transition-group';
import { game } from '@csegames/library/dist/_baseGame';
import { AnnouncementType } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { RootState } from '../../../../redux/store';
import { KeybindsState } from '../../../../redux/keybindsSlice';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const Container = 'Announcements-Popup-Container';
const PopupMessage = 'Announcements-Popup-PopupMessage';
const ObjectiveSuccessMessage = 'Announcements-Popup-ObjectiveSuccessMessage';
const ObjectiveFailedMessage = 'Announcements-Popup-ObjectiveFailedMessage';
const PopupBoxDisplayTimeSeconds = 7.0;
const TransitionEnterSeconds = 0.5;

const TransitionLeaveSeconds = 0.1;

interface PopupMessage {
  id: number;
  message: string;
  type: AnnouncementType;
}

interface InjectedProps {
  usingGamepad: boolean;
  keybindsState: KeybindsState;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = InjectedProps;

export interface State {
  messages: PopupMessage[];
}

class APopupAnnouncement extends React.Component<Props, State> {
  private eventHandle: ListenerHandle = null;
  private nextPopupBoxId: number;

  constructor(props: Props) {
    super(props);
    this.nextPopupBoxId = 0;
    this.state = {
      messages: []
    };
  }

  public render() {
    let popups = [];
    for (let msg of this.state.messages) {
      if (msg.type === AnnouncementType.PopUp) {
        popups.push(
          <div className={PopupMessage} key={msg.id}>
            {parseAnnouncementText(
              msg.message,
              this.props.usingGamepad,
              this.props.keybindsState,
              this.props.stringTable
            )}
          </div>
        );
      } else if (msg.type === AnnouncementType.ObjectiveSuccess) {
        popups.push(
          <div className={ObjectiveSuccessMessage} key={msg.id}>
            {parseAnnouncementText(
              msg.message,
              this.props.usingGamepad,
              this.props.keybindsState,
              this.props.stringTable
            )}
          </div>
        );
      } else if (msg.type === AnnouncementType.ObjectiveFail) {
        popups.push(
          <div className={ObjectiveFailedMessage} key={msg.id}>
            {parseAnnouncementText(
              msg.message,
              this.props.usingGamepad,
              this.props.keybindsState,
              this.props.stringTable
            )}
          </div>
        );
      }
    }

    return (
      <div id='PopupAnnouncementContainer_HUD' className={Container}>
        <CSSTransitionGroup
          transitionName='announcement'
          transitionEnterTimeout={TransitionEnterSeconds * 1000}
          transitionLeaveTimeout={TransitionLeaveSeconds * 1000}
        >
          {popups}
        </CSSTransitionGroup>
      </div>
    );
  }

  public componentDidMount() {
    this.eventHandle = clientAPI.bindAnnouncementListener(this.handleAnnouncement.bind(this));
  }

  public componentWillUnmount() {
    if (this.eventHandle) {
      this.eventHandle.close();
    }
  }

  private handleAnnouncement = (
    type: AnnouncementType,
    message: string,
    speakerName: string,
    speakerIcon: string,
    soundID: number
  ) => {
    if (!message) {
      return;
    }

    let gotValidType = false;
    for (const validType of [
      AnnouncementType.PopUp,
      AnnouncementType.ObjectiveSuccess,
      AnnouncementType.ObjectiveFail
    ]) {
      if ((type & validType) !== 0) {
        gotValidType = true;
        break;
      }
    }

    if (!gotValidType) {
      return;
    }

    if (soundID !== 0) {
      setTimeout(() => {
        game.playGameSound(soundID);
      }, TransitionEnterSeconds * 1000);
    }

    const newPopupId = this.nextPopupBoxId;
    this.nextPopupBoxId += 1;

    const newBox: PopupMessage = { id: newPopupId, message: message, type: type };
    this.setState({ messages: [...this.state.messages, newBox] });

    // remove this new box after a bit
    setTimeout(() => {
      this.setState({ messages: this.state.messages.filter((box) => box.id !== newPopupId) });
    }, PopupBoxDisplayTimeSeconds * 1000);
  };
}

function mapStateToProps(state: RootState): Props {
  return {
    usingGamepad: state.baseGame.usingGamepad,
    keybindsState: state.keybinds,
    stringTable: state.stringTable.stringTable
  };
}

export const PopupAnnouncement = connect(mapStateToProps)(APopupAnnouncement);
