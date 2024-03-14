/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { Button } from '../../shared/Button';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { MiddleModalDisplay } from '../../shared/MiddleModalDisplay';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../redux/store';
import { StringIDGeneralNo, StringIDGeneralYes, getStringTableValue } from '../../../helpers/stringTableHelpers';

const Container = 'Settings-ResetDialog-Container';
const Title = 'Settings-ResetDialog-Title';
const Text = 'Settings-ResetDialog-Text';
const ButtonsContainer = 'Settings-ResetDialog-ButtonsContainer';

const ButtonStyles = 'Settings-ResetDialog-ButtonStyles';

const StringIDSettingsResetAllConfirmTitle = 'SettingsResetAllConfirmTitle';
const StringIDSettingsResetAllConfirmDescription = 'SettingsResetAllConfirmDescription';

interface ReactProps {
  onYesClick: () => void;
  onNoClick: () => void;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AResetDialog extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  private onYesClick() {
    this.props.onYesClick();
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
  }

  private onClose() {
    this.props.onNoClick();
  }

  private onNoClick() {
    this.props.onNoClick();
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
  }

  render(): React.ReactNode {
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)}>
        <div className={Container}>
          <div className={Title}>
            {getStringTableValue(StringIDSettingsResetAllConfirmTitle, this.props.stringTable)}
          </div>
          <div className={Text}>
            {getStringTableValue(StringIDSettingsResetAllConfirmDescription, this.props.stringTable)}
          </div>
          <div className={ButtonsContainer}>
            <Button
              text={getStringTableValue(StringIDGeneralYes, this.props.stringTable)}
              type='blue'
              onClick={this.onYesClick.bind(this)}
              styles={ButtonStyles}
            />
            <Button
              text={getStringTableValue(StringIDGeneralNo, this.props.stringTable)}
              type='blue-outline'
              onClick={this.onNoClick.bind(this)}
              styles={ButtonStyles}
            />
          </div>
        </div>
      </MiddleModalDisplay>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const ResetDialog = connect(mapStateToProps)(AResetDialog);
