/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { getVirtualKeyCode, vkKeyCodes } from '@csegames/camelot-unchained';

import ListItem from '../ListItem';
import { ConfigInfo } from '../../OptionsMain';

export interface KeyBindingsListItemProps {
  keyBinding: ConfigInfo;
  searchIncludes: boolean;
  listeningMode: boolean;
  onToggleListeningMode: (keyBinding: ConfigInfo) => void;
  handleKeyEvent: (keyBinding: ConfigInfo, keyCode: number) => void;
  isOddItem: boolean;
  isVisible: boolean;
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
    let keyCode = vkKeyCodes[Number(this.props.keyBinding.value)];
    if (keyCode) {
      keyCode = keyCode.substring(3, keyCode.length);
    }
    return (
      <ListItem
        name={this.props.keyBinding.name}
        value={this.props.listeningMode ? 'Press a key' : keyCode}
        searchIncludes={this.props.searchIncludes}
        isOddItem={this.props.isOddItem}
        onClick={this.onClick}
      />
    );
  }

  public componentDidMount() {
    window.addEventListener('keydown', this.handleKeyEvent);
  }

  public shouldComponentUpdate(nextProps: KeyBindingsListItemProps) {
    return nextProps.isVisible;
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
      this.props.handleKeyEvent(this.props.keyBinding, getVirtualKeyCode(e.keyCode));
    }
  }
}

export default KeyBindingsListItem;

