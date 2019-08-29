/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  class FactionExt {
    public static abbreviation(faction: Faction): string;
    public static gqlToEnum(factionName: string): Faction;
  }
  interface Window {
    FactionExt: typeof FactionExt;
  }
}

class FactionExt {
  public static abbreviation(faction: Faction) {
    switch (faction) {
      case Faction.Arthurian: return 'art';
      case Faction.TDD: return 'tdd';
      case Faction.Viking: return 'vik';
      default: '';
    }
  }
  public static gqlToEnum(factionName: string): Faction {
    switch (factionName) {
      case Faction[Faction.Arthurian]: return Faction.Arthurian;
      case Faction[Faction.TDD]: return Faction.TDD;
      case Faction[Faction.Viking]: return Faction.Viking;
      default:
      case Faction[Faction.Factionless]: return Faction.Factionless;
    }
  }
}
window.FactionExt = FactionExt;
