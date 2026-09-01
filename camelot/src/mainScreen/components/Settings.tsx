/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration, addConditionalWidgetExiting } from '../redux/hudSlice';
import { AddDispatch, RootState } from '../redux/store';
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
import { refetchKeybinds } from '../dataSources/keybindsService';
import { genID } from '@csegames/library/dist/_baseGame/utils/idGen';
import { clearOptionChanges } from '../redux/gameSettingsSlice';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import {
  getStringTableValue,
  StringIDGeneralApply,
  StringIDGeneralCancel,
  StringIDGeneralDefault,
  StringIDGeneralDelete,
  StringIDGeneralLoad,
  StringIDGeneralSave,
  StringIDGeneralSaveAs,
  StringIDGeneralYes
} from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';

const ModalID = 'SaveKeybindsAs';

// CSS classes
const Root = 'HUD-Settings-Root';
const Search = 'HUD-Settings-Search';
const SaveAsModalBody = 'HUD-Settings-SaveAsModalBody';
const LoadModalBody = 'HUD-Settings-LoadModalBody';

// String IDs
const StringIDSettingsTitle = 'SettingsTitle';
const StringIDSettingsTabTitleGeneral = 'SettingsTabTitleGeneral';
const StringIDSettingsTabTitleAddons = 'SettingsTabTitleAddons';
const StringIDSettingsSectionTitleKeyBindings = 'SettingsSectionTitleKeyBindings';
const StringIDSettingsSectionTitleInput = 'SettingsSectionTitleInput';
const StringIDSettingsSectionTitleAudio = 'SettingsSectionTitleAudio';
const StringIDSettingsSectionTitleGraphics = 'SettingsSectionTitleGraphics';
const StringIDSettingsSaveKeybindsModalInputLabel = 'SettingsSaveKeybindsModalInputLabel';
const StringIDSettingsResetKeybindsModalTitle = 'SettingsResetKeybindsModalTitle';
const StringIDSettingsResetKeybindsModalMessage = 'SettingsResetKeybindsModalMessage';
const StringIDSettingsLoadKeybindsModalTitle = 'SettingsLoadKeybindsModalTitle';
const StringIDSettingsLoadKeybindsModalEmptyMessage = 'SettingsLoadKeybindsModalEmptyMessage';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  keybinds: Dictionary<Keybind>;
  advanceSettingsOriginalValues: Dictionary<GameOption>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps & AddDispatch;

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
  Addons = 'addons'
}

enum SettingsSection {
  KeyBindings = 'key-bindings',
  Input = 'input',
  Audio = 'audio',
  Graphics = 'graphics',
  SkillButtons = 'skill-buttons',
  Chat = 'chat',
  UI = 'ui'
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
      title: getStringTableValue(StringIDSettingsSectionTitleKeyBindings, this.props.stringTable),
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
      },
      onOpen: () => {
        clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
      }
    };
    // Input
    const inputSection: MenuSectionData = {
      id: SettingsSection.Input,
      title: getStringTableValue(StringIDSettingsSectionTitleInput, this.props.stringTable),
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
      },
      onOpen: () => {
        clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
      }
    };
    // Audio
    const audioSection: MenuSectionData = {
      id: SettingsSection.Audio,
      title: getStringTableValue(StringIDSettingsSectionTitleAudio, this.props.stringTable),
      content: {
        node: (
          <>
            <SearchInput className={Search} value={this.state.searchValue} setValue={this.setSearchValue.bind(this)} />
            <GameOptionInputsList
              searchValue={this.state.searchValue}
              category={OptionCategory.Audio}
              getValue={this.getOptionValue.bind(this)}
              setValue={this.setOptionValue.bind(this)}
              isAdvance
            />
          </>
        ),
        scrollable: true
      },
      onOpen: () => {
        clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
      }
    };
    // Graphics
    const graphicsSection: MenuSectionData = {
      id: SettingsSection.Graphics,
      title: getStringTableValue(StringIDSettingsSectionTitleGraphics, this.props.stringTable),
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
      },
      onOpen: () => {
        clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
      }
    };
    // UI section removed — "Toggle UI Edit Mode" moved to the Game Menu (Esc menu) and
    // "Reload UI" moved into the HUD Editor screen.
    const tabs: MenuTabData[] = [
      {
        id: SettingsTab.General,
        title: getStringTableValue(StringIDSettingsTabTitleGeneral, this.props.stringTable),
        sections: [keyBindingsSection, inputSection, audioSection, graphicsSection]
      },
      {
        id: SettingsTab.Addons,
        title: getStringTableValue(StringIDSettingsTabTitleAddons, this.props.stringTable)
      }
    ];
    return (
      <div className={Root}>
        <Menu
          isDragCopy={this.props.isDragCopy}
          title={getStringTableValue(StringIDSettingsTitle, this.props.stringTable)}
          menuID={WIDGET_ID_SETTINGS}
          closeSelf={this.closeSelf.bind(this)}
          tabs={tabs}
          getFooterButtons={(tabID, sectionID) => {
            const defaultKeybindsButton: FooterButtonData = {
              onClick: () => {
                this.resetKeybindsToDefaults();
                clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
              },
              text: getStringTableValue(StringIDGeneralDefault, this.props.stringTable)
            };
            const defaultOptionsButton: FooterButtonData = {
              onClick: () => {
                this.resetOptionsToDefaults();
                clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
              },
              text: getStringTableValue(StringIDGeneralDefault, this.props.stringTable)
            };
            const applyButton: FooterButtonData = {
              onClick: () => {
                this.apply();
                clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
              },
              text: getStringTableValue(StringIDGeneralApply, this.props.stringTable)
            };
            const saveAsButton: FooterButtonData = {
              onClick: () => {
                this.saveAs();
                clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
              },
              text: getStringTableValue(StringIDGeneralSaveAs, this.props.stringTable)
            };
            const loadButton: FooterButtonData = {
              onClick: () => {
                this.load();
                clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
              },
              text: getStringTableValue(StringIDGeneralLoad, this.props.stringTable)
            };
            const cancelButton: FooterButtonData = {
              onClick: () => {
                this.closeSelf();
                clientAPI.playGameSound(SoundEvents.PLAY_UI_GAME_MENU_OPTIONS);
              },
              text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable)
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

  componentWillUnmount(): void {
    const options = Object.values(this.props.advanceSettingsOriginalValues);
    if (options.length > 0) {
      game.setOptionsAsync(options).then((result) => {
        if (!result.success) {
          console.warn('SetOptionsAsync failed to apply all requested changes.', result);
        }
      });
    }
    this.props.dispatch(clearOptionChanges());
  }

  closeSelf(): void {
    this.setState({ optionValues: new Map() });
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_SETTINGS));
  }

  resetKeybindsToDefaults(): void {
    this.props.dispatch(
      showModal({
        id: 'ResetKeybindsToDefaults',
        content: {
          title: getStringTableValue(StringIDSettingsResetKeybindsModalTitle, this.props.stringTable),
          message: getStringTableValue(StringIDSettingsResetKeybindsModalMessage, this.props.stringTable),

          buttons: [
            {
              text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
              onClick: this.cancelKeybindsReset.bind(this)
            },
            {
              text: getStringTableValue(StringIDGeneralYes, this.props.stringTable),
              onClick: this.confirmKeybindsReset.bind(this)
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
    setOptionsPromise.then(() => {
      this.setState({ setOptionsPromise: null });
    });
    setOptionsPromise.catch(() => {
      this.setState({ setOptionsPromise: null });
    });
    this.props.dispatch(clearOptionChanges());
  }

  saveAs(): void {
    this.props.dispatch(
      showModal({
        id: ModalID,
        content: this.getSaveAsModalContent(''),
        escapable: true
      })
    );
  }

  setSaveAsName(saveAsName: string): void {
    this.setState({ saveAsName });
    this.props.dispatch(updateModalContent([ModalID, this.getSaveAsModalContent(saveAsName)]));
  }

  getSaveAsModalContent(inputValue: string): ModalModel {
    return {
      title: getStringTableValue(StringIDGeneralSaveAs, this.props.stringTable),
      buttons: [
        {
          text: getStringTableValue(StringIDGeneralSave, this.props.stringTable),
          onClick: this.confirmSaveAs.bind(this)
        }
      ],
      body: (
        <div className={SaveAsModalBody}>
          <TextInput
            text={getStringTableValue(StringIDSettingsSaveKeybindsModalInputLabel, this.props.stringTable)}
            value={inputValue}
            setValue={this.setSaveAsName.bind(this)}
          />
        </div>
      )
    };
  }

  confirmSaveAs(): void {
    const setIDs = clientAPI.getKeybindSetIDs();
    const setID = genID();
    setIDs.push(setID);
    clientAPI.setKeybindSetIDs(setIDs);
    const keybindSet = {
      name: this.state.saveAsName,
      keybinds: Object.values(this.props.keybinds)
    };
    clientAPI.setKeybindSet(setID, keybindSet);
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
    const setIDs = clientAPI.getKeybindSetIDs();
    const confirmLoad = (): void => {
      const setIDToLoad = selectedSetID || setIDs[0];
      const keybindSetToLoad = clientAPI.getKeybindSet(setIDToLoad);
      for (const keybindToLoad of keybindSetToLoad?.keybinds ?? []) {
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
    const content: ModalModel = {
      title: getStringTableValue(StringIDSettingsLoadKeybindsModalTitle, this.props.stringTable)
    };
    if (setIDs.length > 0) {
      content.body = (
        <div className={LoadModalBody}>
          {setIDs.map((setID, index) => {
            const keybindSet = clientAPI.getKeybindSet(setID);
            const checked =
              // is first in list and none selected
              (index === 0 && selectedSetID === null) ||
              // or is selected
              setID === selectedSetID;
            const onKeybindClick = (value: boolean): void => {
              if (value) {
                this.props.dispatch(updateModalContent([ModalID, this.getLoadModalContent(setID)]));
              }
            };
            return (
              <BooleanInput
                text={keybindSet?.name || ''}
                key={setID}
                value={checked}
                setValue={onKeybindClick.bind(this)}
              />
            );
          })}
        </div>
      );
      const deleteSet = (): void => {
        const setIDToDelete = selectedSetID || setIDs[0];
        const filteredSetIDs = setIDs.filter((setID) => setID !== setIDToDelete);
        clientAPI.setKeybindSetIDs(filteredSetIDs);
        clientAPI.removeKeybindSet(setIDToDelete);
        this.props.dispatch(updateModalContent([ModalID, this.getLoadModalContent(filteredSetIDs[0] ?? null)]));
        this.props.dispatch(hideModal());
      };
      content.buttons = [
        {
          text: getStringTableValue(StringIDGeneralLoad, this.props.stringTable),
          onClick: confirmLoad.bind(this)
        },
        { text: getStringTableValue(StringIDGeneralDelete, this.props.stringTable), onClick: deleteSet.bind(this) }
      ];
    } else {
      content.message = getStringTableValue(StringIDSettingsLoadKeybindsModalEmptyMessage, this.props.stringTable);
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

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { advanceSettingsOriginalValues } = state.gameSettings;
  return {
    ...ownProps,
    advanceSettingsOriginalValues,
    keybinds: state.keybinds,
    stringTable: state.stringTable.stringTable
  };
};

const Settings = connect(mapStateToProps)(ASettings);

export const WIDGET_ID_SETTINGS = 'Settings';
export const settingsRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_SETTINGS,
  nameStringID: 'HUDEditorWidgetNameSettings',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.Top,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Settings isDragCopy={isDragCopy} />;
  }
};
