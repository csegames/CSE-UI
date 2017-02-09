/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-30 14:52:18
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-27 11:49:08
 */

import * as React from 'react';
import { merge } from 'lodash';
import * as moment from 'moment';
import * as className from 'classnames';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { ql,
         Tooltip,
         Flyout,
         GridView,
         ColumnDefinition,
         Race,
         Faction,
         Gender,
         Archetype,
         client,
         webAPI,
         InlineDropDownSelectEdit,
       } from 'camelot-unchained';

import MemberListMenu from './MemberListMenu';
import GroupTitle from './GroupTitle';
import InviteButton from './InviteButton';

export interface MemberListStyle extends StyleDeclaration {
  container : React.CSSProperties;
  title : React.CSSProperties;
  list : React.CSSProperties;
  listHeader : React.CSSProperties;
  listSection : React.CSSProperties;
  item : React.CSSProperties;
  name : React.CSSProperties;
  rank : React.CSSProperties;
  joined : React.CSSProperties;
  more : React.CSSProperties;
  buttonBar: React.CSSProperties;
}

export const defaultMemberListStyle : MemberListStyle = {

  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },

  title: {
    padding: '10px',
    borderBottom: '2px solid #777'
  },

  list: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    overflowY: 'scroll'
  },

  listHeader: {
    display: 'flex',
    color: '#777',
    fontWeight: 'bold',
    minHeight: '2em',
    padding: '5px'
  },

  listSection: {
    display: 'flex',
    padding: '5px',
    minHeight: '2em',
    ':nth-child(even)': {
      backgroundColor: 'rgba(0, 0, 0, 0.1)'
    }
  },

  item: {
    flex: '1 1 auto',
    margin: '0 5px'
  },

  // modifiers for elements
  name: {
    minWidth: '100px'
  },

  rank: {
    maxWidth: '200px'
  },

  joined: {
    maxWidth: '150px'
  },

  more: {
    maxWidth: '10px',
    cursor: 'pointer',
    flex: '0 0 auto'
  },

  // ButtonBar is the buttons on the top above the rank list
  buttonBar: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: '10px',
  },
};

export interface MemberListProps {
  dispatch : (action : any) => any;
  refetch: () => void;
  group : {
    id: string,
    name: string,
    members: any,
    ranks: ql.CustomRank[],
  };
  userPermissions: ql.PermissionInfo[];
  styles?: Partial<MemberListStyle>;
  columnDefinitions?: ColumnDefinition[];
}

export const defaultMemberListColumnDefinitions = [
  {
    key: (m: {name: string}) => m.name,
    title: 'Name',
    sortable: true,
    sortFunction: (a: {name: string}, b: {name: string}) => a.name < b.name ? 1 : -1,
  },
  {
    key: (m: {id: string, rank: {name: string}}) => m.rank.name,
    title: 'Rank',
    sortable: true,
    sortFunction: (a: {rank: ql.CustomRank}, b: {rank: ql.CustomRank}) => b.rank.level - a.rank.level,
    style: {
      flex: '0 0 120px !important',
      width: '120px'
    },
    renderItem: (m: {id: string, rank: ql.CustomRank}, renderData?: { ranks: ql.CustomRank[], userPermissions: ql.PermissionInfo[], groupId: string, refetch: () => void, }) => {
      if (renderData && renderData.userPermissions && ql.hasPermission(renderData.userPermissions, 'assign-ranks')) {
        return <InlineDropDownSelectEdit value={m.rank}
                                         items={renderData.ranks}
                                         renderListItem={(p: ql.CustomRank) => {
                                           return (
                                             <div style={{padding: '5px'}}>
                                               {p.name}<br/>
                                             </div>
                                           );
                                         }}
                                         renderSelectedItem={(p: ql.CustomRank) => {
                                           return (
                                             <div style={{padding: '5px'}}>
                                               {p.name}<br/>
                                             </div>
                                           );
                                         }}
                                         onSave={(current: ql.CustomRank, r: ql.CustomRank): any  => {
                                           return webAPI.GroupsAPI.assignRankV1(client.shardID, client.characterID, renderData.groupId, m.id, r.name)
                                             .then(result => {
                                               if (result.ok) {
                                                 renderData.refetch();
                                                 return {
                                                   ok: true
                                                 };
                                               }
                                               return {
                                                 ok: false,
                                                 error: result.data,
                                               }
                                             })
                                         }} />;
      } else {
        return <span>{m.rank.name}</span>;
      }
    }
  },
  {
    key: (m: {race: Race}) => m.race,
    title: 'Race',
    sortable: true,
    sortFunction: (a: {race: Race}, b: {race: Race}) => a.race < b.race ? 1 : -1,
    style: {
      flex: '0 0 120px !important',
      width: '120px'
    },
  },
  {
    key: (m: {class: Archetype}) => m.class,
    title: 'Class',
    sortable: true,
    sortFunction: (a: {class: Archetype}, b: {class: Archetype}) => a.class < b.class ? 1 : -1,
    style: {
      flex: '0 0 120px !important',
      width: '120px'
    },
  },
  {
    key: (m: {joined: string}) => m.joined,
    title: 'Joined',
    sortable: true,
    sortFunction: (a: {joined: string}, b: {joined: string}) => a.joined < b.joined ? 1 : -1,
    style: {
      flex: '0 0 180px !important',
      width: '180px'
    },
    renderItem: (m: ql.FullOrderMember) => {
      return (
        <Tooltip
          content={new Date(m.joined).toLocaleString()}
          styles={{
          tooltip: {
            backgroundColor: '#444',
            border: '1px solid #4A4A4A'
          }
        }}>
          {moment(m.joined as any).fromNow()}
        </Tooltip>
      );
    }
  },
  {
    key: (m: {lastLogin: string}) => m.lastLogin,
    title: 'Last Login',
    sortable: true,
    sortFunction: (a: {lastLogin: string}, b: {lastLogin: string}) => a.lastLogin < b.lastLogin ? 1 : -1,
    style: {
      flex: '0 0 180px !important',
      width: '180px'
    },
    renderItem: (m: ql.FullOrderMember) => {
      return (
        <Tooltip
          content={new Date(m.joined).toLocaleString()}
          styles={{
          tooltip: {
            backgroundColor: '#444',
            border: '1px solid #4A4A4A'
          }
        }}>
          {moment(m.lastLogin as any).fromNow()}
        </Tooltip>
      );
    }
  },
];

function renderButtonBar(props: MemberListProps, ss: MemberListStyle, custom: Partial<MemberListStyle>) {
  return (
    <div className={css(ss.buttonBar, custom.buttonBar)}>

        {
          // CREATE RANK
          ql.hasPermission(props.userPermissions, 'create-invites')
            ? <InviteButton dispatch={props.dispatch}
                              refetch={props.refetch}
                              groupId={props.group.id} />
            : null
        }
        
      </div>
  );
}

export default (props : MemberListProps) => {

  const ss = StyleSheet.create(defaultMemberListStyle);
  const custom = StyleSheet.create(props.styles || {});
  const columnDefs = props.columnDefinitions || defaultMemberListColumnDefinitions;

  return (
    <div className={css(ss.container)}>
      <GroupTitle refetch={props.refetch}>
        {props.group.name}
      </GroupTitle>

      {renderButtonBar(props, ss, custom)}

      <GridView items={props.group.members}
                itemsPerPage={25}
                columnDefinitions={columnDefs}
                renderData={{
                  ranks: props.group.ranks,
                  userPermissions: props.userPermissions,
                  groupId: props.group.id,
                  refetch: props.refetch,
                }}
                rowMenu={(item: ql.FullOrderMember, close: () => void) => {
                  return <MemberListMenu member={item}
                                         close={close}
                                         refetch={props.refetch}
                                         groupId={props.group.id} />
                }}
                rowMenuStyle={{
                  backgroundColor: '#444',
                  border: '1px solid #4A4A4A'
                }} />
    </div>
  )
};


