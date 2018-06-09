/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, events } from '@csegames/camelot-unchained';
import { ConfigIndex } from '../utils/configVars';
import { DialogTab, DialogButton } from '../components/TabbedDialog/index';
import { SideMenu, MenuOption } from '../components/SideMenu';
import { KeybindSettings } from '../panels/KeybindSettings';
import { InputSettings } from '../panels/InputSettings';
import { GraphicSettings } from '../panels/GraphicSettings';
import { AudioSettings } from '../panels/AudioSettings';
import { ComingSoon } from '../panels/ComingSoon';
import * as BUTTON from './buttons';
import * as OPTION from './options';

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
      return [BUTTON.DEFAULT, BUTTON.CANCEL];
  }
  return [BUTTON.CANCEL];
}

interface GeneralSettingsProps {
  onCancel: () => void;
}
interface GeneralSettingsState {
  option: MenuOption;
}

export class GeneralSettings extends React.PureComponent<GeneralSettingsProps, GeneralSettingsState> {
  constructor(props: GeneralSettingsProps) {
    super(props);
    this.state = { option: null };
  }
  public render() {
    const { option } = this.state;
    const buttons = getButtonsForOption(option);
    return (
      <DialogTab buttons={buttons} onAction={this.onButton}>
        <SideMenu persist='general' options={options}>{
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
                return <GraphicSettings/>;
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
      case BUTTON.CANCEL:
        this.props.onCancel();
        break;
    }
  }
}

export default GeneralSettings;
