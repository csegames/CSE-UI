/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../redux/store';
import { HUDLayer, HUDWidgetRegistration, addConditionalWidgetExiting } from '../redux/hudSlice';
import Escapable from './Escapable';
import { LoadingTopic } from '../redux/loadingSlice';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getFactionData } from '../gameData/factionData';
import { getRaceData } from '../gameData/raceData';
import { RaceDef } from '../dataSources/manifest/raceManifest';
import { BodyTypeDef } from '../dataSources/manifest/bodyTypeManifest';
import { getStringTableValue } from '../helpers/stringTableHelpers';
import { buildEquippedItemsByGearSlot } from '../helpers/itemHelpers';
import { Item, ItemLocationType } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { ItemDef } from '../dataSources/manifest/itemManifest';
import { ItemIcon } from './items/ItemIcon';
import { FactionTitle } from './FactionTitle';
import { StatDef } from '../dataSources/manifest/statManifest';
import { EntityStat, TagState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { BorderBackground, BorderType, FactionBorder } from './FactionBorder';
import { CornerButtonType, FactionCornerButton } from './FactionCornerButton';
import { BaseHUDWidgetDraggableHandle } from './BaseHUDWidgetDraggableHandle';
import { FactionSlidingPanel } from './FactionSlidingPanel';
import TooltipSource from './TooltipSource';
import { ClassDef } from '../dataSources/manifest/classManifest';

// CSS classes
const Root = 'HUD-Equipped-Root';
const BodyContainer = 'HUD-Equipped-BodyContainer';
const GearSlot = 'HUD-Equipped-GearSlot';
const StatsSlider = 'HUD-Equipped-StatsSlider';
const CharacterInfoPanel = 'HUD-Equipped-CharacterInfoPanel';
const InfoSection = 'HUD-Equipped-InfoSection';
const SectionBorder = 'HUD-Equipped-SectionBorder';
const SectionHeader = 'HUD-Equipped-SectionHeader';
const SectionHeaderLabel = 'HUD-Equipped-SectionHeaderLabel';
const InfoRow = 'HUD-Equipped-InfoRow';
const InfoRowSmall = 'HUD-Equipped-InfoRow small';
const InfoLabel = 'HUD-Equipped-InfoLabel';
const InfoValue = 'HUD-Equipped-InfoValue';
const GridSectionTwoColFlow = 'HUD-Equipped-GridSection twoColFlow';
const GridSectionAttributes = 'HUD-Equipped-GridSection attributes';
const GridSectionResistances = 'HUD-Equipped-GridSection resistances';
const GridCell = 'HUD-Equipped-GridCell';
const GridCellSecondary = 'HUD-Equipped-GridCell secondary';
const GridCellValue = 'HUD-Equipped-GridCellValue';
const GridCellName = 'HUD-Equipped-GridCellName';
const StatGroupEl = 'HUD-Equipped-StatGroup';
const Handle = 'HUD-FancyBorder-HeaderHandle';
const TooltipContent = 'HUD-CharacterBuilder-TooltipContent';
const TooltipTitle = 'HUD-CharacterBuilder-TooltipTitle';
const TooltipMessage = 'HUD-CharacterBuilder-TooltipMessage';
const TooltipMaxWidth = '30vmin';

// String IDs
const StringIDEquippedTitle = 'EquippedTitle';
const StringIDEquippedCharacterInfo = 'EquippedCharacterInfo';
const StringIDEquippedAttributes = 'EquippedAttributes';
const StringIDEquippedResistances = 'EquippedResistances';
const StringIDEquippedOffensiveStats = 'EquippedOffensiveStats';
const StringIDEquippedDefensiveStats = 'EquippedDefensiveStats';
const StringIDEquippedUtility = 'EquippedUtility';
const StringIDEquippedUsableWeaponTypes = 'EquippedUsableWeaponTypes';
const StringIDEquippedUsableArmorTypes = 'EquippedUsableArmorTypes';

interface StatGroup {
  primaryId: string;
  secondaryIds?: string[];
}

// Left-column groups listed first, right-column groups second — CSS column-count splits at the midpoint.
const OFFENSE_STAT_GROUPS: StatGroup[] = [
  // Left col
  { primaryId: 'CriticalHitChance', secondaryIds: ['CriticalHitRating'] },
  { primaryId: 'CriticalDamageMultiplier' },
  // Right col
  { primaryId: 'WeaponDamage' },
  { primaryId: 'BaseWeaponDamageMultiplier' },
  { primaryId: 'BaseSpellDamageMultiplier' },
];

const DEFENSE_STAT_GROUPS: StatGroup[] = [
  // Left col
  { primaryId: 'PhysicalArmorMultiplier', secondaryIds: ['PhysicalArmorRating'] },
  { primaryId: 'MagicArmorMultiplier', secondaryIds: ['MagicArmorRating'] },
  { primaryId: 'EvasionChance', secondaryIds: ['EvasionChanceIncrease'] },
  { primaryId: 'ParryChance' },
  // Right col
  { primaryId: 'BlockValue', secondaryIds: ['BlockValueIncrease'] },
  { primaryId: 'BlockCooldown' },
  { primaryId: 'GutsValue', secondaryIds: ['GutsValueIncrease'] },
  { primaryId: 'GutsThreshold', secondaryIds: ['GutsThresholdIncrease'] },
];

// Explicit display order, not alphabetical. Grouped so the resistances grid's CSS columns read as themed vertical groups:
// physical, elemental, cosmic, magic/mind. (see .resistances in MainScreen-Styles.scss)
const RESISTANCE_ORDER = [
  'SlashingResistanceValue', 'FireResistanceValue', 'ArcaneResistanceValue', 'ShadowResistanceValue',
  'CrushingResistanceValue', 'LightningResistanceValue', 'ChaosResistanceValue', 'SpiritResistanceValue',
  'PiercingResistanceValue', 'EarthResistanceValue', 'VoidResistanceValue', 'MindResistanceValue',
];

const UTILITY_STAT_GROUPS: StatGroup[] = [
  // Left col
  { primaryId: 'MaxHP', secondaryIds: ['MaxHPIncrease'] },
  { primaryId: 'HealthRegeneration' },
  { primaryId: 'BaseHealingMultiplier' },
  { primaryId: 'DetectionRange' },
  // Right col
  { primaryId: 'BuffDurationMultiplier' },
  { primaryId: 'BuffEffectMultiplier' },
  { primaryId: 'DebuffDurationReduction' },
  { primaryId: 'PanicResistanceValue' },
  { primaryId: 'BasePanicMultiplier' },
  { primaryId: 'VeilResistance' },
];

const PROFICIENCY_TAG_PART_COUNT = 3;

interface State {
  isStatsOpen: boolean;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  uiFactionID: string;
  myRace: RaceDef;
  myBodyType: BodyTypeDef;
  stringTable: Record<string, StringTableEntryDef>;
  characterName: string;
  equippedItems: Item[];
  itemsByNumericID: Record<number, ItemDef>;
  stats: Record<string, StatDef>;
  characterStats: Record<number, EntityStat>;
  classID: number;
  classesByNumericID: Record<number, ClassDef>;
  characterLevel: number;
  characterTags: Record<number, TagState>;
  tagAffixByNumericID: Record<number, string>;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AEquipped extends React.Component<Props, State> {
  private itemsByGearSlotCache: {
    equippedItems: Item[];
    itemsByNumericID: Record<number, ItemDef>;
    itemsByGearSlot: Record<string, Item>;
  };

  constructor(props: Props) {
    super(props);

    this.state = {
      isStatsOpen: false
    };
  }

  render(): JSX.Element {
    const factionData = getFactionData(this.props.uiFactionID);
    const raceData = getRaceData(this.props.myRace.id);
    const slotSize = 6.5;
    const slotSizeSmall = 4.9;
    const gearSlots: [string, number, number, number][] = [
      ['Head', slotSize, 50, 14],
      ['Back', slotSize, 28, 17],
      ['Torso', slotSize, 50, 38],
      ['Arms', slotSize, 28, 35],
      ['Hands', slotSize, 72, 35],
      ['Legs', slotSize, 50, 57],
      ['Feet', slotSize, 50, 84],
      ['Earring1', slotSizeSmall, 81, 75],
      ['Earring2', slotSizeSmall, 81, 87],
      ['Neck', slotSize, 72, 17],
      ['Ring1', slotSizeSmall, 19, 75],
      ['Ring2', slotSizeSmall, 19, 87],
      ['OneHandedWeaponLeft', slotSize, 19, 60],
      ['OneHandedWeaponRight', slotSize, 81, 60]
    ];

    return (
      <div className={Root}>
        {!this.props.isDragCopy && (
          <Escapable
            escapeID={WIDGET_ID_EQUIPPED}
            onEscape={this.closeSelf.bind(this)}
            sound={SoundEvents.PLAY_UI_ABILITY_WINDOW_OPEN}
          />
        )}
        <FactionSlidingPanel
          className={StatsSlider}
          titleText={getStringTableValue(StringIDEquippedCharacterInfo, this.props.stringTable)}
          isOpen={this.state.isStatsOpen}
          isBadged={false}
          panelBackground={BorderBackground.Leather}
          onToggleClicked={() => this.setState({ isStatsOpen: !this.state.isStatsOpen })}
        >
          <div
            id='equipped-character-info-panel'
            className={CharacterInfoPanel}
            style={
              {
                '--faction-border-color': factionData.targetBorderColor,
                '--faction-divider-color': factionData.borderColor
              } as React.CSSProperties
            }
          >
            <div className={InfoSection}>
              {this.renderSectionHeader(getStringTableValue(StringIDEquippedCharacterInfo, this.props.stringTable))}
              <FactionBorder
                className={SectionBorder}
                type={BorderType.Primary}
                background={BorderBackground.PatternLarge}
              >
                <div className={InfoRow}>{this.renderCharacterInfoLine()}</div>
                <div className={InfoRowSmall}>
                  <div>
                    <span className={InfoLabel}>
                      {getStringTableValue(StringIDEquippedUsableWeaponTypes, this.props.stringTable)}
                    </span>
                  </div>
                  <div>{this.getWeaponTypeList()}</div>
                </div>
                <div className={InfoRowSmall}>
                  <div>
                    <span className={InfoLabel}>
                      {getStringTableValue(StringIDEquippedUsableArmorTypes, this.props.stringTable)}
                    </span>
                  </div>
                  <div>{this.getArmorTypeList()}</div>
                </div>
              </FactionBorder>
            </div>
            <div className={InfoSection}>
              {this.renderSectionHeader(getStringTableValue(StringIDEquippedAttributes, this.props.stringTable))}
              <FactionBorder
                className={SectionBorder}
                type={BorderType.Primary}
                background={BorderBackground.PatternLarge}
              >
                <div className={GridSectionAttributes}>
                  {this.getPrimaryStats().map((def, i) => this.renderGridCell(def, i))}
                </div>
              </FactionBorder>
            </div>
            <div className={InfoSection}>
              {this.renderSectionHeader(getStringTableValue(StringIDEquippedResistances, this.props.stringTable))}
              <FactionBorder
                className={SectionBorder}
                type={BorderType.Primary}
                background={BorderBackground.PatternLarge}
              >
                <div className={GridSectionResistances}>
                  {this.getResistanceStats().map((def, i) => this.renderGridCell(def, i, true))}
                </div>
              </FactionBorder>
            </div>
            <div className={InfoSection}>
              {this.renderSectionHeader(getStringTableValue(StringIDEquippedOffensiveStats, this.props.stringTable))}
              <FactionBorder
                className={SectionBorder}
                type={BorderType.Primary}
                background={BorderBackground.PatternLarge}
              >
                <div className={GridSectionTwoColFlow}>{this.renderGroupedSection(OFFENSE_STAT_GROUPS)}</div>
              </FactionBorder>
            </div>
            <div className={InfoSection}>
              {this.renderSectionHeader(getStringTableValue(StringIDEquippedDefensiveStats, this.props.stringTable))}
              <FactionBorder
                className={SectionBorder}
                type={BorderType.Primary}
                background={BorderBackground.PatternLarge}
              >
                <div className={GridSectionTwoColFlow}>{this.renderGroupedSection(DEFENSE_STAT_GROUPS)}</div>
              </FactionBorder>
            </div>
            <div className={InfoSection}>
              {this.renderSectionHeader(getStringTableValue(StringIDEquippedUtility, this.props.stringTable))}
              <FactionBorder
                className={SectionBorder}
                type={BorderType.Primary}
                background={BorderBackground.PatternLarge}
              >
                <div className={GridSectionTwoColFlow}>{this.renderGroupedSection(UTILITY_STAT_GROUPS)}</div>
              </FactionBorder>
            </div>
          </div>
        </FactionSlidingPanel>
        <FactionBorder
          className={Root}
          type={BorderType.FancyHeader}
          background={BorderBackground.Leather}
          titleText={getStringTableValue(StringIDEquippedTitle, this.props.stringTable)}
          cornerButtons={[
            <FactionCornerButton
              type={CornerButtonType.Close}
              onClick={() => {
                this.closeSelf();
              }}
            />
          ]}
        >
          <div className={BodyContainer}>
            <FactionBorder
              className={BodyContainer}
              type={BorderType.Primary}
              background={
                raceData.equippedBodyImages.find(
                  (equippedBodyImage) => equippedBodyImage.bodyTypeID === this.props.myBodyType.id
                ).image
              }
            >
              {gearSlots.map(([gearSlotID, size, x, y]) => {
                const items: Item[] = [];
                const item = this.getItemsByGearSlot()[gearSlotID];
                if (item) {
                  items.push(item);
                }
                return (
                  <FactionBorder
                    type={item ? BorderType.Decorative : BorderType.Secondary}
                    cornerSize={item && size === slotSizeSmall ? '4vmin' : undefined}
                    borderSize={item && size === slotSizeSmall ? '4vmin' : undefined}
                    style={{
                      left: `${x}%`,
                      top: `${y}%`
                    }}
                    className={GearSlot}
                    key={gearSlotID}
                    id={`GearSlot-${gearSlotID}`}
                  >
                    <ItemIcon
                      type={ItemLocationType.Equipped}
                      slotImageURL={
                        factionData.gearSlotImages.find((gearSlotImage) => gearSlotImage.gearSlotID === gearSlotID)
                          .image
                      }
                      items={items}
                      slotID={gearSlotID}
                      size={`${size}vmin`}
                    />
                  </FactionBorder>
                );
              })}
            </FactionBorder>
            <FactionTitle>{this.props.characterName}</FactionTitle>
          </div>
          <BaseHUDWidgetDraggableHandle className={Handle} widgetID={WIDGET_ID_EQUIPPED} />
        </FactionBorder>
      </div>
    );
  }

  private getItemsByGearSlot(): Record<string, Item> {
    const { equippedItems, itemsByNumericID } = this.props;
    if (
      this.itemsByGearSlotCache?.equippedItems !== equippedItems ||
      this.itemsByGearSlotCache?.itemsByNumericID !== itemsByNumericID
    ) {
      this.itemsByGearSlotCache = {
        equippedItems,
        itemsByNumericID,
        itemsByGearSlot: buildEquippedItemsByGearSlot(equippedItems, itemsByNumericID)
      };
    }
    return this.itemsByGearSlotCache.itemsByGearSlot;
  }

  private renderSectionHeader(text: string): React.ReactNode {
    const factionData = getFactionData(this.props.uiFactionID);
    return (
      <div className={SectionHeader} style={{ backgroundImage: `url(${factionData.headerBorderSecondaryImage})` }}>
        <span className={SectionHeaderLabel}>{text}</span>
      </div>
    );
  }

  private renderCharacterInfoLine(): React.ReactNode {
    const classDef = this.props.classesByNumericID[this.props.classID];
    const displayLevel = this.props.characterLevel + 1;
    const raceName = getStringTableValue(this.props.myRace?.name ?? '', this.props.stringTable);
    const className = getStringTableValue(classDef?.name ?? '', this.props.stringTable);
    return (
      <>
        {this.props.characterName} | Level <span className={InfoValue}>{displayLevel}</span> | {raceName} | {className}
      </>
    );
  }

  private renderGroupedSection(groups: StatGroup[]): React.ReactNode {
    const { stats } = this.props;
    return groups.map((group, i) => {
      const primaryDef = stats[group.primaryId];
      if (!primaryDef) return null;
      const secondaryDefs = (group.secondaryIds ?? [])
        .map((id) => stats[id])
        .filter((s): s is StatDef => s != null);
      return (
        <div className={StatGroupEl} key={i}>
          {this.renderGridCell(primaryDef, `${i}-primary`)}
          {secondaryDefs.map((def, j) => this.renderGridCell(def, `${i}-secondary-${j}`, false, true))}
        </div>
      );
    });
  }

  private renderGridCell(
    def: StatDef,
    index: string | number,
    stripResistance?: boolean,
    isSecondary?: boolean
  ): React.ReactNode {
    const stat = this.props.characterStats[def.numericID];
    const isPercent = def.tags?.includes('UI.DisplayType.Percent');
    const isPercentInverse = def.tags?.includes('UI.DisplayType.PercentInverse');
    const isPercentOverOne = def.tags?.includes('UI.DisplayType.PercentOverOne');
    const isDecimal = def.tags?.includes('UI.DisplayType.Decimal');
    const isSeconds = def.tags?.includes('UI.DisplayType.Seconds');
    const isMeters = def.tags?.includes('UI.DisplayType.Meters');
    const value = isPercentInverse
      ? `${((1 - (stat?.value ?? 0)) * 100).toFixed(0)}%`
      : isPercentOverOne
      ? `${(((stat?.value ?? 1) - 1) * 100).toFixed(0)}%`
      : isPercent
      ? `${((stat?.value ?? 0) * 100).toFixed(0)}%`
      : isDecimal
      ? stat?.value?.toFixed(2) ?? '0.00'
      : isSeconds
      ? `${stat?.value?.toFixed(0) ?? '0'}s`
      : isMeters
      ? `${stat?.value?.toFixed(0) ?? '0'}m`
      : stat?.value?.toFixed(0) ?? '0';
    const fullName = getStringTableValue(def.name, this.props.stringTable);
    const displayName = stripResistance ? fullName.replace(/\s*resistance\s*/i, '').trim() : fullName;
    return (
      <TooltipSource
        className={isSecondary ? GridCellSecondary : GridCell}
        key={index}
        tooltipID={`StatGrid${def.id}`}
        maxWidth={TooltipMaxWidth}
        positionType='mouse'
        content={() => (
          <div className={TooltipContent}>
            <div className={TooltipTitle}>{fullName}</div>
            <div className={TooltipMessage}>{getStringTableValue(def.description, this.props.stringTable)}</div>
          </div>
        )}
      >
        <span className={GridCellValue}>{value}</span>
        <span className={GridCellName}> {displayName}</span>
      </TooltipSource>
    );
  }

  private closeSelf(): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_EQUIPPED));
  }

  private getWeaponTypeList(): string {
    const { characterTags, tagAffixByNumericID, stringTable } = this.props;
    const names: string[] = [];

    for (const tag of Object.values(characterTags)) {
      if (Object.keys(tag.affixes).length !== PROFICIENCY_TAG_PART_COUNT) continue;
      if (tagAffixByNumericID[tag.affixes[0]] !== 'Proficiency') continue;
      if (tagAffixByNumericID[tag.affixes[1]] !== 'Weapon') continue;
      const weaponTag = tagAffixByNumericID[tag.affixes[2]];
      if (!weaponTag || weaponTag === 'Shield') continue;
      names.push(getStringTableValue(this.weaponTagToStringTableKey(weaponTag), stringTable));
    }

    return names.filter((n) => n).join(' | ');
  }

  private getArmorTypeList(): string {
    const { characterTags, tagAffixByNumericID, stringTable } = this.props;
    const names: string[] = [];

    for (const tag of Object.values(characterTags)) {
      if (Object.keys(tag.affixes).length !== PROFICIENCY_TAG_PART_COUNT) continue;
      if (tagAffixByNumericID[tag.affixes[0]] !== 'Proficiency') continue;
      const part1 = tagAffixByNumericID[tag.affixes[1]];
      const part2 = tagAffixByNumericID[tag.affixes[2]];

      if (part1 === 'Armor') {
        const match = part2?.match(/^Type(\d+)$/);
        if (match) names.push(getStringTableValue(`Equipment.Armor.Type.${match[1]}`, stringTable));
      } else if (part1 === 'Weapon' && part2 === 'Shield') {
        names.push(getStringTableValue('Equipment.Shield', stringTable));
      }
    }

    return names.filter((n) => n).join(' | ');
  }

  private weaponTagToStringTableKey(tag: string): string {
    const match = tag.match(/^(\d+)h(.+)$/i);
    return match ? `Equipment.Weapon.${match[2]}.${match[1]}h` : `Equipment.Weapon.${tag}`;
  }

  private getPrimaryStats(): StatDef[] {
    return Object.values(this.props.stats)
      .filter((s) => s.addPointsAtCharacterCreation)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  private getResistanceStats(): StatDef[] {
    return RESISTANCE_ORDER.map((id) => this.props.stats[id]).filter((s): s is StatDef => s != null);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { name, stats, race, gender, classID, tags, characterLevel } = state.entities.self;
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    myRace: state.gameDefs.racesByNumericID[race],
    myBodyType: state.gameDefs.bodyTypesByNumericID[gender],
    stringTable: state.stringTable.stringTable,
    itemsByNumericID: state.gameDefs.itemsByNumericID,
    equippedItems: state.inventory.equipment,
    stats: state.gameDefs.stats,
    characterName: name,
    characterStats: stats,
    classID,
    classesByNumericID: state.gameDefs.classesByNumericID,
    characterLevel: characterLevel ?? 0,
    characterTags: tags ?? {},
    tagAffixByNumericID: state.gameDefs.tagAffixByNumericID
  };
};

const Equipped = connect(mapStateToProps)(AEquipped);

export const WIDGET_ID_EQUIPPED = 'Equipped';
export const equippedRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_EQUIPPED,
  nameStringID: 'HUDEditorWidgetNameEquipped',
  nativeWidgetID: 'equippedgear',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Left,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 5,
    yOffset: 7
  },
  initTopics: [LoadingTopic.Abilities],
  layer: HUDLayer.Menus,
  requiresGameDefsLoaded: true,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Equipped isDragCopy={isDragCopy} />;
  }
};
