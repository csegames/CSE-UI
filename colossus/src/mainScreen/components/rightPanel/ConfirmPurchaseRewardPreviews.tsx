/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import {
  PerkDefGQL,
  PerkType,
  PurchaseDefGQL,
  PurchaseRewardDefGQL
} from '@csegames/library/dist/hordetest/graphql/schema';
import { Dispatch } from 'redux';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { updateConfirmPurchaseSelectedRewardIndex } from '../../redux/storeSlice';

const Root = 'StartScreen-Store-ConfirmPurchase-RewardPreviews-Root';
const PreviewContainer = 'StartScreen-Store-ConfirmPurchase-RewardPreviews-PreviewContainer';
const PreviewImageWindow = 'StartScreen-Store-ConfirmPurchase-RewardPreviews-PreviewImageWindow';
const PreviewImageRow = 'StartScreen-Store-ConfirmPurchase-RewardPreviews-PreviewImageRow';
const PreviewCell = 'StartScreen-Store-ConfirmPurchase-RewardPreviews-PreviewCell';
const PreviewImage = 'StartScreen-Store-ConfirmPurchase-RewardPreviews-PreviewImage';
const PreviewName = 'StartScreen-Store-ConfirmPurchase-RewardPreviews-PreviewName';
const PageArrow = 'StartScreen-Store-ConfirmPurchase-RewardPreviews-PageArrow';

interface ReactProps {
  purchase: PurchaseDefGQL;
}

interface InjectedProps {
  dispatch?: Dispatch;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  confirmPurchaseSelectedRewardIndex: number;
}

type Props = ReactProps & InjectedProps;

class AConfirmPurchaseRewardPreviews extends React.Component<Props> {
  render() {
    const rewards = this.props.purchase.perks.filter((reward) => {
      const perk = this.props.perksByID[reward.perkID];
      return perk.perkType !== PerkType.Key;
    });

    const firstPage: string = this.props.confirmPurchaseSelectedRewardIndex == 0 ? 'endPage' : '';
    const lastPage: string = this.props.confirmPurchaseSelectedRewardIndex >= rewards.length - 1 ? 'endPage' : '';
    const hiddenClass = rewards.length <= 1 ? 'hidden' : '';

    return (
      <div className={Root}>
        <div className={PreviewImageRow} style={{ left: `${this.props.confirmPurchaseSelectedRewardIndex * -65}vw` }}>
          {rewards.map(this.renderRewardCell.bind(this))}
        </div>
        <div className={PreviewContainer}>
          <div
            className={`${PageArrow} ${firstPage} ${hiddenClass} fs-icon-misc-chevron-left`}
            onClick={this.onPageLeftArrowClick.bind(this)}
          />
          <div className={PreviewImageWindow} />
          <div
            className={`${PageArrow} ${lastPage} ${hiddenClass} fs-icon-misc-chevron-right`}
            onClick={this.onPageRightArrowClick.bind(this, rewards.length)}
          />
        </div>
      </div>
    );
  }

  private renderRewardCell(reward: PurchaseRewardDefGQL, index: number): React.ReactNode {
    const perk: PerkDefGQL = this.props.perksByID[reward.perkID];

    return (
      <div className={PreviewCell} key={index}>
        <img className={PreviewImage} src={this.getPerkImageURL(perk)} />
        <div className={PreviewName}>{this.getPerkDisplayName(perk)}</div>
      </div>
    );
  }

  private getPerkDisplayName(perk: PerkDefGQL): string {
    if (perk && perk.isUnique && perk.champion) {
      return `${perk.name} ${perk.champion.name}`;
    } else {
      return perk.name;
    }
  }

  private getPerkImageURL(perk: PerkDefGQL): string {
    if (
      this.props.purchase.iconURL &&
      this.props.purchase.iconURL.length > 0 &&
      this.props.purchase.perks.length == 1
    ) {
      return this.props.purchase.iconURL;
    }

    if (perk && perk.iconURL && perk.iconURL.length > 0) {
      return perk.iconURL;
    }

    // If all else fails, at least we can show SOMETHING.
    return 'images/fullscreen/gamestats/card-default.jpg';
  }

  private onPageLeftArrowClick(): void {
    if (this.props.confirmPurchaseSelectedRewardIndex > 0) {
      const newPage = this.props.confirmPurchaseSelectedRewardIndex - 1;
      this.props.dispatch(updateConfirmPurchaseSelectedRewardIndex(newPage));
    }
  }

  private onPageRightArrowClick(numPages: number): void {
    if (this.props.confirmPurchaseSelectedRewardIndex + 1 < numPages) {
      const newPage = this.props.confirmPurchaseSelectedRewardIndex + 1;
      this.props.dispatch(updateConfirmPurchaseSelectedRewardIndex(newPage));
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { perksByID, confirmPurchaseSelectedRewardIndex } = state.store;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    perksByID,
    stringTable,
    confirmPurchaseSelectedRewardIndex
  };
}

export const ConfirmPurchaseRewardPreviews = connect(mapStateToProps)(AConfirmPurchaseRewardPreviews);
