/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Injury } from '../../../core/core';
import { Part } from './Part';
import { Label } from './Label';
import { WoundColors } from '../classes/WoundColors';

const colors: WoundColors = new WoundColors();

const pct66: number = 2.0/3.0;
const pct33: number = 1.0/3.0;

export interface DollState { }
export interface DollProps {
  injuries: Injury[];
}

function getState(damage: number, max: number): number {
  if (max == 0)
    return 0;

  const pct: number = damage / max;
  if (pct > pct66) return 0;
  if (pct > pct33) return 1;
  if (pct > 0.0) return 2;
  return 3;
}

// TEMP: Until we know the official client Part ID map
function getPart(clientId: number): number {
  switch (clientId) {
    case 0: return 3;
    case 1: return 0;
    case 2: return 1;
    case 3: return 2;
    case 4: return 4;
    case 5: return 5;
  }
  return -1;
}

// Maps part IDs to injury objects.  If an injury for a part is not availale, returns
// an injury that represents full health

class InjuryMap {
  private map : Injury[] = [];
  public length: number = 6;
  constructor() {
    for (let i = 0; i < this.length; i++) {
      this.map[i] = new Injury();
    }
  }
  addInjury(injury:Injury) {
    this.map[injury.part].refresh(injury);
  }
  getInjury(i : number) : Injury {
    if (this.length > i && i >= 0) {
      return this.map[i];
    }
    const defaultInjury : Injury = new Injury();
    return defaultInjury;
  }
}

export class Doll extends React.Component<DollProps, DollState> {
  render() {
    const injuries = this.props.injuries;
    const parts : any [] = [];
    const labels : any [] = [];
    const map: InjuryMap = new InjuryMap();

    // Build all 6 parts, assumes full health
    // TODO: Should be necessary when client is sending all parts
    for (let i = 0; i < injuries.length; i++) {
      map.addInjury(injuries[i]);
    }

    // Replace damaged body parts
    for (let i = 0; i < map.length; i++) {
      let injury = map.getInjury(i);
      const part =  injury.empty ? getPart(i) : getPart(injury.part);
      const maxHealth = (injury.maxHealth * 3);
      const currentHealth = injury.wounds < 3 ? ((2 - injury.wounds) * injury.maxHealth) + injury.health : 0;
      const state = getState(currentHealth, maxHealth);
      const color = injury.empty ? colors.getColorForWound(0) : colors.getColorForWound(injury.health == 0 ? injury.wounds + 1 : injury.wounds);

      parts.push(
        <Part key={'part.' + part}
          part={part}
          health={currentHealth}
          max={maxHealth}
          wounds={injury.wounds}
          state={state}
          color={color}
          />
      );

      if (!injury.empty) {
        labels.push(
          <Label key={'part.' + part}
            part={part}
            value={currentHealth}
            max={maxHealth}
            color={color}
            />
        );
      }
    }

    return (
      <div className="doll">
        {parts}
        {labels}
      </div>);
  }
}

export default Doll;
