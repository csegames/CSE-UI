/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ExternalDataSource } from '../redux/externalDataSource';
import {
  partyQuery,
  PartyQueryResult,
  partyOffersSubscription,
  PartyOfferSubscriptionResult
} from './partyGraphQLConstants';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { LoadingTopic, setInitialized } from '../redux/loadingSlice';
import { addInviteTimeout, dropInviteTimeout, setParty, setPermissions } from '../redux/partySlice';
import { getMSUntil, updateServerTimeDelta } from '../redux/clockSlice';
import { PartySnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/PartySnapshot';
import { Invitation, OfferEvent } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { hideModal, ModalModel, showModal, updateModalContent } from '../redux/modalsSlice';
import { callAcceptInvitation, callRejectInvitation } from '../helpers/rest/warbandsRestCalls';
import { WithWebInterface } from '../redux/withWebInterface';

export class PartyService extends WithWebInterface(ExternalDataSource) {
  private lastCharacterID?: string;
  private alwaysBound: ListenerHandle[] = [];

  protected async bind(): Promise<ListenerHandle[]> {
    this.alwaysBound = [
      await this.onInitialize(this.setBindings.bind(this)),
      await this.onDisconnect(this.clearBindings.bind(this)),
      clientAPI.bindPartyListener(this.handlePartyUpdate.bind(this))
    ];
    const bindings = await this.remapBindings();
    this.dispatch(setInitialized({ topic: LoadingTopic.Party, result: true }));
    return bindings;
  }

  // we need to reset our context each time the active character changes (including on logout) ... we may actually
  // see the same characterID twice in a row if, for instance, a developer refreshes the UI during gameplay
  private async setBindings(): Promise<void> {
    const characterID = this.getActiveCharacter();
    if (this.lastCharacterID === characterID) {
      return;
    }
    this.lastCharacterID = characterID;
    this.rebind(await this.remapBindings());
  }

  private clearBindings(): void {
    this.lastCharacterID = undefined;
    this.rebind([...this.alwaysBound]);
  }

  private async remapBindings(): Promise<ListenerHandle[]> {
    const handles: ListenerHandle[] = [...this.alwaysBound];
    if (this.lastCharacterID === undefined) {
      return handles;
    }

    handles.push(
      await this.subscribe<PartyQueryResult>(
        { operationName: 'partyQuery', query: partyQuery },
        this.handlePartyQuery.bind(this)
      ),
      await this.subscribe<PartyOfferSubscriptionResult>(
        { operationName: 'partyOffers', query: partyOffersSubscription },
        this.handleOfferUpdate.bind(this)
      )
    );

    return handles;
  }

  private handlePartyUpdate(result: PartySnapshot): void {
    this.dispatch(setParty(result));

    const isLeader = this.getIsLeader(result);
    const canInvite = isLeader || !result.groupID;
    this.dispatch(setPermissions({ canInvite, canKick: isLeader, canPromote: isLeader, isLeader }));
  }

  private getIsLeader(snapshot: PartySnapshot): boolean {
    if (!snapshot.groupID) {
      return false;
    }
    for (const member of snapshot.members) {
      if (this.lastCharacterID == member.characterID) {
        return member.isLeader;
      }
    }
    return false;
  }

  private handlePartyQuery(result: PartyQueryResult): void {
    this.dispatch(updateServerTimeDelta(result.serverTimestamp));
    for (const invite of result.partyOffers.invitations) {
      this.queueOffer(invite);
    }
  }

  private handleOfferUpdate(result: PartyOfferSubscriptionResult): void {
    const event = result.partyOffers;
    if (event?.isInvite) {
      if (event.hasEnded) {
        this.removeOffer(event);
      } else {
        this.queueOffer(event);
      }
    }
  }

  private queueOffer(offer: OfferEvent | Invitation) {
    if (!offer || offer.from.id == this.lastCharacterID || offer.to.id != this.lastCharacterID) {
      return;
    }

    const modalID = this.getModalID(offer);
    const content: ModalModel = {
      message: `${offer.from.name} has invited you to a party`,
      buttons: [
        {
          text: 'Reject',
          onClick: () => {
            this.dispatch(callRejectInvitation(offer.from.id));
            this.dispatch(hideModal());
          }
        },
        {
          text: 'Accept',
          onClick: () => {
            this.dispatch(callAcceptInvitation(offer.from.id));
            this.dispatch(hideModal());
          }
        }
      ]
    };

    const removeOffer = this.removeOffer.bind(this, offer);

    if (this.reduxState.modals.modals.find((m) => m.id == modalID)) {
      this.dispatch(updateModalContent([modalID, content]));
    } else {
      this.dispatch(
        showModal({
          id: modalID,
          content,
          escapable: true,
          hideCloseButton: true,
          onClose: () => removeOffer
        })
      );
    }

    const remainingMs = getMSUntil(this.reduxState.clock, offer.expires);
    if (remainingMs <= 0) {
      removeOffer();
      return;
    }

    const expirationHandle = window.setTimeout(removeOffer, remainingMs);
    this.dispatch(addInviteTimeout([offer.from.id, expirationHandle]));
  }

  private removeOffer(offer: OfferEvent | Invitation) {
    window.clearTimeout(this.reduxState.party.inviteTimeouts[offer.from.id]);
    this.dispatch(dropInviteTimeout(offer.from.id));

    const modalID = this.getModalID(offer);
    const content: ModalModel = {
      message: `A party invite from ${offer.from.name} has expired`,
      buttons: [
        {
          text: 'OK',
          onClick: () => this.dispatch.bind(this)(hideModal())
        }
      ]
    };

    this.dispatch(updateModalContent([modalID, content]));
  }

  private getModalID(offer: OfferEvent | Invitation): string {
    return `invite-${offer.from.id}`;
  }
}
