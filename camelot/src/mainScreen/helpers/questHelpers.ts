/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { ProgressState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { ItemDef } from '../dataSources/manifest/itemManifest';
import { ProgressionTrackDef } from '../dataSources/manifest/progressionTrackManifest';
import { QuestDef } from '../dataSources/manifest/questDefManifest';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { QuestDisplayCategory, QuestStateEx } from '../redux/questSlice';
import { EquipmentRequirementOperator, EquipRequirement } from './itemHelpers';
import { getStringTableValue, getTokenizedStringTableValue } from './stringTableHelpers';

const ItemRewardPrefix = 'Item.';
const XPTrackTagRewardPrefix = 'XPTrackTag.';
const StringIDQuestRewardXP = 'QuestRewardXP';

export interface QuestItemReward {
  itemID: string;
  name: string;
  iconUrl?: string;
  amount: number;
}

export interface QuestXPReward {
  trackID: string;
  name: string;
  iconUrl?: string;
  amount: number;
}

export function getItemRewards(def: QuestDef, itemsByStringID: Record<string, ItemDef>): QuestItemReward[] {
  const rewards: QuestItemReward[] = [];
  for (const reward of def.rewards ?? []) {
    if (!reward.id.startsWith(ItemRewardPrefix)) {
      continue;
    }
    const itemID = reward.id.slice(ItemRewardPrefix.length);
    const itemDef = itemsByStringID[itemID];
    rewards.push({ itemID, name: itemDef?.name ?? itemID, iconUrl: itemDef?.iconUrl, amount: reward.amount });
  }
  return rewards;
}

// First progression track on the entity that matches tag (mirrors server behavior - see ProgressionComponent)
export function findOwnedTrackByTag(
  tag: string,
  progressionTracks: Record<string, ProgressionTrackDef>,
  selfProgression: Record<string, ProgressState> | undefined
): ProgressionTrackDef | undefined {
  for (const trackID of Object.keys(selfProgression ?? {})) {
    const track = progressionTracks[trackID];
    if (track?.tags.some((t) => t === tag || t.startsWith(`${tag}.`))) {
      return track;
    }
  }
  return undefined;
}

// Progression track names are stringtable keys
// Rewards that don't match any tracks on the player are not shown
export function getXPRewards(
  def: QuestDef | undefined,
  progressionTracks: Record<string, ProgressionTrackDef>,
  stringTable: Record<string, StringTableEntryDef>,
  selfProgression: Record<string, ProgressState> | undefined
): QuestXPReward[] {
  const rewards: QuestXPReward[] = [];
  for (const reward of def?.rewards ?? []) {
    if (!reward.id.startsWith(XPTrackTagRewardPrefix)) {
      continue;
    }
    const tag = reward.id.slice(XPTrackTagRewardPrefix.length);
    const track = findOwnedTrackByTag(tag, progressionTracks, selfProgression);
    if (!track) {
      continue;
    }
    rewards.push({
      trackID: track.id,
      name: getStringTableValue(track.nameKey, stringTable),
      iconUrl: track.iconURL || undefined,
      amount: reward.amount
    });
  }
  return rewards;
}

// e.g. "250 Fishing XP"
export function getXPRewardText(reward: QuestXPReward, stringTable: Record<string, StringTableEntryDef>): string {
  return getTokenizedStringTableValue(StringIDQuestRewardXP, stringTable, {
    AMOUNT: addCommasToNumber(reward.amount.toFixed(0)),
    NAME: reward.name
  });
}

// Same string IDs the QuestLog uses for its section headers.
const StringIDQuestLogSectionTitleTutorial = 'QuestLogSectionTitleTutorial';
const StringIDQuestLogSectionTitleKingsBounty = 'QuestLogSectionTitleKingsBounty';
const StringIDQuestLogSectionTitleMilitaryService = 'QuestLogSectionTitleMilitaryService';
const StringIDQuestLogSectionTitleWorkOrders = 'QuestLogSectionTitleWorkOrders';

// Resolves the string table ID of the QuestLog section this quest displays under.
export function getQuestSectionTitleStringID(def: QuestDef): string | undefined {
  if (def.tags.includes(QuestDisplayCategory.Tutorial)) {
    return StringIDQuestLogSectionTitleTutorial;
  }
  if (def.tags.includes(QuestDisplayCategory.KingsTask)) {
    return StringIDQuestLogSectionTitleKingsBounty;
  }
  if (def.tags.includes(QuestDisplayCategory.MilitaryService)) {
    return StringIDQuestLogSectionTitleMilitaryService;
  }
  if (
    def.tags.includes(QuestDisplayCategory.TurnInArmor) ||
    def.tags.includes(QuestDisplayCategory.TurnInMisc) ||
    def.tags.includes(QuestDisplayCategory.TurnInWeapons)
  ) {
    return StringIDQuestLogSectionTitleWorkOrders;
  }
  return undefined;
}

// King's Task and Sell/TurnIn quests have bespoke display logic. Everything else (Tutorial,
// Military Service, and future categories) uses the generic default display.
export function isGenericQuestDisplay(def: QuestDef): boolean {
  return (
    !def.tags.includes(QuestDisplayCategory.KingsTask) &&
    !def.tags.includes(QuestDisplayCategory.TurnInArmor) &&
    !def.tags.includes(QuestDisplayCategory.TurnInMisc) &&
    !def.tags.includes(QuestDisplayCategory.TurnInWeapons)
  );
}

export function getQuestsForDisplayCategory(
  category: QuestDisplayCategory,
  allQuests: Record<string, QuestStateEx>,
  questDefs: Record<string, QuestDef>,
  itemDefs: Record<string, ItemDef>,
  playerFactionID: string
): QuestStateEx[] {
  let quests: QuestStateEx[] = Object.values(allQuests).filter((q) => {
    const def = questDefs[q.questDataID];

    // Quest must be properly defined.
    if (!def) {
      return false;
    }

    // Quest must match the requested category tag.
    if (!def.tags.includes(category)) {
      return false;
    }

    // If the quest is a "Sell / TurnIn" quest, the item must permit the user's faction.
    // That way we don't show quests that are impossible to complete.
    const sellTarget = def?.targets?.find(({ id }) => id.startsWith('Sell.'));
    if (sellTarget) {
      const itemID = sellTarget.id.slice(5);
      const itemDef = itemDefs[itemID];
      const requirements: EquipRequirement[] = JSON.parse(itemDef?.equipRequirements);
      const isBlocked = requirements.some((req) => {
        if (req.Faction) {
          if (req.Operator === EquipmentRequirementOperator.Equals) {
            if (req.Faction !== playerFactionID) {
              return true; // We don't match a required faction, so we are blocked.
            }
          } else if (req.Operator === EquipmentRequirementOperator.NotEquals) {
            if (req.Faction === playerFactionID) {
              return true; // We match a forbidden faction, so we are blocked.
            }
          }
        }
        return false;
      });

      if (isBlocked) {
        return false;
      }
    }

    return true;
  });
  return quests;
}

export const WorkOrderDisplayCategories: QuestDisplayCategory[] = [
  QuestDisplayCategory.TurnInArmor,
  QuestDisplayCategory.TurnInWeapons,
  QuestDisplayCategory.TurnInMisc
];

export function getLoggedQuestsForDisplayCategories(
  categories: QuestDisplayCategory[],
  loggedQuestIDs: string[],
  allQuests: Record<string, QuestStateEx>,
  questDefs: Record<string, QuestDef>,
  itemDefs: Record<string, ItemDef>,
  playerFactionID: string
): QuestStateEx[] {
  return categories.reduce<QuestStateEx[]>(
    (logged, category) =>
      logged.concat(
        getQuestsForDisplayCategory(category, allQuests, questDefs, itemDefs, playerFactionID).filter((q) =>
          loggedQuestIDs.includes(q.instanceID)
        )
      ),
    []
  );
}
