/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { SettingsPanel } from '../../components/SettingsPanel';
import {
  getKeyBinds,
  cancel,
  ConfigIndex,
  recordKeybind,
  stopRecordingKeybind,
  restoreDefaultKeybinds,
} from '../../utils/configVars';
import { KeyBind } from '../../components/KeyBind';
import { sendSystemMessage } from 'services/actions/system';
import {
  Keybinds,
  persistKeybinds,
  restoreKeybinds,
  linkCharacterToKeybinds,
  getCharacterKeybindsName,
  removeKeybinds,
  Bind,
  getButtonNameFromId,
  updateKeybind,
  getKeybinds,
} from '../../utils/keyboard';
import { client, events, Binding } from '@csegames/camelot-unchained';
import { Box } from 'UI/Box';
import { Field } from 'UI/Field';
import { CloseButton } from 'UI/CloseButton';
import { SaveAs } from '../../components/SaveAs';
import { Load } from '../../components/Load';
import * as CSS from 'lib/css-helper';
import * as CONFIG from 'components/UI/config';
import ClashModal from './ClashModal';
import ListeningModal from './ListeningModal';

const Bind = styled('span')`
  background-color: rgba(128,128,128,0.1);
  border: 1px solid rgba(128,128,128,0.1);
  margin: 2px 0 2px 3px;
  padding: 0 3px;
`;

const KeyBindsSearchBar = styled('div')`
  ${CSS.IS_ROW} ${CSS.DONT_GROW}
  padding: 10px;
  box-sizing: border-box!important;
  width: 100%;
`;

const KeyBindsContainer = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.EXPAND_TO_FIT}
  width: 100%;
  padding: 10px;
  padding-top: 0;
  box-sizing: border-box!important;
  overflow: auto;
`;

const SearchBox = styled('input')`
  height: 25px;
  width: 100%;
  background-color: black;
  color: white;
  margin: 2px;
  border: 0;
  padding: 0 10px;
  outline: none;
  transition: all 0.30s ease-in-out;
  &:focus {
    box-shadow: 0 0 2px ${CONFIG.MENU_HIGHLIGHT_BORDER_COLOR};
  }
`;

const CloseButtonPosition = css`
  position: absolute;
  right: 0px;
  top: 3px;
`;

const ConfigName = styled('h4')`
  margin-bottom: 0!important;
  padding: 4px 15px;
  color: ${CONFIG.NORMAL_TEXT_COLOR};
`;

interface ClashKey extends Binding {
  name: string;
}

interface Clash extends Binding {
  sameAs: ClashKey[];
  name: string;
}

export interface Listening {
  keybind: Bind;
  alias: number;
}

interface KeybindSettingsProps {
  onCancel: () => void;
}

interface KeybindSettingsState {
  version: number;
  keybinds: Keybinds;
  clash: Clash;
  listening: Listening;
  search: string;
  mode: string;
  name: string;
}

function sameBinds(keybinds: Keybinds, name: string, keybind: Binding): Clash | null {
  const sameAs: ClashKey[] = [];
  Object.keys(keybinds).forEach((key) => {
    const binds = keybinds[key].boundKeys;
    for (let i = 0; i < binds.length; i++) {
      if (binds[i].name === keybind.boundKeyName && (name !== key || keybind.alias !== i)) {
        sameAs.push({
          id: keybinds[key].button,
          name: key,
          alias: i,
          boundKeyValue: binds[i].value,
          boundKeyName: binds[i].name,
        });
      }
    }
  });
  if (sameAs.length) {
    return { ...keybind, sameAs, name };
  }

  // There is no clash, just return default state which is null
  return null;
}

export class KeybindSettings extends React.PureComponent<KeybindSettingsProps, KeybindSettingsState> {
  private eventHandle: number;
  constructor(props: KeybindSettingsProps) {
    super(props);
    this.state = {
      version: 0,
      keybinds: null,
      listening: null,
      clash: null,
      search: '',
      mode: null,
      name: getCharacterKeybindsName(),
    };
  }

  public componentDidMount() {
    this.eventHandle = events.on('settings--action', this.onAction);
    this.loadSettings();
  }

  public componentWillUnmount() {
    cancel(ConfigIndex.KEYBIND);
    if (this.eventHandle) events.off(this.eventHandle);
    if (this.state.listening) {
      this.dontListen();
    }
  }

  public render() {
    const { mode, keybinds, listening, clash } = this.state;
    const keys = keybinds && Object.keys(keybinds);
    return (
      <SettingsPanel style={{ padding: 0 }}>
        { keys && keys.length > 10 ? this.renderSearchBar() : null }
        { keys ? this.renderKeyBinds(keybinds) : null }
        { listening ?
          <ListeningModal
            listening={listening}
            clearBind={this.clearBind}
            toggleRebind={this.toggleRebind}
          /> : null
        }
        { clash ? <ClashModal clash={clash} onResolveClash={this.onResolveClash} /> : null }
        { mode === 'save' && <SaveAs label='Save keybinds as' saveAs={this.saveAs} onClose={this.clearMode}/>}
        { mode === 'load' && <Load load={this.load} remove={this.remove} onClose={this.clearMode}/>}
      </SettingsPanel>
    );
  }

  private renderSearchBar() {
    const { name } = this.state;
    return (
      <KeyBindsSearchBar>
        <Field style={{ width: '400px' }}>
          <ConfigName>{name && `Keybind Config: ${name}`}</ConfigName>
        </Field>
        <Field className='expand'>
          <Box padding={false} style={{ margin: 0 }}>
            <SearchBox spellcheck={false} placeholder='Search...'
              value={this.state.search}
              onFocus={() => client.RequestInputOwnership()}
              onBlur={() => client.ReleaseInputOwnership()}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                // because our keys don't have spaces in, we strip spaces from the search
                this.setState({ search: e.target.value });
              }}
            />
            { this.state.search.length
              ? (
                <CloseButton
                  onClick={() => this.setState({ search: '' })}
                  width={25}
                  height={25}
                  className={CloseButtonPosition}
                />
              ) : null
            }
          </Box>
        </Field>
      </KeyBindsSearchBar>
    );
  }

  private renderKeyBinds(keybinds: Keybinds) {
    let { search } = this.state;
    search = search.replace(/ /g, '').toLowerCase();
    return (
      <KeyBindsContainer className='cse-ui-scroller-thumbonly'>
        { keybinds && Object.keys(keybinds).map((key) => {
          const keybind = keybinds[key];
          if (search && key.toLowerCase().indexOf(search) === -1) return null;
          return (
            <KeyBind key={key} name={key} bind={keybind} toggleRebind={this.toggleRebind}/>
          );
        })}
      </KeyBindsContainer>
    );
  }

  private loadSettings() {
    getKeyBinds((keybinds: any, type: ConfigIndex) => {
      if (type === ConfigIndex.KEYBIND) {
        this.setState({ version: this.state.version + 1, keybinds });
      }
    });
  }

  private onAction = (args: any) => {
    switch (args.id) {
      case 'apply':
        sendSystemMessage('All configurations have been applied');
        if (this.state.name) {
          // Apply config to current saved profile
          persistKeybinds(this.state.keybinds, this.state.name);
        }
        break;
      case 'cancel':
        // This is now a no-op.  TODO: Should we remove the button?
        this.props.onCancel();
        break;
      case 'default':
        if (client.debug) console.log('reset keybinds (RestoreConfigDefaults)');
        linkCharacterToKeybinds(null);  // unlinks character from any keybind config
        restoreDefaultKeybinds();
        this.loadSettings();
        this.setState({ mode: null, name: null });
        break;
      case 'save': case 'load':
        this.setState({ mode: args.id });
        break;
    }
  }

  private toggleRebind = (keybind: Bind, alias: number) => {
    const { listening } = this.state;
    if (listening) {
      this.dontListen();
      if (listening.keybind.button === keybind.button && listening.alias === alias) {
        // clicked listening button again, cancells listen.
        this.setState({ listening: null });
        return;
      }
    }
    // start listening.
    this.setState({ listening: { keybind, alias }, clash: null }, this.listen);
  }

  private clearBind = (id: number, alias: number) => {
    this.dontListen();
    updateKeybind(getButtonNameFromId(id), { id, alias, boundKeyName: '', boundKeyValue: 0 });
    client.ClearKeybind(id, alias);
    this.setState({ listening: null, version: this.state.version + 1, keybinds: getKeybinds() });
  }

  private listen() {
    const { listening } = this.state;
    if (client.debug) console.log('listen (call recordKeybind)');
    recordKeybind(listening.keybind.button, listening.alias, this.keybindChanged);
  }

  private dontListen() {
    if (client.debug) console.log('done listen (cancel recording keybind and cancel listener)');
    stopRecordingKeybind();
  }

  private keybindChanged = (keybind: Binding, type: ConfigIndex) => {
    if (type === ConfigIndex.KEYBIND_CHANGED) {
      if (client.debug) console.log('keybind has changed!!! ' + JSON.stringify(keybind));
      const name = getButtonNameFromId(keybind.id);
      const clash = sameBinds(this.state.keybinds, name, keybind);
      if (clash) {
        this.setState({ listening: null, clash });
      } else {
        // keybind has been applied, just update state
        updateKeybind(name, keybind);
        this.setState({ listening: null, clash, version: this.state.version, keybinds: getKeybinds() });
      }
    }
  }

  private onResolveClash = (clash: Clash, resolved: boolean) => {
    if (resolved) {
      // We don't actually unbind clashes, just let the player know that there are other actions bound with the same key.
      updateKeybind(clash.name, {
        id: clash.id,
        alias: clash.alias,
        boundKeyName: clash.boundKeyName,
        boundKeyValue: clash.boundKeyValue,
      });
      this.setState({ version: this.state.version + 1, keybinds: getKeybinds() });
    } else {
      // Not resolved, need to restore this keybind, state still has the previous
      // value as we didn't change state for the new key yet.
      const value = this.state.keybinds[clash.name].boundKeys[clash.alias].value;
      client.SetKeybind(clash.id, clash.alias, value);
    }
    this.setState({ clash: null });
  }

  private saveAs = (name: string) => {
    if (client.debug) console.log('save as ' + name);
    persistKeybinds(this.state.keybinds, name);
    this.setState({ name: getCharacterKeybindsName() });
    this.clearMode();
  }

  private load = (name: string) => {
    if (client.debug) console.log('load ' + name);
    this.setState({ name: 'Loading...' });
    this.clearMode();
    restoreKeybinds(name, () => {
      linkCharacterToKeybinds(name);
      this.setState({ name });
      this.loadSettings();
    });
  }

  private remove = (name: string) => {
    if (client.debug) console.log('remove ' + name);
    removeKeybinds(name);
    if (name === this.state.name) {
      this.setState({ name: null });
    }
  }

  private clearMode = () => {
    this.setState({ mode: null });
  }
}
