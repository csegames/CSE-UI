/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ExternalDataSource } from '../redux/externalDataSource';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { getMSUntil, updateServerTimeDelta } from '../redux/clockSlice';
import { GuildInvitation } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { hideModal, ModalModel, showModal, updateModalContent } from '../redux/modalsSlice';
import { GuildSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/GuildSnapshot';
import { addInviteTimeout, dropInviteTimeout, setGuild } from '../redux/guildSlice';
import {
  guildOffersSubscription,
  GuildOfferSubscriptionResult,
  guildQuery,
  GuildQueryResult
} from './guildGraphQLConstants';
import { callAcceptGuildInvitation, callRejectGuildInvitation } from '../helpers/rest/guildsRestCalls';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralAccept,
  StringIDGeneralReject
} from '../helpers/stringTableHelpers';
import { WithWebInterface } from '../redux/withWebInterface';

const StringIDGuildsCreateGuildMessage = 'GuildsCreateGuildMessage';
const StringIDGuildsJoinGuildMessage = 'GuildsJoinGuildMessage';

export class GuildService extends WithWebInterface(ExternalDataSource) {
  protected async bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([
      clientAPI.bindGuildListener(this.handleGuildUpdate.bind(this)),
      await this.subscribe<GuildQueryResult>(
        { operationName: 'guildQuery', query: guildQuery },
        this.handleGuildQuery.bind(this)
      ),
      await this.subscribe<GuildOfferSubscriptionResult>(
        { operationName: 'guildOffers', query: guildOffersSubscription },
        this.handleOfferUpdate.bind(this)
      )
    ]);
  }

  private handleGuildUpdate(result: GuildSnapshot): void {
    this.dispatch(setGuild(result));
  }

  private handleGuildQuery(result: GuildQueryResult): void {
    this.dispatch(updateServerTimeDelta(result.serverTimestamp));
    for (const invite of result.guildOffers.invitations) {
      this.queueOffer(invite);
    }
  }

  private handleOfferUpdate(result: GuildOfferSubscriptionResult): void {
    const event = result.guildOffers;
    if (event?.isInvite) {
      if (event.hasEnded) {
        this.removeOffer(event);
      } else {
        this.queueOffer(event);
      }
    }
  }

  private queueOffer(offer: GuildInvitation) {
    if (!offer) {
      return;
    }

    const modalID = this.getModalID(offer);

    // TODO: Different content for invites to an unnamed guild.
    const isNewGuild = true;

    const content: ModalModel = {
      message: isNewGuild
        ? getTokenizedStringTableValue(StringIDGuildsCreateGuildMessage, this.reduxState.stringTable.stringTable, {
            NAME: offer.from?.displayName
          })
        : getTokenizedStringTableValue(StringIDGuildsJoinGuildMessage, this.reduxState.stringTable.stringTable, {
            NAME: offer.from?.displayName,
            // TODO: Eventually, a guild name should be part of the offer data.
            GUILDNAME: '(NYI: GuildName)'
          }),
      buttons: [
        {
          text: getStringTableValue(StringIDGeneralReject, this.reduxState.stringTable.stringTable),
          onClick: () => {
            this.dispatch(callRejectGuildInvitation(offer.from.id));
            this.dispatch(hideModal());
          }
        },
        {
          text: getStringTableValue(StringIDGeneralAccept, this.reduxState.stringTable.stringTable),
          onClick: () => {
            this.dispatch(callAcceptGuildInvitation(offer.from.id));
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

  private removeOffer(offer: GuildInvitation) {
    window.clearTimeout(this.reduxState.party.inviteTimeouts[offer.from.id]);
    this.dispatch(dropInviteTimeout(offer.from.id));

    const modalID = this.getModalID(offer);
    const content: ModalModel = {
      // TODO: Localized text, duh.
      message: `A party invite from ${offer.from.displayName} has expired`,
      buttons: [
        {
          text: 'OK',
          onClick: () => this.dispatch.bind(this)(hideModal())
        }
      ]
    };

    this.dispatch(updateModalContent([modalID, content]));
  }

  private getModalID(offer: GuildInvitation): string {
    return `guildInvite-${offer.from.id}`;
  }
}
