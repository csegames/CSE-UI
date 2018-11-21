/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import Fuse from 'fuse.js';
import { Store } from '@csegames/camelot-unchained/lib/utils/local-storage';

import { SettingsPanel } from 'widgets/Settings/components/SettingsPanel';
import { KeybindRow } from 'widgets/Settings/components/KeybindRow';

import { Box } from 'UI/Box';
import { Field } from 'UI/Field';
import { CloseButton } from 'UI/CloseButton';
import { SaveAsDialog } from 'widgets/Settings/components/SaveAsDialog';
import { LoadDialog } from 'widgets/Settings/components/LoadDialog';
import { ResetKeybindsDialog } from 'widgets/Settings/components/ResetKeybindsDialog';
import * as CSS from 'lib/css-helper';
import * as CONFIG from 'components/UI/config';


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

const Error = styled('div')`
  color: #dd0000;
`;

export const MODAL_ACCENT = 'rgba(255, 234, 194, 0.4)';
export const MODAL_HIGHLIGHT_STRONG = 'rgba(255, 234, 194, 0.2)';
export const MODAL_HIGHLIGHT_WEAK = 'rgba(255, 234, 194, 0.0)';

export const ModalContainer = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const ModalButtonContainer = styled('div')`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalButton = styled('div')`
  position: relative;
  pointer-events: all;
  background: url(images/progression/button-off.png) no-repeat;
  width: 95px;
  height: 30px;;
  border: none;
  margin: 12px 16px 0 16px;
  cursor: pointer;
  color: #848484;
  font-family: 'Caudex', serif;
  font-size: 10px;
  text-transform: uppercase;
  text-align: center;
  line-height: 30px;
  &:hover {
    background: url(images/progression/button-on.png) no-repeat;
    color: #fff;
    &::before {
      content: '';
      position: absolute;
      background-image: url(images/progression/button-glow.png);
      width: 93px;
      height: 30px;
      left: 0;
      background-size: cover;
  }
`;

enum KeybindMode {
  Idle,
  Save,
  Load,
  ConfirmReset,
}

interface Props {
  onCancel: () => void;
}

interface State {
  mode: KeybindMode;
  searchText: string;
  error: string;

  // If setName contains a value, then a keybind set is loaded
  setName: string;

  // Binding changes waiting to be applied
  bindingQueue: ObjectMap<{
    keybindID: number;
    index: number;
    value: number;
  }>;
}

export class KeybindSettings extends React.PureComponent<Props, State> {

  private listenPromise: CancellablePromise<Binding> = null;

  /**
   * Store class is an interface to localStorage with prefixed keys
   */
  private store: Store;

  private setsKey: string = '_sets';

  constructor(props: Props) {
    super(props);
    this.state = {
      mode: KeybindMode.Idle,
      searchText: '',
      setName: '',
      error: '',
      bindingQueue: {},
    };
    this.store = new Store('cse-keybinds_');
  }

  public componentDidMount() {
    game.on('settings--action', this.onAction);
  }

  public componentWillUnmount() {
    // stop listening for a key if we are when we unmount
    if (this.listenPromise) {
      this.listenPromise.cancel();
    }
  }

  public render() {
    return (
      <SettingsPanel style={{ padding: 0 }}>
        { this.renderSearchBar() }
        { this.renderKeyBinds() }
        { this.renderModal() }
      </SettingsPanel>
    );
  }

  private renderSearchBar = () => {
    return (
      <KeyBindsSearchBar>
        <Field style={{ width: '400px' }}>
          <ConfigName>{name && `Keybind Config: ${name}`}</ConfigName>
        </Field>
        <Field className='expand'>
          <Box padding={false} style={{ margin: 0 }}>
            <SearchBox
              spellcheck={false}
              placeholder='Search...'
              value={this.state.searchText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                // because our keys don't have spaces in, we strip spaces from the search
                this.setState({ searchText: e.target.value });
              }}
            />
            { this.state.error && <Error>{this.state.error}</Error> }
            { this.state.searchText.length
              ? (
                <CloseButton
                  onClick={() => this.setState({ searchText: '' })}
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

  private renderKeyBinds = () => {
    let binds = Object.values(game.keybinds);
    if (this.state.searchText) {
      const fuse = new Fuse(binds, {
        caseSensitive: false,
        shouldSort: true,
        keys: [{
          name: 'description',
          weight: 0.7,
        }, {
          name: 'category',
          weight: 0.3,
        }],
      });
      binds = fuse.search(this.state.searchText.replace(/ /g, '').toLowerCase()) as Keybind[];
    }
    return (
      <KeyBindsContainer className='cse-ui-scroller-thumbonly'>
        {
          binds.map(kb =>
          <KeybindRow
            key={kb.id}
            keybind={kb as Keybind}
            bindingQueue={this.state.bindingQueue}
            requestBind={this.onRequestBinding}
          />)
        }
      </KeyBindsContainer>
    );
  }

  private renderModal = () => {
    switch (this.state.mode) {
      case KeybindMode.Save:
        return <SaveAsDialog label='Save keybinds as' saveAs={this.saveAs} onClose={this.resetToIdle}/>;
      case KeybindMode.Load:
        return (
          <LoadDialog
            names={this.getSetNames()}
            onLoad={this.loadSet}
            onRemove={this.deleteSet}
            onClose={this.resetToIdle}
          />
        );
      case KeybindMode.ConfirmReset: {
        return <ResetKeybindsDialog onYesClick={this.resetKeybinds} onCancelClick={this.resetToIdle} />;
      }
    }
    return null;
  }

  private resetKeybinds = () => {
    game.resetKeybinds();
    this.resetToIdle();
  }

  private resetToIdle = (error: string = '') => {
    this.setState({
      mode: KeybindMode.Idle,
      error,
    });
  }

  private onRequestBinding = (keybindID: number, index: number, value: number) => {
    // setTimeout(() => this.forceUpdate(), 1000);
    // this.setState(state => ({
    //   ...state,
    //   bindingQueue: {
    //     ...state.bindingQueue,
    //     [`${keybindID}-${index}`]: {
    //       keybindID,
    //       index,
    //       value,
    //     }},
    // }));
  }

  private onAction = (args: { id: 'default' | 'save' | 'load' | 'cancel' | 'apply'}) => {
    switch (args.id) {
      case 'apply':
        Object.values(this.state.bindingQueue).forEach(b => game.setKeybind(b.keybindID, b.index, b.value));
        this.setState({
          bindingQueue: {},
        });
        break;
      case 'default':
        this.setState({
          mode: KeybindMode.ConfirmReset,
        });
        break;
      case 'save':
        this.setState({
          mode: KeybindMode.Save,
        });
        break;
      case 'load':
        this.setState({
          mode: KeybindMode.Load,
        });
        break;
      case 'cancel':
        if (this.listenPromise) {
          this.listenPromise.cancel();
        }
        this.props.onCancel();
        break;
    }
  }

  private saveAs = (name: string) => {
    if (name === '_sets') {
      // invalid set name!!
      this.resetToIdle('Invalid set name. Please, try again with another name.');
      return;
    }
    if (game.debug) console.log('saving keybinds as ' + name);
    this.store.set(name, this.getSavableKeybinds());

    const sets = this.getSetNames();
    sets.push(name);
    this.store.set('_sets', sets);

    this.resetToIdle();
    this.setState({ setName: name });
  }

  private getSetNames = () => {
    const sets = this.store.get<string[]>('_sets');
    return !!sets ? sets : [];
  }

  private loadSet = (name: string) => {
    if (game.debug) console.log('loading keybind set ' + name);

    const set = this.store.get<ArrayMap<Keybind>>(name);
    if (!set) {
      this.resetToIdle('failed to load set from local storage.');
      return;
    }

    Object.values(set).forEach((kb) => {
      kb.binds.forEach((b, index) => {
        game.setKeybind(kb.id, index, b.value);
      });
    });

    this.resetToIdle();
  }

  private deleteSet = (name: string) => {
    if (game.debug) console.log('deleting keybind set ' + name);
    this.store.remove(name);

    const sets = this.store.get<string[]>(this.setsKey);
    if (sets) {
      sets.remove(name);
      this.store.set(this.setsKey, sets);
    }

    this.resetToIdle();
  }

  private getSavableKeybinds = () => {
    const keybinds: ArrayMap<Keybind> =  cloneDeep(game.keybinds) as ArrayMap<Keybind>;
    Object.keys(keybinds).forEach((kbKey) => {
      const binds = keybinds[kbKey].binds;
      keybinds[kbKey].binds = [binds['0'], binds['1'], binds['2']];
    });
    return keybinds;
  }
}
