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
import { hideAllOverlays } from '../../redux/navigationSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { ErrorData } from '../../helpers/errorConversionHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { StringIDGeneralContinue, getStringTableValue } from '../../helpers/stringTableHelpers';

const Container = 'Error-Container';
const Title = 'Error-Title';
const FailedToQueueTitle = 'Error-FailedToQueueTitle';
const Message = 'Error-Message';

const ButtonStyle = 'Error-Button';

export interface ReactProps {
  error: ErrorData;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AErrorModal extends React.Component<Props> {
  private onClose() {
    this.props.dispatch(hideAllOverlays());
  }

  private onContinueClick() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
    this.onClose();
  }

  public render() {
    const error = this.props.error;
    const titleStyle = error.severity === 'standard' ? Title : FailedToQueueTitle;

    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)}>
        <div className={Container}>
          <div className={titleStyle}>{error.title}</div>
          <div className={Message}>
            {error.message} ({error.code})
          </div>
          <Button
            type='blue-outline'
            text={getStringTableValue(StringIDGeneralContinue, this.props.stringTable)}
            styles={ButtonStyle}
            onClick={this.onContinueClick.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  return { ...ownProps, stringTable };
}

export const ErrorModal = connect(mapStateToProps)(AErrorModal);
