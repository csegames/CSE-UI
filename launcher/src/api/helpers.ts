/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// These enums are no longer part of the server API but are referenced in launcher UI code.
// They have been preserved here to keep that code functional but should not be carried forward
// during any rework of character creation.

import { primary } from '../api/graphql';
import { AccessType } from './webapi';

/** CU.Archetype */
export enum Archetype {
  Druid = 'Druid',
  WaveWeaver = 'WaveWeaver',
  BlackKnight = 'BlackKnight',
  Fianna = 'Fianna',
  Mjolnir = 'Mjolnir',
  Physician = 'Physician',
  Empath = 'Empath',
  Stonehealer = 'Stonehealer',
  Blackguard = 'Blackguard',
  ForestStalker = 'ForestStalker',
  WintersShadow = 'WintersShadow',
  FlameWarden = 'FlameWarden',
  Minstrel = 'Minstrel',
  DarkFool = 'DarkFool',
  Skald = 'Skald',
  Abbot = 'Abbot',
  BlessedCrow = 'BlessedCrow',
  Helbound = 'Helbound',
  Berserker = 'Berserker',
  Amazon = 'Amazon',
  Celt = 'Celt',
  Knight = 'Knight'
}

/** CU.Gender */
export enum Gender {
  None = 'None',
  Male = 'Male',
  Female = 'Female'
}

/** CU.Race */
export enum Race {
  Luchorpan = 'Luchorpan',
  Strm = 'Strm',
  Hamadryad = 'Hamadryad',
  CaitSith = 'CaitSith',
  Firbog = 'Firbog',
  Valkyrie = 'Valkyrie',
  Golem = 'Golem',
  HumanMaleV = 'HumanMaleV',
  HumanMaleA = 'HumanMaleA',
  HumanMaleT = 'HumanMaleT',
  Pict = 'Pict',
  Charlotte = 'Charlotte',
  Berserker = 'Berserker',
  MindlessDead = 'MindlessDead',
  DrySkeleton = 'DrySkeleton',
  Amazon = 'Amazon',
  Knight = 'Knight',
  Celt = 'Celt',
  Ninja = 'Ninja',
  WinterWind = 'WinterWind',
  DishonoredDead = 'DishonoredDead',
  ColossusFrostGiant = 'ColossusFrostGiant',
  ColossusFireGiant = 'ColossusFireGiant',
  DevourerGiant = 'DevourerGiant',
  CorpseGiant = 'CorpseGiant',
  Necromancer = 'Necromancer',
  Litch = 'Litch',
  Warlock = 'Warlock',
  DeathPriest = 'DeathPriest',
  PlagueBringer = 'PlagueBringer',
  ShadowWraith = 'ShadowWraith',
  LostSoul = 'LostSoul',
  SpectralAlly = 'SpectralAlly',
  SpectralWarrior = 'SpectralWarrior',
  BoneReaper = 'BoneReaper',
  DragonColossus = 'DragonColossus',
  HumanF = 'HumanF',
  DragonArthurian = 'DragonArthurian',
  DragonTDD = 'DragonTDD',
  DragonViking = 'DragonViking',
  DragonFactionless = 'DragonFactionless',
  Jotnar = 'Jotnar',
  KeepLordArthurian = 'KeepLordArthurian',
  KeepLordTDD = 'KeepLordTDD',
  KeepLordViking = 'KeepLordViking',
  KeepLordFactionless = 'KeepLordFactionless',
  KeepChampionArthurian = 'KeepChampionArthurian',
  KeepChampionTDD = 'KeepChampionTDD',
  KeepChampionViking = 'KeepChampionViking',
  KeepChampionFactionless = 'KeepChampionFactionless',
  PlaguedMindlessDead = 'PlaguedMindlessDead',
  FireDrySkeleton = 'FireDrySkeleton',
  PoisonDrySkeleton = 'PoisonDrySkeleton',
  BombDrySkeleton = 'BombDrySkeleton',
  FrostDrySkeleton = 'FrostDrySkeleton',
  BefouledDishonoredDead = 'BefouledDishonoredDead',
  GhastlyLostSoul = 'GhastlyLostSoul',
  StealerLostSoul = 'StealerLostSoul',
  BerserkerLitch = 'BerserkerLitch',
  GaseousLitch = 'GaseousLitch',
  TestCostumePerks1 = 'TestCostumePerks1',
  Any = 'Any',
  TestBoss = 'TestBoss',
  BerserkerGhostly = 'BerserkerGhostly',
  NinjaGhostly = 'NinjaGhostly',
  CeltGhostly = 'CeltGhostly',
  AmazonGhostly = 'AmazonGhostly',
  KnightGhostly = 'KnightGhostly',
  BerserkerRagnarok = 'BerserkerRagnarok',
  NinjaRagnarok = 'NinjaRagnarok',
  CeltRagnarok = 'CeltRagnarok',
  AmazonRagnarok = 'AmazonRagnarok',
  KnightRagnarok = 'KnightRagnarok',
  BerserkerColor01 = 'BerserkerColor01',
  BerserkerColor02 = 'BerserkerColor02',
  BerserkerColor03 = 'BerserkerColor03',
  BerserkerColor04 = 'BerserkerColor04',
  NinjaColor01 = 'NinjaColor01',
  NinjaColor02 = 'NinjaColor02',
  NinjaColor03 = 'NinjaColor03',
  NinjaColor04 = 'NinjaColor04',
  CeltColor01 = 'CeltColor01',
  CeltColor02 = 'CeltColor02',
  CeltColor03 = 'CeltColor03',
  CeltColor04 = 'CeltColor04',
  AmazonColor01 = 'AmazonColor01',
  AmazonColor02 = 'AmazonColor02',
  AmazonColor03 = 'AmazonColor03',
  AmazonColor04 = 'AmazonColor04',
  KnightColor01 = 'KnightColor01',
  KnightColor02 = 'KnightColor02',
  KnightColor03 = 'KnightColor03',
  KnightColor04 = 'KnightColor04'
}

// legacy version of SimpleCharacter that still uses enums
export interface SimpleCharacter {
  archetype: Archetype | null;
  faction: primary.Faction | null;
  gender: Gender | null;
  id: primary.CharacterID | null;
  lastLogin: string | null;
  name: string;
  race: Race;
  shardID: primary.ShardID;
}

// HACK [CSE-1184] - This information should be fetched from the definition data for the related data structures
// however we do not currently have support to do that everywhere, and this is a stop gap till the data is available.
export function raceString(race: Race): string {
  switch (race) {
    case Race.Luchorpan:
      return 'Luchorpán';
    case Race.HumanMaleV:
      return 'Human';
    case Race.HumanMaleA:
      return 'Human';
    case Race.HumanMaleT:
      return 'Human';
    case Race.Jotnar:
      return 'Jötnar';
    case Race.Firbog:
      return 'Fir Bog';
    case Race.Strm:
      return "St'rm";
    case Race.CaitSith:
      return 'Cait Sith';
  }

  return Race[race];
}

export function archetypeString(archetype: Archetype): string {
  switch (archetype) {
    case Archetype.BlackKnight:
      return 'Black Knight';
    case Archetype.Mjolnir:
      return 'Mjölnir';
    case Archetype.Blackguard:
      return 'Black Guard';
    case Archetype.ForestStalker:
      return 'Forest Stalker';
    case Archetype.WintersShadow:
      return "Winter's Shadow";
    case Archetype.FlameWarden:
      return 'Flame Warden';
    case Archetype.BlessedCrow:
      return 'Blessed Crow';
    case Archetype.DarkFool:
      return 'Dark Fool';
    case Archetype.WaveWeaver:
      return 'Wave Weaver';
  }

  return Archetype[archetype];
}

export function accessLevelString(access: AccessType) {
  switch (access) {
    case AccessType.Public:
      return 'Everyone';
    case AccessType.Live:
      return 'Live Backers';
    case AccessType.Beta3:
      return 'All Testers';
    case AccessType.Beta2:
      return 'Beta 1-2, Alpha, IT';
    case AccessType.Beta1:
      return 'Beta 1, Alpha, IT';
    case AccessType.Alpha:
      return 'Alpha, IT';
    case AccessType.InternalTest:
      return 'IT';
    case AccessType.Employees:
      return 'CSE';
  }
}
