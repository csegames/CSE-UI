/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import {
  shardCharactersQuery,
  ShardCharactersQueryResult,
  charactersSubscription,
  CharactersSubscriptionResult,
  CharacterRestrictionsSubscriptionResult,
  characterRestrictionsSubscription
} from './charactersNetworkingConstants';
import {
  removeCharacter,
  selectCharacter,
  startCharacterCreation,
  updateCharacter,
  updateCharacters,
  updateRestrictions
} from '../redux/charactersSlice';
import { LoadingTopic } from '../redux/loadingSlice';
import {
  CharacterRemovedUpdate,
  CharacterUpdate,
  PatcherCharacterUpdateType
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { setUIFactionID } from '../redux/hudSlice';
import { cacheImagesForFaction } from '../helpers/imageCacheHelpers';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { WithWebInterface } from '../redux/withWebInterface';

export class CharactersService extends WithWebInterface(ExternalDataSource) {
  protected async bind(): Promise<ListenerHandle[]> {
    const handles = Promise.resolve([
      await this.query<ShardCharactersQueryResult>(
        { query: shardCharactersQuery },
        this.handleShardCharacters.bind(this),
        LoadingTopic.ShardCharacters
      ),
      await this.subscribe<CharactersSubscriptionResult>(
        { query: charactersSubscription },
        this.handleCharactersSubscriptionUpdate.bind(this)
      ),
      await this.subscribe<CharacterRestrictionsSubscriptionResult>(
        { query: characterRestrictionsSubscription },
        this.handleCharacterSubscriptionsRestrictionsUpdate.bind(this)
      )
    ]);

    return handles;
  }

  private handleShardCharacters(result: ShardCharactersQueryResult): void {
    this.dispatch(updateCharacters(result.shardCharacters));
    this.dispatch(updateRestrictions(result.characterRestrictions));
    if (result.shardCharacters.length === 0) {
      this.dispatch(startCharacterCreation());
    } else {
      this.selectRecentCharacter();
    }
  }

  private handleCharactersSubscriptionUpdate(result: CharactersSubscriptionResult): void {
    switch (result.characterUpdates.type) {
      case PatcherCharacterUpdateType.Updated:
        const charUpdate = result.characterUpdates as CharacterUpdate;
        this.dispatch(updateCharacter(charUpdate.character));
        this.dispatch(selectCharacter(charUpdate.character.id));
        break;
      case PatcherCharacterUpdateType.Removed:
        const charaRemoved = result.characterUpdates as CharacterRemovedUpdate;
        this.dispatch(removeCharacter(charaRemoved.characterID));
        if (this.reduxState.characters.selectedCharacterID === charaRemoved.characterID) {
          this.selectRecentCharacter();
        }
        break;
    }
  }

  private handleCharacterSubscriptionsRestrictionsUpdate(result: CharacterRestrictionsSubscriptionResult): void {
    this.dispatch(updateRestrictions(result.characterRestrictions));
  }

  private selectRecentCharacter(): void {
    const recentCharacter = [...this.reduxState.characters.characters].sort((a, b) => {
      const dateA = new Date(a.lastLogin);
      const dateB = new Date(b.lastLogin);
      return dateB.getTime() - dateA.getTime();
    })[0];
    this.dispatch(selectCharacter(recentCharacter?.id ?? null));
    if (recentCharacter) {
      clientAPI.pauseAllPaperDollExcept(recentCharacter.name);
      this.dispatch(setUIFactionID(recentCharacter.factionID));
      cacheImagesForFaction(recentCharacter.factionID);
    }
  }
}
