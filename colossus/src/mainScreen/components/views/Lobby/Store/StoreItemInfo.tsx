/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { PurchaseDefGQL, ChampionGQL, PerkDefGQL, CostDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { RootState } from '../../../../redux/store';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue, getTokenizedStringTableValue } from '../../../../helpers/stringTableHelpers';
import {
  BUX_PERK_ID,
  OwnershipStatus,
  PurchaseOwnershipData,
  getFinalPurchaseCost,
  getPurchaseOwnershipData,
  isFreeReward
} from '../../../../helpers/storeHelpers';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { PerkIcon } from './PerkIcon';

const Root = 'StartScreen-Store-StoreItemInfo-Root';
const Name = 'StartScreen-Store-StoreItemInfo-Name';
const BundleCount = 'StartScreen-Store-StoreItemInfo-BundleCount';
const BonusText = 'StartScreen-Store-StoreItemInfo-BonusText';
const StatusFree = 'StartScreen-Store-StoreItemInfo-StatusFree';
const StatusOwned = 'StartScreen-Store-StoreItemInfo-StatusOwned';
const CostRow = 'StartScreen-Store-StoreItemInfo-CostRow';
const CostFinal = 'StartScreen-Store-StoreItemInfo-CostFinal';
const CostOriginal = 'StartScreen-Store-StoreItemInfo-CostOriginal';
const CostName = 'StartScreen-Store-StoreItemInfo-CostName';
const CostIcon = 'StartScreen-Store-StoreItemInfo-CostIcon';

const StringIDStoreFree = 'StoreFree';
const StringIDStoreOwned = 'StoreOwned';
const StringIDStoreBundleCount = 'StoreBundleCount';
const StringIDStoreBundleCountAndOwned = 'StoreBundleCountAndOwned';

interface ReactProps {
  purchase: PurchaseDefGQL;
}

interface InjectedProps {
  champions: ChampionGQL[];
  perksByID: Dictionary<PerkDefGQL>;
  ownedPerks: Dictionary<number>;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AStoreItemInfo extends React.Component<Props> {
  render(): JSX.Element {
    const ownershipData = getPurchaseOwnershipData(this.props.purchase, this.props.perksByID, this.props.ownedPerks);

    return (
      <div className={Root}>
        {(this.props.purchase.bonusDescription?.length ?? 0) > 0 && (
          <div className={BonusText}>{this.props.purchase.bonusDescription}</div>
        )}
        <div className={Name}>{this.getPackageTitle(ownershipData)}</div>
        {this.props.purchase.perks.length > 1 && <div className={BundleCount}>{this.getCountText(ownershipData)}</div>}
        {this.renderPriceOrStatus(ownershipData)}
      </div>
    );
  }

  private renderPriceOrStatus(ownershipData: PurchaseOwnershipData): React.ReactNode {
    // Free (and not yet claimed).  If it is already claimed, we will fall through and show "Owned".
    if (isFreeReward(this.props.purchase) && ownershipData.status !== OwnershipStatus.FullyOwned) {
      return <div className={StatusFree}>{getStringTableValue(StringIDStoreFree, this.props.stringTable)}</div>;
    }

    // Are the Unique items in this purchase already owned?
    switch (ownershipData.status) {
      case OwnershipStatus.FullyOwned: {
        // Cannot be purchased, so we just say "owned".
        return <div className={StatusOwned}>{getStringTableValue(StringIDStoreOwned, this.props.stringTable)}</div>;
      }
      case OwnershipStatus.PartiallyOwned:
      case OwnershipStatus.Unowned: {
        const finalPrice = getFinalPurchaseCost(this.props.purchase, this.props.perksByID, this.props.ownedPerks);
        return <>{this.props.purchase.costs.map(this.renderPrice.bind(this, finalPrice))}</>;
      }
    }
  }

  private getCountText(ownershipData: PurchaseOwnershipData): string {
    if (ownershipData.status === OwnershipStatus.PartiallyOwned) {
      return getTokenizedStringTableValue(StringIDStoreBundleCountAndOwned, this.props.stringTable, {
        COUNT: `${ownershipData.allUniquePerkIDs.length}`,
        OWNED: `${ownershipData.ownedUniquePerkIDs.length}`
      });
    } else {
      return getTokenizedStringTableValue(StringIDStoreBundleCount, this.props.stringTable, {
        COUNT: `${ownershipData.allUniquePerkIDs.length}`
      });
    }
  }

  private renderPrice(finalPrices: CostDefGQL[], cost: CostDefGQL, index: number): React.ReactNode {
    const costPerk = this.props.perksByID[cost.perkID];
    if (!costPerk) {
      return null;
    }

    const originalPrice = cost.qty;
    let finalPrice = finalPrices.find((c) => c.perkID === cost.perkID).qty;

    return (
      <div className={CostRow} key={index}>
        <PerkIcon className={CostIcon} perkID={cost.perkID} />
        <div className={CostFinal}>{addCommasToNumber(finalPrice)}</div>
        {finalPrice < originalPrice ? <div className={CostOriginal}>{addCommasToNumber(originalPrice)}</div> : null}
        {costPerk.id !== BUX_PERK_ID && <div className={CostName}>{costPerk.name}</div>}
      </div>
    );
  }

  private getPackageTitle(ownershipData: PurchaseOwnershipData): string {
    let packageName: string = '';

    // If the PurchaseDef has a title, use that.
    if (this.props.purchase.name && this.props.purchase.name.length > 0) {
      packageName = this.props.purchase.name;
    }
    // If the PerkDef has a title, use that.
    else if (this.props.purchase.perks && this.props.purchase.perks.length > 0) {
      const perk = this.props.perksByID[this.props.purchase.perks[0].perkID];

      if (perk && perk.name && perk.name.length > 0) {
        packageName = perk.name;
      }
    } else {
      console.error('Title Failed to Load');
      return '';
    }

    //If the uniqueItems in this purchase are all for a single champion, we show their name as well.
    const uniquePerks = ownershipData.allUniquePerkIDs.map((pid) => this.props.perksByID[pid]);
    if (
      uniquePerks.length > 0 &&
      !uniquePerks.find((perk) => {
        return perk.champion?.id !== uniquePerks[0].champion?.id;
      }) &&
      uniquePerks[0].champion?.name
    ) {
      // All for one champion!
      return `${packageName} ${uniquePerks[0].champion.name}`;
    } else {
      // Not all for one champion, so just show the package name.
      return packageName;
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID } = state.store;
  const { champions, ownedPerks } = state.profile;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    champions,
    perksByID,
    stringTable,
    ownedPerks
  };
}

export const StoreItemInfo = connect(mapStateToProps)(AStoreItemInfo);
