/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@reduxjs/toolkit';
import { TagState } from '../../../../library/dist/camelotunchained/game/GameClientModels/EntityState';

export enum MatchMode {
  All,
  Any,
  None
}

export function getTagFromString(tagString: string, tagAffixTable: Record<string, number>): TagState {
  if (!tagString) {
    console.error('Called getTagFromString w/o a tagString');
    return { affixes: [], count: 0 };
  }

  if (!tagAffixTable) {
    console.error('Called getTagFromString w/o a stringTable');
    return { affixes: [], count: 0 };
  }

  var regex: RegExp = /^\s*(\w+(?:.\w+)*)\s*$/;
  if (!regex.test(tagString)) {
    console.error('Called getTagFromString w/ an invalid tag');
    return { affixes: [], count: 0 };
  }

  let affixes: Record<number, number> = {};

  let i = 0;

  let split = tagString.split('.');
  for (var index in split) {
    const affixValue = tagAffixTable[split[index]];
    if (!affixValue) {
      console.error(`Failed to find tag affix ${split[index]}`);
      return { affixes: [], count: 0 };
    }
    affixes[i] = affixValue;
    i++;
  }

  return { affixes: affixes, count: 1 };
}

export function getEntityTagStrings(tags: Record<string, TagState>, tagAffixByNumericID: Record<number, string>): string[] {
  return Object.values(tags ?? {}).map((tag) =>
    getStringFromTagAffixIDs(Object.values(tag?.affixes ?? {}), tagAffixByNumericID)
  );
}

export function getStringFromTagAffixIDs(affixIDs: number[], tagAffixTable: Record<number, string>): string {
  if (affixIDs.length == 0) {
    console.error('Called getStringFromTagAffixIDs w/ an empty affixID list');
    return '';
  }

  if (!tagAffixTable) {
    console.error('Called getStringFromTagAffixIDs w/o a stringTable');
    return '';
  }

  let affixes: string[] = affixIDs.map((id) => {
    const tag = tagAffixTable[id];
    if (tag) {
      return tag;
    }
    console.error(`Failed to find tag affix id ${id}`);
    return '';
  });

  return affixes.join('.');
}

// Tag A will now match Tag B if either
// - Tag A exactly matches Tag B
// - Tag A is a full word prefix of Tag B (prefix where the next character is the delimeter '.')
// Examples:
// 'fire.hot' matches 'fire.hot'
// 'fire.hot' matches 'fire.hot.very'
// 'fire.hot' doesn't match 'fire'
// 'fire.hot' doesn't match 'fire.hotter'
function tagMatches(tag: TagState, tagToMatch: TagState): boolean {
  if (!tag) {
    console.error('Called tagMatches w/o a tag');
    return false;
  }

  if (!tagToMatch) {
    console.error('Called tagMatches w/o a tagToMatch');
    return false;
  }

  if (Object.keys(tag.affixes).length == 0) {
    console.error(`Called tagMatches w/ an empty tag`);
    return false;
  }

  if (Object.keys(tagToMatch.affixes).length == 0) {
    console.error(`Called tagMatches w/ an empty tagToMatch`);
    return false;
  }

  if (Object.keys(tag.affixes).length > Object.keys(tagToMatch.affixes).length) {
    return false;
  }

  for (let i = 0; i < Object.keys(tag.affixes).length; ++i) {
    if (tag.affixes[i] != tagToMatch.affixes[i]) {
      return false;
    }
  }

  return true;
}

export function tagMatchesAny(tags: Dictionary<TagState>, tagToMatch: TagState): boolean {
  if (!tags) {
    console.error('Called tagMatchesAny w/o tags');
    return false;
  }

  if (!tagToMatch) {
    console.error('Called tagMatchesAny w/o a tagToMatch');
    return false;
  }

  for (let index in tags) {
    if (tagMatches(tags[index], tagToMatch)) {
      return true;
    }
  }
  return false;
}

function tagsMatchAll(tags: Dictionary<TagState>, tagsToMatch: TagState[]): boolean {
  if (!tags) {
    console.error('Called tagsMatchAll w/o tags');
    return false;
  }

  if (!tagsToMatch) {
    console.error('Called tagsMatchAll w/o tagsToMatch');
    return false;
  }

  for (let index in tagsToMatch) {
    if (tagMatchesAny(tags, tagsToMatch[index]) == false) {
      return false;
    }
  }
  return true;
}

function tagsMatchAny(tags: Dictionary<TagState>, tagsToMatch: TagState[]): boolean {
  if (!tags) {
    console.error('Called tagsMatchAny w/o tags');
    return false;
  }

  if (!tagsToMatch) {
    console.error('Called tagsMatchAny w/o tagsToMatch');
    return false;
  }

  for (let index in tagsToMatch) {
    if (tagMatchesAny(tags, tagsToMatch[index])) {
      return true;
    }
  }
  return false;
}

function tagsMatchNone(tags: Dictionary<TagState>, tagsToMatch: TagState[]): boolean {
  if (!tags) {
    console.error('Called tagsMatchNone w/o tags');
    return false;
  }

  if (!tagsToMatch) {
    console.error('Called tagsMatchNone w/o tagsToMatch');
    return false;
  }

  for (let index in tagsToMatch) {
    if (tagMatchesAny(tags, tagsToMatch[index])) {
      return false;
    }
  }
  return true;
}

export function tagsMatch(
  tags: Dictionary<TagState>,
  tagsToMatch: TagState[],
  matchMode: MatchMode = MatchMode.All
): boolean {
  if (!tags) {
    console.error('Called tagsMatch w/o tags');
    return false;
  }

  if (!tagsToMatch) {
    console.error('Called tagsMatch w/o tagsToMatch');
    return false;
  }

  switch (matchMode) {
    case MatchMode.All:
      return tagsMatchAll(tags, tagsToMatch);
    case MatchMode.Any:
      return tagsMatchAny(tags, tagsToMatch);
    case MatchMode.None:
      return tagsMatchNone(tags, tagsToMatch);
    default:
      console.error(`Called tagsMatch with invalid MatchMode ${matchMode}`);
      return false;
  }
}

function tagCountMatches(tags: Dictionary<TagState>, tagToMatch: TagState): number {
  if (!tags) {
    console.error('Called tagCountMatches w/o tags');
    return 0;
  }

  if (!tagToMatch) {
    console.error('Called tagCountMatches w/o a tagToMatch');
    return 0;
  }

  let count = 0;
  for (let index in tags) {
    if (tagMatches(tags[index], tagToMatch)) {
      count += tags[index].count;
    }
  }
  return count;
}

export function tagsCountMatches(tags: Dictionary<TagState>, tagsToMatch: TagState[]): number {
  if (!tags) {
    console.error('Called tagsCountMatches w/o tags');
    return 0;
  }

  if (!tagsToMatch) {
    console.error('Called tagsCountMatches w/o tagsToMatch');
    return 0;
  }

  let count = 0;
  for (let index in tagsToMatch) {
    count += tagCountMatches(tags, tagsToMatch[index]);
  }
  return count;
}
