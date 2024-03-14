/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { ItemStat } from '../items/ItemStat';
import { ItemResource } from '../items/ItemResource';
import {
  EquippedItem,
  Item,
  EntityResourceDefinitionGQL,
  ItemResourceGQL,
  ItemStatDefinitionGQL,
  ItemTooltipCategoryDef,
  StatGQL,
  GearSlotDefRef
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { ItemResourceID, ItemStatID } from './itemData';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getItemGearSlotID, isItemStatRenderable } from './itemUtils';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import TooltipDividerTopURL from '../../../images/item-tooltips/divider_top.png';
import TooltipDividerBottomURL from '../../../images/item-tooltips/divider_bottom.png';

const Root = 'HUD-ItemTooltip-Root';
const Header = 'HUD-ItemTooltip-Header';
const Name = 'HUD-ItemTooltip-Name';
const Divider = 'HUD-ItemTooltip-Divider';
const DividerTopImage = 'HUD-ItemTooltip-DividerTopImage';
const DividerBottomImage = 'HUD-ItemTooltip-DividerBottomImage';
const StatGroup = 'HUD-ItemTooltip-StatGroup';
const StatGroupList = 'HUD-ItemTooltip-StatGroupList';
const StatContainer = 'HUD-ItemTooltip-StatContainer';
const ResourceContainer = 'HUD-ItemTooltip-ResourceContainer';
const Slots = 'HUD-ItemTooltip-Slots';
const SlotsIcons = 'HUD-ItemTooltip-SlotsIcons';
const SlotsIcon = 'HUD-ItemTooltip-SlotsIcon';
const BottomText = 'HUD-ItemTooltip-BottomText';

interface ReactProps {
  items: Item[];
}

interface InjectedProps {
  itemLowQualityThreshold: number;
  equippedItems: EquippedItem[];
  itemStats: Dictionary<ItemStatDefinitionGQL>;
  entityResources: Dictionary<EntityResourceDefinitionGQL>;
  itemTooltipCategories: Dictionary<ItemTooltipCategoryDef>;
  gearSlots: Dictionary<GearSlotDefRef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AItemTooltip extends React.Component<Props> {
  render(): JSX.Element {
    const name = this.props.items[0].staticDefinition.name;
    const description = this.props.items[0].staticDefinition.description;
    const itemType = this.props.items[0].staticDefinition.itemType;
    const slotIcons: string[] = [];
    this.props.items[0].staticDefinition.gearSlotSets.forEach((gearSlotSet) => {
      gearSlotSet.gearSlots.forEach((gearSlot) => {
        const gearSlotDef = this.props.gearSlots[gearSlot.id];
        if (gearSlotDef) {
          slotIcons.push(gearSlotDef.iconClass);
        }
      });
    });
    return (
      <div className={Root}>
        <div className={Header}>
          <div>
            <div className={Name}>
              <span>{name}</span>
            </div>
            <div>
              <span>({description})</span>
            </div>
            <div>
              <span>{itemType}</span>
            </div>
          </div>
          <div>
            <ItemStat
              color={(value) => (value < this.props.itemLowQualityThreshold ? '#e2392d' : '#5cf442')}
              item={this.props.items[0]}
              statID={ItemStatID.Quality}
              showEmptyValue
            />
            <ItemStat item={this.props.items[0]} statID={ItemStatID.TotalMass} showEmptyValue />
            <ItemStat
              color={this.props.items[0].location.equipped ? '#555' : '#999'}
              item={this.props.items[0]}
              statID={ItemStatID.Encumbrance}
              showEmptyValue
            />
            <ItemStat item={this.props.items[0]} statID={ItemStatID.ArmorClass} />
          </div>
        </div>
        <div className={Divider}>
          <img className={DividerTopImage} src={TooltipDividerTopURL} />
        </div>
        {this.getCategoryIDs().map((categoryID) => (
          <div className={StatGroup} key={categoryID}>
            <span>{categoryID} Stats</span>
            <div className={StatGroupList}>
              {this.getCategoryStats(categoryID).map((stat) => (
                <div className={StatContainer} key={stat.statID}>
                  <ItemStat item={this.props.items[0]} statID={stat.statID as ItemStatID} showName showCompare />
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className={Divider}>
          <img className={DividerBottomImage} src={TooltipDividerBottomURL} />
        </div>
        <div className={StatGroupList}>
          {this.getResources().map((resource) => {
            return (
              <div className={ResourceContainer} key={resource.id}>
                <ItemResource item={this.props.items[0]} resourceID={resource.id as ItemResourceID} />
              </div>
            );
          })}
        </div>
        <div className={Divider} />
        {slotIcons.length > 0 && (
          <div className={Slots}>
            <span>EquipmentSlots</span>
            <div className={SlotsIcons}>
              {slotIcons.map((slotIcon) => (
                <div className={`${SlotsIcon} ${slotIcon}`} key={slotIcon} />
              ))}
            </div>
          </div>
        )}
        <div className={BottomText}>{this.getBottomText()}</div>
      </div>
    );
  }

  getCategoryIDs(): string[] {
    return Object.keys(this.props.itemTooltipCategories)
      .filter((categoryID) =>
        this.props.items[0].statList.some((itemStat) => {
          if (isItemStatRenderable(this.props.items[0], itemStat.statID as ItemStatID, this.props.equippedItems)) {
            const stat = this.props.itemStats[itemStat.statID];
            return stat.category === categoryID;
          }
          return false;
        })
      )
      .sort((a, b) => {
        const aCategory = this.props.itemTooltipCategories[a];
        const bCategory = this.props.itemTooltipCategories[b];
        return bCategory.sortOrder - aCategory.sortOrder;
      });
  }

  getCategoryStats(categoryID: string): StatGQL[] {
    return this.props.items[0].statList
      .filter((itemStat) => {
        if (isItemStatRenderable(this.props.items[0], itemStat.statID as ItemStatID, this.props.equippedItems)) {
          const stat = this.props.itemStats[itemStat.statID];
          return stat.category === categoryID;
        }
        return false;
      })
      .sort((a, b) => {
        const statA = this.props.itemStats[a.statID];
        const statB = this.props.itemStats[b.statID];
        return statB.sortOrder - statA.sortOrder;
      });
  }

  getResources(): ItemResourceGQL[] {
    return [...this.props.items[0].resourceList].sort((a, b) => {
      const resourceA = this.props.entityResources[a.id];
      const resourceB = this.props.entityResources[b.id];
      return resourceB.sortOrder - resourceA.sortOrder;
    });
  }

  getBottomText(): string {
    const pieces: string[] = [];
    if (this.props.items[0].location.inventory) {
      const gearSlotID = getItemGearSlotID(this.props.items[0]);
      if (gearSlotID) {
        pieces.push('Double click to equip');
      }
      pieces.push('Right click item for more actions');
    }
    if (this.props.items[0].location.equipped) {
      pieces.push('Right click to unequip');
    }
    return pieces.join(' | ');
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    itemLowQualityThreshold: state.gameDefs.settings.itemLowQualityThreshold,
    equippedItems: state.equippedItems.items ?? [],
    itemStats: state.gameDefs.itemStats,
    entityResources: state.gameDefs.entityResources,
    itemTooltipCategories: state.gameDefs.itemTooltipCategories,
    gearSlots: state.gameDefs.gearSlots
  };
};

export const ItemTooltip = connect(mapStateToProps)(AItemTooltip);
