/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Item, ItemLocationType } from '@csegames/library/dist/camelotunchained/game/types/Items';
import * as React from 'react';
import { connect } from 'react-redux';
import { TagState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { ItemDef, ItemType } from '../../dataSources/manifest/itemManifest';
import {
  getItemComparisonEquippedItems,
  getItemDefFromProps,
  hasUnmetTagRequirement,
  ProficiencyTagPrefix
} from '../../helpers/itemHelpers';
import { getEntityTagStrings } from '../../helpers/tagHelpers';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { RootState } from '../../redux/store';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { BorderBackground, BorderType, FactionBorder } from '../FactionBorder';
import { ContentWrapper, TooltipBorder } from '../TooltipPane';
import { ItemTooltip, StringIDItemTooltipEquipped } from './ItemTooltip';

const Row = 'HUD-ItemCompareTooltip-Row';
const CardWrapper = 'HUD-ItemCompareTooltip-CardWrapper';
const EquippedTab = 'HUD-ItemCompareTooltip-EquippedTab';
const EquippedTabText = 'HUD-ItemCompareTooltip-EquippedTabText';

interface ReactProps {
  items?: Item[];
  itemDefID?: string;
}

interface InjectedProps {
  defs: GameDefsState;
  equippedItems: Item[];
  selfTags: Record<string, TagState>;
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class AItemCompareTooltip extends React.Component<Props> {
  render(): React.ReactNode {
    const item = this.props.items?.[0];
    const itemDef = getItemDefFromProps(this.props.defs, item, this.props.itemDefID);
    const comparisonItems = this.getComparisonItems(item, itemDef);
    const isPrimaryEquipped = item?.location.type === ItemLocationType.Equipped;

    if (comparisonItems.length === 0) {
      return this.renderCard(this.props.items, this.props.itemDefID, isPrimaryEquipped);
    }

    return (
      <div className={Row}>
        {this.renderCard(this.props.items, this.props.itemDefID, isPrimaryEquipped)}
        {comparisonItems.map((comparisonItem) => (
          <React.Fragment key={comparisonItem.instanceID}>
            {this.renderCard([comparisonItem], undefined, true)}
          </React.Fragment>
        ))}
      </div>
    );
  }

  private renderCard(items: Item[] | undefined, itemDefID?: string, isEquippedCard?: boolean): React.ReactNode {
    return (
      <div className={CardWrapper}>
        {isEquippedCard && (
          <FactionBorder type={BorderType.Secondary} background={BorderBackground.PatternLarge} className={EquippedTab}>
            <div className={EquippedTabText}>
              {getStringTableValue(StringIDItemTooltipEquipped, this.props.stringTable)}
            </div>
          </FactionBorder>
        )}
        <FactionBorder type={BorderType.Primary} background={BorderBackground.PatternLarge} className={TooltipBorder}>
          <div className={ContentWrapper}>
            <ItemTooltip items={items} itemDefID={itemDefID} />
          </div>
        </FactionBorder>
      </div>
    );
  }

  private getComparisonItems(item: Item | undefined, itemDef: ItemDef | undefined): Item[] {
    const isEquippableGear = itemDef?.itemType === ItemType.Armor || itemDef?.itemType === ItemType.Weapon;
    const isAlreadyEquipped = item?.location.type === ItemLocationType.Equipped;
    if (!itemDef || !isEquippableGear || isAlreadyEquipped) {
      return [];
    }

    const entityTagStrings = getEntityTagStrings(this.props.selfTags, this.props.defs.tagAffixByNumericID);
    if (hasUnmetTagRequirement(itemDef, ProficiencyTagPrefix, entityTagStrings, this.props.defs)) {
      return [];
    }

    return getItemComparisonEquippedItems(itemDef, this.props.equippedItems, this.props.defs.itemsByNumericID);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => ({
  ...ownProps,
  defs: state.gameDefs,
  equippedItems: state.inventory.equipment,
  selfTags: state.entities.self.tags,
  stringTable: state.stringTable.stringTable
});

export const ItemCompareTooltip = connect(mapStateToProps)(AItemCompareTooltip);
