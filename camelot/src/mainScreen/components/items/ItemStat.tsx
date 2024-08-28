/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  CharacterStatField,
  EquippedItem,
  Item,
  ItemStatDefinitionGQL,
  StatDisplayType,
  StatDefinitionGQL
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getItemStatCompareValue, getItemStatValue, isItemStatRenderable } from './itemUtils';
import { ItemStatID } from './itemData';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';

const Root = 'HUD-ItemStat-Root';
const Name = 'HUD-ItemStat-Name';
const Icon = 'HUD-ItemStat-Icon';
const Value = 'HUD-ItemStat-Value';
const Compare = 'HUD-ItemStat-Compare';
const ComparePositive = 'HUD-ItemStat-ComparePositive';
const CompareNegative = 'HUD-ItemStat-CompareNegative';

interface ReactProps {
  item: Item;
  statID: ItemStatID;
  color?: string | ((value: number) => string);
  showName?: boolean;
  showEmptyValue?: boolean;
  showCompare?: boolean;
}

interface InjectedProps {
  itemStats: Dictionary<ItemStatDefinitionGQL>;
  stats: Dictionary<StatDefinitionGQL>;
  myStats: Dictionary<CharacterStatField>;
  equippedItems: (EquippedItem | null)[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AItemStat extends React.Component<Props> {
  render(): JSX.Element {
    const stat = this.getStat();
    if (!stat) {
      return null;
    }

    const requirementStatID =
      Object.keys(this.props.stats).find((statKey) => {
        const requirementStat = this.props.stats[statKey];
        if (requirementStat.itemRequirementStat === stat.id) {
          return requirementStat;
        }
      }) ?? null;
    const requirementStat = requirementStatID && this.props.stats[requirementStatID];
    const value = this.getValue();
    const requirementDiff = requirementStat && this.props.myStats[requirementStat.id].value - value;
    const renderedValue = this.getRenderedValue(value);
    const compareValue = this.getCompareValue();
    const renderedCompareValue = compareValue !== null ? this.getRenderedValue(compareValue) : null;
    if (
      this.props.showEmptyValue ||
      isItemStatRenderable(this.props.item, this.props.statID, this.props.equippedItems)
    ) {
      const color = typeof this.props.color === 'string' ? this.props.color : this.props.color?.(value);
      const compare =
        renderedCompareValue !== null
          ? `(${renderedCompareValue >= 0 ? '+' : ''}${this.getFormattedValue(renderedCompareValue)})`
          : null;
      return (
        <div className={Root} style={{ color: requirementDiff !== null && requirementDiff < 0 ? 'red' : color }}>
          {this.props.showName && <span className={Name}>{stat.name}</span>}
          <div className={`${Icon} ${stat.iconClass}`} />
          <span className={Value}>{this.getFormattedValue(renderedValue)}</span>
          {this.props.showCompare && requirementDiff === null && compare && (
            <span className={`${Compare} ${renderedCompareValue >= 0 ? ComparePositive : CompareNegative}`}>
              {compare}
            </span>
          )}
        </div>
      );
    }
    return null;
  }

  getStat(): ItemStatDefinitionGQL {
    return this.props.itemStats[this.props.statID];
  }

  getValue(): number {
    return getItemStatValue(this.props.item, this.props.statID);
  }

  getCompareValue(): number | null {
    return getItemStatCompareValue(this.props.item, this.props.statID, this.props.equippedItems);
  }

  getRenderedValue(value: number): number {
    const stat = this.getStat();
    if (stat.displayType === StatDisplayType.Percent) {
      return value * 100;
    }
    return value;
  }

  getFormattedValue(value: number): string {
    const stat = this.getStat();
    const pieces: string[] = [];
    pieces.push(addCommasToNumber(value.toFixed(stat.displayPrecision)));

    if (stat.displayType === StatDisplayType.Percent) {
      pieces.push('%');
    }
    pieces.push(stat.unitDescription.toLowerCase());
    return pieces.join('');
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    itemStats: state.gameDefs.itemStats,
    stats: state.gameDefs.stats,
    myStats: state.gameDefs.myStats,
    equippedItems: state.equippedItems.items ?? [],
    ...ownProps
  };
};

export const ItemStat = connect(mapStateToProps)(AItemStat);
