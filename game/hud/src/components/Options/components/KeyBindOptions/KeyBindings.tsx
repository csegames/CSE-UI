/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';
import { client, Input } from '@csegames/camelot-unchained';

import SearchableList from '../../../SearchableList';
import { ConfigIndex, ConfigInfo } from '../../OptionsMain';
import KeyBindWarningModal, { WarningModalInfo } from './KeyBindWarningModal';
import KeyBindingsListItem from './KeyBindingsListItem';

export interface KeyBindingsStyle {
  KeyBindings: React.CSSProperties;
  listContainer: React.CSSProperties;
  searchInput: React.CSSProperties;
}

const Container = styled('div')`
  height: 100%;
`;

const ListContainerStyle = css`
  height: '289px',
`;

const ListItemsContainerStyle = css`
  overflow: hidden;
`;

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
    return (
      <Container>
        <Input
          placeholder={'Search'}
          styles={{ input: { overflow: 'hidden' } }}
          onChange={this.onSearchChange}
          value={this.state.searchValue}
        />
        <SearchableList
          getRef={r => this.listRef = r}
          containerClass={ListContainerStyle}
          listItemsContainerClass={ListItemsContainerStyle}
          listItemsData={this.state.keyBindings}
          listItemHeight={40}
          listHeight={289}
          searchValue={this.state.searchValue}
          searchKey={'name'}
          renderListItem={(keyBinding: ConfigInfo, searchIncludes, isVisible, i) => (
            <KeyBindingsListItem
              key={keyBinding.name}
              isVisible={isVisible}
              keyBinding={keyBinding}
              searchIncludes={searchIncludes}
              onToggleListeningMode={this.onToggleListeningMode}
              listeningMode={this.state.whichConfigIsListening === keyBinding.name}
              handleKeyEvent={this.handleKeyEvent}
              isOddItem={i % 2 !== 0}
            />
          )}
        />
        <KeyBindWarningModal
          onConfirmPress={this.onConfirmModalPress}
          onCancelPress={this.onCancelModalPress}
          warningModalInfo={this.state.warningModalInfo}
        />
      </Container>
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

