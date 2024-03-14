/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { storeStaticDataQuery, StoreStaticDataQueryResult } from './storeNetworkingConstants';
import {
  updateStoreHasPurchasables,
  updateStoreNewEquipment,
  updateStoreNewPurchases,
  updateStorePerksByID,
  updateStoreRMTCurrencies,
  updateStoreStaticData
} from '../redux/storeSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from 'redux';
import { RootState } from '../redux/store';
import { isPurchaseable } from '../helpers/storeHelpers';
import { storeLocalStore } from '../localStorage/storeLocalStorage';
import { PerkDefGQL, PerkType } from '@csegames/library/dist/hordetest/graphql/schema';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { InitTopic } from '../redux/initializationSlice';
import { updateRuneModDisplay, updateRuneModLevels } from '../redux/runesSlice';
import { calculateSelectedRuneMods } from '../helpers/perkUtils';
import { updateSelectedRuneMods } from '../redux/profileSlice';

export class StoreNetworkingService extends ExternalDataSource {
  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<StoreStaticDataQueryResult>(
        { query: storeStaticDataQuery },
        this.handleStaticDataQueryResult.bind(this),
        InitTopic.Store
      )
    ];
  }

  private handleStaticDataQueryResult(result: StoreStaticDataQueryResult): void {
    // Validate the result.
    if (!result?.game?.purchases || !result?.game?.runeModLevels || !result?.game?.perks) {
      console.warn('Received invalid static data from Store fetch.');
      return;
    }

    // Make it easy to find perks by ID
    const perksByID: Dictionary<PerkDefGQL> = {};
    for (const perk of result.game.perks) {
      perksByID[perk.id] = perk;
    }

    // Calculate which Purchases are "new" so we can badge the Store UI.
    const seenPurchases = storeLocalStore.getSeenPurchases();
    const newPurchases: Dictionary<boolean> = {};

    if (seenPurchases === undefined) {
      // This path is handled in the 'oneTimeBadgingLogic' function, as it has dependencies
      // on other reducers.
    } else {
      // Add any unseen purchases to the 'new' list.
      // They may not result in a badge if the unseen purchases are locked and thus would not
      // appear in the store UI.
      for (const purchase of result.game.purchases) {
        if (!seenPurchases[purchase.id]) {
          newPurchases[purchase.id] = true;
        }
      }
    }

    // Build the list of currencies that can be purchased via RMT.
    const rmtCurrencyIds: Dictionary<boolean> = {};
    for (const rMTPurchase of result.game.rMTPurchases) {
      for (const grant of rMTPurchase.perks) {
        const perk = perksByID[grant.perkID];
        if (perk && perk.perkType === PerkType.Currency) {
          rmtCurrencyIds[grant.perkID] = true;
        }
      }
    }

    // Calculate if there are any new Rewards
    let hasPurchasables: boolean = false;
    for (const purchase of result.game.purchases) {
      if (isPurchaseable(purchase, perksByID, this.reduxState.profile.ownedPerks)) {
        hasPurchasables = true;
        break;
      }
    }

    this.dispatch(updateStoreRMTCurrencies(rmtCurrencyIds));
    this.dispatch(updateStoreNewPurchases(newPurchases));
    this.dispatch(updateStorePerksByID(perksByID));
    this.dispatch(updateStoreHasPurchasables(hasPurchasables));

    // We want to do this one last because it sets the 'isDataFetched' flag.
    this.dispatch(updateStoreStaticData(result));

    // Send over the runeModLevels and defaultRuneGauge now
    this.dispatch(updateRuneModLevels(result.game.runeModLevels));
    this.dispatch(updateRuneModDisplay(result.game.runeModDisplay));

    // this function gets called from multiple sevices, but will only be made after both the
    // perks and profile has loaded.
    this.dispatch(updateSelectedRuneMods(calculateSelectedRuneMods(perksByID, this.reduxState.profile?.champions)));
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    // We are overriding this function so we can make sure Store and Profile are both loaded before we run the
    // badging logic.
    super.onReduxUpdate(reduxState, dispatch);

    // The oneTimeBadgingLogic function pointer erases itself once its work is done.
    if (this.oneTimeBadgingLogic) {
      this.oneTimeBadgingLogic();
    }
  }

  // This is deliberately a function pointer because we are changing it in onReduxUpdate().
  private oneTimeBadgingLogic = () => {
    // We need the store data AND the ownedPerks data in order to do these calculations, so make sure they are
    // both fresh before we start.
    if (this.reduxState.store.isDataFetched && this.reduxState.profile.isProfileFetched) {
      this.calculateNewPurchases();
      this.initializeUnseenEquipment();

      // This logic only needs to run once per session, so clear the function pointer to save processor cycles.
      this.oneTimeBadgingLogic = null;
    }
  };

  private calculateNewPurchases(): void {
    // If there are no seen purchases, then this is the first login.
    let seenPurchases = storeLocalStore.getSeenPurchases();
    if (seenPurchases === undefined) {
      seenPurchases = {};
      const newPurchases: Dictionary<boolean> = {};
      this.reduxState.store.purchases.forEach((purchase) => {
        if (
          isPurchaseable(purchase, this.reduxState.store.perksByID, this.reduxState.profile.ownedPerks) ||
          this.reduxState.profile.ownedPerks[purchase.perks[0].perkID]
        ) {
          // "Purchaseable" means the item can show up in the store.  On first launch we do not want to drown
          // our users in badges, so we mark everything in the initial Store state as seen.
          // Also, if you already own something, it will never count as 'new'.
          seenPurchases[purchase.id] = true;
        } else {
          // Unpurchaseable items (e.g. a timed sale that hasn't started yet) get marked as "new" for this session
          // because they may be unlocked later during the session at which point we should badge for them.
          newPurchases[purchase.id] = true;
        }
      });
      // The "new" list just goes into Redux, since it gets recalculated every session.
      this.dispatch(updateStoreNewPurchases(newPurchases));
    } else {
      // If you acquired something, Purchases for it shouldn't count as New anymore.
      this.reduxState.store.purchases.forEach((purchase) => {
        if (this.reduxState.profile.ownedPerks[purchase.perks[0].perkID]) {
          seenPurchases[purchase.id] = true;
        }
      });
    }
    // Store the "seen" list locally so we will remember across sessions.
    storeLocalStore.setSeenPurchases(seenPurchases);
  }

  private initializeUnseenEquipment(): void {
    // If we had any unseen equipment from previous sessions, feed it into Redux.
    let unseenEquipment = storeLocalStore.getUnseenEquipment();
    if (unseenEquipment === undefined) {
      // Make sure local storage for this is initialized.
      storeLocalStore.setUnseenEquipment({});
    } else {
      // If the user no longer owns a perk we thought was new, then they probably sold it before looking at it.
      // No need to keep track of it any longer.
      const idsToPrune: string[] = [];
      Object.keys(unseenEquipment).forEach((perkID) => {
        if (
          this.reduxState.profile.ownedPerks[perkID] === undefined ||
          this.reduxState.profile.ownedPerks[perkID] < 1
        ) {
          idsToPrune.push(perkID);
        }
      });
      idsToPrune.forEach((perkID) => {
        delete unseenEquipment[perkID];
      });

      storeLocalStore.setUnseenEquipment(unseenEquipment);
    }

    this.dispatch(updateStoreNewEquipment(unseenEquipment || {}));
  }
}
