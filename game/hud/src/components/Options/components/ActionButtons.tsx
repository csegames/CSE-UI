/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-23 10:54:12
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-25 11:21:37
 */

import * as React from 'react';
import * as _ from 'lodash';
import { utils, client } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import { ConfigInfo, ConfigIndex } from '../OptionsMain';

export interface ActionButtonsStyle extends StyleDeclaration {
  ActionButtons: React.CSSProperties;
  button: React.CSSProperties;
}

export const defaultActionButtonsStyle: ActionButtonsStyle = {
  ActionButtons: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px 10px',
    backgroundColor: '#202020',
    borderTop: `1px solid ${utils.lightenColor('#202020', 30)}`,
    borderBottom: `1px solid ${utils.lightenColor('#202020', 30)}`,
    color: 'white',
  },
  
  button: {
    color: utils.lightenColor('#454545', 100),
  },
};

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
    const ss = StyleSheet.create(defaultActionButtonsStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.ActionButtons, custom.ActionButtons)}>
        <div>
          <button className={css(ss.button, custom.button)} onClick={this.onSaveDiskClick}>SAVE</button>
          <button className={css(ss.button, custom.button)} onClick={this.onLoadDiskClick}>LOAD</button>
        </div>
        <div>
          <button className={css(ss.button, custom.button)} onClick={this.onDefaultsClick}>DEFAULTS</button>
          <button className={css(ss.button, custom.button)} onClick={this.onCancelClick}>CANCEL</button>
        </div>
      </div>
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

