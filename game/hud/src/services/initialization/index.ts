/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  events,
  client,
  signalr,
  CombatLog,
  Faction,
  bodyParts,
  damageTypes,
  skillTracks,
  resourceTypes,
  activeEffectActions,
} from '@csegames/camelot-unchained';
import slashCommands from './slashCommands';

export default () => {
  slashCommands();

  signalr.initializeSignalR();

  client.OnToggleHUDItem((name: string) => {
    events.fire('hudnav--navigate', name);
  });

  client.OnCharacterZoneChanged((id: string) => {
    window['zoneID'] = id;
  });

  function combatLogToString(log: CombatLog): string {
    // fromName (fromFaction) > toName
    // (toFaction) | {damages} | {disruption} | {heals} | {cures} | {resources} | {impulse} | {activeEffects}
    //
    // {damages} (RED) => received (sent - received) part type  [100(20) RIGHTLEG SLASHING]
    // {disruption} (ORANGE) => received (sent - received) tracks  [100(20) PRIMARYWEAPON]
    // {resources} (YELLOW) => received (sent - received) type
    // {heals} (GREEN) => received (sent - received) part
    // {cures} (BLUE) => HEAD(2) TORSO
    // {impulse} (INDIGO) => received (sent - received) IMPULSE
    // {activeEffects} (VIOLET) => activeEffects[0] activeEffects[1] ...
    if (!log) return;
    let output = `${log.fromName}(${Faction[log.fromFaction]}) > ${log.toName}(${Faction[log.toFaction]}) | `;

    if (log.damages) {
      for (let i = 0; i < log.damages.length; ++i) {
        const d = log.damages[i];
        output += `::red::${d.received.toFixed(0)}(${Math.abs(d.sent - d.received).toFixed(0)}) ${bodyParts[d.part]}
        ${damageTypes[d.type]} | `;
      }
    }


    if (log.disruption) {
      output += `::orange::${log.disruption.received.toFixed(0)}(${Math.abs(log.disruption.sent - log.disruption.received)
        .toFixed(0)}) DISRUPTION ${log.disruption.source} `;

      if (log.disruption.tracksInterrupted === skillTracks.NONE) {
        output += ` | `;

      } else {

        if (log.disruption.tracksInterrupted & skillTracks.BOTHWEAPONS) {
          output += ` ${skillTracks[skillTracks.BOTHWEAPONS]}`;
        } else if (log.disruption.tracksInterrupted & skillTracks.PRIMARYWEAPON) {
          output += ` ${skillTracks[skillTracks.PRIMARYWEAPON]} `;
        } else if (log.disruption.tracksInterrupted & skillTracks.SECONDARYWEAPON) {
          output += ` ${skillTracks[skillTracks.SECONDARYWEAPON]} `;
        }

        if (log.disruption.tracksInterrupted & skillTracks.VOICE) {
          output += ` ${skillTracks[skillTracks.VOICE]} `;
        }

        if (log.disruption.tracksInterrupted & skillTracks.MIND) {
          output += ` ${skillTracks[skillTracks.MIND]} `;
        }

        output += ` INTERRUPTED | `;
      }
    }

    if (log.heals) {
      for (let i = 0; i < log.heals.length; ++i) {
        const h = log.heals[i];
        output += `::green::HEALED ${h.received.toFixed(0)}(${Math.abs(h.sent - h.received).toFixed(0)})
        ${bodyParts[h.part]} | `;
      }
    }

    if (log.cures) {
      output += `::blue::CURED `;
      const curedParts = [0, 0, 0, 0, 0, 0];
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
        output += `::yellow::${d.received.toFixed(0)}(${Math.abs(d.sent - d.received).toFixed(0)})
        ${resourceTypes[d.type]} | `;
      }
    }

    if (log.impulse) {
      output += `::indigo::${log.impulse.received.toFixed(0)}(${Math.abs(log.impulse.sent - log.impulse.received)
        .toFixed(0)}) IMPULSE | `;
    }

    if (log.activeEffects) {
      for (let i = 0; i < log.activeEffects.length; ++i) {
        output += `::violet::${log.activeEffects[i].name} ${activeEffectActions[log.activeEffects[i].action]} `;
        if (log.activeEffects[i].action === activeEffectActions.APPLIED) output += `${log.activeEffects[i].duration} `;
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
  combatLogToString(null);

  let combatLogTimeout: number = null;
  let batchedCombatLogs: string[] = [];
  client.OnCombatLogEvent((logs: CombatLog[]) => {
    const combatLogs = logs.map(combatLogToString);
    if (combatLogTimeout) {
      clearTimeout(combatLogTimeout);
      batchedCombatLogs = batchedCombatLogs.concat(combatLogs);
      combatLogTimeout = window.setTimeout(() => {
        events.fire('combatlog_message', batchedCombatLogs);
        batchedCombatLogs = [];
        combatLogTimeout = null;
      }, 500);
      return;
    }
    combatLogTimeout = window.setTimeout(() => {
      events.fire('combatlog_message', combatLogs);
      combatLogTimeout = null;
    }, 500);
  });


  // hook up for console messages to system messages
  let consoleLogTimeout: number = null;
  let batchedConsoleLogs: string[] = [];
  client.OnConsoleText((text: string) => {
    if (consoleLogTimeout) {
      clearTimeout(consoleLogTimeout);
      batchedConsoleLogs = batchedConsoleLogs.concat(text);
      consoleLogTimeout = window.setTimeout(() => {
        events.fire('system_message', batchedConsoleLogs);
        batchedConsoleLogs = [];
        consoleLogTimeout = null;
      }, 500);
      return;
    }

    consoleLogTimeout = window.setTimeout(() => {
      events.fire('system_message', text);
      consoleLogTimeout = null;
    }, 500);
  });
};
