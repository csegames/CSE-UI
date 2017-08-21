/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-22 10:25:49
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-24 18:02:16
 */

import * as React from 'react';
import * as _ from 'lodash';
import { client, utils, Input } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import { ConfigIndex, ConfigInfo } from '../../OptionsMain';
import KeyBindWarningModal, { WarningModalInfo } from './KeyBindWarningModal';
import KeyBindingsListItem from './KeyBindingsListItem';

export interface KeyBindingsStyle extends StyleDeclaration {
  KeyBindings: React.CSSProperties;
  listContainer: React.CSSProperties;
  searchInput: React.CSSProperties;
}

export const defaultKeyBindingsStyle: KeyBindingsStyle = {
  KeyBindings: {
    height: '100%',
  },

  listContainer: {
    overflow: 'auto',
    height: 'calc(100% - 50px)',
  },
  
  searchInput: {
    backgroundColor: 'rgba(0,0,0,0.9)',
  },
};

export interface KeyBindingsProps {
  styles?: Partial<KeyBindingsStyle>;
  activeConfigIndex: number;

  // This prop is used so that OptionsMain knows what the current keybinds are
  keyBindConfigs: ConfigInfo[];
  onKeyBindingsChange: (keyBindings: ConfigInfo[]) => void;
}

export interface KeyBindingsState {
  
  searchValue: string;
  whichConfigIsListening: string;

  // This state is used for formatting during search.
  keyBindings: ConfigInfo[];

  // this is shown when there is already a keybinding for the input key
  warningModalInfo: WarningModalInfo;  
}

export class KeyBindings extends React.Component<KeyBindingsProps, KeyBindingsState> {
  private listRef: HTMLDivElement;
  constructor(props: KeyBindingsProps) {
    super(props);
    this.state = {
      searchValue: '',
      whichConfigIsListening: '',
      warningModalInfo: null,
      keyBindings: [],
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultKeyBindingsStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    
    return (
      <div className={css(ss.KeyBindings, custom.KeyBindings)}>
        <Input
          placeholder={'Search'}
          styles={{
            input: defaultKeyBindingsStyle.searchInput,
          }}
          onChange={this.onSearchChange}
          value={this.state.searchValue}
        />
        <div ref={ref => this.listRef = ref} className={css(ss.listContainer, custom.listContainer)}>
          {this.state.keyBindings.map((keyBinding, i) => {
            const searchIncludes = utils.doesSearchInclude(this.state.searchValue, keyBinding.name);
            return (
              <KeyBindingsListItem
                key={keyBinding.name}
                keyBinding={keyBinding}
                searchIncludes={searchIncludes}
                onToggleListeningMode={this.onToggleListeningMode}
                listeningMode={this.state.whichConfigIsListening === keyBinding.name}
                handleKeyEvent={this.handleKeyEvent}
                isOddItem={i % 2 !== 0}
              />
            );
          })}
        </div>
        <KeyBindWarningModal
          onConfirmPress={this.onConfirmModalPress}
          onCancelPress={this.onCancelModalPress}
          warningModalInfo={this.state.warningModalInfo}
        />
      </div>
    );
  }

  public componentDidMount() {
    if (this.props.activeConfigIndex === ConfigIndex.KEYBIND) {
      client.GetConfigVars(ConfigIndex.KEYBIND);
      this.setState({ keyBindings: this.props.keyBindConfigs });
    }
  }

  public componentWillReceiveProps(nextProps: KeyBindingsProps) {
    if (!_.isEqual(nextProps.keyBindConfigs, this.props.keyBindConfigs)) {
      this.setState({ keyBindings: nextProps.keyBindConfigs });
    }
  }

  public componentWillUpdate(nextProps: KeyBindingsProps, nextState: KeyBindingsState) {
    if (nextState.searchValue !== this.state.searchValue) {
      this.setState(this.distributeFilteredConfigVars(nextState.searchValue));
    }
  }

  private distributeFilteredConfigVars = (searchValue: string) => {
    const keyBindings = this.props.keyBindConfigs;
    if (searchValue === '') {
      return {
        keyBindings,
      };
    } else {
      const keyBindingsThatMatchSearch: ConfigInfo[] = [];
      const filteredKeyBindings = keyBindings.filter((keyBinding) => {
        const includedInSearch = utils.doesSearchInclude(searchValue, keyBinding.name);
        if (includedInSearch) {
          keyBindingsThatMatchSearch.push(keyBinding);
          return false;
        } else {
          return true;
        }
      });
      const distributedKeyBindings = [...keyBindingsThatMatchSearch, ...filteredKeyBindings];
      return {
        keyBindings: distributedKeyBindings,
      };
    }
  }

  private onToggleListeningMode = (keyBinding: ConfigInfo) => {
    this.setState(() => {
      if (this.state.whichConfigIsListening === keyBinding.name) {
        client.ReleaseInputOwnership();
        return {
          whichConfigIsListening: '',
        };
      } else {
        client.RequestInputOwnership();
        return {
          whichConfigIsListening: keyBinding.name,
        };
      }
    });
  }

  private handleKeyEvent = (nextKeyBind: ConfigInfo, keyCode: number) => {
    const keyBindings = this.props.keyBindConfigs;
    const existingKeyBind =  _.find(keyBindings, keyBind =>
      keyBind.name !== nextKeyBind.name && keyBind.value === `${keyCode}`);
    
    if (existingKeyBind) {
      const warningModalInfo: WarningModalInfo = {
        currentKeyBind: existingKeyBind,
        nextKeyBind,
      };
      this.setState({ warningModalInfo });
    } else {
      const keyBindingIndex = _.findIndex(keyBindings, keyBind => keyBind.name === nextKeyBind.name);
      client.ChangeConfigVar(nextKeyBind.name, `${keyCode}`);
      client.SaveConfigChanges();
      keyBindings[keyBindingIndex] = {
        ...keyBindings[keyBindingIndex],
        value: `${keyCode}`,
      };
      this.props.onKeyBindingsChange(keyBindings);
      this.setState({ whichConfigIsListening: '', keyBindings });
    }
  }

  private onConfirmModalPress = (warningModalInfo: WarningModalInfo) => {
    const keyBindings = this.props.keyBindConfigs;
    const { currentKeyBind, nextKeyBind } = warningModalInfo;
    const newKeyBindIndex = _.findIndex(keyBindings, keyBind => keyBind.name === nextKeyBind.name);
    const oldKeyBindIndex = _.findIndex(keyBindings, keyBind => keyBind.name === currentKeyBind.name);

    // Update new config var and make old one empty
    client.ChangeConfigVar(nextKeyBind.name, currentKeyBind.value);
    client.ChangeConfigVar(currentKeyBind.name, '');
    client.SaveConfigChanges();

    keyBindings[newKeyBindIndex] = {
      ...keyBindings[newKeyBindIndex],
      value: `${currentKeyBind.value}`,
    };

    keyBindings[oldKeyBindIndex] = {
      ...keyBindings[oldKeyBindIndex],
      value: '',
    };
    
    this.props.onKeyBindingsChange(keyBindings);
    this.setState({ warningModalInfo: null, whichConfigIsListening: '', keyBindings });
  }

  private onCancelModalPress = () => {
    this.setState({ warningModalInfo: null, whichConfigIsListening: '' });
  }

  private onSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Need to add a scroll to top
    setTimeout(() => this.listRef.scrollTop = 0, 200);
    this.setState({ searchValue: e.target.value });
  }
}

export default KeyBindings;

