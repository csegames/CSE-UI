/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ExternalDataSource from '../redux/externalDataSource';
import { profileQuery, ProfileQueryResult } from './profileNetworkingConstants';
import {
  updateProfile,
  updateOwnedPerks,
  updateSelectedRuneMods,
  markProfileRefreshStarted,
  endProfileRefresh
} from '../redux/profileSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { InitTopic } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { RootState } from '../redux/store';
import { calculateSelectedRuneMods } from '../helpers/perkUtils';
import { Dispatch } from 'redux';

export class ProfileService extends ExternalDataSource {
  private refreshHandle: ListenerHandle = null;

  protected async bind(): Promise<ListenerHandle[]> {
    return [
      await this.query<ProfileQueryResult>({ query: profileQuery }, this.handleProfile.bind(this), InitTopic.Profile),
      this.onInitialize(this.refresh.bind(this))
    ];
  }

  private handleProfile(result: ProfileQueryResult): void {
    if (
      !result.colossusProfile ||
      !Array.isArray(result.colossusProfile.champions) ||
      !Array.isArray(result.colossusProfile.lifetimeStats)
    ) {
      console.warn('Missing data, colossusProfile, colossusProfile champions, colossusProfile lifetimeStats query');
      return;
    }

    // Precalculate to avoid expensive lookups all over the place.
    const ownedPerks: Dictionary<number> = {};
    result.colossusProfile?.perks?.forEach((p) => {
      ownedPerks[p.id] = p.qty;
    });
    this.dispatch(updateOwnedPerks(ownedPerks));

    // this function gets called from multiple sevices, but will only be made after both the
    // perks and profile has loaded.
    const selectedRuneMods = calculateSelectedRuneMods(
      this.reduxState.store.perksByID,
      result.colossusProfile.champions
    );
    this.dispatch(updateSelectedRuneMods(selectedRuneMods));

    // We want to do this one last because it sets the 'isProfileFetched' flag.
    this.dispatch(updateProfile(result.colossusProfile));
    this.refreshHandle?.close();

    if (this.reduxState.profile.onProfileRefreshes) {
      this.reduxState.profile.onProfileRefreshes.forEach((onProfileRefresh) => {
        onProfileRefresh();
      });
      this.dispatch(endProfileRefresh());
    }
  }

  protected onReduxUpdate(reduxState: RootState, dispatch: Dispatch): void {
    super.onReduxUpdate(reduxState, dispatch);
    if (reduxState.profile.shouldProfileRefresh) {
      this.refresh();
    }
  }

  private async refresh(): Promise<void> {
    this.dispatch(markProfileRefreshStarted());
    this.refreshHandle?.close();
    this.refreshHandle = await this.query<ProfileQueryResult>(
      { query: profileQuery },
      this.handleProfile.bind(this),
      InitTopic.Profile
    );
  }
}
