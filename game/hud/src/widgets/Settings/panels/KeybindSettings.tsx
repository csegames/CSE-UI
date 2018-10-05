/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import Fuse from 'fuse.js';
import { ConfirmDialog } from '@csegames/camelot-unchained/lib/components/ConfirmDialog';
import { Store } from '@csegames/camelot-unchained/lib/utils/local-storage';

import { SettingsPanel } from 'widgets/Settings/components/SettingsPanel';
import { KeybindRow, spacify } from 'widgets/Settings/components/KeybindRow';

import { Box } from 'UI/Box';
import { Field } from 'UI/Field';
import { CloseButton } from 'UI/CloseButton';
import { SaveAs } from 'widgets/Settings/components/SaveAs';
import { Load } from 'widgets/Settings/components/Load';
import * as CSS from 'lib/css-helper';
import * as CONFIG from 'components/UI/config';

import { Key } from 'widgets/Settings/components/Key';

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

const ListeningTitle = styled('div')`
  font-size: 24px;
  font-weight: 500;
  color: rgba(255, 234, 194, 1);
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 5px;
  text-align: center;
`;

const ListeningKey = styled('div')`
  text-align: center;
  font-style: italic;
`;

const InstructionsText = styled('div')`
  margin-top: 20px;
  text-align: center;
`;

const ListeningPopup = styled('div')`
  width: 400px;
  height: 250px;
  padding: 20px;
`;

const ConfirmBind = styled('div')`
  padding: 20px;
`;

const ConfirmBindingText = styled('span')`
  text-align: center;
  font-size: 1.2em;
`;

const Clashed = styled('div')`
  width: 400px;
  height: 250px;
  padding: 20px;
  text-align: center;
`;

const ClashContent = styled('div')`
  ${CSS.IS_COLUMN} ${CSS.DONT_GROW}
  ${CSS.HORIZONTALLY_CENTERED}
  min-height: 26px;
  margin-right: 5px;
  line-height: 26px;
  .clash-key {
    align-self: center;
    pointer-events: none;
  }
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

/**
 * Check if there are any conflicts with other Keybinds
 * @param checkID ID of Keybind we are attempting to apply the Binding to
 * @param checkBind Binding value we wish to check against
 * @return {Keybind[]} Any keybinds that share the same Binding value as the ones to check
 */
function checkForConflicts(checkID: number, checkBind: Binding): Keybind[] {
  const sameAs: Keybind[] = [];
  game.keybinds.forEach((keybind) => {
    if (keybind.id === checkID) return;

    keybind.binds.forEach((bind) => {
      if (bind.value === checkBind.value) {
        sameAs.push(keybind);
      }
    });
  });
  return sameAs;
}

enum KeybindMode {
  Idle,
  ListeningForKey,
  ConfirmBind,
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

  selectedKeybind: Keybind;
  // Index into the selectedKeybind binds property we are setting
  selectedKeybindIndex: number;

  // Binding we received from the client after listening for binds
  activeBinding: Binding;

  // If setName contains a value, then a keybind set is loaded
  setName: string;
}

export class KeybindSettings extends React.PureComponent<Props, State> {

  private listenPromise: CancellablePromise<Binding> = null;

  /**
   * Fuse - fuzzy searching library, uses this property for search that will
   * return an array of keybinds that fuzzy match search terms
   */
  private fuse: Fuse;

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
      selectedKeybind: null,
      selectedKeybindIndex: -1,
      activeBinding: null,
      setName: '',
      error: '',
    };
    this.fuse = new Fuse(game.keybinds as any[], {
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
        {/* { listening ?
          <ListeningModal
            listening={listening}
            clearBind={this.clearBind}
            toggleRebind={this.toggleRebind}
          /> : null
        }
        { clash ? <ClashModal clash={clash} onResolveClash={this.onResolveClash} /> : null } */}
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
            <SearchBox spellcheck={false} placeholder='Search...'
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
    const matchingBinds = this.fuse.search(this.state.searchText.replace(/ /g, '').toLowerCase()) as Keybind[];
    return (
      <KeyBindsContainer className='cse-ui-scroller-thumbonly'>
        {
          matchingBinds.map(
            keybind => (<KeybindRow key={keybind.id} keybind={keybind} onRequestBind={this.onRequestBinding}/>))
        }
      </KeyBindsContainer>
    );
  }

  private renderModal = () => {
    switch (this.state.mode) {
      case KeybindMode.ListeningForKey: {
        const { selectedKeybind, selectedKeybindIndex } = this.state;
        return (
          <ConfirmDialog
            onConfirm={() => {
              game.clearKeybind(selectedKeybind.id, selectedKeybindIndex);
              this.resetToIdle();
            }}
            onCancel={() => {
              this.listenPromise.cancel();
              this.resetToIdle();
            }}
            confirmButtonContent={'Unbind'}
            cancelButtonContent={'Cancel'}
          >
            <ListeningPopup>
              <ListeningTitle>Press any key</ListeningTitle>
              <ListeningKey>Binding: {spacify(selectedKeybind.description)}</ListeningKey>
              <InstructionsText>
                Press the key / key combination you wish to bind to {selectedKeybind.description}.
              </InstructionsText>
            </ListeningPopup>
          </ConfirmDialog>
        );
      }
      case KeybindMode.ConfirmBind: {
        const { selectedKeybind, selectedKeybindIndex, activeBinding } = this.state;
        const conflicts = checkForConflicts(selectedKeybind.id, activeBinding);
        return (
          <ConfirmDialog
            confirmButtonContent={'Yes'}
            cancelButtonContent={'Cancel'}
            onConfirm={() => game.setKeybind(selectedKeybind.id, selectedKeybindIndex, activeBinding)}
            onCancel={this.resetToIdle}
          >
            <ConfirmBind>
              <ConfirmBindingText>
                Bind&nbsp;
                <Key className='clash-key'>{activeBinding.name}</Key>
                &nbsp;to {selectedKeybind.description}?
              </ConfirmBindingText>
              {
                conflicts.length > 1 ?
                <Clashed>
                <ClashContent>
                  Warning! <Key className='clash-key'>{activeBinding.name}</Key> is also bound to
                  <div>
                    {conflicts.map((keybind, index) => (
                      <span key={index}>
                        <Bind>{spacify(keybind.description)}</Bind>
                        {index !== conflicts.length - 1 ? ', ' : ''}
                      </span>
                    ))}
                  </div>
                  <i>Do you still want to rebind?</i>
                </ClashContent>
                </Clashed> : null
              }
            </ConfirmBind>
          </ConfirmDialog>
        );
      }
      case KeybindMode.Save:
        return <SaveAs label='Save keybinds as' saveAs={this.saveAs} onClose={this.resetToIdle}/>;
      case KeybindMode.Load:
        return <Load load={this.loadSet} remove={this.deleteSet} onClose={this.resetToIdle}/>;
      case KeybindMode.ListeningForKey: {
        return (
          <ConfirmDialog
            onConfirm={() => {
              game.resetKeybinds();
              this.resetToIdle();
            }}
            onCancel={() => {
              this.resetToIdle();
            }}
            confirmButtonContent={'Yes'}
            cancelButtonContent={'Cancel'}
          >
            <ListeningPopup>
              <ListeningTitle>Reset Keybinds</ListeningTitle>
              <InstructionsText>
                Clicking 'Yes' will reset all keybinds to their default values. Are you sure you wish to reset all keybinds?
              </InstructionsText>
            </ListeningPopup>
          </ConfirmDialog>
        );
      }
    }
    return null;
  }

  private resetToIdle = (error: string = '') => {
    this.setState({
      mode: KeybindMode.Idle,
      selectedKeybind: null,
      selectedKeybindIndex: -1,
      activeBinding: null,
      error,
    });
  }

  private onRequestBinding = (keybind: Keybind, index: number) => {
    this.listenPromise = game.listenForKeyBindingAsync();
    this.listenPromise.then(this.handleBindingResponse).catch(this.handleListenError);
    this.setState({
      mode: KeybindMode.ListeningForKey,
      selectedKeybind: keybind,
      selectedKeybindIndex: index,
    });
  }

  private handleBindingResponse = (binding: Binding) => {
    this.setState({
      mode: KeybindMode.ConfirmBind,
      activeBinding: binding,
    });
  }

  private handleListenError = (error: { errorMessage: string }) => {
    this.resetToIdle(error.errorMessage);
  }

  private onAction = (args: { id: 'default' | 'save' | 'load' | 'cancel' }) => {
    switch (args.id) {
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
          mode: KeybindMode.Save,
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
    this.store.set(name, game.keybinds);

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

    const set = this.store.get<Keybind[]>(name);
    if (!set) {
      this.resetToIdle('failed to load set from local storage.');
      return;
    }

    const result = game.setKeybinds(set);

    if (result.success) {
      this.resetToIdle();
      return;
    }

    this.resetToIdle((result as Failure).reason);
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
}
