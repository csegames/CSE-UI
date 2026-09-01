/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ChampionGQL, PurchaseDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { Dispatch } from '@reduxjs/toolkit';
import { updateStoreChampionIDFilters, updateStoreHideOwnedPurchases } from '../../../../redux/storeSlice';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { StringTableEntryDef } from '../../../../dataSources/manifest/stringTableManifest';
import { PerkDef } from '../../../../dataSources/manifest/perkManifest';
import { CostumeDef } from '../../../../dataSources/manifest/costumeManifest';
import { ChampionDef } from '../../../../dataSources/manifest/championManifest';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Root = 'StartScreen-Store-Filters-Root';
const ChampionRow = 'StartScreen-Store-Filters-ChampionRow';
const ChampionName = 'StartScreen-Store-Filters-ChampionName';
const ChampionPortrait = 'StartScreen-Store-Filters-ChampionPortrait';
const Checkbox = 'StartScreen-Store-Filters-Checkbox';
const Separator = 'StartScreen-Store-Filters-Separator';

const StringIDStoreHideOwned = 'StoreHideOwned';

interface ReactProps {
  purchases: PurchaseDefGQL[];
}

interface InjectedProps {
  dispatch?: Dispatch;
  stringTable: Dictionary<StringTableEntryDef>;
  perksByID: Dictionary<PerkDef>;
  champions: ChampionDef[];
  championIDToChampion: Dictionary<ChampionDef>;
  championCostumes: CostumeDef[];
  profileChampions: ChampionGQL[];
  championIDFilters: string[];
  hideOwnedPurchases: boolean;
}

type Props = ReactProps & InjectedProps;

class AStoreFilters extends React.Component<Props> {
  render(): JSX.Element {
    // If the purchase list doesn't include any unique perks, then the filter is irrelevant.
    const hasUniquePerks = !!this.props.purchases.find((purchase) => {
      return !!purchase.perks.find((prd) => {
        return this.props.perksByID[prd.perkID]?.isUnique;
      });
    });
    if (!hasUniquePerks) {
      return null;
    }

    const championList = this.getChampionList();
    const checkStyle = this.props.hideOwnedPurchases ? 'checked' : '';

    return (
      <div className={Root}>
        {
          // If there are no champion-specific perks in the purchase list, then we don't need to show the champion filter.
          championList.length > 0 && (
            <>
              {championList.map(this.renderChampionRow.bind(this))}
              <div className={Separator} />
            </>
          )
        }
        <div
          className={ChampionRow}
          onClick={this.onHideOwnedClick.bind(this)}
          onMouseEnter={this.onMouseEnterCheckbox.bind(this)}
        >
          <div className={`${Checkbox} ${checkStyle}`} />
          <div className={ChampionName}>{getStringTableValue(StringIDStoreHideOwned, this.props.stringTable)}</div>
        </div>
      </div>
    );
  }

  private renderChampionRow(champion: ChampionDef, index: number): React.ReactNode {
    const checkStyle = this.props.championIDFilters.includes(champion.id) ? 'checked' : '';

    return (
      <div
        className={ChampionRow}
        key={index}
        onClick={this.onChampionFilterClick.bind(this, champion)}
        onMouseEnter={this.onMouseEnterCheckbox.bind(this)}
      >
        <div className={`${Checkbox} diamond ${checkStyle}`} />
        <div className={ChampionName}>{champion.name}</div>
        <img className={ChampionPortrait} src={this.getChampionPortraitURL(champion)} />
      </div>
    );
  }

  private onMouseEnterCheckbox(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_MAINMENU_MOUSEOVER);
  }

  private onHideOwnedClick(): void {
    this.props.dispatch?.(updateStoreHideOwnedPurchases(!this.props.hideOwnedPurchases));
    clientAPI.playGameSound(SoundEvents.PLAY_UI_STOREMENU_CHARACTER_SELECT);
  }

  private onChampionFilterClick(champion: ChampionDef): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_STOREMENU_CHARACTER_SELECT);
    let filters: string[] = [...this.props.championIDFilters];
    if (filters.includes(champion.id)) {
      filters = filters.filter((cid) => cid !== champion.id);
    } else {
      filters.push(champion.id);
    }
    this.props.dispatch?.(updateStoreChampionIDFilters(filters));
  }

  private getChampionPortraitURL(champion: ChampionDef): string {
    const championGQL = this.props.profileChampions.find((c) => {
      return c.championID === champion.id;
    });
    const allCostumesForChampion: CostumeDef[] = this.props.championCostumes.filter((costume: CostumeDef) => {
      return costume.requiredChampionID === champion.id;
    });

    const costumePerk = this.props.perksByID[championGQL?.costumePerkID];

    const equippedCostume = allCostumesForChampion.find((costume) => {
      return costume.id === costumePerk?.costumeID;
    });

    return equippedCostume?.thumbnailURL ?? '';
  }

  private getChampionList(): ChampionDef[] {
    const champions: Dictionary<ChampionDef> = {};

    this.props.purchases.forEach((purchase) => {
      purchase.perks.forEach((p) => {
        const perk = this.props.perksByID[p.perkID];
        if (perk.championID) {
          champions[perk.championID] = this.props.championIDToChampion[perk.championID];
        }
      });
    });

    const sortedChampions: ChampionDef[] = [];
    // `ChampionSelect` uses the order provided by championInfo.champions, so we are matching that here.
    this.props.champions.forEach((ci) => {
      if (champions[ci.id]) {
        sortedChampions.push(champions[ci.id]);
      }
    });

    return sortedChampions;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { perksByID, championIDFilters, hideOwnedPurchases } = state.store;
  const { champions, championCostumes, championIDToChampion } = state.championInfo;

  return {
    ...ownProps,
    stringTable,
    perksByID,
    champions,
    championIDToChampion,
    championCostumes,
    profileChampions: state.profile.champions,
    championIDFilters,
    hideOwnedPurchases
  };
}

export const StoreFilters = connect(mapStateToProps)(AStoreFilters);
