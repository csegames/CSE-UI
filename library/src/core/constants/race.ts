/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export enum race {
  NONE = -1,
  //TUATHA = 0,
  HAMADRYAD = 1,
  LUCHORPAN = 2,
  FIRBOG = 3,

  VALKYRIE = 4,
  HELBOUND = 5,
  FROSTGIANT = 6,
  //DVERGR = 7,

  STRM = 8,
  CAITSITH = 9,
  GOLEM = 10,
  //GARGOYLE = 11,

  STORMRIDERT = 12,
  STORMRIDERA = 13,
  STORMRIDERV = 14,

  HUMANMALEV = 15,
  HUMANMALEA = 16,
  HUMANMALET = 17,

  PICT = 18,
};

export function raceToString(r: race): string {
  switch(r) {
  case race.HAMADRYAD: return 'Hamadryad';
  case race.LUCHORPAN: return 'Luchorpán';
  case race.FIRBOG: return 'Fir Bog';
  case race.VALKYRIE: return 'Valkyrie';
  case race.HELBOUND: return 'Helbound';
  case race.FROSTGIANT: return 'Jötnar';
  case race.STRM: return 'St’rm';
  case race.CAITSITH: return 'Cait Sith';
  case race.GOLEM: return 'Golem';
  case race.STORMRIDERT: return 'Stormrider (T)';
  case race.STORMRIDERA: return 'Stormrider';
  case race.STORMRIDERV: return 'Stormrider (V)';
  case race.HUMANMALEV: return 'Human';
  case race.HUMANMALEA: return 'Human';
  case race.HUMANMALET: return 'Human';
  case race.PICT: return 'Pict';
  }
}

export default race;
