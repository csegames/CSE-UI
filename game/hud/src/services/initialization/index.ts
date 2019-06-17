/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import slashCommands from './slashCommands';
import windowEventThrottling from './windowEventThrottling';

export default () => {
  game.store.init();
  slashCommands();
  windowEventThrottling();

  function combatLogToString(log: CombatEvent): string {
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
        output += `::red::${d.received.toFixed(0)}(${Math.abs(d.sent - d.received).toFixed(0)}) ${BodyPart[d.part]}
        ${DamageType[d.type]} | `;
      }
    }


    if (log.disruption) {
      output += `::orange::${log.disruption.received.toFixed(0)}(${Math.abs(log.disruption.sent - log.disruption.received)
        .toFixed(0)}) DISRUPTION ${log.disruption.source} `;

      if (log.disruption.tracksInterrupted === AbilityTrack.None) {
        output += ` | `;

      } else {

        if (log.disruption.tracksInterrupted & AbilityTrack.BothWeapons) {
          output += ` ${AbilityTrack[AbilityTrack.BothWeapons]}`;
        } else if (log.disruption.tracksInterrupted & AbilityTrack.PrimaryWeapon) {
          output += ` ${AbilityTrack[AbilityTrack.PrimaryWeapon]} `;
        } else if (log.disruption.tracksInterrupted & AbilityTrack.SecondaryWeapon) {
          output += ` ${AbilityTrack[AbilityTrack.SecondaryWeapon]} `;
        }

        if (log.disruption.tracksInterrupted & AbilityTrack.Voice) {
          output += ` ${AbilityTrack[AbilityTrack.Voice]} `;
        }

        if (log.disruption.tracksInterrupted & AbilityTrack.Mind) {
          output += ` ${AbilityTrack[AbilityTrack.Mind]} `;
        }

        output += ` INTERRUPTED | `;
      }
    }

    if (log.heals) {
      for (let i = 0; i < log.heals.length; ++i) {
        const h = log.heals[i];
        output += `::green::HEALED ${h.received.toFixed(0)}(${Math.abs(h.sent - h.received).toFixed(0)})
        ${BodyPart[h.part]} | `;
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
          output += ` ${BodyPart[i]}(${curedParts[i]}) `;
        }
      }

      output += '| ';
    }

    if (log.resources) {
      for (let i = 0; i < log.resources.length; ++i) {
        const d = log.resources[i];
        output += `::yellow::${d.received.toFixed(0)}(${Math.abs(d.sent - d.received).toFixed(0)})
        ${EntityResourceType[d.type]} | `;
      }
    }

    if (log.impulse) {
      output += `::indigo::${log.impulse.received.toFixed(0)}(${Math.abs(log.impulse.sent - log.impulse.received)
        .toFixed(0)}) IMPULSE | `;
    }

    if (log.activeEffects) {
      for (let i = 0; i < log.activeEffects.length; ++i) {
        output += `::violet::${log.activeEffects[i].name} ${ActiveEffectAction[log.activeEffects[i].action]} `;
        if (log.activeEffects[i].action === ActiveEffectAction.Applied) output += `${log.activeEffects[i].duration} `;
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

  game.onCombatEvent((logs: CombatEvent[]) => {
    const combatLogs = logs.map(combatLogToString);
    game.trigger('combatlog_message', combatLogs);
  });


  // hook up for console messages to system messages
  game.onConsoleText((text: string) => {
    game.trigger('systemMessage', text);
  });
};
