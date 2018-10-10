/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import gql from 'graphql-tag';
import styled from 'react-emotion';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
import {
  WarbandDisplayQuery,
  WarbandDisplaySubscription,
  GroupUpdateType,
  GroupMemberUpdate,
  GroupMemberRemovedUpdate,
} from 'gql/interfaces';

import { addOrUpdate, removeWhere } from '../../lib/reduxUtils';
import WarbandMemberDisplay from './WarbandMemberDisplay';
import {
  setActiveWarbandID,
  getActiveWarbandID,
  onWarbandMemberUpdate,
  onWarbandMemberRemoved,
} from '../../services/actions/warband';
import { WarbandMemberStateFragment } from 'gql/fragments/WarbandMemberStateFragment';

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

const query = gql`
  query WarbandDisplayQuery {
    myWarband {
      info {
        id
      }
      membersState {
        ...WarbandMemberState
      }
    }
  }
  ${WarbandMemberStateFragment}
`;

const subscriptionQuery = gql`
  subscription WarbandDisplaySubscription {
    groupUpdates {
      updateType
      groupID

      ... on GroupMemberUpdate {
        memberState
      }

      ... on GroupMemberRemovedUpdate {
        characterID
      }
    }
  }
`;
const subscriptionUrl =  (game.webAPIHost + '/graphql').replace('http', 'ws');
const subscriptionInitPayload = {
  shardID: game.shardID,
  Authorization: `Bearer ${game.accessToken}`,
  characterID: game.selfPlayerState.characterID,
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

  private graphql: GraphQLResult<WarbandDisplayQuery.Query>;
  private eventJoinedHandle: EventHandle;
  private receivedMemberUpdate: boolean = false;

  constructor(props: WarbandDisplayProps) {
    super(props);
    this.state = {
      ...(WarbandDisplay.emptyWarband()),
    };
  }

  public render() {
    return (
      <GraphQL query={query} onQueryResult={this.handleQuery}>
        {() => this.state.warbandID ? (
          <GraphQL
            subscription={{
              query: subscriptionQuery,
              url: subscriptionUrl,
              initPayload: subscriptionInitPayload,
            }}
            subscriptionHandler={this.handleSubscription}>
            {() => (
              <Container>
                {
                  this.state.activeMembers &&
                    this.state.activeMembers.map(m => <WarbandMemberDisplay key={m.entityID} member={m as any} />)
                }
              </Container>
            )}
          </GraphQL>
        ) : null}
      </GraphQL>
    );
  }

  public componentDidMount() {
    this.eventJoinedHandle = game.on('warband-joined', this.onJoinWarband);
  }

  public componentWillUnmount() {
    this.eventJoinedHandle.clear();
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

  private handleQuery = (graphql: GraphQLResult<WarbandDisplayQuery.Query>) => {
    this.graphql = graphql;
    if (!graphql.data || !graphql.ok) {
      return graphql;
    }

    const warband = graphql.data.myWarband;
    if (warband) {
      this.onInitializeWarband(warband.info.id, warband.membersState as GroupMemberState[]);
    }
  }

  private handleSubscription = (result: SubscriptionResult<WarbandDisplaySubscription.Subscription>,
                                data: WarbandDisplayQuery.Query) => {
    if (!result.data || !result.ok) {
      return data;
    }

    const resultData = result.data;
    switch (resultData.groupUpdates.updateType) {
      case GroupUpdateType.MemberJoined: {
        const member = WarbandDisplay.deserializeMember((resultData.groupUpdates as GroupMemberUpdate).memberState);
        this.onWarbandMemberJoined(member);
        break;
      }
      case GroupUpdateType.MemberRemoved: {
        this.onWarbandMemberRemoved((resultData.groupUpdates as GroupMemberRemovedUpdate).characterID);
        break;
      }
      case GroupUpdateType.MemberUpdate: {
        const member = WarbandDisplay.deserializeMember((resultData.groupUpdates as GroupMemberUpdate).memberState);
        this.onWarbandMemberUpdated(member);
        break;
      }
    }
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
      if  (process.env.IS_DEVELOPMENT) {
        console.error(`WarbandMemberJoined Failed to parse WarbandMember. | ${e}`);
      }
      return;
    }
  }

  private onJoinWarband = (id: string) => {
    this.graphql.refetch();
  }

  private onInitializeWarband = (id: string, members: GroupMemberState[]) => {
    this.setState({
      ...(WarbandDisplay.emptyWarband()),
      warbandID: id,
      activeMembers: members,
    });
    setActiveWarbandID(id);
    members.forEach(member => onWarbandMemberUpdate(member));
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

  private onWarbandMemberJoined = (member: GroupMemberState) => {
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

  private onWarbandMemberUpdated = (member: GroupMemberState) => {
    if (!this.state.warbandID) return;
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
        game.trigger('systemMessage', `${removeResult.removed[0].name} has left your warband.`);
      }
      return {
        ...state,
        activeMembers: removeResult.result,
      };
    });
  }
}

