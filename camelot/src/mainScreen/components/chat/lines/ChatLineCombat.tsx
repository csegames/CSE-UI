import * as React from 'react';
import { ChatLine } from '../ChatLine';
import { ChatScopes } from '@csegames/library/dist/camelotunchained/game/types/ChatTypes';
import { CombatEvent } from '@csegames/library/dist/_baseGame/types/CombatEvent';
import { StringTableEntryDef } from '../../../dataSources/manifest/stringTableManifest';
import { store } from '../../../redux/store';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralBar,
  StringIDGeneralMinusPre,
  StringIDGeneralPlusPre
} from '../../../helpers/stringTableHelpers';
import { AbilityTrackFlags } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import { ActiveEffectAction } from '@csegames/library/dist/_baseGame/types/ActiveEffectAction';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { allChatScopeDisplayData } from '../ChatScopes';

const StringIDChatCombatEventHeader = 'ChatCombatEventHeader';
const StringIDChatCombatEventDisruptionInfo = 'ChatCombatEventDisruptionInfo';
const StringIDChatCombatEventDisruptionTracks = 'ChatCombatEventDisruptionTracks';
const StringIDChatCombatEventHeal = 'ChatCombatEventHeal';
const StringIDChatCombatEventImpulse = 'ChatCombatEventImpulse';

export class ChatLineCombat extends ChatLine {
  constructor(readonly combatEvent: CombatEvent) {
    super(ChatScopes.Combat);
  }

  render(): React.ReactChild {
    const stringTable = store.getState().stringTable.stringTable;
    return (
      <div key={this.id} style={{ color: allChatScopeDisplayData[ChatScopes.Combat].color }}>
        <span>
          {this.renderCombatEventHeader(stringTable)}
          {this.combatEvent.disruption && this.renderCombatEventDisruption(stringTable)}
          {this.combatEvent.resources && this.renderCombatEventResources(stringTable)}
          {this.combatEvent.impulse && this.renderCombatEventImpulse(stringTable)}
          {this.combatEvent.activeEffects && this.renderCombatActiveEffects(stringTable)}
          {this.combatEvent.statuses && this.renderCombatStatuses(stringTable)}
          {this.combatEvent.errors && this.renderCombatErrors(stringTable)}
        </span>
      </div>
    );
  }

  renderCombatEventHeader(stringTable: Record<string, StringTableEntryDef>): JSX.Element {
    const headerText = getTokenizedStringTableValue(StringIDChatCombatEventHeader, stringTable, {
      FROM_NAME: this.combatEvent.fromName,
      FROM_FACTION: Faction[this.combatEvent.fromFaction],
      TO_NAME: this.combatEvent.toName,
      TO_FACTION: Faction[this.combatEvent.toFaction]
    });
    const headerSeparator = getStringTableValue(StringIDGeneralBar, stringTable);
    return <span>{`${headerText} ${headerSeparator} `}</span>;
  }

  renderCombatEventDisruption(stringTable: Record<string, StringTableEntryDef>): JSX.Element {
    const disruption = this.combatEvent.disruption!;

    const disruptionInfo = getTokenizedStringTableValue(StringIDChatCombatEventDisruptionInfo, stringTable, {
      RECEIVED: disruption.received.toFixed(0),
      DIFF: Math.abs(disruption.sent - disruption.received).toFixed(0),
      SOURCE: disruption.source
    });
    const disruptionSeparator = getStringTableValue(StringIDGeneralBar, stringTable);
    const disruptionTracks = getTokenizedStringTableValue(StringIDChatCombatEventDisruptionTracks, stringTable, {
      TRACKS: AbilityTrackFlags[disruption.tracksInterrupted!]
    });
    return (
      <span>
        {`${disruptionInfo} ${disruptionSeparator} `}
        {disruption.tracksInterrupted !== AbilityTrackFlags.None && disruptionTracks}
        {` ${disruptionSeparator} `}
      </span>
    );
  }

  renderCombatEventResources(stringTable: Record<string, StringTableEntryDef>): JSX.Element {
    const entityResourcesByNumericID = store.getState().gameDefs.entityResourcesByNumericID;
    const damageTypesByNumericID = store.getState().gameDefs.damageTypesByNumericID;
    return (
      <span>
        {this.combatEvent.resources!.map((resource): string => {
          const resourceDef = entityResourcesByNumericID[resource.resourceNumericID];
          if (resourceDef) {
            if (resourceDef.id == EntityResourceIDs.Health) {
              if (resource.amount > 0) {
                return `${getTokenizedStringTableValue(StringIDChatCombatEventHeal, stringTable, {
                  AMOUNT: resource.amount.toFixed(0)
                })} ${getStringTableValue(StringIDGeneralBar, stringTable)} `;
              } else {
                return `${resource.amount.toFixed(0)} ${
                  damageTypesByNumericID[resource.damageTypeNumericID]?.name ?? ''
                } `;
              }
            } else {
              return `${resource.amount.toFixed(0)} ${resourceDef.name} ${getStringTableValue(
                StringIDGeneralBar,
                stringTable
              )} `;
            }
          }
          return '';
        })}
      </span>
    );
  }

  renderCombatEventImpulse(stringTable: Record<string, StringTableEntryDef>): JSX.Element {
    const impulse = this.combatEvent.impulse!;
    return (
      <span>
        {`${getTokenizedStringTableValue(StringIDChatCombatEventImpulse, stringTable, {
          RECEIVED: impulse.received.toFixed(0),
          DIFF: Math.abs(impulse.sent - impulse.received).toFixed(0)
        })} ${getStringTableValue(StringIDGeneralBar, stringTable)} `}
      </span>
    );
  }

  renderCombatActiveEffects(stringTable: Record<string, StringTableEntryDef>): JSX.Element {
    return (
      <span>
        {this.combatEvent.activeEffects!.map((activeEffect, activeEffectIndex) => (
          <span key={activeEffectIndex}>
            {`${activeEffect.name} ${ActiveEffectAction[activeEffect.action]} `}
            {activeEffect.action === ActiveEffectAction.Applied && `${activeEffect.duration} `}
          </span>
        ))}
        {` ${getStringTableValue(StringIDGeneralBar, stringTable)} `}
      </span>
    );
  }

  renderCombatStatuses(stringTable: Record<string, StringTableEntryDef>): JSX.Element {
    return (
      <span>
        {this.combatEvent.statuses!.map(
          (eventStatus): string =>
            `${getTokenizedStringTableValue(
              eventStatus.action ? StringIDGeneralMinusPre : StringIDGeneralPlusPre,
              stringTable,
              {
                VALUE: eventStatus.name
              }
            )} ${getStringTableValue(StringIDGeneralBar, stringTable)} `
        )}
      </span>
    );
  }

  renderCombatErrors(stringTable: Record<string, StringTableEntryDef>): JSX.Element {
    return (
      <span>
        {this.combatEvent.errors!.map(
          (error): string => `${error.msg} ${getStringTableValue(StringIDGeneralBar, stringTable)} `
        )}
      </span>
    );
  }
}
