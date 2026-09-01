/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { AbilityWithActivation } from '../../redux/abilitiesSlice';
import { RootState } from '../../redux/store';
import { AbilityDisplayDef } from '../../dataSources/manifest/abilityDisplayManifest';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  replaceStringTokens
} from '../../helpers/stringTableHelpers';
import { FactionDivider } from '../FactionDivider';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { FormattedTextDiv } from '../../../shared/components/FormattedTextDiv';
import { GameDefsState } from '../../redux/gameDefsSlice';

const StringIDAbilityTooltipTargetingEnemy = 'AbilityTooltipTargetingEnemy';
const StringIDAbilityTooltipTargetingFriend = 'AbilityTooltipTargetingFriend';
const StringIDAbilityTooltipTargetingGround = 'AbilityTooltipTargetingGround';
const StringIDAbilityTooltipTargetingSelf = 'AbilityTooltipTargetingSelf';
const StringIDAbilityTooltipSpecAndUnlockLevel = 'AbilityTooltipSpecAndUnlockLevel';
const StringIDAbilityTooltipStatRange = 'AbilityTooltipStatRange';
const StringIDAbilityTooltipStatRadius = 'AbilityTooltipStatRadius';
const StringIDAbilityTooltipStatBaseDamage = 'AbilityTooltipStatBaseDamage';
const StringIDAbilityTooltipStatBaseHealing = 'AbilityTooltipStatBaseHealing';
const StringIDAbilityTooltipStatCastTime = 'AbilityTooltipStatCastTime';
const StringIDAbilityTooltipStatCooldown = 'AbilityTooltipStatCooldown';
const StringIDAbilityTooltipStatResourceCost = 'AbilityTooltipStatResourceCost';
const StringIDAbilityTooltipStatResourceGain = 'AbilityTooltipStatResourceGain';
const StringIDAbilityTooltipCastTimeInstant = 'AbilityTooltipCastTimeInstant';
const StringIDAbilityTooltipCastTimeChanneled = 'AbilityTooltipCastTimeChanneled';
const StringIDAbilityTooltipKeywordMelee = 'AbilityTooltipKeywordMelee';
const StringIDAbilityTooltipKeywordRanged = 'AbilityTooltipKeywordRanged';
const StringIDAbilityTooltipKeywordSpell = 'AbilityTooltipKeywordSpell';
const StringIDAbilityTooltipKeywordBuff = 'AbilityTooltipKeywordBuff';
const StringIDAbilityTooltipKeywordDebuff = 'AbilityTooltipKeywordDebuff';
const StringIDsAbilityTooltipResource: Record<string, string> = {
  Courage: 'AbilityTooltipResourceCourage',
  Determination: 'AbilityTooltipResourceDetermination',
  Faith: 'AbilityTooltipResourceFaith',
  Focus: 'AbilityTooltipResourceFocus',
  Judgment: 'AbilityTooltipResourceJudgment',
  Mana: 'AbilityTooltipResourceMana',
  Panic: 'AbilityTooltipResourcePanic'
};
const StringIDsAbilityTooltipDamageTypes: Record<string, string> = {
  ['Magic']: 'AbilityTooltipDamageTypeMagic',
  ['Magic.Arcane']: 'AbilityTooltipDamageTypeMagicArcane',
  ['Magic.Chaos']: 'AbilityTooltipDamageTypeMagicChaos',
  ['Magic.Earth']: 'AbilityTooltipDamageTypeMagicEarth',
  ['Magic.Fire']: 'AbilityTooltipDamageTypeMagicFire',
  ['Magic.Lightning']: 'AbilityTooltipDamageTypeMagicLightning',
  ['Magic.Mind']: 'AbilityTooltipDamageTypeMagicMind',
  ['Magic.Shadow']: 'AbilityTooltipDamageTypeMagicShadow',
  ['Magic.Spirit']: 'AbilityTooltipDamageTypeMagicSpirit',
  ['Magic.Void']: 'AbilityTooltipDamageTypeMagicVoid',
  ['Physical']: 'AbilityTooltipDamageTypePhysical',
  ['Physical.Crushing']: 'AbilityTooltipDamageTypePhysicalCrushing',
  ['Physical.Piercing']: 'AbilityTooltipDamageTypePhysicalPiercing',
  ['Physical.Slashing']: 'AbilityTooltipDamageTypePhysicalSlashing',
  ['Poison']: 'AbilityTooltipDamageTypePoison'
};

// Styles
const Root = 'HUD-AbilityTooltip-Root';
const Title = 'HUD-AbilityTooltip-Title';
const Description = 'HUD-AbilityTooltip-Description';
const SpreadRow = 'HUD-AbilityTooltip-SpreadRow';
const ItemRequirements = 'HUD-AbilityTooltip-ItemRequirements';
const Targeting = 'HUD-AbilityTooltip-Targeting';
const SpecializationLevel = 'HUD-AbilityTooltip-SpecializationLevel';
const Keywords = 'HUD-AbilityTooltip-Keywords';
const StatsSection = 'HUD-AbilityTooltip-StatsSection';
const StatsColumn = 'HUD-AbilityTooltip-StatsColumn';
const StatLabel = 'HUD-AbilityTooltip-StatLabel';
const StatValue = 'HUD-AbilityTooltip-StatValue';

interface DisplayStrings {
  itemRequirements?: string;
  targeting?: string;
  specialization?: string;
  range?: string;
  damage?: string;
  healing?: string;
  castTime?: string;
  cooldown?: string;
  radius?: string;
  cost?: string;
  grant?: string;
  keywords?: string;
}

interface ReactProps {
  abilityID: number;
}

interface InjectedProps {
  abilityStatus: AbilityWithActivation;
  displayData: AbilityDisplayDef;
  stringTable: Record<string, StringTableEntryDef>;
  gameDefs: GameDefsState;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityTooltip extends React.Component<Props> {
  render(): React.ReactNode {
    // If no ability is assigned, then we dont' have to render anything.
    if (!this.props.abilityStatus) {
      return null;
    }

    const title = this.props.displayData?.name ?? '';
    const stats = this.props.abilityStatus?.stats ?? {};
    const description = replaceStringTokens(this.props.displayData?.description, this.props.abilityStatus?.stats);
    const displayStrings = this.buildDisplayStrings(this.props.displayData?.tags ?? [], stats);

    return (
      <div className={Root}>
        {displayStrings.itemRequirements ? (
          <>
            <div className={SpreadRow}>
              <div className={ItemRequirements}>{displayStrings.itemRequirements}</div>
              <div className={Targeting}>{displayStrings.targeting}</div>
            </div>
            <div className={SpecializationLevel}>{displayStrings.specialization ?? ''}</div>
          </>
        ) : (
          <div className={SpreadRow}>
            <div className={SpecializationLevel}>{displayStrings.specialization ?? ''}</div>
            <div className={Targeting}>{displayStrings.targeting ?? ''}</div>
          </div>
        )}
        <div className={Title}>{title}</div>
        <div className={Description}>
          {description.split('\n').map((line, lineIndex) => (
            <React.Fragment key={lineIndex}>
              {lineIndex > 0 && <br />}
              {line}
            </React.Fragment>
          ))}
        </div>
        <FactionDivider simple />
        <div className={StatsSection}>
          <div className={StatsColumn}>
            {displayStrings.damage && (
              <FormattedTextDiv text={displayStrings.damage} textClasses={[StatLabel, StatValue]} />
            )}
            {displayStrings.healing && (
              <FormattedTextDiv text={displayStrings.healing} textClasses={[StatLabel, StatValue]} />
            )}
            {displayStrings.castTime && (
              <FormattedTextDiv text={displayStrings.castTime} textClasses={[StatLabel, StatValue]} />
            )}
            {displayStrings.radius && (
              <FormattedTextDiv text={displayStrings.radius} textClasses={[StatLabel, StatValue]} />
            )}
            {displayStrings.cost && (
              <FormattedTextDiv text={displayStrings.cost} textClasses={[StatLabel, StatValue]} />
            )}
            {displayStrings.grant && (
              <FormattedTextDiv text={displayStrings.grant} textClasses={[StatLabel, StatValue]} />
            )}
          </div>
          <div className={StatsColumn}>
            {displayStrings.cooldown && (
              <FormattedTextDiv text={displayStrings.cooldown} textClasses={[StatLabel, StatValue]} />
            )}
            {displayStrings.range && (
              <FormattedTextDiv text={displayStrings.range} textClasses={[StatLabel, StatValue]} />
            )}
          </div>
        </div>
        <FactionDivider simple />
        <div className={Keywords}>{displayStrings.keywords ?? ''}</div>
      </div>
    );
  }

  private buildDisplayStrings(tags: string[], stats: Record<string, number>): DisplayStrings {
    let data: DisplayStrings = {};

    let keywords: string[] = [];

    const maxRange = stats['MaxRange'] ?? 0;
    const castTime = stats['CastTime'] ?? 0;
    const cooldown = stats['Cooldown'] ?? 0;
    const baseDamage = stats['BaseDamage'] ?? 0;
    const baseHeal = stats['BaseHeal'] ?? 0;
    const aoeRadius = stats['AoeRadius'] ?? 0;

    if (baseDamage > 0) {
      data.damage = getTokenizedStringTableValue(StringIDAbilityTooltipStatBaseDamage, this.props.stringTable, {
        DAMAGE: baseDamage.toFixed(0)
      });
    }

    if (baseHeal > 0) {
      data.healing = getTokenizedStringTableValue(StringIDAbilityTooltipStatBaseHealing, this.props.stringTable, {
        HEALING: baseHeal.toFixed(0)
      });
    }

    if (maxRange > 0) {
      data.range = getTokenizedStringTableValue(StringIDAbilityTooltipStatRange, this.props.stringTable, {
        METERS: maxRange.toFixed(0)
      });
    }

    if (aoeRadius > 0) {
      data.radius = getTokenizedStringTableValue(StringIDAbilityTooltipStatRadius, this.props.stringTable, {
        METERS: aoeRadius.toFixed(0)
      });
    }

    if (cooldown > 0) {
      data.cooldown = getTokenizedStringTableValue(StringIDAbilityTooltipStatCooldown, this.props.stringTable, {
        SECONDS: cooldown.toFixed(1)
      });
    }

    let cost = Object.entries(stats).find((e) => e[0].startsWith('Cost.'));
    if (!!cost) {
      const words = cost[0].split('.');
      const resourceID = words[1];
      if (resourceID?.length > 0) {
        data.cost = getTokenizedStringTableValue(StringIDAbilityTooltipStatResourceCost, this.props.stringTable, {
          NUMBER: cost[1].toFixed(0),
          RESOURCE: getStringTableValue(StringIDsAbilityTooltipResource[resourceID], this.props.stringTable)
        });
      }
    }

    let gain = Object.entries(stats).find((e) => e[0].startsWith('Gain.'));
    if (!!gain) {
      const words = gain[0].split('.');
      const resourceID = words[1];
      if (resourceID?.length > 0) {
        data.grant = getTokenizedStringTableValue(StringIDAbilityTooltipStatResourceGain, this.props.stringTable, {
          NUMBER: gain[1].toFixed(0),
          RESOURCE: getStringTableValue(StringIDsAbilityTooltipResource[resourceID], this.props.stringTable)
        });
      }
    }

    // Doing these outside of the tag loop to simplify keyword ordering.
    if (tags.includes('Asset.Action.Melee')) {
      keywords.push(getStringTableValue(StringIDAbilityTooltipKeywordMelee, this.props.stringTable));
    }
    if (tags.includes('Asset.Action.Ranged')) {
      keywords.push(getStringTableValue(StringIDAbilityTooltipKeywordRanged, this.props.stringTable));
    }
    if (tags.includes('Asset.Action.Spell')) {
      keywords.push(getStringTableValue(StringIDAbilityTooltipKeywordSpell, this.props.stringTable));
    }
    if (tags.includes('Asset.Effect.Buff')) {
      keywords.push(getStringTableValue(StringIDAbilityTooltipKeywordBuff, this.props.stringTable));
    }
    if (tags.includes('Asset.Effect.Debuff')) {
      keywords.push(getStringTableValue(StringIDAbilityTooltipKeywordDebuff, this.props.stringTable));
    }

    tags.forEach((tag) => {
      if (tag.startsWith('Asset.Targeting.')) {
        data.targeting = this.getTargetingString(tag);
      } else if (tag.startsWith('Asset.Specialization.')) {
        data.specialization = this.getSpecializationString(tag);
      } else if (tag.startsWith('Asset.Effect.Damage.')) {
        const damageTypeStringID = StringIDsAbilityTooltipDamageTypes[tag.slice(20)];
        if (!!damageTypeStringID) {
          keywords.push(getStringTableValue(damageTypeStringID, this.props.stringTable));
        }
      }
    });

    if (tags.includes('Asset.Activation.Channel')) {
      data.castTime = getStringTableValue(StringIDAbilityTooltipCastTimeChanneled, this.props.stringTable);
    } else if (castTime <= 0) {
      data.castTime = getStringTableValue(StringIDAbilityTooltipCastTimeInstant, this.props.stringTable);
    } else {
      data.castTime = getTokenizedStringTableValue(StringIDAbilityTooltipStatCastTime, this.props.stringTable, {
        SECONDS: castTime.toFixed(1)
      });
    }

    data.keywords = keywords.join(' | ');

    return data;
  }

  private getTargetingString(tag: string): string {
    switch (tag) {
      case 'Asset.Targeting.Enemy': {
        return getStringTableValue(StringIDAbilityTooltipTargetingEnemy, this.props.stringTable);
      }
      case 'Asset.Targeting.Friend': {
        return getStringTableValue(StringIDAbilityTooltipTargetingFriend, this.props.stringTable);
      }
      case 'Asset.Targeting.Ground': {
        return getStringTableValue(StringIDAbilityTooltipTargetingGround, this.props.stringTable);
      }
      case 'Asset.Targeting.Self': {
        return getStringTableValue(StringIDAbilityTooltipTargetingSelf, this.props.stringTable);
      }
    }
    return '';
  }

  private getSpecializationString(tag: string): string {
    const specDef = Object.values(this.props.gameDefs.progressionTracks).find((track) => track.tags.includes(tag));

    if (specDef) {
      const unlockLevel = specDef.abilityUnlocks[this.props.displayData?.id] ?? 0;
      const displayUnlockLevel = unlockLevel + 1;

      return getTokenizedStringTableValue(StringIDAbilityTooltipSpecAndUnlockLevel, this.props.stringTable, {
        SOURCE: getStringTableValue(specDef.nameKey, this.props.stringTable),
        UNLOCK_LEVEL: displayUnlockLevel.toFixed(0)
      });
    }
    return '';
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const abilityStatus = state.abilities.abilities[ownProps.abilityID];
  const displayData = state.gameDefs.abilityDisplayDefsByNumericID[abilityStatus?.displayDefID];
  return {
    ...ownProps,
    displayData,
    abilityStatus,
    stringTable: state.stringTable.stringTable,
    gameDefs: state.gameDefs
  };
}

export const AbilityTooltip = connect(mapStateToProps)(AAbilityTooltip);
