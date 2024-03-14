/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDHorizontalAnchor,
  HUDLayer,
  HUDVerticalAnchor,
  HUDWidgetRegistration,
  addMenuWidgetExiting
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { GameOption, OptionCategory, SelectValue } from '@csegames/library/dist/_baseGame/types/Options';
import { game } from '@csegames/library/dist/_baseGame';
import { CancellablePromise } from '@csegames/library/dist/_baseGame/clientTasks';
import { Failure, Success } from '@csegames/library/dist/_baseGame/types/SuccessFailure';
import { ArrayMap, Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { hideModal, ModalModel, showModal, updateModalContent } from '../redux/modalsSlice';
import Fuse from 'fuse.js/dist/fuse';
import { MenuSectionData, FooterButtonData, MenuTabData } from './menu/menuData';
import { SearchInput } from './input/SearchInput';
import { KeybindInput } from './input/KeybindInput';
import { GameOptionInputsList } from './input/GameOptionInputsList';
import { Menu } from './menu/Menu';
import { TextInput } from './input/TextInput';
import { BooleanInput } from './input/BooleanInput';
import { keybindsLocalStore } from '../localStorage/KeybindsLocalStorage';
import { refetchKeybinds } from '../dataSources/keybindsService';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';

const Root = 'HUD-Settings-Root';
const Search = 'HUD-Settings-Search';
const SaveAsModalBody = 'HUD-Settings-SaveAsModalBody';
const LoadModalBody = 'HUD-Settings-LoadModalBody';

interface ReactProps {}

interface InjectedProps {
  keybinds: Dictionary<Keybind>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  optionValues: Map<string, number | boolean | SelectValue>;
  setOptionsPromise: CancellablePromise<
    | Success
    | (Failure & {
        failures: ArrayMap<{
          option: GameOption;
          reason: string;
        }>;
      })
  > | null;
  searchValue: string;
  saveAsName: string;
}

enum SettingsTab {
  General = 'general',
  Interface = 'interface',
  Addons = 'addons'
}

enum SettingsSection {
  KeyBindings = 'key-bindings',
  Input = 'input',
  Audio = 'audio',
  Graphics = 'graphics',
  SkillButtons = 'skill-buttons',
  Chat = 'chat'
}

class ASettings extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      optionValues: new Map(),
      setOptionsPromise: null,
      searchValue: '',
      saveAsName: ''
    };
  }

  render(): JSX.Element {
    // Key Bindings
    const keyBindingsSection: MenuSectionData = {
      id: SettingsSection.KeyBindings,
      title: 'Key Bindings',
      content: {
        node: (
          <>
            <SearchInput className={Search} value={this.state.searchValue} setValue={this.setSearchValue.bind(this)} />
            {this.getKeybinds().map((keybind) => (
              <KeybindInput keybind={keybind} key={keybind.id} />
            ))}
          </>
        ),
        scrollable: true
      }
    };
    // Input
    const inputSection: MenuSectionData = {
      id: SettingsSection.Input,
      title: 'Input',
      content: {
        node: (
          <>
            <SearchInput className={Search} value={this.state.searchValue} setValue={this.setSearchValue.bind(this)} />
            <GameOptionInputsList
              searchValue={this.state.searchValue}
              category={OptionCategory.Input}
              getValue={this.getOptionValue.bind(this)}
              setValue={this.setOptionValue.bind(this)}
            />
          </>
        ),
        scrollable: true
      }
    };
    // Audio
    const audioSection: MenuSectionData = {
      id: SettingsSection.Audio,
      title: 'Audio',
      content: {
        node: (
          <>
            <SearchInput className={Search} value={this.state.searchValue} setValue={this.setSearchValue.bind(this)} />
            <GameOptionInputsList
              searchValue={this.state.searchValue}
              category={OptionCategory.Audio}
              getValue={this.getOptionValue.bind(this)}
              setValue={this.setOptionValue.bind(this)}
            />
          </>
        ),
        scrollable: true
      }
    };
    // Graphics
    const graphicsSection: MenuSectionData = {
      id: SettingsSection.Graphics,
      title: 'Graphics',
      content: {
        node: (
          <>
            <SearchInput className={Search} value={this.state.searchValue} setValue={this.setSearchValue.bind(this)} />
            <GameOptionInputsList
              searchValue={this.state.searchValue}
              category={OptionCategory.Rendering}
              getValue={this.getOptionValue.bind(this)}
              setValue={this.setOptionValue.bind(this)}
            />
          </>
        ),
        scrollable: true
      }
    };
    // Skill Buttons
    const skillButtonsSection: MenuSectionData = {
      id: SettingsSection.SkillButtons,
      title: 'Skill Buttons'
    };
    // Chat
    const chatSection: MenuSectionData = {
      id: SettingsSection.Chat,
      title: 'Chat'
    };
    const tabs: MenuTabData[] = [
      {
        id: SettingsTab.General,
        title: 'General',
        sections: [keyBindingsSection, inputSection, audioSection, graphicsSection]
      },
      {
        id: SettingsTab.Interface,
        title: 'Interface',
        sections: [skillButtonsSection, chatSection]
      },
      {
        id: SettingsTab.Addons,
        title: 'Addons'
      }
    ];
    return (
      <div className={Root}>
        <Menu
          title='Settings'
          menuID={WIDGET_NAME_SETTINGS}
          closeSelf={this.closeSelf.bind(this)}
          tabs={tabs}
          getFooterButtons={(tabID, sectionID) => {
            const defaultKeybindsButton: FooterButtonData = {
              onClick: this.resetKeybindsToDefaults.bind(this),
              text: 'Default'
            };
            const defaultOptionsButton: FooterButtonData = {
              onClick: this.resetOptionsToDefaults.bind(this),
              text: 'Default'
            };
            const applyButton: FooterButtonData = {
              onClick: this.apply.bind(this),
              text: 'Apply'
            };
            const saveAsButton: FooterButtonData = {
              onClick: this.saveAs.bind(this),
              text: 'Save As'
            };
            const loadButton: FooterButtonData = {
              onClick: this.load.bind(this),
              text: 'Load'
            };
            const cancelButton: FooterButtonData = {
              onClick: this.closeSelf.bind(this),
              text: 'Cancel'
            };
            switch (tabID) {
              case SettingsTab.General:
                {
                  switch (sectionID) {
                    case SettingsSection.Audio:
                    case SettingsSection.Input:
                    case SettingsSection.Graphics:
                      return [defaultOptionsButton, applyButton, cancelButton];
                    case SettingsSection.KeyBindings:
                      return [defaultKeybindsButton, saveAsButton, loadButton];
                  }
                }
                break;
              case SettingsTab.Interface: {
                return [];
              }
              case SettingsTab.Addons: {
                return [];
              }
            }
            return [cancelButton];
          }}
          escapable
        />
      </div>
    );
  }

  closeSelf(): void {
    this.setState({ optionValues: new Map() });
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_SETTINGS));
  }

  resetKeybindsToDefaults(): void {
    this.props.dispatch(
      showModal({
        id: 'ResetKeybindsToDefaults',
        content: {
          title: 'Confirm Reset',
          message:
            "Clicking 'Yes' will reset all keybinds to their default values. Are you sure you wish to reset all keybinds?",

          buttons: [
            {
              text: 'Yes',
              onClick: this.confirmKeybindsReset.bind(this)
            },
            {
              text: 'Cancel',
              onClick: this.cancelKeybindsReset.bind(this)
            }
          ]
        },
        escapable: true
      })
    );
  }

  confirmKeybindsReset(): void {
    game.resetKeybinds();
    this.props.dispatch(hideModal());
    refetchKeybinds(this.props.dispatch);
  }

  cancelKeybindsReset(): void {
    this.props.dispatch(hideModal());
  }

  resetOptionsToDefaults(): void {
    const optionValues = new Map();
    for (const option of Object.values(game.options)) {
      optionValues.set(option.name, option.defaultValue);
    }
    this.setState({ optionValues });
  }

  apply(): void {
    if (this.state.setOptionsPromise) {
      this.state.setOptionsPromise.cancel();
    }
    const updatedOptions: GameOption[] = [];
    for (const option of Object.values(game.options)) {
      const updatedValue = this.state.optionValues.get(option.name);
      if (typeof updatedValue !== 'undefined' && option.value !== updatedValue) {
        const updatedOption: GameOption = { ...option };
        updatedOption.value = updatedValue;
        updatedOptions.push(updatedOption);
      }
    }
    const setOptionsPromise = game.setOptionsAsync(updatedOptions);
    this.setState({ setOptionsPromise });
    setOptionsPromise.finally(() => {
      this.setState({ setOptionsPromise: null });
    });
  }

  saveAs(): void {
    this.props.dispatch(
      showModal({
        id: 'SaveKeybindsAs',
        content: this.getSaveAsModalContent(''),
        escapable: true
      })
    );
  }

  setSaveAsName(saveAsName: string): void {
    this.setState({ saveAsName });
    this.props.dispatch(updateModalContent(this.getSaveAsModalContent(saveAsName)));
  }

  getSaveAsModalContent(inputValue: string): ModalModel {
    return {
      title: 'Save As',
      buttons: [
        {
          text: 'Save',
          onClick: this.confirmSaveAs.bind(this)
        }
      ],
      body: (
        <div className={SaveAsModalBody}>
          <TextInput text='Save keybinds as:' value={inputValue} setValue={this.setSaveAsName.bind(this)} />
        </div>
      )
    };
  }

  confirmSaveAs(): void {
    const setIDs = keybindsLocalStore.getSetIDs();
    const setID = genID();
    setIDs.push(setID);
    keybindsLocalStore.setSetIDs(setIDs);
    const keybindSet = {
      name: this.state.saveAsName,
      keybinds: Object.values(this.props.keybinds)
    };
    keybindsLocalStore.setKeybindSet(setID, keybindSet);
    this.props.dispatch(hideModal());
  }

  load(): void {
    this.props.dispatch(
      showModal({
        id: 'LoadKeybinds',
        content: this.getLoadModalContent(null),
        escapable: true
      })
    );
  }

  getLoadModalContent(selectedSetID: string | null): ModalModel {
    const setIDs = keybindsLocalStore.getSetIDs();
    const confirmLoad = (): void => {
      const setIDToLoad = selectedSetID || setIDs[0];
      const keybindSetToLoad = keybindsLocalStore.getKeybindSet(setIDToLoad);
      for (const keybindToLoad of keybindSetToLoad.keybinds) {
        const matchedKeybind = Object.values(this.props.keybinds).find((keybind) => keybind.id === keybindToLoad.id);
        if (matchedKeybind) {
          matchedKeybind.binds.forEach((matchedBind, index) => {
            const bindToLoad = keybindToLoad.binds[index];
            if (matchedBind.value !== bindToLoad.value) {
              game.setKeybind(keybindToLoad.id, index, bindToLoad.value);
            }
          });
        }
      }
      refetchKeybinds(this.props.dispatch);
      this.props.dispatch(hideModal());
    };
    const content: ModalModel = { title: 'Load Keybinds' };
    if (setIDs.length > 0) {
      content.body = (
        <div className={LoadModalBody}>
          {setIDs.map((setID, index) => {
            const keybindSet = keybindsLocalStore.getKeybindSet(setID);
            const checked =
              // is first in list and none selected
              (index === 0 && selectedSetID === null) ||
              // or is selected
              setID === selectedSetID;
            const onKeybindClick = (value: boolean): void => {
              if (value) {
                this.props.dispatch(updateModalContent(this.getLoadModalContent(setID)));
              }
            };
            return (
              <BooleanInput text={keybindSet.name} key={setID} value={checked} setValue={onKeybindClick.bind(this)} />
            );
          })}
        </div>
      );
      content.buttons = [
        {
          text: 'Load',
          onClick: confirmLoad.bind(this)
        }
      ];
      const deleteSet = (): void => {
        const setIDToDelete = selectedSetID || setIDs[0];
        const filteredSetIDs = setIDs.filter((setID) => setID !== setIDToDelete);
        keybindsLocalStore.setSetIDs(filteredSetIDs);
        keybindsLocalStore.removeKeybindSet(setIDToDelete);
        this.props.dispatch(updateModalContent(this.getLoadModalContent(filteredSetIDs[0] ?? null)));
        this.props.dispatch(hideModal());
      };
      content.buttons = [{ text: 'Delete', onClick: deleteSet.bind(this) }];
    } else {
      content.message = 'No saved Keybind Sets';
    }
    return content;
  }

  getOptionValue(option: GameOption): number | boolean | SelectValue {
    const value = this.state.optionValues.get(option.name);
    if (typeof value !== 'undefined') {
      return value;
    }
    return option.value;
  }

  setOptionValue(option: GameOption, value: number | boolean | SelectValue): void {
    const optionValues = new Map(this.state.optionValues);
    optionValues.set(option.name, value);
    this.setState({ optionValues });
  }

  setSearchValue(searchValue: string): void {
    this.setState({ searchValue });
  }

  getKeybinds(): Keybind[] {
    const pattern = this.state.searchValue.replace(/ /g, '').toLowerCase();
    if (pattern) {
      const fuse = new Fuse(Object.values(this.props.keybinds), {
        isCaseSensitive: false,
        shouldSort: true,
        keys: ['description']
      });
      const results = fuse.search(pattern);
      return results.map((result) => result.item);
    }
    return Object.values(this.props.keybinds);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    keybinds: state.keybinds
  };
};

const Settings = connect(mapStateToProps)(ASettings);

export const WIDGET_NAME_SETTINGS = 'Settings';
export const settingsRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_SETTINGS,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  layer: HUDLayer.Menus,
  render: () => {
    return <Settings />;
  }
};
