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
  StringIDGeneralCancel,
  StringIDGeneralChange,
  StringIDGeneralYes,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../../../helpers/stringTableHelpers';

const Container = 'Settings-Keybinds-ConfirmSetBindDialog-Container';
const ConfirmBindingText = 'Settings-Keybinds-ConfirmSetBindDialog-ConfirmBindingText';
const Key = 'Settings-Keybinds-ConfirmSetBindDialog-Key';
const TextContent = 'Settings-Keybinds-ConfirmSetBindDialog-TextContent';
const ClashesContainer = 'Settings-Keybinds-ConfirmSetBindDialog-ClashesContainer';
const StillWantText = 'Settings-Keybinds-ConfirmSetBindDialog-StillWantText';
const ButtonContainer = 'Settings-Keybinds-ConfirmSetBindDialog-ButtonContainer';
const ButtonStyles = 'Settings-Keybinds-ConfirmSetBindDialog-ButtonStyles';

const ClashingKey = 'Settings-Keybinds-ConfirmSetBindDialog-ClashingKey';

const StringIDSettingsConfirmBindingAlreadyBound = 'SettingsConfirmBindingAlreadyBound';
const StringIDSettingsConfirmBindingConfirmTitle = 'SettingsConfirmBindingConfirmTitle';
const StringIDSettingsConfirmBindingAlreadyBoundDescription = 'SettingsConfirmBindingAlreadyBoundDescription';
const StringIDSettingsConfirmBindingRebindConfirm = 'SettingsConfirmBindingRebindConfirm';
const StringIDSettingsConfirmBindingBindDescription1 = 'SettingsConfirmBindingBindDescription1';
const StringIDSettingsConfirmBindingBindDescription2 = 'SettingsConfirmBindingBindDescription2';

interface State {}

interface ReactProps {
  keybind: Keybind;
  newBind: Binding;
  conflicts: Keybind[];
  onYesClick: () => void;
  onNoClick: () => void;
  onCancelClick: () => void;
}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export class AConfirmSetBindDialog extends React.Component<Props, State> {
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

  private onCancelClick() {
    this.props.onCancelClick();
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP_NO);
  }

  public render() {
    const confirmText =
      this.props.conflicts.length >= 1
        ? getStringTableValue(StringIDSettingsConfirmBindingAlreadyBound, this.props.stringTable)
        : getStringTableValue(StringIDSettingsConfirmBindingConfirmTitle, this.props.stringTable);

    return (
      <div className={Container}>
        <span className={ConfirmBindingText}>{confirmText}</span>
        {this.props.conflicts.length >= 1 ? (
          <p className={TextContent}>
            <span className={Key}>{this.props.newBind.name}</span>
            {getStringTableValue(StringIDSettingsConfirmBindingAlreadyBoundDescription, this.props.stringTable)}
            <span className={ClashesContainer}>
              {this.props.conflicts.map((keybind, index) => (
                <span className={ClashingKey} key={index}>
                  "{toTitleCase(keybind.description)}"{index !== this.props.conflicts.length - 1 ? ', ' : ''}
                </span>
              ))}
            </span>
            <br />
            <span className={StillWantText}>
              {getStringTableValue(StringIDSettingsConfirmBindingRebindConfirm, this.props.stringTable)}
            </span>
          </p>
        ) : (
          <p className={TextContent}>
            {getStringTableValue(StringIDSettingsConfirmBindingBindDescription1, this.props.stringTable)}
            <span className={Key}>{this.props.newBind.name}</span>
            {getTokenizedStringTableValue(StringIDSettingsConfirmBindingBindDescription2, this.props.stringTable, {
              KEYBIND_DESCRIPTION: toTitleCase(this.props.keybind.description)
            })}
          </p>
        )}
        <div className={ButtonContainer}>
          <Button
            type='blue'
            text={getStringTableValue(StringIDGeneralYes, this.props.stringTable)}
            onClick={() => this.onYesClick()}
            styles={ButtonStyles}
          />
          <Button
            type='blue-outline'
            text={getStringTableValue(StringIDGeneralChange, this.props.stringTable)}
            onClick={() => this.onNoClick()}
            styles={ButtonStyles}
          />
          <Button
            type='blue-outline'
            text={getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
            onClick={() => this.onCancelClick()}
            styles={ButtonStyles}
          />
        </div>
      </div>
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

export const ConfirmSetBindDialog = connect(mapStateToProps)(AConfirmSetBindDialog);
