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
  addMenuWidgetExiting,
  toggleMenuWidget
} from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { Menu } from './menu/Menu';
import { MenuTabData } from './menu/menuData';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { game } from '@csegames/library/dist/_baseGame';
import { Button } from './Button';
import { SearchInput } from './input/SearchInput';
import { Material, Block, PotentialItem, Blueprint } from '@csegames/library/dist/_baseGame/types/Building';
import Fuse from 'fuse.js/dist/fuse';
import TooltipSource from './TooltipSource';
import { CancellablePromise } from '@csegames/library/dist/_baseGame/clientTasks';
import { Failure, Success } from '@csegames/library/dist/_baseGame/types/SuccessFailure';
import { BuildingMode } from '@csegames/library/dist/_baseGame/types/Building';
import { showModal } from '../redux/modalsSlice';
import { TextInput } from './input/TextInput';
import { ModalModel } from '../redux/modalsSlice';
import { updateModalContent } from '../redux/modalsSlice';
import { hideModal } from '../redux/modalsSlice';
import { CloseButton } from '../../shared/components/CloseButton';
import { WIDGET_NAME_OPEN_BUILD } from './OpenBuild';

const Root = 'HUD-Build-Root';
const IconGrid = 'HUD-Build-IconGrid';
const IconBox = 'HUD-Build-IconBox';
const IconBoxSelected = 'HUD-Build-IconBoxSelected';
const BlueprintCloseButtonPosition = 'HUD-Build-BlueprintCloseButtonPosition';
const Tooltip = 'HUD-Build-Tooltip';
const TooltipImage = 'HUD-Build-TooltipImage';
const TooltipText = 'HUD-Build-TooltipText';
const SaveBlueprintModalBody = 'HUD-Build-SaveBlueprintModalBody';
const HelpContent = 'HUD-Build-HelpContent';
const KeybindContainer = 'HUD-Build-KeybindContainer';
const KeybindValue = 'HUD-Build-KeybindValue';
const KeybindDescription = 'HUD-Build-KeybindDescription';
const HelpButton = 'HUD-Build-HelpButton';

interface ReactProps {}

interface InjectedProps {
  keybinds: Dictionary<Keybind>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  searchValue: string;
  selectBlockPromise: CancellablePromise<Success | Failure> | null;
  deleteBlueprintPromise: CancellablePromise<Success | Failure> | null;
  selectBlueprintPromise: CancellablePromise<Success | Failure> | null;
  saveBlueprintPromise: CancellablePromise<Success | Failure> | null;
  selectItemPromise: CancellablePromise<Success | Failure> | null;
  selectionIntervalID: number;
  hasSelection: boolean;
  saveBlueprintName: string;
}

interface SearchableItem extends Omit<PotentialItem, 'tags'> {
  tags: string[];
}

interface SearchableBlock extends Omit<Block, 'tags'> {
  tags: string[];
}

interface SearchableMaterial extends Omit<Material, 'blocks' | 'tags'> {
  blocks: SearchableBlock[];
  tags: string[];
}

enum BuildTab {
  Blocks = 'blocks',
  Blueprints = 'blueprints',
  Items = 'items',
  Help = 'help'
}

enum ItemPlacementType {
  None = 0,
  Door = 1,
  Plot = 2,
  BuildingFaceSide = 3,
  BuildingFaceBottom = 4,
  BuildingFaceTop = 5
}

class ABuild extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchValue: '',
      selectBlockPromise: null,
      deleteBlueprintPromise: null,
      selectBlueprintPromise: null,
      saveBlueprintPromise: null,
      selectItemPromise: null,
      selectionIntervalID: null,
      hasSelection: false,
      saveBlueprintName: ''
    };
  }

  render(): JSX.Element {
    return (
      <div className={Root}>
        <Menu title='Build' menuID='build' tabs={this.getTabs()} closeSelf={this.closeSelf.bind(this)} escapable />
      </div>
    );
  }

  getTabs(): MenuTabData[] {
    const leftKeybindIDs = [
      28, // CubeToggleSelectionUI
      15, // CubeToggleSelectionMode
      14, // CubeCommitBlock
      13, // CubeUndoBlockPlacement
      7, // CubeRotateBlockX
      8, // CubeRotateBlockY
      9, // CubeRotateBlockZ
      4, // CubeFlipBlockX
      5, // CubeFlipBlockY
      6, // CubeFlipBlockZ
      10, // CubeCycleSelectedBlockShape
      2, // CubeBuildingCopy
      3 // CubeBuildingPaste
    ];
    const rightKeybindIDs = [
      29, // CubeBlueprintFromSelection
      47, // UIHideToggle
      16, // CubeRemovePlacedObjects
      17, // CubeSelectPlacedObject
      31 // CubeReplaceMaterial
    ];
    return [
      {
        id: BuildTab.Blocks,
        title: 'Blocks',
        content: {
          node: (
            <>
              <SearchInput value={this.state.searchValue} setValue={this.setSearchValue.bind(this)} />
              <div className={IconGrid}>
                {this.getMaterials().map((material) =>
                  material.blocks.map((block) => {
                    const selectBlock = (): void => {
                      if (game.building.activeBlockID !== block.id) {
                        if (this.state.selectBlockPromise) {
                          this.state.selectBlockPromise.cancel();
                          this.setState({ selectBlockPromise: null });
                        }
                        const selectBlockPromise = game.building.selectBlockAsync(block.id);
                        this.setState({ selectBlockPromise });
                        selectBlockPromise.finally(() => {
                          this.setState({ selectBlockPromise: null });
                        });
                      }
                    };
                    return (
                      <TooltipSource
                        tooltipParams={{
                          id: `Build-Block-${block.id}`,
                          content: () => (
                            <div className={Tooltip}>
                              <img className={TooltipImage} src={`data:image/png;base64,${material.icon}`} />
                              <span className={TooltipText}>{[...material.tags, ...block.tags].join(' ')}</span>
                            </div>
                          )
                        }}
                        key={block.id}
                      >
                        <div
                          className={
                            game.building.activeBlockID === block.id ? `${IconBox} ${IconBoxSelected}` : IconBox
                          }
                          onClick={selectBlock.bind(this)}
                          key={block.id}
                        >
                          <img src={`data:image/png;base64,${block.icon}`} />
                        </div>
                      </TooltipSource>
                    );
                  })
                )}
              </div>
            </>
          ),
          scrollable: true
        }
      },
      {
        id: BuildTab.Blueprints,
        title: 'Blueprints',
        content: {
          node: (
            <>
              <SearchInput value={this.state.searchValue} setValue={this.setSearchValue.bind(this)} />
              <Button onClick={this.createBlueprint.bind(this)} disabled={!this.state.hasSelection}>
                Create Blueprint
              </Button>
              <div className={IconGrid}>
                {this.getBlueprints().map((blueprint) => {
                  const selectBlueprint = (): void => {
                    if (game.building.activeBlueprintID !== blueprint.id) {
                      if (this.state.selectBlueprintPromise) {
                        this.state.selectBlueprintPromise.cancel();
                        this.setState({ selectBlueprintPromise: null });
                      }
                      const selectBlueprintPromise = game.building.selectBlueprintAsync(blueprint.id);
                      this.setState({ selectBlueprintPromise });
                      selectBlueprintPromise.finally(() => {
                        this.setState({ selectBlueprintPromise: null });
                      });
                    }
                  };
                  const deleteBlueprint = (): void => {
                    this.props.dispatch(
                      showModal({
                        id: 'DeleteBlueprint',
                        content: this.getDeleteBlueprintModalContent(blueprint.id)
                      })
                    );
                  };
                  return (
                    <TooltipSource
                      tooltipParams={{
                        id: `Build-Blueprint-${blueprint.id}`,
                        content: () => (
                          <div className={Tooltip}>
                            <img className={TooltipImage} src={`data:image/png;base64,${blueprint.icon}`} />
                            <span className={TooltipText}>{blueprint.name}</span>
                          </div>
                        )
                      }}
                      key={blueprint.id}
                    >
                      <div className={IconBox} onClick={selectBlueprint.bind(this)}>
                        <CloseButton className={BlueprintCloseButtonPosition} onClick={deleteBlueprint.bind(this)} />
                        <img src={`data:image/png;base64,${blueprint.icon}`} />
                      </div>
                    </TooltipSource>
                  );
                })}
              </div>
            </>
          )
        }
      },
      {
        id: BuildTab.Items,
        title: 'Items',
        content: {
          node: (
            <>
              <SearchInput value={this.state.searchValue} setValue={this.setSearchValue.bind(this)} />
              <div className={IconGrid}>
                {this.getItems().map((item) => {
                  const selectItem = (): void => {
                    if (game.building.activePotentialItemID !== item.id) {
                      if (this.state.selectItemPromise) {
                        this.state.selectItemPromise.cancel();
                        this.setState({ selectItemPromise: null });
                      }
                      const selectItemPromise = game.building.selectPotentialItemAsync(item.id);
                      this.setState({ selectItemPromise });
                      selectItemPromise.then((res) => {
                        if (res.success) {
                          game.trigger('toggleBuildSelector');
                        }
                      });
                      selectItemPromise.finally(() => {
                        this.setState({ selectItemPromise: null });
                      });
                    }
                  };
                  return (
                    <TooltipSource
                      tooltipParams={{
                        id: `Build-Item-${item.id}`,
                        content: () => (
                          <div className={Tooltip}>
                            <img className={TooltipImage} src={item.icon} />
                            <span className={TooltipText}>{[item.name, ...item.tags].join(' ')}</span>
                          </div>
                        )
                      }}
                      key={item.id}
                    >
                      <div className={IconBox} onClick={selectItem.bind(this)}>
                        <img src={item.icon} />
                      </div>
                    </TooltipSource>
                  );
                })}
              </div>
            </>
          ),
          scrollable: true
        }
      },
      {
        id: BuildTab.Help,
        title: 'Help',
        content: {
          node: (
            <div className={HelpContent}>
              <div>{leftKeybindIDs.map(this.renderKeybind.bind(this))}</div>
              <div>
                <Button className={HelpButton} onClick={this.enableFlyMode.bind(this)}>
                  Fly Mode On
                </Button>
                <Button className={HelpButton} onClick={this.disableFlyMode.bind(this)}>
                  Fly Mode Off
                </Button>
                <Button className={HelpButton} onClick={this.showPerfHUD.bind(this)}>
                  Show Perf HUD
                </Button>
                <Button className={HelpButton} onClick={this.hidePerfHud.bind(this)}>
                  Hide Perf HUD
                </Button>
                {rightKeybindIDs.map(this.renderKeybind.bind(this))}
              </div>
            </div>
          ),
          scrollable: true
        }
      }
    ];
  }

  renderKeybind(keybindID: number): JSX.Element {
    const keybind = this.props.keybinds[keybindID];
    return (
      <div className={KeybindContainer} key={keybindID}>
        <div className={KeybindValue}>
          {keybind.binds
            .filter((bind) => bind.value)
            .map((bind) => (
              <span key={bind.value}>{bind.name}</span>
            ))}
        </div>
        <span className={KeybindDescription}>{keybind.description}</span>
      </div>
    );
  }

  componentDidMount(): void {
    // I don't really like this solution, but to my knowledge the client does not expose a listener for when selection has changed
    this.setState({
      selectionIntervalID: window.setInterval(this.updateHasSelection.bind(this), 1000)
    });
  }

  componentWillUnmount(): void {
    if (this.state.selectionIntervalID) {
      window.clearInterval(this.state.selectionIntervalID);
      this.setState({
        selectionIntervalID: null
      });
    }
  }

  updateHasSelection(): void {
    this.setState({ hasSelection: game.building.mode === BuildingMode.BlocksSelected });
  }

  closeSelf(): void {
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_BUILD));
    this.props.dispatch(
      toggleMenuWidget({
        widgetId: WIDGET_NAME_OPEN_BUILD
      })
    );
  }

  setSearchValue(searchValue: string): void {
    this.setState({ searchValue });
  }

  getMaterials(): SearchableMaterial[] {
    const materials: SearchableMaterial[] = Object.values(game.building.materials).map(
      (material): SearchableMaterial => ({
        ...material,
        tags: Object.values(material.tags),
        blocks: Object.values(material.blocks).map(
          (block): SearchableBlock => ({ ...block, tags: Object.values(block.tags) })
        )
      })
    );
    const pattern = this.state.searchValue.replace(/ /g, '').toLowerCase();
    if (pattern) {
      const fuse = new Fuse(materials, {
        isCaseSensitive: false,
        shouldSort: true,
        keys: ['tags', 'blocks.tags']
      });
      const results = fuse.search(pattern);
      return results.map((result) => result.item);
    }
    return materials;
  }

  getItems(): SearchableItem[] {
    const items: SearchableItem[] = Object.values(game.building.potentialItems)
      .filter(
        (item) =>
          (game.isCUBE && item.placementType === ItemPlacementType.Plot) || item.templateType !== ItemPlacementType.None
      )
      .map((item): SearchableItem => ({ ...item, tags: Object.values(item.tags) }));
    const pattern = this.state.searchValue.replace(/ /g, '').toLowerCase();
    if (pattern) {
      const fuse = new Fuse(items, {
        isCaseSensitive: false,
        shouldSort: true,
        keys: ['name', 'tags']
      });
      const results = fuse.search(pattern);
      return results.map((result) => result.item);
    }
    return items;
  }

  getBlueprints(): Blueprint[] {
    const blueprints: Blueprint[] = Object.values(game.building.blueprints);
    const pattern = this.state.searchValue.replace(/ /g, '').toLowerCase();
    if (pattern) {
      const fuse = new Fuse(blueprints, {
        isCaseSensitive: false,
        shouldSort: true,
        keys: ['name']
      });
      const results = fuse.search(pattern);
      return results.map((result) => result.item);
    }
    return blueprints;
  }

  createBlueprint(): void {
    this.props.dispatch(
      showModal({
        id: 'CreateBlueprint',
        content: this.getSaveBlueprintModalContent('')
      })
    );
  }

  getSaveBlueprintModalContent(inputValue: string): ModalModel {
    return {
      title: 'Save Blueprint',
      body: (
        <div className={SaveBlueprintModalBody}>
          <TextInput text='Save blueprint as:' value={inputValue} setValue={this.setSaveBlueprintName.bind(this)} />
        </div>
      ),
      buttons: [
        {
          text: 'Save',
          onClick: this.saveBlueprint.bind(this)
        },
        {
          text: 'Cancel',
          onClick: this.cancelSaveBlueprint.bind(this)
        }
      ]
    };
  }

  setSaveBlueprintName(saveBlueprintName: string): void {
    this.setState({ saveBlueprintName });
    this.props.dispatch(updateModalContent(this.getSaveBlueprintModalContent(saveBlueprintName)));
  }

  getDeleteBlueprintModalContent(blueprintID: number): ModalModel {
    const confirmDeleteBlueprint = (): void => {
      if (this.state.deleteBlueprintPromise) {
        this.state.deleteBlueprintPromise.cancel();
        this.setState({ deleteBlueprintPromise: null });
      }
      const deleteBlueprintPromise = game.building.deleteBlueprintAsync(blueprintID);
      this.setState({ deleteBlueprintPromise });
      deleteBlueprintPromise.finally(() => {
        this.setState({ deleteBlueprintPromise: null });
      });
      this.props.dispatch(hideModal());
    };
    return {
      title: 'Delete Blueprint',
      message: `Are you sure you wish to delete the blueprint (${game.building.blueprints[blueprintID].name})?`,
      buttons: [
        {
          text: 'Delete',
          onClick: confirmDeleteBlueprint.bind(this)
        },
        {
          text: 'Cancel',
          onClick: this.cancelDeleteBlueprint.bind(this)
        }
      ]
    };
  }

  cancelSaveBlueprint(): void {
    this.props.dispatch(hideModal());
  }

  saveBlueprint(): void {
    if (this.state.saveBlueprintPromise) {
      this.state.saveBlueprintPromise.cancel();
      this.setState({ saveBlueprintPromise: null });
    }
    const saveBlueprintPromise = game.building.createBlueprintFromSelectionAsync(this.state.saveBlueprintName);
    this.setState({ saveBlueprintPromise });
    saveBlueprintPromise.finally(() => {
      this.setState({ saveBlueprintPromise: null });
    });
    this.props.dispatch(hideModal());
  }

  cancelDeleteBlueprint(): void {
    this.props.dispatch(hideModal());
  }

  enableFlyMode(): void {
    game.sendSlashCommand('fly 1');
  }

  disableFlyMode(): void {
    game.sendSlashCommand('fly 0');
  }

  showPerfHUD(): void {
    game.sendSlashCommand('showPerfHUD 1');
  }

  hidePerfHud(): void {
    game.sendSlashCommand('showPerfHUD 0');
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    keybinds: state.keybinds
  };
};

const Build = connect(mapStateToProps)(ABuild);

export const WIDGET_NAME_BUILD = 'Build';
export const buildRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME_BUILD,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: -7.5
  },
  layer: HUDLayer.Menus,
  render: () => {
    return <Build />;
  }
};
