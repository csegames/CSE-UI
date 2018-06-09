/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { SettingsPanel } from '../components/SettingsPanel';
import { getKeyBinds, cancel, ConfigIndex } from '../utils/configVars';
import { KeyBind, Listening } from '../components/KeyBind';
import { keyBinds2KeyConfig, getKeyLabel, KeyBinds } from '../utils/keyboard';
import { client, events, getVirtualKeyCode } from '@csegames/camelot-unchained';
import { Box } from '../components/Box';
import { Field } from '../components/Field';
import { Key } from '../components/Key';
import * as CSS from '../utils/css-helper';
import * as CONFIG from '../config';

interface ClashKey {
  name: string;
  which: number;
}

interface Clash {
  sameAs: ClashKey[];
  name: string;
  which: number;
  keyCode: number;
}

interface ClashesProps {
  clash: Clash;
  onResolve: (chash: Clash, resolved: boolean) => void;
}
const Bind = styled('span')`
  background-color: rgba(7,7,7,1);
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

const ClearSearch = styled('span')`
  position: absolute;
  content: '';
  right: 0px;
  width: 25px;
  height: 25px;
  line-height: 25px;
  color: ${CONFIG.NAV_HIGHLIGHT_TEXT_COLOR};
`;

const ClashContent = styled('div')`
  min-height: 26px;
  margin-right: 5px;
  line-height: 26px;
`;

/* tslint:disable:function-name */
function Clashes(props: ClashesProps) {
  const { sameAs, keyCode } = props.clash;
  function resolve(ok: boolean) {
    props.onResolve(props.clash, ok);
  }
  return (
    <Box justify='center' style={{ minHeight: '45px' }}>
      <ClashContent>
        <Key>{getKeyLabel(keyCode)}</Key> is already bound to
        {sameAs.map((item: ClashKey, index: number) => (
          <Bind key={index}>{item.name}</Bind>
        ))}.
      </ClashContent>
      <ClashContent>
        Override?
        <Key onClick={() => resolve(true)}>Yes</Key>
        /
        <Key onClick={() => resolve(false)}>No</Key>
      </ClashContent>
    </Box>
  );
}

interface KeybindSettingsProps {
}
interface KeybindSettingsState {
  keybinds: KeyBinds;
  clash: Clash;
  listening: Listening;
  search: string;
}

function sameBinds(keybinds: any, keyCode: number) {
  const found: ClashKey[] = [];
  Object.keys(keybinds).forEach((key) => {
    const binds = keybinds[key];
    for (let i = 0; i < binds.length; i++) {
      if (binds[i].code === keyCode) {
        found.push({ name: key, which: i });
      }
    }
  });
  return found;
}

export class KeybindSettings extends React.PureComponent<KeybindSettingsProps, KeybindSettingsState> {
  private evh: number;
  constructor(props: KeybindSettingsProps) {
    super(props);
    this.state = {
      keybinds: null,
      listening: null,
      clash: null,
      search: '',
    };
  }

  public componentDidMount() {
    this.evh = events.on('settings--reload', this.reload);
    this.loadSettings();
  }

  public componentWillUnmount() {
    cancel(ConfigIndex.KEYBIND);
    if (this.evh) events.off(this.evh);
    if (this.state.listening) {
      this.dontListen(false);
    }
  }

  private renderSearchBar() {
    return (
      <KeyBindsSearchBar>
        <Field style={{ width: '400px' }}></Field>
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
              ? <ClearSearch onClick={() => this.setState({ search: '' })}>X</ClearSearch>
              : null
            }
          </Box>
        </Field>
      </KeyBindsSearchBar>
    );
  }

  private renderKeyBinds(keys: string[]) {
    const { clash, keybinds, listening } = this.state;
    let { search } = this.state;
    search = search.replace(/ /g, '').toLowerCase();
    return (
      <KeyBindsContainer>
        { keys && keys.map((key) => {
              if (clash && key === clash.name) {
                return <Clashes key={clash.name} clash={clash} onResolve={this.onResolveClash}/>;
              }
              if (search && key.toLowerCase().indexOf(search) === -1) return null;
              return (
                <KeyBind key={key} name={key} binds={keybinds[key]}
                    listening={listening && listening.name === key ? listening : null}
                    toggleRebind={this.toggleRebind}/>
              );
        })}
      </KeyBindsContainer>
    )
  }

  public render() {
    const { keybinds } = this.state;
    const keys = keybinds && Object.keys(keybinds);
    return (
      <SettingsPanel style={{ padding: 0 }}>
        { keys && keys.length > 10 ? this.renderSearchBar() : null }
        { keys ? this.renderKeyBinds(keys) : null }
      </SettingsPanel>
    );
  }

  private loadSettings() {
    getKeyBinds((keybinds: any, type: ConfigIndex) => {
      if (type === ConfigIndex.KEYBIND) {
        this.setState({ keybinds: keyBinds2KeyConfig(keybinds) });
      }
    });
  }

  private reload = (type: ConfigIndex) => {
    if (type === ConfigIndex.KEYBIND) {
      this.loadSettings();
    }
  }

  private toggleRebind = (name: string, which: number) => {
    const { listening } = this.state;
    if (listening) {
      this.dontListen();
      if (listening.name === name && listening.which === which) {
        // clicked listening button again, cancells listen.
        this.setState({ listening: null });
        return;
      }
    }
    // start listening.
    this.setState({ listening: { name, which }, clash: null }, this.listen);
  }

  private listen() {
    window.addEventListener('keydown', this.handleKeyEvent);
    client.RequestInputOwnership();
  }

  private dontListen(updateState = true) {
    // Stop listening
    window.removeEventListener('keydown', this.handleKeyEvent);
    client.ReleaseInputOwnership();
    if (updateState) this.setState({ listening: null });
  }

  private handleKeyEvent = (e: KeyboardEvent) => {
    const { listening } = this.state;
    if (listening) {
      e.preventDefault();
      const keyCode = getVirtualKeyCode(e.keyCode);
      const name = listening.name;
      const which = listening.which;
      console.log(`keyCode = ${keyCode} name=${name} which=${which}`);

      // Clear listening state
      this.dontListen();

      // Find other keys using this binding
      const same = sameBinds(this.state.keybinds, keyCode);
      console.log(JSON.stringify(same));
      if (same.length) {
        this.setState({ clash: { sameAs: same, name, which, keyCode } });
      } else {
        this.bind(name, which, keyCode);
      }
    }
  }

  private bind(name: string, which: number, keyCode: number) {
    const config = `${name}_${which + 1}`;

    // Actually change mapping
    console.log(`keybind set ${config} = ${keyCode}`);
    client.ChangeConfigVar(config, `${keyCode}`);
    client.SaveConfigChanges();

    // Update keybind in state
    const keybinds = Object.assign({}, this.state.keybinds);
    keybinds[name][which] = {
      code: keyCode,
      label: getKeyLabel(keyCode),
    };
    this.setState({ keybinds });
  }

  private onResolveClash = (clash: Clash, resolved: boolean) => {
    if (resolved) {
      clash.sameAs.forEach((item: ClashKey) => {
        const config = `${item.name}_${item.which + 1}`;
        console.log(`clear key ${config}`);
        client.ChangeConfigVar(config, '');
      });
      this.bind(clash.name, clash.which, clash.keyCode);
    }
    this.setState({ clash: null });
  }
}
