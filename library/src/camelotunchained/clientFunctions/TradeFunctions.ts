/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { EntityID } from '../../_baseGame/types/localDefinitions';
import { TradeSnapshot } from '../game/GameClientModels/TradeSnapshot';

const tradeInviteAddedEvent = 'trade.inviteAdded'; // Player received an invitation
const tradeInviteRemovedEvent = 'trade.inviteRemoved'; // An incoming invitation was revoked or canceled
const tradeDataUpdatedEvent = 'trade.dataUpdated'; // Player's trade data updated
const tradeErrorEvent = 'trade.error'; // A trade command failed
const tradeSuccessEvent = 'trade.success'; // Trade has completed successfully
const tradeCanceledEvent = 'trade.canceled'; // Trade was canceled by the target
const tradeTargetLeftEvent = 'trade.targetLeft'; // Trade was canceled because the target left

const tradeSendInviteCallbackName = 'trade.SendInvite';
const tradeRevokeInviteCallbackName = 'trade.RevokeInvite';
const tradeAcceptInviteCallbackName = 'trade.AcceptInvite';
const tradeRejectInviteCallbackName = 'trade.RejectInvite';
const tradeMoveItemCallbackName = 'trade.MoveItem';
const tradeConfirmItemsCallbackName = 'trade.ConfirmItems';
const tradeCancelCallbackName = 'trade.Cancel';

export type TradeInviteListener = (targetID: EntityID, targetName: string) => void;
export type TradeErrorListener = (errorMessage: string) => void;
export type TradeSuccessListener = () => void;
export type TradeCanceledListener = (tradeTargetName: string) => void;
export type TradeTargetLeftListener = (tradeTargetName: string) => void;
export type TradeUpdatedListener = (tradeData: TradeSnapshot) => void;

export interface TradeMocks {
  triggerTradeInviteAdded(targetID: EntityID, targetName: string): void;
  triggerTradeInviteRemoved(targetID: EntityID, targetName: string): void;
  triggerTradeError(errorMessage: string): void;
  triggerTradeSuccess(): void;
  triggerTradeCanceled(tradeTargetName: string): void;
  triggerTradeTargetLeft(tradeTargetName: string): void;
  triggerTradeUpdated(tradeData: TradeSnapshot): void;
}

export interface TradeFunctions {
  bindTradeInviteAddedListener(listener: TradeInviteListener): ListenerHandle;
  bindTradeInviteRemovedListener(listener: TradeInviteListener): ListenerHandle;
  bindTradeErrorListener(listener: TradeErrorListener): ListenerHandle;
  bindTradeSuccessListener(listener: TradeSuccessListener): ListenerHandle;
  bindTradeCanceledListener(listener: TradeCanceledListener): ListenerHandle;
  bindTradeTargetLeftListener(listener: TradeTargetLeftListener): ListenerHandle;
  bindTradeUpdatedListener(listener: TradeUpdatedListener): ListenerHandle;
  sendTradeInvite(targetEntityID: EntityID): void;
  revokeTradeInvite(targetEntityID: EntityID): void;
  acceptTradeInvite(targetEntityID: EntityID): void;
  rejectTradeInvite(targetEntityID: EntityID): void;
  moveTradeItem(itemInstanceID: string, unitCount: number): void; // Negative unitCount moves back to inventory/wallet
  confirmTradeItems(expectedRevision: number): void;
  cancelTrade(): void;
}

class TradeFunctionsBase implements TradeFunctions, TradeMocks {
  private readonly events = new EventEmitter();

  triggerTradeInviteAdded(targetID: EntityID, targetName: string): void {
    this.events.trigger(tradeInviteAddedEvent, targetID, targetName);
  }
  triggerTradeInviteRemoved(targetID: EntityID, targetName: string): void {
    this.events.trigger(tradeInviteRemovedEvent, targetID, targetName);
  }
  triggerTradeError(errorMessage: string): void {
    this.events.trigger(tradeErrorEvent, errorMessage);
  }
  triggerTradeSuccess(): void {
    this.events.trigger(tradeSuccessEvent);
  }
  triggerTradeCanceled(tradeTargetName: string): void {
    this.events.trigger(tradeCanceledEvent, tradeTargetName);
  }
  triggerTradeTargetLeft(tradeTargetName: string): void {
    this.events.trigger(tradeTargetLeftEvent, tradeTargetName);
  }
  triggerTradeUpdated(tradeData: TradeSnapshot): void {
    this.events.trigger(tradeDataUpdatedEvent, tradeData);
  }

  bindTradeInviteAddedListener(listener: TradeInviteListener): ListenerHandle {
    return this.events.on(tradeInviteAddedEvent, listener);
  }
  bindTradeInviteRemovedListener(listener: TradeInviteListener): ListenerHandle {
    return this.events.on(tradeInviteRemovedEvent, listener);
  }
  bindTradeErrorListener(listener: TradeErrorListener): ListenerHandle {
    return this.events.on(tradeErrorEvent, listener);
  }
  bindTradeSuccessListener(listener: TradeSuccessListener): ListenerHandle {
    return this.events.on(tradeSuccessEvent, listener);
  }
  bindTradeCanceledListener(listener: TradeCanceledListener): ListenerHandle {
    return this.events.on(tradeCanceledEvent, listener);
  }
  bindTradeTargetLeftListener(listener: TradeTargetLeftListener): ListenerHandle {
    return this.events.on(tradeTargetLeftEvent, listener);
  }
  bindTradeUpdatedListener(listener: TradeUpdatedListener): ListenerHandle {
    return this.events.on(tradeDataUpdatedEvent, listener);
  }

  sendTradeInvite(targetEntityID: EntityID): void {}
  revokeTradeInvite(targetEntityID: EntityID): void {}
  acceptTradeInvite(targetEntityID: EntityID): void {}
  rejectTradeInvite(targetEntityID: EntityID): void {}
  moveTradeItem(itemInstanceID: string, unitCount: number): void {}
  confirmTradeItems(expectedRevision: number): void {}
  cancelTrade(): void {}
}

class CoherentTradeFunctions extends TradeFunctionsBase {
  bindTradeInviteAddedListener(listener: TradeInviteListener): ListenerHandle {
    const mockHandle = super.bindTradeInviteAddedListener(listener);
    const engineHandle = engine.on(tradeInviteAddedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindTradeInviteRemovedListener(listener: TradeInviteListener): ListenerHandle {
    const mockHandle = super.bindTradeInviteRemovedListener(listener);
    const engineHandle = engine.on(tradeInviteRemovedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindTradeErrorListener(listener: TradeErrorListener): ListenerHandle {
    const mockHandle = super.bindTradeErrorListener(listener);
    const engineHandle = engine.on(tradeErrorEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindTradeSuccessListener(listener: TradeSuccessListener): ListenerHandle {
    const mockHandle = super.bindTradeSuccessListener(listener);
    const engineHandle = engine.on(tradeSuccessEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindTradeCanceledListener(listener: TradeCanceledListener): ListenerHandle {
    const mockHandle = super.bindTradeCanceledListener(listener);
    const engineHandle = engine.on(tradeCanceledEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindTradeTargetLeftListener(listener: TradeTargetLeftListener): ListenerHandle {
    const mockHandle = super.bindTradeTargetLeftListener(listener);
    const engineHandle = engine.on(tradeTargetLeftEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindTradeUpdatedListener(listener: TradeUpdatedListener): ListenerHandle {
    const mockHandle = super.bindTradeUpdatedListener(listener);
    const engineHandle = engine.on(tradeDataUpdatedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  sendTradeInvite(targetEntityID: EntityID): void {
    engine.trigger(tradeSendInviteCallbackName, targetEntityID);
  }
  revokeTradeInvite(targetEntityID: EntityID): void {
    engine.trigger(tradeRevokeInviteCallbackName, targetEntityID);
  }
  acceptTradeInvite(targetEntityID: EntityID): void {
    engine.trigger(tradeAcceptInviteCallbackName, targetEntityID);
  }
  rejectTradeInvite(targetEntityID: EntityID): void {
    engine.trigger(tradeRejectInviteCallbackName, targetEntityID);
  }
  moveTradeItem(itemInstanceID: string, unitCount: number): void {
    engine.trigger(tradeMoveItemCallbackName, itemInstanceID, unitCount);
  }
  confirmTradeItems(expectedRevision: number): void {
    engine.trigger(tradeConfirmItemsCallbackName, expectedRevision);
  }
  cancelTrade(): void {
    engine.trigger(tradeCancelCallbackName);
  }
}

class BrowserTradeFunctions extends TradeFunctionsBase {}

export const impl: TradeFunctions & TradeMocks = engine.isAttached
  ? new CoherentTradeFunctions()
  : new BrowserTradeFunctions();
