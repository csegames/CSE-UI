/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { includes } from 'lodash';
import { SimpleCharacter, Archetype, Race } from '../api/helpers';
import { ArchetypeInfo, Faction } from '../api/webapi';

export function shouldFlipCharImage(character: SimpleCharacter) {
  return character.archetype === Archetype.WintersShadow;
}

export function getCharImage(character: SimpleCharacter) {
  if (!character || !character.race || !character.gender || !character.archetype) return '';

  let race = Race[character.race].toLowerCase();
  if (includes(race, 'human')) {
    race = 'human';
  }

  const archetype = Archetype[character.archetype].toLowerCase();
  const gender = (character.gender as any) === 'Male' ? 'm' : 'f';

  return `/ui/images/classes/${race}-${gender}-${archetype}.png`;
}

// TODO: Dont use healers as default, we don't have any videos for the newer classes
export function getClassMedia(archetype: ArchetypeInfo): [string, string] {
  let videoTitle = 'healers';
  switch (archetype.stringID) {
    case Archetype.WintersShadow:
      videoTitle = 'class_archer';
      break;
    case Archetype.ForestStalker:
      videoTitle = 'class_archer';
      break;
    case Archetype.Blackguard:
      videoTitle = 'class_archer';
      break;
    case Archetype.BlackKnight:
      videoTitle = 'heavy';
      break;
    case Archetype.Fianna:
      videoTitle = 'heavy';
      break;
    case Archetype.Mjolnir:
      videoTitle = 'heavy';
      break;
    case Archetype.Physician:
      videoTitle = 'healers';
      break;
    case Archetype.Empath:
      videoTitle = 'healers';
      break;
    case Archetype.Stonehealer:
      videoTitle = 'healers';
      break;
    case Archetype.FlameWarden:
      videoTitle = 'healers';
      break;
    case Archetype.Druid:
      videoTitle = 'healers';
      break;
    case Archetype.WaveWeaver:
      videoTitle = 'healers';
      break;
  }

  return [`videos/${videoTitle}.webm`, `videos/${videoTitle}.jpg`];
}

export function getRaceMedia(race: Race): [string, string] {
  return [`videos/healers.webm`, `videos/healers.jpg`];
}

export function getFactionMedia(faction: Faction): [string, string] {
  switch (faction) {
    case Faction.Arthurian:
      return [`videos/arthurian.webm`, `videos/Arthurian-bg.jpg`];
    case Faction.TDD:
      return [`videos/TDD.webm`, `videos/TDD-bg.jpg`];
    case Faction.Viking:
      return [`videos/Viking.webm`, `videos/Viking-bg.jpg`];
  }
  return [`videos/arthurian.webm`, `videos/Arthurian-bg.jpg`];
}
