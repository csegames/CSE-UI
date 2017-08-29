/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-22 16:51:31
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-24 18:11:25
 */

import * as React from 'react';
import { utils, client, dxKeyCodes } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { ConfigInfo } from '../../OptionsMain';

export interface KeyBindWarningModalStyle extends StyleDeclaration {
  KeyBindWarningModal: React.CSSProperties;
  exclamationTriangle: React.CSSProperties;
  dialogText: React.CSSProperties;
  importantText: React.CSSProperties;
  buttonContainer: React.CSSProperties;
  button: React.CSSProperties;
  close: React.CSSProperties;
}

export const defaultKeyBindWarningModalStyle: KeyBindWarningModalStyle = {
  KeyBindWarningModal: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    margin: 'auto',
    backgroundColor: '#454545',
    color: utils.lightenColor('#454545', 100),
    height: '100%',
    width: '100%',
  },

  exclamationTriangle: {
    fontSize: '50px',
    marginBottom: '15px',
  },

  dialogText: {
    textAlign: 'center',
    fontSize: '22px',
    margin: 0,
    padding: 0,
  },

  importantText: {
    color: 'white',
  },

  buttonContainer: {
    display: 'flex',
  },

  button: {
    color: utils.lightenColor('#454545', 100),
  },

  close: {
    position: 'absolute',
    top: 5,
    right: 5,
    color: '#cdcdcd',
    fontSize: '20px',
    marginRight: '5px',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: '#bbb',
    },
  },
};

export interface WarningModalInfo {
  currentKeyBind: ConfigInfo;
  nextKeyBind: ConfigInfo;
}

export interface KeyBindWarningModalProps {
  styles?: Partial<KeyBindWarningModalStyle>;
  warningModalInfo: WarningModalInfo;
  onCancelPress: () => void;
  onConfirmPress: (warningModalInfo: WarningModalInfo) => void;
}

export interface KeyBindWarningModalState {
}

export class KeyBindWarningModal extends React.Component<KeyBindWarningModalProps, KeyBindWarningModalState> {
  constructor(props: KeyBindWarningModalProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultKeyBindWarningModalStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const currentKeyBind = this.props.warningModalInfo && this.props.warningModalInfo.currentKeyBind;

    return this.props.warningModalInfo ? (
      <div className={css(ss.KeyBindWarningModal, custom.KeyBindWarningModal)}>
        <div className={css(ss.close, custom.close)} onClick={this.props.onCancelPress}>
          <i className='fa fa-times click-effect'></i>
        </div>
        <div className={`${css(ss.exclamationTriangle, custom.exclamationTriangle)} fa fa-exclamation-triangle`} />
        <p className={css(ss.dialogText, custom.dialogText)}>
          <span className={css(ss.importantText, custom.importantText)}>{currentKeyBind.name}&nbsp;</span>
          is already using the key bind
          <span className={css(ss.importantText, custom.importantText)}>&nbsp;{dxKeyCodes[currentKeyBind.value]}</span>
        </p>
        <p className={css(ss.dialogText, custom.dialogText)}>Are you sure you want to override it?</p>
        <div className={css(ss.buttonContainer, custom.buttonContainer)}>
          <button
            onClick={() => this.props.onConfirmPress(this.props.warningModalInfo)}
            className={css(ss.button, custom.button, ss.overrideButton, custom.overrideButton)}>
            Override
          </button>
          <button onClick={this.onCancelPress} className={css(ss.button, custom.button)}>
            Cancel
          </button>
        </div>
      </div>
    ) : null;
  }

  private onCancelPress = () => {
    this.props.onCancelPress();
    client.ReleaseInputOwnership();
  }
}

export default KeyBindWarningModal;

