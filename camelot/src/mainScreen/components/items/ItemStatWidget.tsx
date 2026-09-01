/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getItemStatCompareValue, getItemStatValue, isItemStatRenderable } from '../../helpers/itemHelpers';
import { ItemStatID } from './itemData';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { ItemDef } from '../../dataSources/manifest/itemManifest';
import { StatDef } from '../../dataSources/manifest/statManifest';
import { EntityStat } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { getTokenizedStringTableValue, StringIDGeneralPercent } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';

// CSS classes
const Root = 'HUD-ItemStat-Root';
const Name = 'HUD-ItemStat-Name';
const Icon = 'HUD-ItemStat-Icon';
const Value = 'HUD-ItemStat-Value';
const Compare = 'HUD-ItemStat-Compare';
const ComparePositive = 'HUD-ItemStat-ComparePositive';
const CompareNegative = 'HUD-ItemStat-CompareNegative';

// String IDs
const StringIDItemTooltipCompareValueHigher = 'ItemTooltipCompareValueHigher';
const StringIDItemTooltipCompareValueLower = 'ItemTooltipCompareValueLower';

// Tags
const DisplayTypePercentTag = 'UI.DisplayType.Percent';
const DisplayTypePercentOverOneTag = 'UI.DisplayType.PercentOverOne';

interface ReactProps {
  item?: Item;
  statID: ItemStatID;
  color?: string | ((value: number) => string);
  showName?: boolean;
  showEmptyValue?: boolean;
  showCompare?: boolean;
}

interface InjectedProps {
  stats: Dictionary<StatDef>;
  myStats: Record<number, EntityStat>;
  equippedItems: Item[];
  itemsByNumericID: Record<number, ItemDef>;
  stringTable: Record<string, StringTableEntryDef>;
  tagAffixIDByStringID: Record<string, number>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AItemStatWidget extends React.Component<Props> {
  render(): React.ReactNode {
    const stat = this.getStat();
    if (!stat || !this.props.item) {
      return null;
    }

    const requirementStatID =
      Object.keys(this.props.stats).find((statKey) => {
        const requirementStat = this.props.stats[statKey];
        if (requirementStat.itemRequirementStatID === stat.id) {
          return requirementStat;
        }
      }) ?? null;
    const requirementStat = requirementStatID ? this.props.stats[requirementStatID] : null;
    const value = this.getValue();
    const requirementDiff = requirementStat ? (this.props.myStats[requirementStat.numericID]?.value ?? 0) - value : 0;
    const renderedValue = this.getRenderedValue(value);
    const compareValue = this.getCompareValue();
    const renderedCompareValue = compareValue !== null ? this.getRenderedValue(compareValue) : null;
    if (
      this.props.showEmptyValue ||
      isItemStatRenderable(
        this.props.item,
        this.props.stats[this.props.statID],
        this.props.equippedItems,
        this.props.itemsByNumericID
      )
    ) {
      const color = typeof this.props.color === 'string' ? this.props.color : this.props.color?.(value);
      let compareStringID: string = '';
      if (renderedCompareValue !== null) {
        compareStringID =
          renderedCompareValue >= 0 ? StringIDItemTooltipCompareValueHigher : StringIDItemTooltipCompareValueLower;
      }
      return (
        <div className={Root} style={{ color: requirementDiff !== null && requirementDiff < 0 ? 'red' : color }}>
          {this.props.showName && <span className={Name}>{stat.name}</span>}
          <div className={`${Icon}`} />
          <span className={Value}>{this.getFormattedValue(renderedValue)}</span>
          {this.props.showCompare && requirementDiff === null && renderedCompareValue !== null && (
            <span className={`${Compare} ${renderedCompareValue >= 0 ? ComparePositive : CompareNegative}`}>
              {getTokenizedStringTableValue(compareStringID, this.props.stringTable, {
                VALUE: this.getFormattedValue(renderedCompareValue)
              })}
            </span>
          )}
        </div>
      );
    }
    return null;
  }

  getStat(): StatDef {
    return this.props.stats[this.props.statID];
  }

  getValue(): number {
    return getItemStatValue(this.props.item, this.props.stats[this.props.statID]);
  }

  getCompareValue(): number | null {
    return getItemStatCompareValue(
      this.props.item,
      this.props.stats[this.props.statID],
      this.props.equippedItems,
      this.props.itemsByNumericID
    );
  }

  getRenderedValue(value: number): number {
    const stat = this.getStat();
    if (stat.tags?.includes(DisplayTypePercentOverOneTag)) {
      return (value - 1) * 100;
    }
    if (stat.tags?.includes(DisplayTypePercentTag)) {
      return value * 100;
    }
    return value;
  }

  getFormattedValue(value: number): string {
    const stat = this.getStat();
    const formattedValue = addCommasToNumber(value.toFixed(2));
    if (stat.tags?.includes(DisplayTypePercentOverOneTag) || stat.tags?.includes(DisplayTypePercentTag)) {
      return getTokenizedStringTableValue(StringIDGeneralPercent, this.props.stringTable, {
        VALUE: formattedValue
      });
    }
    return formattedValue;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { stats, itemsByNumericID, tagAffixIDByStringID } = state.gameDefs;
  return {
    stats,
    myStats: state.entities.self.stats,
    equippedItems: state.inventory.equipment,
    itemsByNumericID,
    stringTable: state.stringTable.stringTable,
    tagAffixIDByStringID,
    ...ownProps
  };
};

export const ItemStatWidget = connect(mapStateToProps)(AItemStatWidget);
