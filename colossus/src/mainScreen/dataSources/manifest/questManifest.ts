/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { PerkRewardDefGQL, ProfileLockDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { QuestStaticData, updateQuestStaticData } from '../../redux/questSlice';

export const questManifestID = 'quests';

// Keep in sync with QuestType.cs
export enum QuestType {
  Invalid = 'Invalid',
  Normal = 'Normal',
  BattlePass = 'BattlePass',
  DailyNormal = 'DailyNormal',
  DailyHard = 'DailyHard',
  Champion = 'Champion',
  SubQuest = 'SubQuest'
}

export interface QuestLinkDef {
  progress: number;
  rewards: PerkRewardDefGQL[];
  premiumRewards: PerkRewardDefGQL[];
  rewardImageOverride: string;
  rewardNameOverride: string;
  rewardDescriptionOverride: string;
  premiumRewardImageOverride: string;
  premiumRewardNameOverride: string;
  premiumRewardDescriptionOverride: string;
}

export interface QuestDef {
  id: string;
  name: string;
  shortName: string;
  description: string;
  questLock: ProfileLockDefGQL[];
  premiumLock: ProfileLockDefGQL[];
  links: QuestLinkDef[];
  questType: QuestType;
  subQuestIDs: string[];
  displaySubQuests: boolean;
  previewDate: string;
  comingSoonImage: string;
  currentBackgroundImage: string;
  expiredImage: string;
  endedSplashImage: string;
  startedSplashImage: string;
}

export function processQuests(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isQuestData)) {
    console.error('Invalid Quest manifest file');
    return;
  }

  const staticData: QuestStaticData = {
    quests: {
      Invalid: [],
      Normal: [],
      BattlePass: [],
      DailyNormal: [],
      DailyHard: [],
      Champion: [],
      SubQuest: []
    },
    questsById: {}
  };

  for (const quest of json.defs) {
    switch (version) {
      case 1:
        staticData.questsById[quest.id] = {
          id: quest.id,
          name: quest.name,
          shortName: quest.shortName,
          description: quest.description,
          questLock: quest.questLock,
          premiumLock: quest.premiumLock,
          links: quest.links,
          questType: quest.questType,
          subQuestIDs: quest.subQuestIDs,
          displaySubQuests: quest.displaySubQuests,
          previewDate: quest.previewDate,
          comingSoonImage: quest.comingSoonImage,
          currentBackgroundImage: quest.currentBackgroundImage,
          expiredImage: quest.expiredImage,
          endedSplashImage: quest.endedSplashImage,
          startedSplashImage: quest.startedSplashImage
        };

        const questType: QuestType = quest.questType;
        if (staticData.quests[questType]) {
          staticData.quests[questType].push(staticData.questsById[quest.id]);
        } else {
          staticData.quests.Invalid.push(staticData.questsById[quest.id]);
          console.warn('Received static quest data with invalid questType', quest);
        }

        break;
    }
  }

  // Sort quests by their start date (if specified).
  staticData.quests.BattlePass.sort(sortQuestsByStartDate);
  staticData.quests.DailyNormal.sort(sortQuestsByStartDate);
  staticData.quests.DailyHard.sort(sortQuestsByStartDate);

  dispatch(updateQuestStaticData(staticData));
}

function sortQuestsByStartDate(a: QuestDef, b: QuestDef): number {
  const aStartDateLock = a.questLock?.find((lock) => {
    return lock.startTime != null;
  });
  const bStartDateLock = b.questLock?.find((lock) => {
    return lock.startTime != null;
  });

  // Quests without start dates come first in the array, then sorted by start date.
  if (!bStartDateLock) {
    return 1;
  } else if (!aStartDateLock) {
    return -1;
  }

  const aStartDate: Date = new Date(aStartDateLock.startTime);
  const bStartDate: Date = new Date(bStartDateLock.startTime);

  return aStartDate.getTime() - bStartDate.getTime();
}

function isQuestData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 16 &&
        'id' in obj &&
        'name' in obj &&
        'shortName' in obj &&
        'description' in obj &&
        'questLock' in obj &&
        'premiumLock' in obj &&
        'links' in obj &&
        'questType' in obj &&
        'subQuestIDs' in obj &&
        'displaySubQuests' in obj &&
        'previewDate' in obj &&
        'comingSoonImage' in obj &&
        'currentBackgroundImage' in obj &&
        'expiredImage' in obj &&
        'endedSplashImage' in obj &&
        'startedSplashImage' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Quest object`, obj);
      } else if (!Array.isArray(obj.questLock)) {
        console.error(`Found invalid questLock array in Quests object`, obj);
        return false;
      } else if (!Array.isArray(obj.premiumLock)) {
        console.error(`Found invalid premiumLock array in Quests object`, obj);
        return false;
      } else if (!Array.isArray(obj.links)) {
        console.error(`Found invalid links array in Quests object`, obj);
        return false;
      } else if (!Array.isArray(obj.subQuestIDs)) {
        console.error(`Found invalid subQuestIDs array in Quests object`, obj);
        return false;
      } else {
        for (const lock of obj.questLock) {
          if (!isLockData(lock, version)) {
            console.error(`Found invalid Quests questLock object`, lock);
            return false;
          }
        }

        for (const lock of obj.premiumLock) {
          if (!isLockData(lock, version)) {
            console.error(`Found invalid Quests premiumLock object`, lock);
            return false;
          }
        }

        for (const link of obj.links) {
          if (!isLinkData(link, version)) {
            console.error(`Found invalid Quests link object`, link);
            return false;
          }
        }
      }

      return isCorrectType;
    default:
      console.error(`Found invalid Quest version ${version}`);
      return false;
  }
}

function isLockData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 7 &&
        'endTime' in obj &&
        'invertConditions' in obj &&
        'perkID' in obj &&
        'progressionNodeID' in obj &&
        'questID' in obj &&
        'questLevel' in obj &&
        'startTime' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid quest Lock object`, obj);
      }

      return isCorrectType;
    default:
      console.error(`Found invalid quest Lock version ${version}`);
      return false;
  }
}

function isLinkData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isValidObject =
        Object.keys(obj).length === 9 &&
        'progress' in obj &&
        'rewards' in obj &&
        'premiumRewards' in obj &&
        'rewardImageOverride' in obj &&
        'rewardNameOverride' in obj &&
        'rewardDescriptionOverride' in obj &&
        'premiumRewardImageOverride' in obj &&
        'premiumRewardNameOverride' in obj &&
        'premiumRewardDescriptionOverride' in obj;
      if (!isValidObject) {
        return false;
      } else if (!Array.isArray(obj.rewards)) {
        console.error(`Found invalid quest.link.rewards array in Quests object`, obj);
        return false;
      } else if (!Array.isArray(obj.premiumRewards)) {
        console.error(`Found invalid quest.link.premiumRewards array in Quests object`, obj);
        return false;
      } else {
        for (const reward of obj.rewards) {
          if (!isRewardData(reward, version)) {
            console.error(`Found invalid quest.link.rewards object`, reward);
            return false;
          }
        }

        for (const reward of obj.premiumRewards) {
          if (!isRewardData(reward, version)) {
            console.error(`Found invalid quest.link.premiumRewards object`, reward);
            return false;
          }
        }
      }
      return true;
    default:
      console.error(`Found invalid quest Lock version ${version}`);
      return false;
  }
}

function isRewardData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      return Object.keys(obj).length === 2 && 'perkID' in obj && 'qty' in obj;
    default:
      console.error(`Found invalid quest reward version ${version}`);
      return false;
  }
}
