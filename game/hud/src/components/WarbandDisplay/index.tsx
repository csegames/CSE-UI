/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as events  from '@csegames/camelot-unchained/lib/events';
import * as signalr from '@csegames/camelot-unchained/lib/signalR';
import { WarbandMember, Gender, Race } from '@csegames/camelot-unchained/lib/webAPI/definitions';
import client from '@csegames/camelot-unchained/lib/core/client';
import styled from 'react-emotion';

import { addOrUpdate, removeWhere } from '../../lib/reduxUtils';
import WarbandMemberDisplay from './WarbandMemberDisplay';

const Container = styled('div')`
  user-select: none;
  pointer-events: none;
`;

const characterImages = {
  humanM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_pict-m.png',
  humanF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_pict-f.png',
  luchorpanM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_luchorpan-m.png',
  luchorpanF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_luchorpan-f.png',
  valkyrieM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  valkyrieF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  humanmalevM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_valkyrie-m.png',
  humanmaleaM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-m-art.png',
  humanmaletM: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-m-tdd.png',
  humanmalevF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-vik.png',
  humanmaleaF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-art.png',
  humanmaletF: 'https://s3.amazonaws.com/camelot-unchained/character-creation/character/icons/icon_humans-f-tdd.png',
};

export interface WarbandDisplayProps {
  isMini?: boolean;
}

export interface WarbandDisplayState {
  activeMembers?: WarbandMember[];
  permanentMembers?: WarbandMember[];
  name?: string;
  warbandID?: string;
}

export class WarbandDisplay extends React.Component<WarbandDisplayProps, WarbandDisplayState> {

  private eventHandles: number[] = [];

  constructor(props: WarbandDisplayProps) {
    super(props);
    this.state = {
      ...(WarbandDisplay.emptyWarband()),
    };

    this.registerWarbandEvents();
    signalr.groupsHub.onConnected = hub => hub.invoke('invalidate');
  }

  public render() {
    return (
      <Container>
        {
          this.state.activeMembers &&
            this.state.activeMembers.map(m => <WarbandMemberDisplay key={m.characterID} member={m} />)
        }
      </Container>
    );
  }

  public componentWillUnmount() {
    this.unregisterWarbandEvents();
  }

  private static emptyWarband() {
    return {
      activeMembers: [] as WarbandMember[],
      name: '',
      permanentMembers: [] as WarbandMember[],
      warbandID: '',
    };
  }

  private static memberCompare(a: WarbandMember, b: WarbandMember): boolean {
    return a.characterID === b.characterID;
  }

  private static getAvatar(gender: Gender, race: Race) {
    if (gender === Gender.Male) { // MALE
      switch (race) {
        case 2: return characterImages.luchorpanM; // Luchorpan
        case 4: return characterImages.valkyrieM; // Valkyrie
        case 15: return characterImages.humanmalevM; // Humanmalev
        case 16: return characterImages.humanmaleaM; // Humanmalea
        case 17: return characterImages.humanmaletM; // Humanmalet
        case 18: return characterImages.humanM; // Pict
      }
    } else {
      switch (race) {
        case 2: return characterImages.luchorpanF; // Luchorpan
        case 4: return characterImages.valkyrieF; // Valkyrie
        case 15: return characterImages.humanmalevF; // Humanmalev
        case 16: return characterImages.humanmaleaF; // Humanmalea
        case 17: return characterImages.humanmaletF; // Humanmalet
        case 18: return characterImages.humanF; // Pict
      }
    }
  }

  private static deserializeMember(memberJSON: string) {
    try {
      const member = JSON.parse(memberJSON);
      member.avatar = WarbandDisplay.getAvatar(member.gender, member.race);
      return member;
    } catch (e) {
      if (client.debug) {
        console.error(`WarbandMemberJoined Failed to parse WarbandMember. | ${e}`);
      }
      return;
    }
  }

  private registerWarbandEvents = () => {
    this.eventHandles.push(events.on(signalr.WARBAND_EVENTS_JOINED, this.onWarbandJoined));
    this.eventHandles.push(events.on(signalr.WARBAND_EVENTS_UPDATE, this.onWarbandJoined));
    this.eventHandles.push(events.on(signalr.WARBAND_EVENTS_QUIT, this.onWarbandQuit));
    this.eventHandles.push(events.on(signalr.WARBAND_EVENTS_ABANDONED, this.onWarbandQuit));
    this.eventHandles.push(events.on(signalr.WARBAND_EVENTS_MEMBERJOINED, this.onWarbandMemberJoined));
    this.eventHandles.push(events.on(signalr.WARBAND_EVENTS_MEMBERUPDATE, this.onWarbandMemberUpdated));
    this.eventHandles.push(events.on(signalr.WARBAND_EVENTS_MEMBERREMOVED, this.onWarbandMemberRemoved));
  }

  private unregisterWarbandEvents = () => {
    for (const listener of this.eventHandles) {
      events.off(listener);
    }
  }

  private onWarbandJoined = (id: string, name: string) => {
    events.fire('chat-show-room', id);
    this.setState(WarbandDisplay.emptyWarband());
  }

  private onWarbandQuit = (id: string) => {
    events.fire('chat-leave-room', id);
    this.setState((state) => {
      if (state.warbandID !== id) return state;
      return {
        ...state,
        ...(WarbandDisplay.emptyWarband()),
      };
    });
  }

  private onWarbandMemberJoined = (memberJSON: string) => {
    const member = WarbandDisplay.deserializeMember(memberJSON);
    if (!member) return;

    this.setState((state) => {
      return {
        ...state,
        activeMembers: addOrUpdate(state.activeMembers, member, WarbandDisplay.memberCompare),
      };
    });
  }

  private onWarbandMemberUpdated = (memberJSON: string) => {
    const member = WarbandDisplay.deserializeMember(memberJSON);
    if (!member) return;

    this.setState((state) => {
      return {
        ...state,
        activeMembers: addOrUpdate(state.activeMembers, member, WarbandDisplay.memberCompare),
      };
    });
  }

  private onWarbandMemberRemoved = (characterID: string) => {
    this.setState((state) => {
      const removeResult = removeWhere(state.activeMembers, m => m.characterID === characterID);
      if (removeResult.removed.length > 0) {
        events.fire('system', `${removeResult.removed[0].name} has left your warband.`);
      }
      return {
        ...state,
        activeMembers: removeResult.result,
      };
    });
  }
}
