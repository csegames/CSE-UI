/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-22 14:49:29
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-24 18:05:03
 */

import * as React from 'react';
import { dxKeyCodes, jsToDXKeyCodeMap } from 'camelot-unchained';

import ListItem from '../ListItem';
import { ConfigInfo } from '../../OptionsMain';

export interface KeyBindingsListItemProps {
  keyBinding: ConfigInfo;
  searchIncludes: boolean;
  listeningMode: boolean;
  onToggleListeningMode: (keyBinding: ConfigInfo) => void;
  handleKeyEvent: (keyBinding: ConfigInfo, keyCode: number) => void;
  isOddItem: boolean;
}

export interface KeyBindingsListItemState {
}

export class KeyBindingsListItem extends React.Component<KeyBindingsListItemProps, KeyBindingsListItemState> {
  constructor(props: KeyBindingsListItemProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <ListItem
        onClick={this.onClick}
        name={this.props.keyBinding.name}
        value={this.props.listeningMode ? 'Press a key' : dxKeyCodes[this.props.keyBinding.value]}
        searchIncludes={this.props.searchIncludes}
        isOddItem={this.props.isOddItem}
      />
    );
  }

  public componentDidMount() {
    window.addEventListener('keydown', this.handleKeyEvent);
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyEvent);
  }

  private onClick = () => {
    this.props.onToggleListeningMode(this.props.keyBinding);
  }

  private handleKeyEvent = (e: any) => {
    if (this.props.listeningMode) {
      e.preventDefault();
      this.props.handleKeyEvent(this.props.keyBinding, jsToDXKeyCodeMap[e.keyCode]);
    }
  }
}

export default KeyBindingsListItem;

