/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ItemDef } from '../dataSources/manifest/itemManifest';
import { QuestDef } from '../dataSources/manifest/questDefManifest';
import { QuestDisplayCategory, QuestStateEx } from '../redux/questSlice';
import { EquipmentRequirementOperator, EquipRequirement } from './itemHelpers';

const ItemRewardPrefix = 'Item.';

export interface QuestItemReward {
  itemID: string;
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
