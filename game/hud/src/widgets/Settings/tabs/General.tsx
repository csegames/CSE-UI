/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { DialogTab, DialogButton } from 'UI/TabbedDialog';
import { SideMenu, MenuOption } from 'UI/SideMenu';
import { KeybindSettings } from 'widgets/Settings/panels/KeybindSettings';
import { ComingSoon } from '../panels/ComingSoon';
import * as BUTTON from './buttons';
import * as OPTION from './options';
import { CategoryPane } from 'widgets/Settings/panels/CategoryPane';

const options: MenuOption[] = [
  OPTION.KEYS,
  OPTION.INPUT,
  OPTION.AUDIO,
  OPTION.GRAPHICS,
];

function getButtonsForOption(option: MenuOption) {
  switch (option) {
    case OPTION.AUDIO:
    case OPTION.INPUT:
    case OPTION.GRAPHICS:
      return [BUTTON.DEFAULT, BUTTON.APPLY, BUTTON.CANCEL];
    case OPTION.KEYS:
      return [BUTTON.DEFAULT, BUTTON.SAVEAS, BUTTON.LOAD];
  }
  return [BUTTON.CANCEL];
}

export interface SelectedDisplayMode {
  fullScreen: boolean;
}

interface GeneralSettingsProps {
  onCancel: () => void;
}
interface GeneralSettingsState {
  option: MenuOption;
  saveAs: boolean;
}

export class GeneralSettings extends React.PureComponent<GeneralSettingsProps, GeneralSettingsState> {
  constructor(props: GeneralSettingsProps) {
    super(props);
    this.state = {
      option: null,
      saveAs: false,
    };
  }
  public render() {
    const { option } = this.state;
    const buttons = getButtonsForOption(option);
    return (
      <DialogTab buttons={buttons} onAction={this.onButton}>
        <SideMenu name='settings' id='general' options={options} onSelectOption={this.selectOption}>{
          (option: MenuOption) => {
            switch (option) {
              case OPTION.KEYS:
                return <KeybindSettings onCancel={this.cancel}/>;
              case OPTION.INPUT:
                return <CategoryPane category={OptionCategory.Input} onCancel={this.cancel} />;
              case OPTION.GRAPHICS:
                return <CategoryPane category={OptionCategory.Rendering} onCancel={this.cancel} />;
              case OPTION.AUDIO:
                return <CategoryPane category={OptionCategory.Audio} onCancel={this.cancel} />;
            }
            return <ComingSoon/>;
          }
        }</SideMenu>
      </DialogTab>
    );
  }

  private selectOption = (option: MenuOption) => {
    this.setState({ option });
  }

  private onButton = (button: DialogButton) => {
    let action;
    switch (button) {
      case BUTTON.DEFAULT:
        action = { id: 'default' };
        break;
      case BUTTON.APPLY:
        action = { id: 'apply' };
        break;
      case BUTTON.CANCEL:
        action = { id: 'cancel' };
        break;
      case BUTTON.SAVEAS:
        action = { id: 'save' };
        break;
      case BUTTON.LOAD:
        action = { id: 'load' };
        break;
    }
    game.trigger('settings--action', action);
  }

  private cancel = () => {
    this.props.onCancel();
  }
}

export default GeneralSettings;
