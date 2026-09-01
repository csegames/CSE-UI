/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { TradeSnapshot, TradeState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/TradeSnapshot';
import {
  addTradeRequester,
  clearTradeItemPosition,
  clearTradeItemPositions,
  clearTradeRequesters,
  removeTradeRequester,
  setTradeItemPosition,
  updateTradeSnapshot
} from '../redux/tradeSlice';
import { EntityID } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import { AppDispatch } from '../redux/store';
import { addConditionalWidgetExiting, showConditionalWidget } from '../redux/hudSlice';
import { WIDGET_ID_TRADEREQUESTS } from '../components/trade/TradeRequests';
import { WIDGET_ID_TRADE } from '../components/trade/Trade';
import { showToaster } from '../redux/toastersSlice';
import { getStringTableValue, StringIDGeneralError } from '../helpers/stringTableHelpers';
import { showModal } from '../redux/modalsSlice';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';

const StringIDTradeTradeCanceled = 'TradeTradeCanceled';
const StringIDTradeTradeComplete = 'TradeTradeComplete';

export class TradeService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([
      clientAPI.bindTradeInviteAddedListener(this.handleTradeInviteAdded.bind(this)),
      clientAPI.bindTradeInviteRemovedListener(this.handleTradeInviteRemoved.bind(this)),
      clientAPI.bindTradeErrorListener(this.handleTradeError.bind(this)),
      clientAPI.bindTradeSuccessListener(this.handleTradeSuccess.bind(this)),
      clientAPI.bindTradeCanceledListener(this.handleTradeCanceled.bind(this)),
      clientAPI.bindTradeTargetLeftListener(this.handleTradeTargetLeft.bind(this)),
      clientAPI.bindTradeUpdatedListener(this.handleTradeUpdated.bind(this))
    ]);
  }

  private handleTradeInviteAdded(targetID: EntityID, targetName: string) {
    // If this is the first invite, show the TradeRequests window.
    if (Object.keys(this.reduxState.trade.tradeRequesters).length === 0) {
      this.dispatch?.(showConditionalWidget(WIDGET_ID_TRADEREQUESTS));
    }

    this.dispatch?.(addTradeRequester({ targetID, targetName }));
  }

  private handleTradeInviteRemoved(targetID: EntityID, targetName: string) {
    // If this was the last invite (and you don't have an outgoing invite), hide the TradeRequests window.
    if (
      Object.keys(this.reduxState.trade.tradeRequesters).length === 1 && // Only one requester to remove.
      !!this.reduxState.trade.tradeRequesters[targetID] && // And this was that requester.
      this.reduxState.trade.tradeSnapshot.tradeState === TradeState.None // No outgoing trade request?
    ) {
      this.dispatch?.(addConditionalWidgetExiting(WIDGET_ID_TRADEREQUESTS));
    }

    this.dispatch?.(removeTradeRequester(targetID));
  }

  private handleTradeError(errorMessage: string) {
    this.dispatch?.(
      showModal({
        id: 'TradeError',
        content: {
          title: getStringTableValue(StringIDGeneralError, this.reduxState.stringTable.stringTable),
          message: errorMessage
        },
        escapable: true
      })
    );
  }

  private handleTradeSuccess() {
    this.dispatch?.(
      showToaster({
        content: { message: getStringTableValue(StringIDTradeTradeComplete, this.reduxState.stringTable.stringTable) }
      })
    );
  }

  private handleTradeCanceled(tradeTargetName: string) {
    this.dispatch?.(
      showToaster({
        content: { message: getStringTableValue(StringIDTradeTradeCanceled, this.reduxState.stringTable.stringTable) }
      })
    );
    this.dispatch?.(clearTradeItemPositions());
  }

  private handleTradeTargetLeft(tradeTargetName: string) {
    this.dispatch?.(
      showToaster({
        content: { message: getStringTableValue(StringIDTradeTradeCanceled, this.reduxState.stringTable.stringTable) }
      })
    );
  }

  private handleTradeUpdated(newState: TradeSnapshot) {
    if (newState.tradeState !== this.reduxState.trade.tradeSnapshot.tradeState) {
      switch (newState.tradeState) {
        case TradeState.None: {
          // You were trading (or had at least sent an invitation), but now you're not, so no need
          // to show the Trade window.
          this.dispatch?.(addConditionalWidgetExiting(WIDGET_ID_TRADE));
          if (
            // If you had an invite out and canceled it,
            this.reduxState.trade.tradeSnapshot.tradeState === TradeState.Invited &&
            // and no one is requesting to trade with you,
            Object.values(this.reduxState.trade.tradeRequesters).length === 0
          ) {
            // then you can hide the TradeRequests window.
            this.dispatch?.(addConditionalWidgetExiting(WIDGET_ID_TRADEREQUESTS));
          }
          break;
        }
        case TradeState.Invited: {
          // If the snapshot indicates an invitation, that means the local player just SENT an invite.
          // You can only have one outgoing invitation at a time, so we'll show you who it's with on
          // the TradeRequests window.
          // Note that it may already be open if someone had sent YOU an invite previously.
          this.dispatch?.(showConditionalWidget(WIDGET_ID_TRADEREQUESTS));
          break;
        }
        case TradeState.ModifyingItems:
        case TradeState.Confirmed: {
          // For either of these cases, you now have an active trade session, so any pending invites
          // are no longer relevant.
          this.dispatch?.(addConditionalWidgetExiting(WIDGET_ID_TRADEREQUESTS));
          this.dispatch?.(clearTradeRequesters());
          // And for sure the Trade window should be shown (may already be, in which case this is a no-op).
          this.dispatch?.(showConditionalWidget(WIDGET_ID_TRADE));

          // Capture and resolve any out-of-sync errors between local and server state.
          forceSyncTradeItemBookkeeping(
            this.reduxState.trade.tradeItemPositions,
            newState.tradeItems,
            this.reduxState.gameDefs.settings.tradeCapacity,
            this.dispatch
          );

          break;
        }
      }
    }

    this.dispatch?.(updateTradeSnapshot(newState));
  }
}

export function forceSyncTradeItemBookkeeping(
  tradeItemPositions: Record<number, string>,
  tradeItems: Item[],
  tradeCapacity: number,
  dispatch?: AppDispatch
): void {
  // In case of trade errors, we may wind up with trade items that don't have a local position.
  // For those, just assign them the first available position.
  const itemsWithPositions = Object.values(tradeItemPositions);
  const unassignedItems = tradeItems.filter((item) => !itemsWithPositions.includes(item.instanceID));

  function getNextFreePositionAfter(index: number): number {
    for (let i = index + 1; i < tradeCapacity; ++i) {
      if (!tradeItemPositions[i]) {
        return i;
      }
    }
    return -1;
  }
  let freePosition = -1;
  unassignedItems.forEach((item) => {
    freePosition = getNextFreePositionAfter(freePosition);
    if (freePosition === -1) {
      console.error(`Too many trade items detected!`);
    } else {
      dispatch?.(setTradeItemPosition([item.instanceID, freePosition]));
    }
  });

  // If we have positioned items that are no longer part of the trade (error, or because they were successfully removed),
  // remove them from position tracking.
  Object.entries(tradeItemPositions).forEach((entry) => {
    const index = +entry[0];
    const itemInstanceID = entry[1];

    if (!tradeItems.find((item) => item.instanceID === itemInstanceID)) {
      dispatch?.(clearTradeItemPosition(index));
    }
  });
}
