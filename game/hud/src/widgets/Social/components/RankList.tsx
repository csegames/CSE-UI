/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 12:11:02
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 15:22:09
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { ql,
         utils,
         Flyout,
         Tooltip,
         RaisedButton,
         DualListSelect,
         Dialog,
         GridView,
         ColumnDefinition,
         webAPI,
         client,
         InlineTextInputEdit,
         InlineNumberInputEdit,
         InlineMultiSelectEdit,
       } from 'camelot-unchained';

import GroupTitle from './GroupTitle';
import CreateRankDialog from './CreateRankDialog';
import RankListItemMenu from './RankListItemMenu';

const { stringContains } = utils;

export const defaultRanksStyle : RanksStyle = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },

  title: {
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

  name: {
    minWidth: '150px',
    maxWidth: '150px',
    width: '150px',
    textOverflow: 'ellipsis'
  },

  level: {
    minWidth: '75px',
    maxWidth: '75px',
    width: '75px'
  },

  permissions: {
    minWidth: '250px',
    textOverflow: 'wrap'
  },

  options: {
    minWidth: '10px',
    maxWidth: '10px',
    width: '10px',
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
}

export interface RanksStyle extends StyleDeclaration {
  container : React.CSSProperties;
  title : React.CSSProperties;
  list : React.CSSProperties;
  listHeader : React.CSSProperties;
  listSection : React.CSSProperties;
  item : React.CSSProperties;
  name : React.CSSProperties;
  level : React.CSSProperties;
  permissions : React.CSSProperties;
  options : React.CSSProperties;
  buttonBar: React.CSSProperties;
}

let createRankDialogRef: Dialog<any> = null; 
function renderButtonBar(props: RanksProps, ss: RanksStyle, custom: Partial<RanksStyle>) {
  return (
    <div className={css(ss.buttonBar, custom.buttonBar)}>

        {
          // CREATE RANK
          ql.hasPermission(props.userPermissions, 'create-rank')
            ? (
                <Dialog ref={r => createRankDialogRef = r}
                        closeOnClickOutside={true}
                        content={() => <CreateRankDialog dispatch={props.dispatch}
                                                   groupId={props.group.id}
                                                   permissions={props.group.permissions}
                                                   onCancel={() => createRankDialogRef.hide()}
                                                   onCreated={() => {
                                                     createRankDialogRef.hide();
                                                     props.refetch();
                                                   }} />
                                }>
                  <RaisedButton styles={{
                      button: {
                        flex: '0 0 auto',
                      }
                    }}>
                    Create Rank
                  </RaisedButton>
              </Dialog>)
            : null
        }
        
      </div>
  );
}

export interface RanksProps {
  dispatch: (action : any) => any;
  refetch: () => void;
  group: {
    id: string;
    name: string;
    ranks: ql.CustomRank[];
    permissions: ql.PermissionInfo[];
  };
  userPermissions: ql.PermissionInfo[];
  columnDefinitions?: ColumnDefinition[];
  styles?: Partial < RanksStyle >;
}

export const defaultRankListColumnDefinitions: ColumnDefinition[] = [
  {
    key: (r: ql.CustomRank) => r.name,
    title: 'Name',
    sortable: true,
    style: {
      flex: '0 0 150px !important',
      width: '150px',
      textOverflow: 'ellipsis',
    },
    sortFunction: (a: ql.CustomRank, b: ql.CustomRank) => a.name < b.name ? 1 : -1,
    renderItem: (r: ql.CustomRank, renderData?: { userPermissions: ql.PermissionInfo[], groupId: string, refetch: () => void, }) => {
      if (renderData && renderData.userPermissions && ql.hasPermission(renderData.userPermissions, 'update-ranks')) {
        return <InlineTextInputEdit value={r.name} onSave={(currentName: string, newName: string): any  => {
            return webAPI.GroupsAPI.renameRankV1(client.shardID, client.characterID, renderData.groupId, currentName, newName)
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
        return <span>{r.name}</span>;
      }
    }
  },
  {
    key: (r: ql.CustomRank) => r.level,
    title: 'Level',
    sortable: true,
    style: {
      flex: '0 0 120px !important',
      width: '120px'
    },
    sortFunction: (a: ql.CustomRank, b: ql.CustomRank) => b.level - a.level,
    renderItem: (r: ql.CustomRank, renderData?: { userPermissions: ql.PermissionInfo[], groupId: string, refetch: () => void, }) => {
      if (renderData && renderData.userPermissions && ql.hasPermission(renderData.userPermissions, 'update-ranks')) {
        return <InlineNumberInputEdit value={r.level}
                                      min={2}
                                      max={1000}
                                      onSave={(currentLevel: number, newLevel: string): any  => {
            return webAPI.GroupsAPI.setRankLevelV1(client.shardID, client.characterID, renderData.groupId, r.name, Number.parseInt(newLevel))
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
        return <span>{r.level}</span>;
      }
    }
  },
  {
    key: (r: ql.CustomRank) => r.permissions,
    title: 'Permissions',
    style: {
      textOverflow: 'wrap',
    },
    renderItem: (item: ql.CustomRank, renderData?: { userPermissions: ql.PermissionInfo[], groupPermissions: ql.PermissionInfo[], groupId: string, refetch: () => void, }) => {
      if (renderData && renderData.userPermissions && ql.hasPermission(renderData.userPermissions, 'update-ranks')) {

      return <InlineMultiSelectEdit items={renderData.groupPermissions}
                                    value={item.permissions}
                                    styles={{
                                      container: {
                                        width: '600px',
                                      }
                                    }}
                                    renderListItem={(p: ql.PermissionInfo) => {
                                      return (
                                        <div key={p.tag} style={{padding: '5px', border: '1px solid rgba(0, 0, 0, 0.2)'}}>
                                          {p.name}<br/>
                                          {p.description}<br/>
                                          <i>enables {p.enables.join(', ')}</i>
                                        </div>
                                      );
                                    }}
                                    renderSelectedItem={(p: ql.PermissionInfo) => {
                                      return (
                                        <Tooltip key={p.tag} content={p.description}>
                                          <span style={{paddingRight: '5px'}}>{p.name+' '}</span>
                                        </Tooltip>
                                      );
                                    }}
                                    itemComparison={(a: ql.PermissionInfo, b: ql.PermissionInfo) => a.tag == b.tag}
                                    filter={(text: string, p: ql.PermissionInfo) => stringContains(p.name, text)}
                                    onSave={(existing: ql.PermissionInfo[], permissions: ql.PermissionInfo[]): any  => {
                                      console.log(permissions.map(p => p.tag).join());
                                      return webAPI.GroupsAPI.setRankPermissionsV1(client.shardID, client.characterID, renderData.groupId, item.name, permissions.map(p => p.tag))
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
                                    }} />
      } else {
      return <span>{
        item.permissions
            .map(p => {
              return (
                <Tooltip
                  key={p.tag}
                  content={() => {
                  return (
                    <div>
                      <div>{p.description}</div>
                      <i>id: {p.tag}</i>
                    </div>
                  );
                }}
                  styles={{
                  container: {
                    margin: '2px',
                  },
                  content: {
                    backgroundColor: '#444',
                    border: '1px solid #4A4A4A',
                    maxWidth: '300px',
                  }
                }}>
                  {p.name}
                </Tooltip>
              )
            })}</span>
    }}
  },
];


export default (props : RanksProps) => {

  const ss = StyleSheet.create(defaultRanksStyle);
  const custom = StyleSheet.create(props.styles || {});
  const colDefs = props.columnDefinitions || defaultRankListColumnDefinitions;

  return (
    <div className={css(ss.container, custom.container)}>
      <GroupTitle styles={{
                    title: ss.title
                  }}
                  refetch={props.refetch}>
        {props.group.name}
      </GroupTitle>

      {renderButtonBar(props, ss, custom)}

      

      <GridView items={props.group.ranks}
                itemsPerPage={20}
                columnDefinitions={colDefs}
                userPermissions={props.userPermissions}
                rowMenu={(item: ql.CustomRank, close: () => void) => {
                  return <RankListItemMenu refetch={props.refetch}
                                           groupId={props.group.id}
                                           close={close}
                                           rank={item} />
                }}
                renderData={{
                  userPermissions: props.userPermissions,
                  groupId: props.group.id,
                  refetch: props.refetch,
                  groupPermissions: props.group.permissions,
                }}
                rowMenuStyle={{
                  backgroundColor: '#444',
                  border: '1px solid #4A4A4A'
                }} />
    </div>
  )
}
