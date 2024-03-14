/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { Button } from '../../../shared/Button';
import { Binding, Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import {
  StringIDGeneralNo,
  StringIDGeneralOk,
  StringIDGeneralYes,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../../helpers/stringTableHelpers';

const Container = 'Settings-Keybinds-ConfirmRemoveBindDialog-Container';
const ConfirmBindingText = 'Settings-Keybinds-ConfirmRemoveBindDialog-ConfirmBindingText';
const Key = 'Settings-Keybinds-ConfirmRemoveBindDialog-Key';
const TextContent = 'Settings-Keybinds-ConfirmRemoveBindDialog-TextContent';
const ButtonContainer = 'Settings-Keybinds-ConfirmRemoveBindDialog-ButtonContainer';

const ButtonStyles = 'Settings-Keybinds-ConfirmRemoveBindDialog-ButtonStyles';

const StringIDSettingsConfirmUnbindingTitle = 'SettingsConfirmUnbindingTitle';
const StringIDSettingsConfirmUnbindingDescription1 = 'SettingsConfirmUnbindingDescription1';
const StringIDSettingsConfirmUnbindingDescription2 = 'SettingsConfirmUnbindingDescription2';
const StringIDSettingsConfirmNothingToUnbind = 'SettingsConfirmNothingToUnbind';

interface State {}

interface ReactProps {
  keybind: Keybind;
  binding: Binding;
  onYesClick: () => void;
  onNoClick: () => void;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export class AConfirmRemoveBindDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {};
  }

  private onYesClick() {
    this.props.onYesClick();
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_YES);
  }

  private onNoClick() {
    this.props.onNoClick();
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
  }

  public render() {
    if (this.props.binding.name) {
      const tokens = {
        KEYBIND_DESCRIPTION: toTitleCase(this.props.keybind.description)
      };

      return (
        <div className={Container}>
          <span className={ConfirmBindingText}>
            {getStringTableValue(StringIDSettingsConfirmUnbindingTitle, this.props.stringTable)}
          </span>
          <p className={TextContent}>
            {getStringTableValue(StringIDSettingsConfirmUnbindingDescription1, this.props.stringTable)}
            <span className={Key}>{this.props.binding.name}</span>
            {getTokenizedStringTableValue(StringIDSettingsConfirmUnbindingDescription2, this.props.stringTable, tokens)}
          </p>
          <div className={ButtonContainer}>
            <Button
              type='blue'
              text={getStringTableValue(StringIDGeneralYes, this.props.stringTable)}
              onClick={() => this.onYesClick()}
              styles={ButtonStyles}
            />
            <Button
              type='blue-outline'
              text={getStringTableValue(StringIDGeneralNo, this.props.stringTable)}
              onClick={() => this.onNoClick()}
              styles={ButtonStyles}
            />
          </div>
        </div>
      );
    } else {
      return (
        <div className={Container}>
          <span className={ConfirmBindingText}>
            {getStringTableValue(StringIDSettingsConfirmNothingToUnbind, this.props.stringTable)}
          </span>
          <div className={ButtonContainer}>
            <Button
              type='blue'
              text={getStringTableValue(StringIDGeneralOk, this.props.stringTable)}
              onClick={() => this.onNoClick()}
              styles={ButtonStyles}
            />
          </div>
        </div>
      );
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const ConfirmRemoveBindDialog = connect(mapStateToProps)(AConfirmRemoveBindDialog);
