/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as webAPI from '@csegames/library/dist/hordetest/webAPI/definitions';

import { Button } from '../shared/Button';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { game } from '@csegames/library/dist/_baseGame';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from 'redux';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { hideOverlay, Overlay } from '../../redux/navigationSlice';
import { setUserShouldRefresh } from '../../redux/userSlice';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import {
  getStringTableValue,
  StringIDGeneralCancel,
  StringIDGeneralContinue,
  StringIDGeneralUnknownError
} from '../../helpers/stringTableHelpers';
import { webConf } from '../../dataSources/networkConfiguration';

const Form = 'SetDisplayName-Form';
const Title = 'SetDisplayName-Title';
const ErrorText = 'SetDisplayName-ErrorText';
const ButtonsContainer = 'SetDisplayName-ButtonsContainer';
const ButtonStyles = 'SetDisplayName-ButtonStyles';
const Input = 'SetDisplayName-Input';

const StringIDSetDisplayNameTitle = 'SetDisplayNameTitle';

interface ReactProps {}

interface InjectedProps {
  displayName?: string;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  waitingOnRequest: boolean;
  resultMessage: string;
  resultIsSuccess: boolean;
}

class ASetDisplayName extends React.Component<Props, State> {
  private form: React.RefObject<HTMLFormElement>;

  constructor(props: Props) {
    super(props);
    this.form = React.createRef();
    this.state = {
      waitingOnRequest: false,
      resultMessage: ' ', // Needs to be non-empty, else the div gets optimized out of existence.
      resultIsSuccess: true
    };
  }

  private async setDisplayName() {
    try {
      const form = this.form.current;
      const newDisplayName: string = form['displayName'].value;

      game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
      this.setState((s) => ({
        ...s,
        waitingOnRequest: true
      }));

      var result = await webAPI.DisplayNameAPI.SetDisplayName(webConf, newDisplayName);
      if (result.ok) {
        this.props.dispatch(setUserShouldRefresh(true)); // TODO : set up profile change subscription
        this.onClose();
      } else {
        let lastError = getStringTableValue(StringIDGeneralUnknownError, this.props.stringTable);
        try {
          lastError = result.json<any>().FieldCodes[0].Message;
        } catch (err) {
          console.error('setDisplayName error on parsing Json for lastError message', err);
        }
        this.setState((s) => ({
          ...s,
          waitingOnRequest: false,
          resultMessage: lastError,
          resultIsSuccess: false
        }));
      }
    } catch (err) {
      console.log(err);
    }
  }

  private onCancelClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
    this.onClose();
  }

  private onInputKeyDown(event: KeyboardEvent) {
    // The enter key will reload the coherent ui, so ignore it
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }

  private renderResultMessage() {
    if (this.state.resultMessage) {
      return (
        <div className={`${ErrorText} ${!this.state.resultIsSuccess ? 'error' : ''}`}>{this.state.resultMessage}</div>
      );
    }
  }

  private onClose() {
    this.props.dispatch(hideOverlay(Overlay.SetDisplayName));
  }

  public render() {
    const name = this.props.displayName ?? '';
    const nameInputClasses: string[] = [Input];
    if (!this.state.resultIsSuccess) {
      nameInputClasses.push('error');
    }

    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)}>
        <form ref={this.form} className={Form}>
          <div className={Title}>{getStringTableValue(StringIDSetDisplayNameTitle, this.props.stringTable)}</div>
          <input
            className={`${Input} ${nameInputClasses.join(' ')}`}
            name={'displayName'}
            type={'text'}
            placeholder={name}
            onKeyDown={this.onInputKeyDown.bind(this)}
          />
        </form>
        <div className={ButtonsContainer}>
          <Button
            type={'blue'}
            text={getStringTableValue(StringIDGeneralContinue, this.props.stringTable)}
            disabled={this.state.waitingOnRequest}
            onClick={this.setDisplayName.bind(this)}
            styles={ButtonStyles}
          />
          <Button
            type={'blue-outline'}
            text={getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
            disabled={!name && this.state.waitingOnRequest}
            onClick={this.onCancelClick.bind(this)}
            styles={ButtonStyles}
          />
        </div>
        {this.renderResultMessage()}
      </MiddleModalDisplay>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { displayName } = state.user;
  const { stringTable } = state.stringTable;
  return {
    ...ownProps,
    displayName,
    stringTable
  };
}

export const SetDisplayName = connect(mapStateToProps)(ASetDisplayName);
