/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Item, ItemLocationType, ItemStat } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { Dictionary } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { GearSlotDef } from '../../dataSources/manifest/gearSlotManifest';
import { ItemDef, ItemType } from '../../dataSources/manifest/itemManifest';
import {
  getEquippedGearSlotSet,
  getItemDefFromProps,
  getItemResourceByID,
  getItemStatValue,
  getItemsUnitCount,
  hasUnmetTagRequirement,
  isItemStatRenderable,
  ProficiencyTagPrefix
} from '../../helpers/itemHelpers';
import { RootState } from '../../redux/store';
import { ItemStatWidget } from './ItemStatWidget';
import { ItemStatID } from './itemData';
import { ItemTooltipResourceWidget } from './ItemTooltipResourceWidget';
import {
  EntityResource,
  TagState
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { getStringFromTagAffixIDs } from '../../helpers/tagHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralBar
} from '../../helpers/stringTableHelpers';
import { GameDefsState } from '../../redux/gameDefsSlice';

import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import { IngredientEffectDef } from '../../dataSources/manifest/ingredientEffectManifest';
import { ItemModSetDef } from '../../dataSources/manifest/itemModSetManifest';
import { StatDef } from '../../dataSources/manifest/statManifest';
import { FactionDivider } from '../FactionDivider';

// CSS classes
const Root = 'HUD-ItemTooltip-Root';
const Header = 'HUD-ItemTooltip-Header';
const HeaderRow = 'HUD-ItemTooltip-HeaderRow';
const TypeSlotLabel = 'HUD-ItemTooltip-TypeSlotLabel';
const ArmorTypeLabel = 'HUD-ItemTooltip-ArmorTypeLabel';
const WeaponTypeLabel = 'HUD-ItemTooltip-WeaponTypeLabel';
const Disallowed = 'disallowed';
const QualityRow = 'HUD-ItemTooltip-QualityRow';
const QualityLabel = 'HUD-ItemTooltip-QualityLabel';
const QualityValue = 'HUD-ItemTooltip-QualityValue';
const Name = 'HUD-ItemTooltip-Name';
const FlavorText = 'HUD-ItemTooltip-FlavorText';
const CountLabel = 'HUD-ItemTooltip-CountLabel';
const StatRow = 'HUD-ItemTooltip-StatRow';
const StatName = 'HUD-ItemTooltip-StatName';
const StatValue = 'HUD-ItemTooltip-StatValue';
const Broken = 'broken';
const ItemSource = 'HUD-ItemTooltip-ItemSource';
const ItemAbility = 'HUD-ItemTooltip-ItemAbility';

const StatGroup = 'HUD-ItemTooltip-StatGroup';
const StatGroupList = 'HUD-ItemTooltip-StatGroupList';
const StatContainer = 'HUD-ItemTooltip-StatContainer';
//const ResourceContainer = 'HUD-ItemTooltip-ResourceContainer';
const Slots = 'HUD-ItemTooltip-Slots';
const SlotsIcons = 'HUD-ItemTooltip-SlotsIcons';
const SlotsIcon = 'HUD-ItemTooltip-SlotsIcon';
const BottomText = 'HUD-ItemTooltip-BottomText';
const ResourceRow = 'HUD-ItemTooltip-ResourceRow';

// String IDs
const StringIDItemTooltipArmorCategory = 'ItemTooltipArmorCategory';
const StringIDItemTooltipConsumable = 'ItemTooltipConsumable';
const StringIDItemTooltipConsumableDescription = 'ItemTooltipConsumableDescription';
const StringIDItemTooltipCraftingReagent = 'ItemTooltipCraftingReagent';
export const StringIDItemTooltipEquipped = 'ItemTooltipEquipped';
const StringIDItemTooltipEquipmentSlots = 'ItemTooltipEquipmentSlots';
const StringIDItemTooltipModification = 'ItemTooltipModification';
const StringIDItemTooltipModifications = 'ItemTooltipModifications';
const StringIDItemTooltipRightClickActions = 'ItemTooltipRightClickActions';
const StringIDItemTooltipRightClickUnequip = 'ItemTooltipRightClickUnequip';
const StringIDItemTooltipStats = 'ItemTooltipStats';
const StringIDReagentSelectionQuality = 'ReagentSelectionQuality';
const StringIDReagentSelectionQuantity = 'ReagentSelectionQuantity';

const TagForUsableItem = 'Item.Tooltip.Usable';
const TagForAdditionalStat = 'UI.Tooltip.Stats.Additional';
const TagForPercentStat = 'UI.DisplayType.Percent';
const TagForPercentOverOneStat = 'UI.DisplayType.PercentOverOne';

interface ReactProps {
  items?: Item[];
  itemDefID?: string;
}

interface InjectedProps {
  defs: GameDefsState;
  equippedItems: Item[];
  stringTable: Record<string, StringTableEntryDef>;
  selfTags: Dictionary<TagState>;
}

type Props = ReactProps & InjectedProps;

class AItemTooltip extends React.Component<Props> {
  render(): React.ReactNode {
    const item = this.props.items?.[0];
    const itemDef = getItemDefFromProps(this.props.defs, item, this.props.itemDefID);

    if (itemDef) {
      if (itemDef.tags?.includes(TagForUsableItem)) {
        return this.renderConsumableTooltip(item, itemDef);
      }

      switch (itemDef.itemType) {
        case ItemType.Armor: {
          return this.renderArmorTooltip(item, itemDef);
        }
        case ItemType.CraftingMaterial: {
          return this.renderCraftingMaterialTooltip(item, itemDef);
        }
        case ItemType.Weapon: {
          return this.renderWeaponTooltip(item, itemDef);
        }
        default: {
          return this.renderDefaultTooltip(item, itemDef);
        }
      }
    } else {
      return this.renderDefaultTooltip(item, itemDef);
    }
  }

  private renderArmorTooltip(item?: Item, itemDef?: ItemDef): React.ReactNode {
    const quality = item ? getItemStatValue(item, this.props.defs.stats[ItemStatID.Quality]) : 1;
    const physicalArmorRating = item
      ? getItemStatValue(item, this.props.defs.stats[ItemStatID.PhysicalArmorRating])
      : itemDef?.defStats?.PhysicalArmorRating ?? 0;
    const magicArmorRating = item
      ? getItemStatValue(item, this.props.defs.stats[ItemStatID.MagicArmorRating])
      : itemDef?.defStats?.MagicArmorRating ?? 0;
    const gearSlots = this.getDisplayGearSlotDefs(item, itemDef);
    const durability = getItemResourceByID(item, EntityResourceIDs.Durability);
    const repairPoints = getItemResourceByID(item, EntityResourceIDs.RepairPoints);
    const statValueClass = `${StatValue}${durability?.current === 0 ? ` ${Broken}` : ''}`;

    return (
      <div className={Root}>
        <div className={Header}>
          <div className={QualityRow}>
            <div className={QualityLabel}>
              {getStringTableValue(StringIDReagentSelectionQuality, this.props.stringTable)}
              {`:\xa0`}
            </div>
            <div className={QualityValue}>{quality}</div>
          </div>
          <div className={TypeSlotLabel}>{gearSlots.map((def) => def.name).join(', ')}</div>
          {/** TODO: Affix names row.  The design and backend for this isn't in place yet, but it will probably just be Tags. */}
          <div className={Name}>
            <span>{itemDef?.name}</span>
          </div>
        </div>
        <div className={`${ArmorTypeLabel}${this.lacksProficiency(ProficiencyTagPrefix, itemDef) ? ` ${Disallowed}` : ''}`}>
          {getStringTableValue(itemDef?.tags?.find((tag) => tag.startsWith('Equipment.')) ?? '', this.props.stringTable)}
        </div>
        <FactionDivider simple />
        <div className={StatRow}>
          <div className={statValueClass}>{`${physicalArmorRating}\xa0`}</div>
          <div className={StatName}>
            {getStringTableValue(this.props.defs.stats[ItemStatID.PhysicalArmorRating].name, this.props.stringTable)}
          </div>
        </div>
        <div className={StatRow}>
          <div className={statValueClass}>{`${magicArmorRating}\xa0`}</div>
          <div className={StatName}>
            {getStringTableValue(this.props.defs.stats[ItemStatID.MagicArmorRating].name, this.props.stringTable)}
          </div>
        </div>
        {this.getAdditionalStatDefs(item, itemDef).map((statDef) => {
          const formatted = this.getFormattedStatValue(item, statDef, itemDef);
          if (formatted === '0') return null;
          return (
            <div className={StatRow} key={statDef.id}>
              <div className={statValueClass}>{`${formatted}\xa0`}</div>
              <div className={StatName}>{getStringTableValue(statDef.name, this.props.stringTable)}</div>
            </div>
          );
        })}
        {/** TODO: Basic stats on items.  Item rework is in progress, so not properly available yet. */}
        <FactionDivider simple />
        {(itemDef?.description?.length ?? 0) > 0 && <div className={FlavorText}>{itemDef!.description}</div>}
        {/** TODO: Source / Tradeskill row.  The design and backend for this isn't in place yet, but it will probably just be Tags.  */}
        {(durability || repairPoints) && (
          <div className={ResourceRow}>
            {durability && <ItemTooltipResourceWidget item={item!} resourceID={EntityResourceIDs.Durability} />}
            {durability && repairPoints && (
              <span>{`\xa0\xa0${getStringTableValue(StringIDGeneralBar, this.props.stringTable)}\xa0\xa0`}</span>
            )}
            {repairPoints && <ItemTooltipResourceWidget item={item!} resourceID={EntityResourceIDs.RepairPoints} />}
          </div>
        )}
      </div>
    );
  }

  private renderCraftingMaterialTooltip(item: Item | undefined, itemDef: ItemDef): React.ReactNode {
    const quality = item ? getItemStatValue(item, this.props.defs.stats[ItemStatID.Quality]) : 1;

    return (
      <div className={Root}>
        <div className={Header}>
          <div className={QualityRow}>
            <div className={QualityLabel}>
              {getStringTableValue(StringIDReagentSelectionQuality, this.props.stringTable)}
              {`:\xa0`}
            </div>
            <div className={QualityValue}>{quality}</div>
          </div>
          <div className={TypeSlotLabel}>
            {getStringTableValue(StringIDItemTooltipCraftingReagent, this.props.stringTable)}
          </div>
          <div className={Name}>
            <span>{itemDef.name}</span>
          </div>
        </div>
        <FactionDivider simple />
        {itemDef.description?.length > 0 && <div className={FlavorText}>{itemDef.description}</div>}
        {/** TODO: Source / Tradeskill row... do we have access to that data yet? */}
        {item && (
          <div className={CountLabel}>{`${getItemsUnitCount(this.props.items)}\xa0${getStringTableValue(
            StringIDReagentSelectionQuantity,
            this.props.stringTable
          )}`}</div>
        )}
      </div>
    );
  }

  private renderConsumableTooltip(item: Item | undefined, itemDef: ItemDef): React.ReactNode {
    const quality = item ? getItemStatValue(item, this.props.defs.stats[ItemStatID.Quality]) : 1;
    const abilityDescription = this.props.defs.abilityDisplayDefsByStringID[itemDef.actions?.[0]?.id]?.description;
    const sourceTag = itemDef.tags?.find((tag) => tag.startsWith('Tradeskill.'));
    const sourceText = sourceTag ? getStringTableValue(sourceTag, this.props.stringTable) : undefined;
    const quantity = getItemsUnitCount(this.props.items);

    let additionalStatCount: number = 0;

    return (
      <div className={Root}>
        <div className={Header}>
          <div className={QualityRow}>
            <div className={QualityLabel}>
              {getStringTableValue(StringIDReagentSelectionQuality, this.props.stringTable)}
              {`:\xa0`}
            </div>
            <div className={QualityValue}>{quality}</div>
          </div>
          <div className={TypeSlotLabel}>
            {getStringTableValue(StringIDItemTooltipConsumable, this.props.stringTable)}
          </div>
          <div className={Name}>
            <span>{itemDef.name}</span>
          </div>
        </div>

        {abilityDescription && (
          <>
            <div className={ItemAbility}>
              {getTokenizedStringTableValue(StringIDItemTooltipConsumableDescription, this.props.stringTable, {
                DESCRIPTION: abilityDescription
              })}
            </div>
          </>
        )}

        <FactionDivider simple />
        {this.getAdditionalStatDefs(item).map((statDef) => {
          const formatted = this.getFormattedStatValue(item!, statDef);
          if (formatted === '0') return null;
          additionalStatCount++;
          return (
            <div className={StatRow} key={statDef.id}>
              <div className={StatValue}>{`${formatted}\xa0`}</div>
              <div className={StatName}>{getStringTableValue(statDef.name, this.props.stringTable)}</div>
            </div>
          );
        })}
        {additionalStatCount > 0 && <FactionDivider simple />}

        {itemDef.description?.length > 0 && <div className={FlavorText}>{itemDef.description}</div>}
        {sourceText && <div className={ItemSource}>{sourceText}</div>}
        {item && quantity > 1 && (
          <div className={CountLabel}>{`${quantity}\xa0${getStringTableValue(
            StringIDReagentSelectionQuantity,
            this.props.stringTable
          )}`}</div>
        )}
      </div>
    );
  }

  private renderWeaponTooltip(item?: Item, itemDef?: ItemDef): React.ReactNode {
    const quality = item ? getItemStatValue(item, this.props.defs.stats[ItemStatID.Quality]) : 1;
    const damageRating = item
      ? getItemStatValue(item, this.props.defs.stats[ItemStatID.DamageRating])
      : itemDef?.defStats?.WeaponDamage ?? 0;
    const gearSlots = this.getDisplayGearSlotDefs(item, itemDef);
    const durability = getItemResourceByID(item, EntityResourceIDs.Durability);
    const repairPoints = getItemResourceByID(item, EntityResourceIDs.RepairPoints);
    const statValueClass = `${StatValue}${durability?.current === 0 ? ` ${Broken}` : ''}`;

    return (
      <div className={Root}>
        <div className={Header}>
          <div className={QualityRow}>
            <div className={QualityLabel}>
              {`${getStringTableValue(StringIDReagentSelectionQuality, this.props.stringTable)}:\xa0`}
            </div>
            <div className={QualityValue}>{quality}</div>
          </div>
          <div className={TypeSlotLabel}>{gearSlots.map((def) => def.name).join(', ')}</div>
          {/** TODO: Affix names row.  The design and backend for this isn't in place yet, but it will probably just be Tags. */}
          <div className={Name}>
            <span>{itemDef?.name ?? ''}</span>
          </div>
        </div>
        <div className={StatRow}>
          <span className={`${WeaponTypeLabel}${this.lacksProficiency(ProficiencyTagPrefix, itemDef) ? ` ${Disallowed}` : ''}`}>
            {getStringTableValue(itemDef?.tags?.find((tag) => tag.startsWith('Equipment.')) ?? '', this.props.stringTable)}
          </span>
          <span className={WeaponTypeLabel}>{'\xa0|\xa0'}</span>
          <span className={WeaponTypeLabel}>
            {this.props.defs.damageTypesByStringID[itemDef?.weaponConfig?.damageTypeDefID ?? '']?.name ?? ''}
          </span>
        </div>
        <FactionDivider simple />
        {damageRating > 0 && (
          <div className={StatRow}>
            <div className={statValueClass}>{`${damageRating}\xa0`}</div>
            <div className={StatName}>
              {getStringTableValue(this.props.defs.stats[ItemStatID.DamageRating].name, this.props.stringTable)}
            </div>
          </div>
        )}
        {this.getAdditionalStatDefs(item, itemDef).map((statDef) => {
          const formatted = this.getFormattedStatValue(item, statDef, itemDef);
          if (formatted === '0') return null;
          return (
            <div className={StatRow} key={statDef.id}>
              <div className={statValueClass}>{`${formatted}\xa0`}</div>
              <div className={StatName}>{getStringTableValue(statDef.name, this.props.stringTable)}</div>
            </div>
          );
        })}
        {/** TODO: Basic stats on items.  Item rework is in progress, so not properly available yet. */}
        <FactionDivider simple />
        {(itemDef?.description?.length ?? 0) > 0 && <div className={FlavorText}>{itemDef!.description}</div>}
        {/** TODO: Source / Tradeskill row.  The design and backend for this isn't in place yet, but it will probably just be Tags.  */}
        {(durability || repairPoints) && (
          <div className={ResourceRow}>
            {durability && <ItemTooltipResourceWidget item={item!} resourceID={EntityResourceIDs.Durability} />}
            {durability && repairPoints && (
              <span>{`\xa0\xa0${getStringTableValue(StringIDGeneralBar, this.props.stringTable)}\xa0\xa0`}</span>
            )}
            {repairPoints && <ItemTooltipResourceWidget item={item!} resourceID={EntityResourceIDs.RepairPoints} />}
          </div>
        )}
      </div>
    );
  }

  private getAdditionalStatDefs(item?: Item, itemDef?: ItemDef): StatDef[] {
    if (item?.stats) {
      return item.stats
        .map((itemStat) => this.props.defs.statsByNumericID[itemStat.id])
        .filter((statDef): statDef is StatDef => statDef?.tags?.includes(TagForAdditionalStat) ?? false);
    }
    if (itemDef?.defStats) {
      return Object.entries(itemDef.defStats)
        .filter(([, value]) => !!value)
        .map(([statID]) => this.props.defs.stats[statID as ItemStatID])
        .filter((statDef): statDef is StatDef => statDef?.tags?.includes(TagForAdditionalStat) ?? false);
    }
    return [];
  }

  private getFormattedStatValue(item: Item | undefined, statDef: StatDef, itemDef?: ItemDef): string {
    const isPercent = statDef.tags?.includes(TagForPercentStat);
    const isPercentOverOne = statDef.tags?.includes(TagForPercentOverOneStat);
    const raw = item
      ? getItemStatValue(item, statDef)
      : (itemDef?.defStats?.[statDef.id as ItemStatID] ?? 0);
    const adjusted = isPercentOverOne ? (raw - 1) * 100 : isPercent ? raw * 100 : raw;
    const numeric = Number(adjusted.toFixed(2)).toString();
    return (isPercent || isPercentOverOne) && numeric !== '0' ? `${numeric}%` : numeric;
  }

  private lacksProficiency(tagPrefix: string, itemDef?: ItemDef): boolean {
    return hasUnmetTagRequirement(itemDef, tagPrefix, this.getSelfTagStrings(), this.props.defs);
  }

  private getSelfTagStrings(): string[] {
    return Object.values(this.props.selfTags).map((tag) =>
      getStringFromTagAffixIDs(Object.values(tag?.affixes ?? {}), this.props.defs.tagAffixByNumericID)
    );
  }

  private getGearSlotDefs(itemDef?: ItemDef): GearSlotDef[] {
    let defs: GearSlotDef[] = [];
    itemDef?.gearSlotSets.forEach((gearSlotSet) => {
      gearSlotSet.forEach((gearSlotID) => {
        const gearSlotDef = this.props.defs.gearSlots[gearSlotID];
        if (gearSlotDef) {
          defs.push(gearSlotDef);
        }
      });
    });
    return defs;
  }

  // For an equipped item, shows only its actual slot (e.g. Earring2), not every slot the item type could occupy.
  private getDisplayGearSlotDefs(item: Item | undefined, itemDef?: ItemDef): GearSlotDef[] {
    if (item && item.location.type === ItemLocationType.Equipped) {
      return (getEquippedGearSlotSet(item, itemDef) ?? [])
        .map((gearSlotID) => this.props.defs.gearSlots[gearSlotID])
        .filter((def): def is GearSlotDef => !!def);
    }
    return this.getGearSlotDefs(itemDef);
  }

  private renderDefaultTooltip(item?: Item, itemDef?: ItemDef): React.ReactNode {
    const name = itemDef?.name;
    const description = itemDef?.description;
    const itemType = itemDef?.itemType;
    const slotIcons: string[] = this.getGearSlotDefs(itemDef).map((def) => def.iconClass);

    return (
      <div className={Root}>
        <div className={Header}>
          <div className={HeaderRow}>
            <div className={Name}>
              <span>{name}</span>
            </div>
            <ItemStatWidget
              color={(value) => (value < this.props.defs.settings.itemLowQualityThreshold ? '#e2392d' : '#5cf442')}
              item={item}
              statID={ItemStatID.Quality}
              showEmptyValue
            />
          </div>
          <div className={HeaderRow}>
            <div>({description})</div>
            <ItemStatWidget item={item} statID={ItemStatID.PhysicalArmorRating} showName />
          </div>
          <div className={HeaderRow}>
            <div>{itemType}</div>
            <ItemStatWidget item={item} statID={ItemStatID.MagicArmorRating} showName />
          </div>
        </div>
        <FactionDivider simple />
        {this.getCategoryIDs().map((categoryID) => {
          return (
            <div className={StatGroup} key={categoryID}>
              <span>
                {getTokenizedStringTableValue(StringIDItemTooltipStats, this.props.stringTable, {
                  CATEGORY: categoryID
                })}
              </span>
              {categoryID === 'Weapon' && (
                <div className={StatGroupList}>
                  {this.getWeaponDisplayTags(itemDef).join(
                    ` ${getStringTableValue(StringIDGeneralBar, this.props.stringTable)} `
                  )}
                </div>
              )}
              {categoryID === 'Armor' && (
                <div className={StatGroupList}>
                  {getTokenizedStringTableValue(StringIDItemTooltipArmorCategory, this.props.stringTable, {
                    CATEGORY:
                      this.props.defs.armorCategories[itemDef?.armorConfig?.armorCategoryDefID ?? '']?.name ?? ''
                  })}
                </div>
              )}
              <div className={StatGroupList}>
                {this.getCategoryStats(categoryID).map((stat) => (
                  <div className={StatContainer} key={stat.id}>
                    <ItemStatWidget
                      item={item}
                      statID={this.props.defs.stats[stat.id].id as ItemStatID}
                      showName
                      showCompare
                    />
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        <FactionDivider simple />
        {/* Commenting this out for now, since item resources (Durability, HP, Repair Points) aren't currently relevant, but they will be added back*/
        /* <div className={StatGroupList}>
          {this.getResources().map((resource) => {
            return (
              <div className={ResourceContainer} key={resource.id}>
                <ItemTooltipResourceWidget item={this.props.items[0]} resourceID={resource.id} />
              </div>
            );
          })}
        </div> */}
        <div className={StatGroupList}>
          <span>{getStringTableValue(StringIDItemTooltipModifications, this.props.stringTable)}</span>
        </div>
        <div className={StatGroupList}>
          {/* This is a rough programmer proof of concept and could really use a UI pass */}
          {this.getModSets(item, this.props.defs.itemModSetsByNumericID).map((def) => (
            <div className={StatContainer} key={def.id}>
              <div>{def.name}</div>
              {def.effectDescriptions.map((desc) => (
                <div>
                  {getTokenizedStringTableValue(StringIDItemTooltipModification, this.props.stringTable, {
                    DESCRIPTION: desc
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className={StatGroupList}>
          {/* This is a rough programmer proof of concept and could really use a UI pass */}
          {this.getIngredientEffects(item, this.props.defs.ingredientEffectsByNumericID).map((def) => (
            <div className={StatContainer} key={def.id}>
              <div>{def.name}</div>
            </div>
          ))}
        </div>
        <FactionDivider simple />
        {slotIcons.length > 0 && (
          <div className={Slots}>
            <span>{getStringTableValue(StringIDItemTooltipEquipmentSlots, this.props.stringTable)}</span>
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

  getWeaponDisplayTags(itemDef?: ItemDef): string[] {
    const tags: string[] = [];

    if (itemDef) {
      const weaponClassName = this.props.defs.weaponClasses[itemDef.weaponConfig.weaponClassDefID].name;
      if (weaponClassName && weaponClassName.length > 0) tags.push(weaponClassName);

      const weaponCategoryName = this.props.defs.weaponCategories[itemDef.weaponConfig.weaponCategoryDefID].name;
      if (weaponCategoryName && weaponCategoryName.length > 0) tags.push(weaponCategoryName);

      const weaponTypeName = this.props.defs.weaponTypes[itemDef.weaponConfig.weaponTypeDefID].name;
      if (weaponTypeName && weaponTypeName.length > 0) tags.push(weaponTypeName);

      const damageTypeName = this.props.defs.damageTypesByStringID[itemDef.weaponConfig.damageTypeDefID]?.name;
      if (damageTypeName && damageTypeName.length > 0) tags.push(damageTypeName);
    }

    return tags;
  }

  getCategoryIDs(): string[] {
    return Object.keys(this.props.defs.itemTooltipCategories)
      .filter((categoryID) =>
        Object.values(this.props.items?.[0]?.stats ?? {}).some((itemStat) => {
          const statDef = this.props.defs.statsByNumericID[itemStat.id];
          if (
            isItemStatRenderable(
              this.props.items![0],
              statDef,
              this.props.equippedItems,
              this.props.defs.itemsByNumericID
            )
          ) {
            return true;
          }
          return false;
        })
      )
      .sort((a, b) => {
        const aCategory = this.props.defs.itemTooltipCategories[a];
        const bCategory = this.props.defs.itemTooltipCategories[b];
        return bCategory.sortOrder - aCategory.sortOrder;
      });
  }

  getCategoryStats(categoryID: string): ItemStat[] {
    return Object.values(this.props.items?.[0]?.stats ?? {}).filter((itemStat) => {
      const statDef = this.props.defs.statsByNumericID[itemStat.id];
      if (
        isItemStatRenderable(this.props.items![0], statDef, this.props.equippedItems, this.props.defs.itemsByNumericID)
      ) {
        return true;
      }
      return false;
    });
  }

  getModSets(i: Item | undefined, defs: Record<number, ItemModSetDef>): ItemModSetDef[] {
    if (i?.modSets) {
      return i.modSets.map((id) => defs[id]);
    }
    return [];
  }

  getIngredientEffects(i: Item | undefined, defs: Record<number, IngredientEffectDef>): IngredientEffectDef[] {
    if (i?.ingredientEffects) {
      return i.ingredientEffects.map((id) => defs[id]);
    }

    return [];
  }

  getResources(): EntityResource[] {
    return [...Object.values(this.props.items?.[0]?.resources ?? {})].sort((a, b) => {
      const resourceA = this.props.defs.entityResourcesByStringID[a.id];
      const resourceB = this.props.defs.entityResourcesByStringID[b.id];
      return resourceB.sortOrder - resourceA.sortOrder;
    });
  }

  getBottomText(): string {
    const pieces: string[] = [];
    if (this.props.items?.[0]?.location?.type == ItemLocationType.Inventory) {
      pieces.push(getStringTableValue(StringIDItemTooltipRightClickActions, this.props.stringTable));
    }
    if (this.props.items?.[0]?.location?.type == ItemLocationType.Equipped) {
      pieces.push(getStringTableValue(StringIDItemTooltipRightClickUnequip, this.props.stringTable));
    }
    return pieces.join(` ${getStringTableValue(StringIDGeneralBar, this.props.stringTable)} `);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    equippedItems: state.inventory.equipment,
    defs: state.gameDefs,
    stringTable: state.stringTable.stringTable,
    selfTags: state.entities.self.tags
  };
};

export const ItemTooltip = connect(mapStateToProps)(AItemTooltip);
