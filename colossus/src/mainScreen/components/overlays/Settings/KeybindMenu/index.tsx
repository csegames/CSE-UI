/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as lunr from 'lunr';
import { KeybindRow } from './KeybindRow';
import { SearchBar } from '../SearchBar';
import { ListeningDialog } from './ListeningDialog';
import { ConfirmSetBindDialog } from './ConfirmSetBindDialog';
import { ConfirmRemoveBindDialog } from './ConfirmRemoveBindDialog';
import { ItemContainer } from '../ItemContainer';
import { Binding, Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { CancellablePromise } from '@csegames/library/dist/_baseGame/clientTasks';
import { game } from '@csegames/library/dist/_baseGame';
import { MenuBody, MenuHeader } from '../Menu';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { KeybindSection } from '@csegames/library/dist/_baseGame/types/Keybind';

const Container = 'Settings-Keybinds-Container';
const GroupName = 'Settings-Keybinds-GroupName';
const DialogContainer = 'Settings-Keybinds-DialogContainer';

const Controls = 'Settings-Keybinds-Controls';

// Localization Tokens
const StringIDSettingsClickToChangeBinding = 'SettingsClickToChangeBinding';
const StringIDSettingsClickToRemoveBinding = 'SettingsClickToRemoveBinding';
const StringIDSettingsGroupBasicControls = 'SettingsGroupBasicControls';
const StringIDSettingsGroupSocial = 'SettingsGroupSocial';
const StringIDSettingsGroupCamera = 'SettingsGroupCamera';
const StringIDSettingsGroupAdvanced = 'SettingsGroupAdvanced';

enum KeybindMode {
  Idle,
  ListeningForKey,
  ConfirmSetBind,
  ConfirmRemoveBind
}

interface KeybindGroup {
  name: string;
  binds: Keybind[];
  section: KeybindSection;
}

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

interface State {
  keybindMode: KeybindMode;
  keybindListening: Keybind;
  newBind: Binding;
  searchValue: string;
  index: number;
  conflicts: Keybind[];
  bindTimeoutId: number;
  removeTimeoutId: number;
}

export class AKeybindMenu extends React.Component<Props, State> {
  //@FIXME  remove all instances of 'any' please.
  private keybindsSearch: lunr.Index;
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
      bindTimeoutId: -1,
      removeTimeoutId: -1
    };
  }

  public componentDidMount() {
    const builder = new lunr.Builder();
    builder.ref('id');
    builder.field('category', { boost: 3 });
    builder.field('description', { boost: 7 });
    for (const id in game.keybinds) {
      const bind = game.keybinds[id];
      builder.add({ id: id, description: bind.description.toLowerCase(), category: bind.category });
    }
    this.keybindsSearch = builder.build();
  }

  private static checkForConflicts(checkID: number, checkBind: Binding): Keybind[] {
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

  private getResults(value: string): Keybind[] {
    const binds: Keybind[] = [];
    if (value) {
      console.log(`searching ${value}`);
      const result = this.keybindsSearch.search(`${value}~3`);
      for (const match of result) {
        console.log(`search found ${JSON.stringify(match)}`);
        binds.push(game.keybinds[match.ref]);
      }
    }
    if (binds.length == 0) {
      for (const bind in game.keybinds) {
        binds.push(game.keybinds[bind]);
      }
      binds.sort((a, b) => a.description.localeCompare(b.description));
    }
    return binds;
  }

  public render() {
    const keybinds = this.getResults(this.state.searchValue);
    const groups: KeybindGroup[] = [
      {
        name: getStringTableValue(StringIDSettingsGroupBasicControls, this.props.stringTable),
        binds: [],
        section: KeybindSection.BasicControls
      },
      {
        name: getStringTableValue(StringIDSettingsGroupSocial, this.props.stringTable),
        binds: [],
        section: KeybindSection.Social
      },
      {
        name: getStringTableValue(StringIDSettingsGroupCamera, this.props.stringTable),
        binds: [],
        section: KeybindSection.Camera
      },
      {
        name: getStringTableValue(StringIDSettingsGroupAdvanced, this.props.stringTable),
        binds: [],
        section: KeybindSection.Advanced
      }
    ];
    keybinds.forEach((keybind) => {
      const group = groups.find((group) => group.section === keybind.section);
      if (group) {
        group.binds.push(keybind);
      } else {
        console.error(`Missing group for keybind "${keybind.description}"`);
      }
    });
    groups.forEach((group) => {
      group.binds.sort((bindA, bindB) => bindA.order - bindB.order);
      if (group.binds.some((bind, bindIndex) => bind.order !== bindIndex + 1)) {
        console.error(`Keybind section "${group.name}" has keybinds with order not defined sequentially`);
      }
    });
    return (
      <>
        <div className={MenuHeader}>
          <div className={ItemContainer} style={{ justifyContent: 'space-evenly' }}>
            <div className={Controls}>
              <span className={`icon-mouse1 assigned`} />{' '}
              {getStringTableValue(StringIDSettingsClickToChangeBinding, this.props.stringTable)}
            </div>
            <div className={Controls}>
              <span className={`icon-mouse2 assigned`} />{' '}
              {getStringTableValue(StringIDSettingsClickToRemoveBinding, this.props.stringTable)}
            </div>
          </div>
          <SearchBar searchValue={this.state.searchValue} onSearchValueChange={this.onSearchValueChange} />
        </div>
        <div className={MenuBody}>
          <div className={Container}>
            {groups.map((group) => (
              <React.Fragment key={group.section}>
                <div className={GroupName}>{group.name}</div>
                {group.binds.map((keybind) => (
                  <KeybindRow
                    key={keybind.id}
                    keybind={keybind}
                    onStartBind={this.onStartBind.bind(this)}
                    onRemoveBind={this.onRemoveBind.bind(this)}
                  />
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
        {this.renderDialog()}
      </>
    );
  }

  public componentDidUnmount() {
    if (this.state.bindTimeoutId >= 0) {
      window.clearTimeout(this.state.bindTimeoutId);
    }

    if (this.state.removeTimeoutId >= 0) {
      window.clearTimeout(this.state.removeTimeoutId);
    }

    this.setState({
      bindTimeoutId: -1,
      removeTimeoutId: -1
    });
  }

  private onSearchValueChange = (searchValue: string) => {
    this.setState({ searchValue });
  };

  private onStartBind = (keybind: Keybind, index: number) => {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP);
    this.setState({ keybindMode: KeybindMode.ListeningForKey, keybindListening: keybind, index });
    this.keybindListenPromise = game.listenForKeyBindingAsync();

    this.keybindListenPromise.then(this.onConfirmBind).catch((e) => {
      console.error('There was an error trying to start keybinding ' + JSON.stringify(e));
      this.cancelKeybind();
    });
  };

  private onRemoveBind = (keybind: Keybind, index: number) => {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CONFIRM_WINDOW_POPUP);
    this.setState({
      keybindMode: KeybindMode.ConfirmRemoveBind,
      keybindListening: keybind,
      newBind: keybind.binds[index],
      index
    });
  };

  private onConfirmBind = (newBind: Binding) => {
    const conflicts = AKeybindMenu.checkForConflicts(this.state.keybindListening.id, newBind);
    this.setState({
      newBind,
      keybindMode: KeybindMode.ConfirmSetBind,
      conflicts
    });
  };

  private onYesConfirmBind = () => {
    const newState = {
      ...cloneDeep(this.state),
      keybindMode: KeybindMode.Idle
    };

    this.state.conflicts.forEach((conflict) => {
      const conflictingBindIndex = conflict.binds.findIndex((b) => b.name === this.state.newBind.name);
      if (conflictingBindIndex !== -1) {
        game.clearKeybind(conflict.id, conflictingBindIndex);
      }
    });

    game.setKeybind(this.state.keybindListening.id, this.state.index, this.state.newBind.value);
    newState.keybindListening.binds[this.state.index] = cloneDeep(this.state.newBind);

    const timeoutId = window.setTimeout(() => this.forceUpdate());

    this.setState({
      ...newState,
      conflicts: [],
      bindTimeoutId: timeoutId
    });
  };

  private onNoConfirmBind = () => {
    this.keybindListenPromise.cancel();
    this.onStartBind(this.state.keybindListening, this.state.index);
  };

  private onYesConfirmRemove = () => {
    const newState = {
      ...cloneDeep(this.state),
      keybindMode: KeybindMode.Idle
    };

    game.clearKeybind(this.state.keybindListening.id, this.state.index);

    const timeoutId = window.setTimeout(() => this.forceUpdate());

    this.setState({
      ...newState,
      conflicts: [],
      removeTimeoutId: timeoutId
    });
  };

  private cancelKeybind = () => {
    if (this.keybindListenPromise) {
      this.keybindListenPromise.cancel();
      this.keybindListenPromise = null;
    }

    this.setState({
      keybindMode: KeybindMode.Idle,
      newBind: null,
      index: -1,
      keybindListening: null
    });
  };

  private renderDialog = () => {
    let content: JSX.Element = null;

    switch (this.state.keybindMode) {
      case KeybindMode.Idle:
        return null;

      case KeybindMode.ListeningForKey:
        content = <ListeningDialog keybind={this.state.keybindListening} />;
        break;

      case KeybindMode.ConfirmSetBind:
        const conflicts = AKeybindMenu.checkForConflicts(this.state.keybindListening.id, this.state.newBind);
        content = (
          <ConfirmSetBindDialog
            keybind={this.state.keybindListening}
            newBind={this.state.newBind}
            conflicts={conflicts}
            onYesClick={this.onYesConfirmBind}
            onNoClick={this.onNoConfirmBind}
            onCancelClick={this.cancelKeybind}
          />
        );
        break;

      case KeybindMode.ConfirmRemoveBind:
        content = (
          <ConfirmRemoveBindDialog
            keybind={this.state.keybindListening}
            binding={this.state.newBind}
            onYesClick={this.onYesConfirmRemove}
            onNoClick={this.cancelKeybind}
          />
        );
        break;
    }

    return <div className={DialogContainer}>{content}</div>;
  };
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    stringTable
  };
}

export const KeybindMenu = connect(mapStateToProps)(AKeybindMenu);
