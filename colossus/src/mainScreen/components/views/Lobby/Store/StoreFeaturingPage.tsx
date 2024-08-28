/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { PurchaseDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { StoreItemCell } from './StoreItemCell';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { StoreRoute } from '../../../../redux/storeSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

const Root = 'StartScreen-Store-StoreFeaturingPage-Root';
const ItemsContainer = 'StartScreen-Store-StoreFeaturingPage-ItemsContainer';
const Column = 'Column';
const ItemLarge = 'StartScreen-Store-ItemLarge';
const ItemTall = 'StartScreen-Store-ItemTall';
const ItemSmall = 'StartScreen-Store-ItemSmall';
const MoreHeader = 'StartScreen-Store-StoreFeaturingPage-MoreHeader';

export enum StoreFeaturingLayout {
  None = 0,
  OneBigTwoTall = 1,
  OneBigTwoSmallOneTall = 2,
  TwoSmallOneBigTwoSmall = 3,
  OneTallTwoSmallOneTallTwoSmall = 4
}

export const StoreFeaturingLayoutItemCount = {
  [StoreFeaturingLayout.None]: 0,
  [StoreFeaturingLayout.OneBigTwoTall]: 3,
  [StoreFeaturingLayout.OneBigTwoSmallOneTall]: 4,
  [StoreFeaturingLayout.TwoSmallOneBigTwoSmall]: 5,
  [StoreFeaturingLayout.OneTallTwoSmallOneTallTwoSmall]: 6
};

const MoreHeaderStringIDs = {
  [StoreRoute.Bundles]: 'StoreTabMoreBundles',
  [StoreRoute.Emotes]: 'StoreTabMoreEmotes',
  [StoreRoute.None]: '',
  [StoreRoute.Portraits]: 'StoreTabMorePortraits',
  [StoreRoute.QuestXP]: 'StoreTabMoreQuestXP',
  [StoreRoute.Rewards]: 'StoreTabMoreRewards',
  [StoreRoute.Skins]: 'StoreTabMoreSkins',
  [StoreRoute.SprintFX]: 'StoreTabMoreSprintFX',
  [StoreRoute.Weapons]: 'StoreTabMoreWeapons'
};

interface ReactProps {
  layout: StoreFeaturingLayout;
  purchases: PurchaseDefGQL[];
  needsMoreHeader: boolean;
  onItemClick: (purchase: PurchaseDefGQL) => void;
}

interface InjectedProps {
  currentRoute: StoreRoute;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export class AStoreFeaturingPage extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <div className={Root}>
        {this.renderItems()}
        {this.renderMoreHeader()}
      </div>
    );
  }

  renderItems(): React.ReactNode {
    switch (this.props.layout) {
      case StoreFeaturingLayout.None: {
        return null;
      }
      case StoreFeaturingLayout.OneBigTwoTall: {
        return (
          <div className={ItemsContainer}>
            <div className={Column}>{this.renderPurchase(this.props.purchases[0], ItemLarge)}</div>
            <div className={Column}>{this.renderPurchase(this.props.purchases[1], ItemTall)}</div>
            <div className={Column}>{this.renderPurchase(this.props.purchases[2], ItemTall)}</div>
          </div>
        );
      }
      case StoreFeaturingLayout.OneBigTwoSmallOneTall: {
        return (
          <div className={ItemsContainer}>
            <div className={Column}>{this.renderPurchase(this.props.purchases[0], ItemLarge)}</div>
            <div className={Column}>
              {this.renderPurchase(this.props.purchases[1], ItemSmall)}
              {this.renderPurchase(this.props.purchases[2], ItemSmall)}
            </div>
            <div className={Column}>{this.renderPurchase(this.props.purchases[3], ItemTall)}</div>
          </div>
        );
      }
      case StoreFeaturingLayout.TwoSmallOneBigTwoSmall: {
        return (
          <div className={ItemsContainer}>
            <div className={Column}>
              {this.renderPurchase(this.props.purchases[0], ItemSmall)}
              {this.renderPurchase(this.props.purchases[1], ItemSmall)}
            </div>
            <div className={Column}>{this.renderPurchase(this.props.purchases[2], ItemLarge)}</div>
            <div className={Column}>
              {this.renderPurchase(this.props.purchases[3], ItemSmall)}
              {this.renderPurchase(this.props.purchases[4], ItemSmall)}
            </div>
          </div>
        );
      }
      case StoreFeaturingLayout.OneTallTwoSmallOneTallTwoSmall: {
        return (
          <div className={ItemsContainer}>
            <div className={Column}>{this.renderPurchase(this.props.purchases[0], ItemTall)}</div>
            <div className={Column}>
              {this.renderPurchase(this.props.purchases[1], ItemSmall)}
              {this.renderPurchase(this.props.purchases[2], ItemSmall)}
            </div>
            <div className={Column}>{this.renderPurchase(this.props.purchases[3], ItemTall)}</div>
            <div className={Column}>
              {this.renderPurchase(this.props.purchases[4], ItemSmall)}
              {this.renderPurchase(this.props.purchases[5], ItemSmall)}
            </div>
          </div>
        );
      }
    }

    return null;
  }

  private renderPurchase(purchase: PurchaseDefGQL, className: string): React.ReactNode {
    if (!purchase) {
      return null;
    }

    return <StoreItemCell sizeClassName={className} purchase={purchase} onClick={this.props.onItemClick} />;
  }

  private renderMoreHeader(): React.ReactNode {
    return (
      this.props.needsMoreHeader && (
        <div className={MoreHeader}>
          {getStringTableValue(MoreHeaderStringIDs[this.props.currentRoute], this.props.stringTable)}
        </div>
      )
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentRoute } = state.store;
  const { stringTable } = state.stringTable;
  return {
    ...ownProps,
    currentRoute,
    stringTable
  };
}

export const StoreFeaturingPage = connect(mapStateToProps)(AStoreFeaturingPage);
