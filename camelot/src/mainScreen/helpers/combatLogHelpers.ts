/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { GameDefsState } from '../redux/gameDefsSlice';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { getStringTableValue } from './stringTableHelpers';

const StringIDChatCombatEventSourceUnknown = 'ChatCombatEventSourceUnknown';

export interface CombatEventSourceInfo {
  kind: 'status' | 'ability';
  name: string;
  description: string;
  iconURL: string;
  numericID: number;
}

export function resolveCombatEventSource(
  source: string | undefined,
  gameDefs: GameDefsState
): CombatEventSourceInfo | null {
  if (!source) {
    return null;
  }

  const statusDef = gameDefs.statusesByStringID?.[source];
  if (statusDef) {
    return {
      kind: 'status',
      name: statusDef.name,
      description: statusDef.description,
      iconURL: statusDef.iconURL,
      numericID: statusDef.numericID
    };
  }

  const abilityDisplayDef = gameDefs.abilityDisplayDefsByStringID?.[source];
  if (abilityDisplayDef) {
    return {
      kind: 'ability',
      name: abilityDisplayDef.name,
      description: abilityDisplayDef.description,
      iconURL: abilityDisplayDef.iconURL,
      numericID: abilityDisplayDef.numericID
    };
  }

  return null;
}

// Local HH:MM:SS for combat log lines, until we have a more generic chat timestamp solution
export function formatChatTimestamp(timeMs: number): string {
  const date = new Date(timeMs);
  const pad = (n: number): string => String(n).padStart(2, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

// Display key for a combat event's "source", such as a status or ability
export function getCombatSourceName(
  sourceInfo: CombatEventSourceInfo | null,
  rawSource: string | undefined,
  stringTable: Record<string, StringTableEntryDef>
): string {
  return sourceInfo?.name ?? rawSource ?? getStringTableValue(StringIDChatCombatEventSourceUnknown, stringTable);
}
