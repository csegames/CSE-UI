/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  events,
  client,
  hasClientAPI,
  signalr,
  CombatLog,
  Faction,
  bodyParts,
  damageTypes,
  skillTracks,
  resourceTypes,
  activeEffectActions,
} from 'camelot-unchained';
import slashCommands from './slashCommands';

export default () => {
  slashCommands();

  signalr.initializeSignalR();

  if (!hasClientAPI()) return;
  // hook up for console messages to system messages
  client.OnConsoleText((text: string) => events.fire('system_message', text));

  function combatLogToString(log: CombatLog): string {
    // fromName (fromFaction) > toName (toFaction) | {damages} | {disruption} | {heals} | {cures} | {resources} | {impulse} | {activeEffects}
    //
    // {damages} (RED) => recieved (sent - recieved) part type  [100(20) RIGHTLEG SLASHING]
    // {disruption} (ORANGE) => recieved (sent - receieved) tracks  [100(20) PRIMARYWEAPON]
    // {resources} (YELLOW) => recieved (sent - recieved) type
    // {heals} (GREEN) => recieved (sent - recieved) part
    // {cures} (BLUE) => HEAD(2) TORSO
    // {impulse} (INDIGO) => recieved (sent - recieved) IMPULSE 
    // {activeEffects} (VIOLET) => activeEffects[0] activeEffects[1] ...

    let output = `${log.fromName}(${Faction[log.fromFaction]}) > ${log.toName}(${Faction[log.toFaction]}) | `;

    if (log.damages) {
      for (let i = 0; i < log.damages.length; ++i) {
        const d = log.damages[i];
        output += `::red::${d.recieved.toFixed(0)}(${Math.abs(d.sent - d.recieved).toFixed(0)}) ${bodyParts[d.part]} ${damageTypes[d.type]} | `;
      }
    }
  

    if (log.disruption) {
      output += `::orange::${log.disruption.recieved.toFixed(0)}(${Math.abs(log.disruption.sent - log.disruption.recieved).toFixed(0)}) DISRUPTION ${log.disruption.source} `;

      if (log.disruption.tracksInterupted == skillTracks.NONE) {
        output += ` | `;

      } else {

        if (log.disruption.tracksInterupted & skillTracks.BOTHWEAPONS) {
          output += ` ${skillTracks[skillTracks.BOTHWEAPONS]}`;
        } else if (log.disruption.tracksInterupted & skillTracks.PRIMARYWEAPON) {
          output += ` ${skillTracks[skillTracks.PRIMARYWEAPON]} `;
        } else if (log.disruption.tracksInterupted & skillTracks.SECONDARYWEAPON) {
          output += ` ${skillTracks[skillTracks.SECONDARYWEAPON]} `;
        }

        if (log.disruption.tracksInterupted & skillTracks.VOICE) {
          output += ` ${skillTracks[skillTracks.VOICE]} `;
        }
        
        if (log.disruption.tracksInterupted & skillTracks.MIND) {
          output += ` ${skillTracks[skillTracks.MIND]} `;
        }

        output += ` INTERRUPTED | `;
      }
    }

    if (log.heals) {
      for (let i = 0; i < log.heals.length; ++i) {
        const h = log.heals[i];
        output += `::green::HEALED ${h.recieved.toFixed(0)}(${Math.abs(h.sent - h.recieved).toFixed(0)}) ${bodyParts[h.part]} | `;
      }
    }

    if (log.cures) {
      output += `::blue::CURED `;
      let curedParts = [0,0,0,0,0,0];
      for (let i = 0; i < log.cures.length; ++i) {
        curedParts[log.cures[i]] += 1;
      }

      for (let i = 0; i < curedParts.length; ++i) {
        if (curedParts[i] > 0) {
          output += ` ${bodyParts[i]}(${curedParts[i]}) `;
        }
      }

      output += '| ';      
    }

    if (log.resources) {
      for (let i = 0; i < log.resources.length; ++i) {
        const d = log.resources[i];
        output += `::yellow::${d.recieved.toFixed(0)}(${Math.abs(d.sent - d.recieved).toFixed(0)}) ${resourceTypes[d.type]} | `;
      }
    }

    if (log.impulse) {
      output += `::indigo::${log.impulse.recieved.toFixed(0)}(${Math.abs(log.impulse.sent - log.impulse.recieved).toFixed(0)}) IMPULSE | `;
    }

    if (log.activeEffects) {
      for (let i = 0; i < log.activeEffects.length; ++i) {
        output += `::violet::${log.activeEffects[i].name} ${activeEffectActions[log.activeEffects[i].action]} `;
        if (log.activeEffects[i].action === activeEffectActions.APPLIED) output += `${log.activeEffects[i].duration} `
      }
      output += '|';
    }
      
    if (log.errors) {
      for (let i = 0; i < log.errors.length; ++i) {
        output += `:::red::${log.errors[i]} `;
      }
    }

    return output;
  }

  client.OnCombatLogEvent((logs: CombatLog[]) => logs.map(e => events.fire('combatlog_message', combatLogToString(e))));
}
