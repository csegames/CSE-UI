/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { CharacterKind } from '@csegames/library/dist/camelotunchained/game/types/CharacterKind';

import NPCTierIconMinor from '../../images/unit-frames/npc-tier-icon-minor.png';
import NPCTierIconElite from '../../images/unit-frames/npc-tier-icon-elite.png';
import NPCTierIconStrongElite from '../../images/unit-frames/npc-tier-icon-strongelite.png';
import NPCTierIconUnique from '../../images/unit-frames/npc-tier-icon-unique.png';
import NPCTierIconMiniboss from '../../images/unit-frames/npc-tier-icon-miniboss.png';
import NPCTierIconBoss from '../../images/unit-frames/npc-tier-icon-boss.png';

export function getNPCTierIconImage(characterKind: CharacterKind | undefined): string {
  switch (characterKind) {
    case CharacterKind.MinorNPC:
      return NPCTierIconMinor;
    case CharacterKind.EliteNPC:
      return NPCTierIconElite;
    case CharacterKind.StrongEliteNPC:
      return NPCTierIconStrongElite;
    case CharacterKind.UniqueNPC:
      return NPCTierIconUnique;
    case CharacterKind.MiniBossNPC:
      return NPCTierIconMiniboss;
    case CharacterKind.BossNPC:
      return NPCTierIconBoss;
    default:
      return NPCTierIconMinor;
  }
}
