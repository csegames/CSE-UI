/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import {
  Vec3f,
  Euler3f,
  MoveItemRequestLocationType
} from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { MoveItemRequest, attemptItemMoves } from '../helpers/itemHelpers';
import { addConditionalWidgetExiting, toggleConditionalWidget } from '../redux/hudSlice';
import { WIDGET_ID_PLACEMENT } from '../components/Placement';
import { getStringFromTagAffixIDs } from '../helpers/tagHelpers';

export class BuildModeService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([
      clientAPI.bindItemPlacementModeChangedListener(this.handleItemPlacementModeChanged.bind(this)),
      clientAPI.bindItemPlacementCommitListener(this.handleItemPlacementCommit.bind(this))
    ]);

    return handles;
  }

  private handleItemPlacementModeChanged(isActive: boolean): void {
    if (!isActive) {
      this.dispatch(addConditionalWidgetExiting(WIDGET_ID_PLACEMENT));
    } else if (!this.reduxState.hud.activeConditionalWidgetIDs.includes(WIDGET_ID_PLACEMENT)) {
      this.dispatch(toggleConditionalWidget(WIDGET_ID_PLACEMENT));
    }
  }

  private handleItemPlacementCommit(
    itemInstanceID: string,
    position: Vec3f,
    rotation: Euler3f,
    actionID: string | null
  ): void {
    const localPlayer = this.reduxState.entities.self;
    const { primary: inventory, equipment, accountBank, stackSplit } = this.reduxState.inventory;

    if (actionID) {
      clientAPI.performItemAction(itemInstanceID, localPlayer.entityID, actionID, position, rotation, 0);
    } else {
      const move: MoveItemRequest = {
        MoveItemID: itemInstanceID,
        UnitCount: -1,
        EntityIDFrom: null,
        CharacterIDFrom: localPlayer.characterID,
        BoneAliasFrom: 0,
        LocationTo: MoveItemRequestLocationType.Ground,
        EntityIDTo: null,
        CharacterIDTo: null,
        PositionTo: -1,
        ContainerIDTo: null,
        DrawerIndexTo: 0,
        GearSlotIDTo: null,
        WorldPositionTo: position,
        RotationTo: rotation,
        BoneAliasTo: 0
      };

      const raceDef = this.reduxState.gameDefs.racesByNumericID[localPlayer.race];

      const tagStrings = Object.values(localPlayer.tags).map((tag) =>
        getStringFromTagAffixIDs(Object.values(tag.affixes), this.reduxState.gameDefs.tagAffixByNumericID)
      );

      attemptItemMoves(
        [move],
        inventory,
        equipment,
        accountBank,
        localPlayer.faction,
        raceDef,
        this.reduxState.gameDefs.classesByNumericID[localPlayer.classID],
        tagStrings,
        localPlayer.stats,
        stackSplit,
        this.reduxState.stringTable.stringTable,
        this.reduxState.gameDefs,
        this.dispatch
      );
    }
  }
}
