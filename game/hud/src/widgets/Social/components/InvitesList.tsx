/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-24 14:14:09
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-27 16:40:18
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import {
  ql,
  webAPI,
  GridView,
  FlatButton,
  ConfirmDialog,
  Spinner,
  GroupType,
  InviteStatus,
  client,
} from 'camelot-unchained';
import { graphql, InjectedGraphQLProps } from 'react-apollo';

import GroupTitle from './GroupTitle';
import ActionButton from './ActionButton';
import InlineOrder from './InlineOrder';
import InlineWarband from './InlineWarband';

export interface InvitesListStyle extends StyleDeclaration {
  container: React.CSSProperties;
}

export const defaultInviteListStyle: InvitesListStyle = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
};

export interface InvitesListProps extends InjectedGraphQLProps<ql.MyCharacterInvitesQuery> {
  dispatch: (action: any) => void;
  refetch: () => void;
  styles?: Partial<InvitesListStyle>;
}

function renderInviteList(props: InvitesListProps, ss: InvitesListStyle, custom: Partial<InvitesListStyle>) {
  if (props.data.myCharacter && props.data.myCharacter.invites) {
    return <GridView items={props.data.myCharacter.invites}
                columnDefinitions={[
                  {
                    key: (i: ql.Invite) => i.groupType,
                    title: 'Group Type',
                    sortable: true,
                    renderItem: (i: ql.Invite) => <span>{i.groupType}</span>,
                  },
                  {
                    key: (i: ql.Invite) => i.groupID,
                    title: 'Group',
                    sortable: true,
                    renderItem: (i: ql.Invite) => {
                      if (i.groupType === 'Order') {
                        return <InlineOrder id={i.groupID} shard={client.shardID} />
                      }
                      return <InlineWarband id={i.groupID} shard={client.shardID} />
                    },
                  },
                  {
                    key: (i: ql.Invite) => i.member,
                    title: 'Sent By',
                    sortable: true,
                    renderItem: (i: ql.Invite) => <span>{i.member.name}</span>,
                  },
                  {
                    key: (i: ql.Invite) => i.status,
                    title: 'Status',
                    sortable: true,
                    renderItem: (i: ql.Invite) => <span>{i.status}</span>,
                  },
                  {
                    key: (i: ql.Invite) => i.inviteCode,
                    title: 'Action',
                    renderItem: (i: ql.Invite) => {
                      if (i.status === 'Active') {
                        return <ActionButton preActionContent={() => <span>Accept</span>}
                                             inActionContent={() => <Spinner />}
                                             postActionContent={() => <span>Accepted</span>}
                                             action={() => {
                                               return webAPI.GroupsAPI.acceptInviteV1(client.shardID, client.characterID, i.groupID, i.inviteCode)
                                                .then(result => {
                                                  return {
                                                    ok: result.ok,
                                                    error: JSON.stringify(result.data),
                                                  };
                                                }) as any;
                                             }}
                                             onActionSuccess={() => {
                                                props.refetch();
                                                props.data.refetch();
                                             }} />
                      }
                      return <span> - </span>
                    }
                  },
                ]} />;
  }

  return (
    <div>
      No invites found for your character.
    </div>
  );
}

function PreQLInvitesList(props: InvitesListProps) {
  const ss = StyleSheet.create(defaultInviteListStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <div className={css(ss.container, custom.container)}>
      <GroupTitle refetch={() => props.data.refetch()}>
        Your Invites
      </GroupTitle>
      {
        props.data.loading ? 
        (
          <div>
            <Spinner />
          </div>
        ) : renderInviteList(props, ss, custom)
      }
    </div>
  );
}

export const InvitesList = graphql(ql.queries.MyCharacterInvites)(PreQLInvitesList);
export default InvitesList;
