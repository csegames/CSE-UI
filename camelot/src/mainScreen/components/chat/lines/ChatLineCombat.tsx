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
  StringIDGeneralComma
} from '../../../helpers/stringTableHelpers';
import { AbilityTrackFlags } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import { ActiveEffectAction } from '@csegames/library/dist/_baseGame/types/ActiveEffectAction';
import { allChatScopeDisplayData } from '../ChatScopes';
import {
  CombatEventSourceInfo,
  formatChatTimestamp,
  getCombatSourceName,
  resolveCombatEventSource
} from '../../../helpers/combatLogHelpers';

const StringIDChatCombatEventHeader = 'ChatCombatEventHeader';
const StringIDChatCombatEventHeaderSelf = 'ChatCombatEventHeaderSelf';
const StringIDChatCombatEventDisruptionInfo = 'ChatCombatEventDisruptionInfo';
const StringIDChatCombatEventDisruptionTracks = 'ChatCombatEventDisruptionTracks';
const StringIDChatCombatEventImpulse = 'ChatCombatEventImpulse';
const StringIDChatCombatEventTimestamp = 'ChatCombatEventTimestamp';
const StringIDChatCombatEventHealSelf = 'ChatCombatEventHealSelf';
const StringIDChatCombatEventHealSelfFromOther = 'ChatCombatEventHealSelfFromOther';
const StringIDChatCombatEventHealOther = 'ChatCombatEventHealOther';
const StringIDChatCombatEventHitOther = 'ChatCombatEventHitOther';
const StringIDChatCombatEventHitSelf = 'ChatCombatEventHitSelf';
const StringIDChatCombatEventHitSelfFromSelf = 'ChatCombatEventHitSelfFromSelf';
const StringIDChatCombatEventResourceGainSelf = 'ChatCombatEventResourceGainSelf';
const StringIDChatCombatEventResourceGainOther = 'ChatCombatEventResourceGainOther';
const StringIDChatCombatEventResourceLoseSelf = 'ChatCombatEventResourceLoseSelf';
const StringIDChatCombatEventResourceLoseOther = 'ChatCombatEventResourceLoseOther';
const StringIDChatCombatEventStatusApplyOther = 'ChatCombatEventStatusApplyOther';
const StringIDChatCombatEventStatusApplySelf = 'ChatCombatEventStatusApplySelf';
const StringIDChatCombatEventStatusApplySelfFromSelf = 'ChatCombatEventStatusApplySelfFromSelf';
const StringIDChatCombatEventStatusApplyNoEntity = 'ChatCombatEventStatusApplyNoEntity';
const StringIDChatCombatEventStatusRemoveOther = 'ChatCombatEventStatusRemoveOther';
const StringIDChatCombatEventStatusRemoveSelf = 'ChatCombatEventStatusRemoveSelf';
const StringIDChatCombatEventStatusRemoveSelfFromSelf = 'ChatCombatEventStatusRemoveSelfFromSelf';
const StringIDChatCombatEventStatusRemoveNoEntity = 'ChatCombatEventStatusRemoveNoEntity';
const StringIDChatCombatEventSourceUnknown = 'ChatCombatEventSourceUnknown';
const StringIDChatCombatEventKillOther = 'ChatCombatEventKillOther';
const StringIDChatCombatEventKillSelf = 'ChatCombatEventKillSelf';
const StringIDChatCombatEventDeathSelf = 'ChatCombatEventDeathSelf';
const StringIDChatCombatEventDeathOther = 'ChatCombatEventDeathOther';
const StringIDChatCombatEventHarvestSelf = 'ChatCombatEventHarvestSelf';
const StringIDChatCombatEventHarvestOther = 'ChatCombatEventHarvestOther';
const StringIDChatCombatEventHarvestItem = 'ChatCombatEventHarvestItem';

export class ChatLineCombat extends ChatLine {
  // Display-only; the base-class timestamp is a sort key with different semantics.
  private readonly receivedAt: number = Date.now();

  constructor(readonly combatEvent: CombatEvent) {
    super(ChatScopes.Combat);
  }

  render(): React.ReactChild {
    const stringTable = store.getState().stringTable.stringTable;
    const sourceInfo = resolveCombatEventSource(this.combatEvent.source, store.getState().gameDefs);

    const harvestText = this.getHarvestText(stringTable, sourceInfo);
    const segments: string[] = [];
    // Resource, status, kill, and harvest log lines have their own specific format and the header is redundant there.
    // It's still used for other event types until they get their own custom treatment.
    if (
      !this.combatEvent.kill &&
      !this.combatEvent.resources?.length &&
      !this.combatEvent.statuses?.length &&
      !harvestText
    ) {
      segments.push(this.getHeaderText(stringTable));
    }
    if (this.combatEvent.kill) {
      segments.push(this.getKillText(stringTable));
    }
    if (this.combatEvent.disruption) {
      segments.push(...this.getDisruptionSegments(stringTable));
    }
    if (this.combatEvent.resources) {
      segments.push(...this.getResourceSegments(stringTable, sourceInfo));
    }
    if (this.combatEvent.impulse) {
      segments.push(this.getImpulseText(stringTable));
    }
    if (this.combatEvent.activeEffects) {
      segments.push(...this.getActiveEffectSegments());
    }
    if (this.combatEvent.statuses) {
      segments.push(...this.getStatusSegments(stringTable));
    }
    if (harvestText) {
      segments.push(harvestText);
    }
    if (this.combatEvent.errors) {
      segments.push(...this.combatEvent.errors.map((error) => error.msg));
    }

    const timestamp = getTokenizedStringTableValue(StringIDChatCombatEventTimestamp, stringTable, {
      TIME: formatChatTimestamp(this.receivedAt)
    });
    const separator = ` ${getStringTableValue(StringIDGeneralBar, stringTable)} `;
    const text = `${timestamp} ${segments.filter((segment) => segment.length > 0).join(separator)}`;

    return (
      <div key={this.id} style={{ color: allChatScopeDisplayData[ChatScopes.Combat].color }}>
        <span>{text}</span>
      </div>
    );
  }

  getHeaderText(stringTable: Record<string, StringTableEntryDef>): string {
    if (this.combatEvent.fromName === this.combatEvent.toName) {
      return getTokenizedStringTableValue(StringIDChatCombatEventHeaderSelf, stringTable, {
        FROM_NAME: this.combatEvent.fromName
      });
    }
    return getTokenizedStringTableValue(StringIDChatCombatEventHeader, stringTable, {
      FROM_NAME: this.combatEvent.fromName,
      TO_NAME: this.combatEvent.toName
    });
  }

  getKillText(stringTable: Record<string, StringTableEntryDef>): string {
    const selfName = store.getState().entities.self.name;
    const fromName = this.combatEvent.fromName;
    const toName = this.combatEvent.toName;

    const isSelfFrom = selfName !== '' && fromName === selfName;
    const isSelfTo = selfName !== '' && toName === selfName;

    if (fromName === '' || fromName === toName) {
      return isSelfTo
        ? getStringTableValue(StringIDChatCombatEventDeathSelf, stringTable)
        : getTokenizedStringTableValue(StringIDChatCombatEventDeathOther, stringTable, { NAME: toName });
    }
    if (isSelfFrom) {
      return getTokenizedStringTableValue(StringIDChatCombatEventKillOther, stringTable, { NAME: toName });
    }
    if (isSelfTo) {
      return getTokenizedStringTableValue(StringIDChatCombatEventKillSelf, stringTable, { NAME: fromName });
    }
    return getTokenizedStringTableValue(StringIDChatCombatEventDeathOther, stringTable, { NAME: toName });
  }

  getDisruptionSegments(stringTable: Record<string, StringTableEntryDef>): string[] {
    const disruption = this.combatEvent.disruption!;
    const segments = [
      getTokenizedStringTableValue(StringIDChatCombatEventDisruptionInfo, stringTable, {
        RECEIVED: disruption.received.toFixed(0),
        DIFF: Math.abs(disruption.sent - disruption.received).toFixed(0),
        SOURCE: disruption.source
      })
    ];
    if (disruption.tracksInterrupted != null && disruption.tracksInterrupted !== AbilityTrackFlags.None) {
      segments.push(
        getTokenizedStringTableValue(StringIDChatCombatEventDisruptionTracks, stringTable, {
          TRACKS: AbilityTrackFlags[disruption.tracksInterrupted]
        })
      );
    }
    return segments;
  }

  getResourceSegments(
    stringTable: Record<string, StringTableEntryDef>,
    sourceInfo: CombatEventSourceInfo | null
  ): string[] {
    const gameDefs = store.getState().gameDefs;
    const selfName = store.getState().entities.self.name;
    const fromName = this.combatEvent.fromName;
    const toName = this.combatEvent.toName;

    const isSelfFrom = fromName === '' || (selfName !== '' && fromName === selfName);
    const isSelfTo = selfName !== '' && toName === selfName;
    const source = getCombatSourceName(sourceInfo, this.combatEvent.source, stringTable);

    return this.combatEvent.resources!.map((resource): string => {
      const resourceDef = gameDefs.entityResourcesByNumericID[resource.resourceNumericID];
      if (!resourceDef) {
        return '';
      }

      const amount = Math.abs(resource.amount).toFixed(0);
      if (resourceDef.id === EntityResourceIDs.Health) {
        const damageType = gameDefs.damageTypesByNumericID[resource.damageTypeNumericID]?.name ?? '';
        let stringID: string;
        if (resource.amount > 0) {
          stringID = isSelfTo
            ? isSelfFrom
              ? StringIDChatCombatEventHealSelf
              : StringIDChatCombatEventHealSelfFromOther
            : StringIDChatCombatEventHealOther;
        } else {
          stringID = isSelfTo
            ? isSelfFrom
              ? StringIDChatCombatEventHitSelfFromSelf
              : StringIDChatCombatEventHitSelf
            : StringIDChatCombatEventHitOther;
        }
        return getTokenizedStringTableValue(stringID, stringTable, {
          SOURCE: source,
          NAME: isSelfTo ? fromName : toName,
          AMOUNT: amount,
          DAMAGE_TYPE: damageType
        });
      }

      // Non-health resources: the subject is the recipient.
      const stringID =
        resource.amount > 0
          ? isSelfTo
            ? StringIDChatCombatEventResourceGainSelf
            : StringIDChatCombatEventResourceGainOther
          : isSelfTo
          ? StringIDChatCombatEventResourceLoseSelf
          : StringIDChatCombatEventResourceLoseOther;
      return getTokenizedStringTableValue(stringID, stringTable, {
        NAME: toName,
        AMOUNT: amount,
        RESOURCE: resourceDef.name
      });
    });
  }

  getImpulseText(stringTable: Record<string, StringTableEntryDef>): string {
    const impulse = this.combatEvent.impulse!;
    return getTokenizedStringTableValue(StringIDChatCombatEventImpulse, stringTable, {
      RECEIVED: impulse.received.toFixed(0),
      DIFF: Math.abs(impulse.sent - impulse.received).toFixed(0)
    });
  }

  getActiveEffectSegments(): string[] {
    return this.combatEvent.activeEffects!.map((activeEffect): string => {
      const duration = activeEffect.action === ActiveEffectAction.Applied ? ` ${activeEffect.duration}` : '';
      return `${activeEffect.name} ${ActiveEffectAction[activeEffect.action]}${duration}`;
    });
  }

  getStatusSegments(stringTable: Record<string, StringTableEntryDef>): string[] {
    const gameDefs = store.getState().gameDefs;
    const selfName = store.getState().entities.self.name;
    const fromName = this.combatEvent.fromName;
    const toName = this.combatEvent.toName;

    const isSelfFrom = selfName !== '' && fromName === selfName;
    const isSelfTo = selfName !== '' && toName === selfName;

    return this.combatEvent.statuses!.map((eventStatus): string => {
      // Hidden statuses (debug builds only) arrive with an empty display name.
      const status =
        eventStatus.name ||
        gameDefs.statusesByNumericID[eventStatus.statusID]?.name ||
        getStringTableValue(StringIDChatCombatEventSourceUnknown, stringTable);
      const isRemove = eventStatus.action === 1;

      let stringID: string;
      if (isSelfTo) {
        if (fromName === '') {
          stringID = isRemove
            ? StringIDChatCombatEventStatusRemoveNoEntity
            : StringIDChatCombatEventStatusApplyNoEntity;
        } else if (isSelfFrom) {
          stringID = isRemove
            ? StringIDChatCombatEventStatusRemoveSelfFromSelf
            : StringIDChatCombatEventStatusApplySelfFromSelf;
        } else {
          stringID = isRemove ? StringIDChatCombatEventStatusRemoveSelf : StringIDChatCombatEventStatusApplySelf;
        }
      } else {
        stringID = isRemove ? StringIDChatCombatEventStatusRemoveOther : StringIDChatCombatEventStatusApplyOther;
      }

      return getTokenizedStringTableValue(stringID, stringTable, {
        STATUS: status,
        NAME: isSelfTo ? fromName : toName
      });
    });
  }

  getHarvestText(stringTable: Record<string, StringTableEntryDef>, sourceInfo: CombatEventSourceInfo | null): string {
    const harvests = this.combatEvent.harvests?.filter((harvest) => harvest.item) ?? [];
    if (harvests.length === 0) {
      return '';
    }

    const selfName = store.getState().entities.self.name;
    const fromName = this.combatEvent.fromName;
    const isSelfFrom = fromName === '' || (selfName !== '' && fromName === selfName);

    const items = harvests
      .map((harvest) =>
        getTokenizedStringTableValue(StringIDChatCombatEventHarvestItem, stringTable, {
          COUNT: harvest.unitCount.toFixed(0),
          ITEM: harvest.item,
          QUALITY: Math.round(harvest.quality).toString()
        })
      )
      .join(`${getStringTableValue(StringIDGeneralComma, stringTable)} `);

    // toName is the node's string-table key, not display text.
    return getTokenizedStringTableValue(
      isSelfFrom ? StringIDChatCombatEventHarvestSelf : StringIDChatCombatEventHarvestOther,
      stringTable,
      {
        SOURCE: getCombatSourceName(sourceInfo, this.combatEvent.source, stringTable),
        NODE: getStringTableValue(this.combatEvent.toName, stringTable),
        ITEMS: items,
        NAME: fromName
      }
    );
  }
}
