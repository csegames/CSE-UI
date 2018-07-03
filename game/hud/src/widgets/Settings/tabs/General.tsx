/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { isEqual } from 'lodash';
import { client, events, DisplayModeConfig } from '@csegames/camelot-unchained';
import { DialogTab, DialogButton } from 'UI/TabbedDialog';
import { SideMenu, MenuOption } from 'UI/SideMenu';
import { KeybindSettings } from '../panels/KeybindSettings';
import { InputSettings } from '../panels/InputSettings';
import { GraphicSettings } from '../panels/GraphicSettings';
import { AudioSettings } from '../panels/AudioSettings';
import { ComingSoon } from '../panels/ComingSoon';
import * as BUTTON from './buttons';
import * as OPTION from './options';
import { sendSystemMessage } from 'services/actions/system';
import { ConfigIndex } from '../utils/configVars';

const options: MenuOption[] = [
  OPTION.KEYS,
  OPTION.INPUT,
  OPTION.AUDIO,
  OPTION.GRAPHICS,
];

function getConfigForOption(option: MenuOption) {
  switch (option) {
    case OPTION.AUDIO: return ConfigIndex.AUDIO;
    case OPTION.INPUT: return ConfigIndex.INPUT;
    case OPTION.GRAPHICS: return ConfigIndex.RENDERING;
    case OPTION.KEYS: return ConfigIndex.KEYBIND;
  }
}

function getButtonsForOption(option: MenuOption) {
  switch (option) {
    case OPTION.AUDIO:
    case OPTION.INPUT:
    case OPTION.GRAPHICS:
    case OPTION.KEYS:
      return [BUTTON.DEFAULT, BUTTON.APPLY, BUTTON.CANCEL];
  }
  return [BUTTON.CANCEL];
}

export interface SelectedDisplayMode extends DisplayModeConfig {
  fullScreen: boolean;
}

interface GeneralSettingsProps {
  onCancel: () => void;
}
interface GeneralSettingsState {
  option: MenuOption;
  selectedDisplayMode: SelectedDisplayMode;
}

export class GeneralSettings extends React.Component<GeneralSettingsProps, GeneralSettingsState> {
  constructor(props: GeneralSettingsProps) {
    super(props);
    this.state = {
      option: null,
      selectedDisplayMode: null,
    };
  }
  public render() {
    const { option } = this.state;
    const buttons = getButtonsForOption(option);
    return (
      <DialogTab buttons={buttons} onAction={this.onButton}>
        <SideMenu name='settings' id='general' options={options}>{
          (option: MenuOption) => {
            switch (option) {
              case OPTION.KEYS:
                this.setState({ option });
                return <KeybindSettings/>;
              case OPTION.INPUT:
                this.setState({ option });
                return <InputSettings/>;
              case OPTION.GRAPHICS:
                this.setState({ option });
                return (
                  <GraphicSettings
                    selectedDisplayMode={this.state.selectedDisplayMode}
                    onSelectedDisplayModeChange={this.onSelectedDisplayModeChange}
                  />
                );
              case OPTION.AUDIO:
                this.setState({ option });
                return <AudioSettings/>;
            }
            this.setState({ option: null });
            return <ComingSoon/>;
          }
        }</SideMenu>
      </DialogTab>
    );
  }

  public shouldComponentUpdate(nextProps: GeneralSettingsProps, nextState: GeneralSettingsState) {
    return !isEqual(nextState, this.state) || !isEqual(nextProps, this.props);
  }

  private onButton = (button: DialogButton) => {
    switch (button) {
      case BUTTON.DEFAULT:
        const config: any = getConfigForOption(this.state.option);
        if (config !== undefined) {
          client.RestoreConfigDefaults(config);
          client.SaveConfigChanges();
          events.fire('settings--reload', config);
        }
        break;
      case BUTTON.APPLY:
        this.setDisplayMode();
        client.SaveConfigChanges();
        sendSystemMessage('All configurations have been applied');
        break;
      case BUTTON.CANCEL:
        this.props.onCancel();
        break;
    }
  }

  private setDisplayMode = () => {
    if (!this.state.selectedDisplayMode) return;

    const { fullScreen, width, height } = this.state.selectedDisplayMode;
    client.SetDisplayMode(fullScreen, width, height);
  }

  private onSelectedDisplayModeChange = (selectedDisplayMode: SelectedDisplayMode) => {
    this.setState({ selectedDisplayMode });
  }
}

export default GeneralSettings;
