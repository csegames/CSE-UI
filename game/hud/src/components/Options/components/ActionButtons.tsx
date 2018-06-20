/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { utils, client } from '@csegames/camelot-unchained';

import { ConfigInfo, ConfigIndex } from '../OptionsMain';

export interface ActionButtonsStyle {
  ActionButtons: React.CSSProperties;
  button: React.CSSProperties;
}

const Container = styled('div')`
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  background-color: #202020;
  border-top: 1px solid ${utils.lightenColor('#202020', 30)};
  border-bottom: 1px solid ${utils.lightenColor('#202020', 30)};
  color: white;
`;

const Button = styled('button')`
  color: ${utils.lightenColor('#454545', 100)};
`;

export interface ActionButtonsProps {
  styles?: Partial<ActionButtonsStyle>;
  activeConfigIndex: number;
  keyBindings: ConfigInfo[];
  onSaveDiskClick: () => void;
  onLoadDiskClick: () => void;
}

export interface ActionButtonsState {
}

export class ActionButtons extends React.Component<ActionButtonsProps, ActionButtonsState> {
  constructor(props: ActionButtonsProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <Container>
        <div>
          <Button onClick={this.onSaveDiskClick}>SAVE</Button>
          <Button onClick={this.onLoadDiskClick}>LOAD</Button>
        </div>
        <div>
          <Button onClick={this.onDefaultsClick}>DEFAULTS</Button>
          <Button onClick={this.onCancelClick}>CANCEL</Button>
        </div>
      </Container>
    );
  }

  private onSaveDiskClick = () => {
    if (this.props.activeConfigIndex === ConfigIndex.KEYBIND) {
      client.SaveConfigChanges();
      const configs: {[id: string]: string} = {};
      this.props.keyBindings.forEach((keyBinding) => {
        configs[keyBinding.name] = keyBinding.value;
      });
      window.localStorage.setItem('-cse-options-savedkeybinds', JSON.stringify(configs));
      this.props.onSaveDiskClick();
    }
  }

  private onLoadDiskClick = () => {
    if (this.props.activeConfigIndex === ConfigIndex.KEYBIND) {
      const savedKeybinds = JSON.parse(window.localStorage.getItem('-cse-options-savedkeybinds'));
      Object.keys(savedKeybinds).forEach((keyBindName) => {
        if (_.find(this.props.keyBindings, keyBind => keyBind.name === keyBindName).value !== savedKeybinds[keyBindName]) {
          client.ChangeConfigVar(keyBindName, savedKeybinds[keyBindName]);
        }
      });
      client.SaveConfigChanges();
      client.GetConfigVars(ConfigIndex.KEYBIND);
      this.props.onLoadDiskClick();
    }
  }

  private onDefaultsClick = () => {
    client.RestoreConfigDefaults(this.props.activeConfigIndex);
    client.SaveConfigChanges();
  }

  private onCancelClick = () => {
    client.CancelAllConfigChanges(this.props.activeConfigIndex);
    client.SaveConfigChanges();
  }
}

export default ActionButtons;

