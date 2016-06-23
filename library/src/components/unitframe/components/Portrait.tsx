/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import race from '../../../core/constants/race';

const Portrait = React.createClass<any, any>({
  // Portrait maps race ID to name because the name is used to pick up
  // the correct portrait image (a resource we own).
  portrait(): string {
    switch (this.props.race) {
      // case race.TUATHA:	   return "Tuatha";
      case race.HAMADRYAD: return "hamadryad";
      case race.LUCHORPAN: return "luchorpan";
      case race.FIRBOG: return "firbog";
      case race.VALKYRIE: return "valkyrie";
      case race.HELBOUND: return "helbound";
      case race.FROSTGIANT: return "frostgiant";
      // case race.DVERGR:      return "Dverger";
      case race.STRM: return "strm";
      case race.CAITSITH: return "caitsith";
      case race.GOLEM: return "golem";
      // case race.GARGOYLE:    return "Gargoyle";
      case race.STORMRIDERT: return "stormridert";
      case race.STORMRIDERA: return "stormridera";
      case race.STORMRIDERV: return "stormriderv";
      case race.HUMANMALEV: return "humanmalev";
      case race.HUMANMALEA: return "humanmalea";
      case race.HUMANMALET: return "humanmalet";
    }
    return "";
  },
  render() {
    const portrait = this.portrait();
    return (<div id="portrait" className={portrait}></div>);
  }
});

export default Portrait;
