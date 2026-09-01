/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { CraftingStationData } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { EntityID } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import { toggleConditionalWidget } from '../redux/hudSlice';
import { WIDGET_ID_CRAFTING } from '../components/crafting/Crafting';
import { CraftingData, updateCraftingData, updateCraftingStationData } from '../redux/craftingSlice';
import { ModalModel, showModal } from '../redux/modalsSlice';
import { getStringTableValue, StringIDGeneralError } from '../helpers/stringTableHelpers';

export class CraftingService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([
      clientAPI.bindCraftingUpdatedListener(this.handleCraftingUpdated.bind(this)),
      clientAPI.bindCraftingOpenedListener(this.handleCraftingOpened.bind(this)),
      clientAPI.bindCraftingErrorListener(this.handleCraftingError.bind(this))
    ]);

    return handles;
  }

  private handleCraftingUpdated(craftingData: CraftingData): void {
    this.dispatch(updateCraftingData(craftingData));
  }

  private handleCraftingOpened(
    craftingStationEntityID: EntityID,
    craftingStationItemDefID: number,
    craftingStationItemInstanceID: string
  ): void {
    let craftingStationData: CraftingStationData = {
      entityID: craftingStationEntityID,
      numericItemDefID: craftingStationItemDefID,
      itemInstanceID: craftingStationItemInstanceID
    };

    // Store the data about the interacted crafting station, then toggle the widget.
    this.dispatch(updateCraftingStationData(craftingStationData));
    this.dispatch(toggleConditionalWidget(WIDGET_ID_CRAFTING));
  }

  private handleCraftingError(locKey: string): void {
    // Show an error modal popup.
    const content: ModalModel = {
      title: getStringTableValue(StringIDGeneralError, this.reduxState.stringTable.stringTable),
      // Error codes are mapped to loc keys in ModifyVoxJobResult.cs' getErrorForClient()
      message: getStringTableValue(locKey, this.reduxState.stringTable.stringTable)
    };
    this.dispatch(showModal({ id: `CraftingError`, content, maxWidth: '38vmin' }));
  }
}
