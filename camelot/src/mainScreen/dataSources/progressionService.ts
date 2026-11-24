/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ProgressState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { showToaster } from '../redux/toastersSlice';
import { updateTrackedProgressionTrackIDs, updateTradeskillTrackerMinimized } from '../redux/tradeskillTrackerSlice';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralUnlocked
} from '../helpers/stringTableHelpers';
import { getTrackDisplayLevel, isArchetypeTrack } from '../helpers/abilityBookHelpers';
import { isNotificationWidgetHidden } from '../components/NotificationToasts';

const StringIDProgressionNewLevelMessage = 'ProgressionNewLevelMessage';
const StringIDProgressionNotificationLevelUp = 'ProgressionNotificationLevelUp';
const StringIDProgressionAbilityPointGained = 'ProgressionAbilityPointGained';

// Level-up and ability-unlock toasts are raised here so they don't depend on any widget being shown.
export class ProgressionService extends ExternalDataSource {
  private lastCharacterID: string = '';
  private lastProgression: Record<string, ProgressState> = {};

  protected override bind(): Promise<ListenerHandle[]> {
    this.dispatch(updateTradeskillTrackerMinimized(clientAPI.getTradeskillTrackerMinimized()));

    return Promise.resolve([
      clientAPI.bindTrackedProgressionTracksChangedListener((characterID, trackIDs) => {
        if (characterID === this.reduxState.entities.self.characterID) {
          this.dispatch(updateTrackedProgressionTrackIDs(trackIDs));
        }
      }),
      clientAPI.bindTradeskillTrackerMinimizedChangedListener((isMinimized) => {
        this.dispatch(updateTradeskillTrackerMinimized(isMinimized));
      })
    ]);
  }

  protected onReduxUpdate = (): void => {
    const self = this.reduxState.entities.self;
    if (self.progression === this.lastProgression) {
      return;
    }
    const isSameCharacter = self.characterID === this.lastCharacterID;
    const oldProgression = this.lastProgression;
    // Updated before dispatching, since dispatching re-enters this subscriber.
    this.lastCharacterID = self.characterID;
    this.lastProgression = self.progression;

    if (!isSameCharacter) {
      this.dispatch(updateTrackedProgressionTrackIDs(clientAPI.getTrackedProgressionTrackIDs(self.characterID)));
    } else if (!isNotificationWidgetHidden(this.reduxState, 'level')) {
      this.notifyLevelUps(oldProgression, self.progression);
    }
  };

  private notifyLevelUps(
    oldProgression: Record<string, ProgressState>,
    newProgression: Record<string, ProgressState>
  ): void {
    const { gameDefs } = this.reduxState;
    const stringTable = this.reduxState.stringTable.stringTable;

    for (const prog of Object.values(newProgression)) {
      const oldLevel = oldProgression[prog.id]?.level;
      const track = gameDefs.progressionTracks[prog.id];
      if (oldLevel === undefined || prog.level <= oldLevel || !track) {
        continue;
      }

      // Only the archetype/character track grants a new ability point; spending one on a
      // specialization track also raises its level, but isn't a gain.
      const isArchetype = isArchetypeTrack(track);
      const displayLevel = getTrackDisplayLevel(track, prog.level);
      this.dispatch(
        showToaster({
          id: `LevelUp${prog.id}`,
          content: {
            // Same layout as the quest toasts: eyebrow banner over an icon + title row.
            eyebrow: getStringTableValue(StringIDProgressionNotificationLevelUp, stringTable),
            titleIconURL: track.iconURL,
            title: getStringTableValue(track.nameKey, stringTable),
            message: getTokenizedStringTableValue(StringIDProgressionNewLevelMessage, stringTable, {
              LEVEL: displayLevel.toFixed(0)
            }),
            rewards: isArchetype
              ? [{ name: getStringTableValue(StringIDProgressionAbilityPointGained, stringTable) }]
              : undefined,
            isSmall: true
          },
          position: 'level',
          soundEvent: SoundEvents.PLAY_UI_SPECIALIZATION_UP
        })
      );

      Object.entries(track.abilityUnlocks).forEach(([abilityID, unlockAtLevel]) => {
        if (unlockAtLevel !== prog.level) {
          return;
        }
        const ability = gameDefs.abilityDisplayDefsByStringID[abilityID];
        if (!ability) {
          return;
        }
        this.dispatch(
          showToaster({
            id: `AbilityUnlock${ability.id}`,
            content: {
              eyebrow: getStringTableValue(StringIDGeneralUnlocked, stringTable),
              titleIconURL: ability.iconURL,
              title: ability.name,
              isSmall: true
            },
            position: 'level',
            soundEvent: SoundEvents.PLAY_UI_ABILITY_LEVEL_UP
          })
        );
      });
    }
  }
}
