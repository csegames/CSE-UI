/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { groupsHub, hubEvents } from '@csegames/camelot-unchained/lib/signalR/hubs/groupsHub';
import styled from 'react-emotion';

import { addOrUpdate, removeWhere } from '../../lib/reduxUtils';
import WarbandMemberDisplay from './WarbandMemberDisplay';
import {
  setActiveWarbandID,
  getActiveWarbandID,
  onWarbandMemberUpdate,
  onWarbandMemberRemoved,
} from '../../services/actions/warband';

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
  activeMembers?: GroupMemberState[];
  permanentMembers?: GroupMemberState[];
  name?: string;
  warbandID?: string;
}

export class WarbandDisplay extends React.Component<WarbandDisplayProps, WarbandDisplayState> {

  private eventHandles: EventHandle[] = [];
  private receivedMemberUpdate: boolean = false;

  constructor(props: WarbandDisplayProps) {
    super(props);
    this.state = {
      ...(WarbandDisplay.emptyWarband()),
    };

    this.registerWarbandEvents();
    groupsHub.onConnected = function(hub) {
      hub.invoke('invalidate');
    };
    groupsHub.start();
  }

  public render() {
    return (
      <Container>
        {
          this.state.activeMembers &&
            this.state.activeMembers.map(m => <WarbandMemberDisplay key={m.id} member={m as any} />)
        }
      </Container>
    );
  }

  public componentWillUnmount() {
    this.unregisterWarbandEvents();
  }


  public shouldComponentUpdate(nextProps: Readonly<WarbandDisplayProps>, nextState: Readonly<WarbandDisplayState>) {

    if (this.props.isMini !== nextProps.isMini) {
      return true;
    }

    if (this.state.warbandID !== nextState.warbandID) {
      return true;
    }

    if (this.receivedMemberUpdate) {
      this.receivedMemberUpdate = false;
      return true;
    }

    return false;
  }

  private static emptyWarband() {
    return {
      activeMembers: [] as GroupMemberState[],
      name: '',
      permanentMembers: [] as GroupMemberState[],
      warbandID: '',
    };
  }

  private static memberCompare(a: GroupMemberState, b: GroupMemberState): boolean {
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

  private static deserializeMember(memberJSON: string): GroupMemberState {
    try {
      const member = JSON.parse(memberJSON);
      member.avatar = WarbandDisplay.getAvatar(member.gender, member.race);
      return member;
    } catch (e) {
      if (process.env.IS_DEVELOPMENT) {
        console.error(`WarbandMemberJoined Failed to parse WarbandMember. | ${e}`);
      }
      return;
    }
  }

  private registerWarbandEvents = () => {
    this.eventHandles.push(game.on(hubEvents.joined, this.onWarbandJoined));
    this.eventHandles.push(game.on(hubEvents.update, this.onWarbandJoined));
    this.eventHandles.push(game.on(hubEvents.quit, this.onWarbandQuit));
    this.eventHandles.push(game.on(hubEvents.abandoned, this.onWarbandQuit));
    this.eventHandles.push(game.on(hubEvents.memberJoined, this.onWarbandMemberJoined));
    this.eventHandles.push(game.on(hubEvents.memberUpdate, this.onWarbandMemberUpdated));
    this.eventHandles.push(game.on(hubEvents.memberRemoved, this.onWarbandMemberRemoved));
  }

  private unregisterWarbandEvents = () => {
    for (const handle of this.eventHandles) {
      handle.clear();
    }
  }

  private onWarbandJoined = (id: string) => {
    this.setState({
      ...(WarbandDisplay.emptyWarband()),
      warbandID: id,
    });
    setActiveWarbandID(id);
  }

  private onWarbandQuit = (id: string) => {
    if (getActiveWarbandID() === id) {
      setActiveWarbandID(null);
    }

    this.setState((state) => {
      if (state.warbandID !== id) return state;
      return {
        ...(WarbandDisplay.emptyWarband()),
      };
    });
  }

  private onWarbandMemberJoined = (memberJSON: string) => {
    const member = WarbandDisplay.deserializeMember(memberJSON);
    if (!member) return;
    onWarbandMemberUpdate(member);
    this.receivedMemberUpdate = true;
    this.setState((state) => {
      return {
        ...state,
        activeMembers: addOrUpdate(state.activeMembers, member, WarbandDisplay.memberCompare),
      };
    });
  }

  private onWarbandMemberUpdated = (memberJSON: string) => {
    if (!this.state.warbandID) return;
    const member = WarbandDisplay.deserializeMember(memberJSON);
    if (!member) return;
    onWarbandMemberUpdate(member);
    this.receivedMemberUpdate = true;
    this.setState((state) => {
      return {
        ...state,
        activeMembers: addOrUpdate(state.activeMembers, member, WarbandDisplay.memberCompare),
      };
    });
  }

  private onWarbandMemberRemoved = (characterID: string) => {
    if (characterID === game.selfPlayerState.characterID) {
      this.onWarbandQuit(this.state.warbandID);
      return;
    }
    onWarbandMemberRemoved(characterID);
    this.receivedMemberUpdate = true;
    this.setState((state) => {
      const removeResult = removeWhere(state.activeMembers, m => m.characterID === characterID);
      if (removeResult.removed.length > 0) {
        game.trigger('system_message', `${removeResult.removed[0].name} has left your warband.`);
      }
      return {
        ...state,
        activeMembers: removeResult.result,
      };
    });
  }
}
