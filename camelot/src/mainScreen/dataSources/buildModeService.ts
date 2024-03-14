/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';
import {
  Vec3f,
  Euler3f,
  ItemAPI,
  MoveItemRequest,
  MoveItemRequestLocationType
} from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { webConf } from './networkConfiguration';
import { attemptItemMoves } from '../components/items/itemUtils';
import { BuildingMode } from '@csegames/library/dist/_baseGame/types/Building';
import { addMenuWidgetExiting, toggleMenuWidget } from '../redux/hudSlice';
import { WIDGET_NAME_BUILD } from '../components/Build';
import { WIDGET_NAME_PLACEMENT } from '../components/Placement';
import { WIDGET_NAME_OPEN_BUILD } from '../components/OpenBuild';
import { game } from '@csegames/library/dist/_baseGame';

export class BuildModeService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([
      clientAPI.bindBuildingModeChangedListener(this.handleBuildingModeChanged.bind(this)),
      clientAPI.bindItemPlacementModeChangedListener(this.handleItemPlacementModeChanged.bind(this)),
      clientAPI.bindItemPlacementCommitListener(this.handleItemPlacementCommit.bind(this))
    ]);

    return handles;
  }

  private handleBuildingModeChanged(mode: BuildingMode): void {
    if (mode === BuildingMode.NotBuilding) {
      game.itemPlacementMode.requestCancel();
      this.dispatch(addMenuWidgetExiting(WIDGET_NAME_BUILD));
      this.dispatch(addMenuWidgetExiting(WIDGET_NAME_OPEN_BUILD));
    } else if (!this.reduxState.hud.activeMenuIds.includes(WIDGET_NAME_BUILD)) {
      this.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_BUILD, escapableId: WIDGET_NAME_BUILD }));
    }
  }

  private handleItemPlacementModeChanged(isActive: boolean): void {
    if (!isActive) {
      this.dispatch(addMenuWidgetExiting(WIDGET_NAME_PLACEMENT));
    } else if (!this.reduxState.hud.activeMenuIds.includes(WIDGET_NAME_PLACEMENT)) {
      this.dispatch(toggleMenuWidget({ widgetId: WIDGET_NAME_PLACEMENT, escapableId: WIDGET_NAME_PLACEMENT }));
    }
  }

  private handleItemPlacementCommit(
    itemInstanceID: string,
    position: Vec3f,
    rotation: Euler3f,
    actionID: string | null
  ): void {
    if (actionID) {
      ItemAPI.PerformItemAction(webConf, itemInstanceID, this.reduxState.player.entityID, actionID, {
        BoneAlias: undefined,
        Rotation: rotation,
        SelectedItemID: undefined,
        WorldPosition: position
      });
    } else {
      const move: MoveItemRequest = {
        MoveItemID: itemInstanceID,
        StackHash: '00000000000000000000000000000000',
        UnitCount: -1,
        From: {
          BoneAlias: undefined,
          BuildingID: undefined,
          CharacterID: this.reduxState.player.characterID,
          ContainerID: '0000000000000000000000',
          DrawerID: undefined,
          EntityID: '0000000000000000000000',
          GearSlotIDs: [],
          Location: MoveItemRequestLocationType.Inventory,
          Position: -1,
          Rotation: undefined,
          VoxSlot: 'Invalid',
          WorldPosition: undefined
        },
        To: {
          BoneAlias: undefined,
          BuildingID: undefined,
          CharacterID: '0000000000000000000000',
          ContainerID: '0000000000000000000000',
          DrawerID: undefined,
          EntityID: '0000000000000000000000',
          GearSlotIDs: [],
          Location: MoveItemRequestLocationType.Ground,
          Position: -1,
          Rotation: rotation,
          VoxSlot: 'Invalid',
          WorldPosition: position
        }
      };

      const raceId = this.reduxState.player.race;
      const raceDef = this.reduxState.gameDefs.racesByNumericID[raceId];

      attemptItemMoves(
        [move],
        this.reduxState.inventory.items,
        this.reduxState.equippedItems.items,
        this.reduxState.player.faction,
        raceDef,
        this.reduxState.gameDefs.classesByNumericID[this.reduxState.player.classID],
        raceDef?.raceTags ?? [],
        this.reduxState.gameDefs.myStats,
        this.reduxState.inventory.inventoryPendingRefreshes,
        this.reduxState.equippedItems.equippedItemsPendingRefreshes,
        this.reduxState.inventory.stackSplit,
        this.dispatch
      );
    }
  }
}
