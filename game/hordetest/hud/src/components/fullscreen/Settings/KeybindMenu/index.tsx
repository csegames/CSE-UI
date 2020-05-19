/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import Fuse from 'fuse.js';
import { styled } from '@csegames/linaria/react';
import { KeybindRow } from './KeybindRow';
import { SearchBar } from '../SearchBar';
import { ListeningDialog } from './ListeningDialog';
import { ConfirmBindDialog } from './ConfirmBindDialog';

const Container = styled.div`
  width: calc(100% - 20px);
  height: 100%;
  padding: 0 10px;
`;

const DialogContainer = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  cursor: default;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1;
`;

enum KeybindMode {
  Idle,
  ListeningForKey,
  ConfirmBind,
}

export interface Props {
}

export interface State {
  keybindMode: KeybindMode;
  keybindListening: Keybind;
  newBind: Binding;
  searchValue: string;
  index: number;
  conflicts: Keybind[];
}

function checkForConflicts(checkID: number, checkBind: Binding): Keybind[] {
  const sameAs: Keybind[] = [];
  Object.values(game.keybinds).forEach((keybind) => {
    if (keybind.id === checkID) return;

    keybind.binds.forEach((bind) => {
      if (bind.value === checkBind.value) {
        sameAs.push(keybind as Keybind);
      }
    });
  });
  return sameAs;
}

export class KeybindMenu extends React.Component<Props, State> {
  private keybindsSearch: Fuse<any>;
  private keybindListenPromise: CancellablePromise<Binding>;

  constructor(props: Props) {
    super(props);
    this.state = {
      keybindMode: KeybindMode.Idle,
      keybindListening: null,
      newBind: null,
      searchValue: '',
      index: -1,
      conflicts: [],
    };
  }

  public render() {
    const keybinds = this.keybindsSearch && this.state.searchValue ?
      this.keybindsSearch.search(this.state.searchValue.replace(/ /g, '').toLowerCase()) as Keybind[] :
      Object.values(game.keybinds) as Keybind[];
    return (
      <>
        <Container>
          <SearchBar searchValue={this.state.searchValue} onSearchValueChange={this.onSearchValueChange} />
          {keybinds.map((keybind) => <KeybindRow keybind={keybind} onStartBind={this.onStartBind} />)}
        </Container>
        {this.renderDialog()}
      </>
    );
  }

  public componentDidMount() {
    this.initializeFuse();
  }

  private initializeFuse = () => {
    const keybinds = Object.values(game.keybinds);
    this.keybindsSearch = new Fuse(keybinds, {
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
  }

  private onSearchValueChange = (searchValue: string) => {
    this.setState({ searchValue });
  }

  private onStartBind = (keybind: Keybind, index: number) => {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CONFIRM_WINDOW_POPUP);
    this.setState({ keybindMode: KeybindMode.ListeningForKey, keybindListening: keybind, index });
    this.keybindListenPromise = game.listenForKeyBindingAsync();

    this.keybindListenPromise
      .then(this.onConfirmBind)
      .catch((e) => {
        console.error('There was an error trying to start keybinding ' + JSON.stringify(e));
        this.cancelKeybindListen();
      });
  }

  private onConfirmBind = (newBind: Binding) => {
    const conflicts = checkForConflicts(this.state.keybindListening.id, newBind);
    if (conflicts.length >= 1) {
      // There are conflicts, bring up confirm modal
      this.setState({ newBind, keybindMode: KeybindMode.ConfirmBind, conflicts });
    } else {
      this.setBind(newBind);
    }
  }

  private setBind = (newBind: Binding) => {
    // If there are no conflicts, just set the keybind
    game.setKeybind(this.state.keybindListening.id, this.state.index, newBind.value);

    const newState = {
      ...cloneDeep(this.state),
      keybindMode: KeybindMode.Idle,
    };
    newState.keybindListening.binds[this.state.index] = cloneDeep(newBind);
    this.setState({ ...newState });
  }

  private onYesConfirmBind = () => {
    const newState = {
      ...cloneDeep(this.state),
      keybindMode: KeybindMode.Idle,
    };

    this.state.conflicts.forEach((conflict) => {
      const conflictingBindIndex = conflict.binds.findIndex(b => b.name === this.state.newBind.name);
      if (conflictingBindIndex !== -1) {
        game.clearKeybind(conflict.id, conflictingBindIndex);
      }
    });

    game.setKeybind(this.state.keybindListening.id, this.state.index, this.state.newBind.value);
    newState.keybindListening.binds[this.state.index] = cloneDeep(this.state.newBind);

    this.setState({ ...newState, conflicts: [] });
    window.setTimeout(() => this.forceUpdate());
  }

  private onNoConfirmBind = () => {
    this.keybindListenPromise.cancel();
    this.onStartBind(this.state.keybindListening, this.state.index);
  }

  private onRemoveBind = () => {
    if (this.keybindListenPromise) {
      this.keybindListenPromise.cancel();
      this.keybindListenPromise = null;
    }
    game.clearKeybind(this.state.keybindListening.id, this.state.index);

    const newState: State = {
      ...cloneDeep(this.state),
      keybindMode: KeybindMode.Idle,
    };
    newState.keybindListening.binds[this.state.index] = { name: '', value: 0 };
    this.setState({ ...newState });
  }

  private cancelKeybindListen = () => {
    if (this.keybindListenPromise) {
      this.keybindListenPromise.cancel();
      this.keybindListenPromise = null;
    }

    this.setState({ keybindMode: KeybindMode.Idle, newBind: null, index: -1, keybindListening: null });
  }

  private renderDialog = () => {
    let content: JSX.Element = null;
    switch (this.state.keybindMode) {
      case KeybindMode.Idle: return null;
      case KeybindMode.ListeningForKey:
        content = (
          <ListeningDialog
            keybind={this.state.keybindListening}
            onRemoveBind={this.onRemoveBind}
            onClose={this.cancelKeybindListen}
          />
        );
        break;
      case KeybindMode.ConfirmBind:
        const conflicts = checkForConflicts(this.state.keybindListening.id, this.state.newBind);
        content = (
          <ConfirmBindDialog
            keybind={this.state.keybindListening}
            newBind={this.state.newBind}
            conflicts={conflicts}
            onClose={this.cancelKeybindListen}
            onYesClick={this.onYesConfirmBind}
            onNoClick={this.onNoConfirmBind}
          />
        );
        break;
    }

    return (
      <DialogContainer>
        {content}
      </DialogContainer>
    );
  }
}
