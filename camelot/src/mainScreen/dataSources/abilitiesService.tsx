/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import {
  AbilityStatus,
  ButtonLayout,
  AbilityGroup,
  AbilityEditStatus,
  AbilityStateFlags
} from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import {
  deleteAbilityButtonLayout,
  deleteAbilityGroup,
  updateAbility,
  updateAbilityActivated,
  UpdateAbilityActivatedParams,
  updateAbilityButtonLayout,
  updateAbilityEditStatus,
  updateAbilityGroup
} from '../redux/abilitiesSlice';
import { LoadingTopic, setInitialized } from '../redux/loadingSlice';
import { HUDLayer, HUDWidgetRegistration, setSelectedWidget } from '../redux/hudSlice';
import { registerHUDWidget } from './hudService';
import { AbilityBar } from '../components/abilityBars/AbilityBar';
import {
  HUDHorizontalAnchor,
  HUDVerticalAnchor,
  HUDWidgetState
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { addPopUpAnnouncement, hidePopUpAnnouncements } from '../redux/popUpAnnouncementsSlice';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';

// String IDs
const StringIDPopUpAnnouncementAbilityFailCooldown = 'PopUpAnnouncementAbilityFailCooldown';

export class AbilitiesService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([
      clientAPI.bindAbilityActivatedListener(this.handleAbilityActivated.bind(this)),
      clientAPI.bindAbilityEditStatusListener(this.handleAbilityEditStatusUpdated.bind(this)),
      clientAPI.bindAbilityGroupUpdatedListener(this.handleAbilityGroupUpdated.bind(this)),
      clientAPI.bindAbilityGroupDeletedListener(this.handleAbilityGroupDeleted.bind(this)),
      clientAPI.bindAbilityStatusUpdatedListener(this.handleAbilityStatusUpdated.bind(this)),
      clientAPI.bindButtonLayoutUpdatedListener(this.handleButtonLayoutUpdated.bind(this)),
      clientAPI.bindButtonLayoutDeletedListener(this.handleButtonLayoutDeleted.bind(this))
    ]);

    // Have to make sure we're registered for ability events before the client starts
    // sending those events!
    this.dispatch(setInitialized({ topic: LoadingTopic.Abilities, result: true }));

    return handles;
  }

  private handleAbilityActivated(abilityId: number): void {
    // The game client just tells us that an ability was activated.  We need to track
    // the activation time so we can display cooldowns, etc.
    const params: UpdateAbilityActivatedParams = {
      abilityId,
      timestamp: new Date()
    };
    this.dispatch(updateAbilityActivated(params));
    const ability = this.reduxState.abilities.abilities[abilityId];
    if (ability.state & AbilityStateFlags.Cooldown) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_COOLDOWN);
      this.dispatch(hidePopUpAnnouncements());
      this.dispatch(
        addPopUpAnnouncement([
          getStringTableValue(StringIDPopUpAnnouncementAbilityFailCooldown, this.reduxState.stringTable.stringTable),
          '#f60000'
        ])
      );
    } else if (ability.disabledReason) {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_FAILURE);
      this.dispatch(hidePopUpAnnouncements());
      this.dispatch(addPopUpAnnouncement([ability.disabledReason, '#f60000']));
    } else {
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_CLICK);
    }
  }

  private handleAbilityEditStatusUpdated(newStatus: AbilityEditStatus): void {
    this.dispatch(updateAbilityEditStatus(newStatus));
    // If editing was turned off, we need to clear the last widget selected
    // in the HUDEditor.
    if (!newStatus.canEdit) {
      this.dispatch(setSelectedWidget(null));
    }
  }

  private handleButtonLayoutUpdated(layout: ButtonLayout): void {
    this.dispatch(updateAbilityButtonLayout(layout));

    // HUD Widgets are part of the Initialization system, so they are guaranteed to have loaded from local
    // storage before we get here.  That means we can safely tell if any events are for "new" ButtonLayouts.

    // The client will send us an update event for every layout post-init.  When that happens, we register
    // the layouts with the HUD Widget system, which allows us to set a default position.

    let id: string = `Bar: Abilities ${layout.id}`;
    let nameStringID = 'HUDEditorWidgetNameBarAbilities';
    let nameStringTokens = { LAYOUT_ID: String(layout.id) };

    // If this layout has not yet been registered with the HUD, register it!
    if (!this.reduxState.hud.widgets[id] || !this.reduxState.hud.widgets[id].registration) {
      let defaults: HUDWidgetState = {
        xAnchor: HUDHorizontalAnchor.Center,
        yAnchor: HUDVerticalAnchor.Bottom,
        yOffset: 3.75
      };

      if (layout.id >= 1) {
        defaults.yOffset += (layout.id - 1) * 6;
      } else if (layout.id === -3) {
        id = 'Bar: Dynamic Abilities';
        nameStringID = 'HUDEditorWidgetNameBarDynamicAbilities';
        nameStringTokens = undefined;
        defaults.yOffset += 12;
      } else if (layout.id === -2) {
        id = 'Bar: Siege Engine';
        nameStringID = 'HUDEditorWidgetNameBarSiegeEngine';
        nameStringTokens = undefined;
      } else if (layout.id === -1) {
        id = 'Bar: Build Mode';
        nameStringID = 'HUDEditorWidgetNameBarBuildMode';
        nameStringTokens = undefined;
      }

      const registry: HUDWidgetRegistration = {
        id,
        nameStringID,
        nameStringTokens,
        defaults,
        requiresGameDefsLoaded: true,
        layer: HUDLayer.HUD,
        render: (isDragCopy: boolean) => {
          return <AbilityBar isDragCopy={isDragCopy} layoutId={layout.id} widgetId={id} />;
        }
      };
      registerHUDWidget(registry);
    }
  }

  private handleButtonLayoutDeleted(layoutID: number): void {
    this.dispatch(deleteAbilityButtonLayout(layoutID));
  }

  private handleAbilityGroupUpdated(group: AbilityGroup): void {
    this.dispatch(updateAbilityGroup(group));
  }

  private handleAbilityGroupDeleted(groupID: number): void {
    this.dispatch(deleteAbilityGroup(groupID));
  }

  private handleAbilityStatusUpdated(status: AbilityStatus): void {
    this.dispatch(updateAbility(status));
  }
}
