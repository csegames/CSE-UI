/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 12:39:02
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-27 15:26:31
 */

import * as React from 'react';
import * as className from 'classnames';
import { merge } from 'lodash';
import {
  ql,
  ConfirmDialog,
  webAPI,
  client
} from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

export const defaultMemberListMenuStyle: MemberListMenuStyle = {
  list: {
    display: 'flex',
    flexDirection: 'column',
    margin: '0',
    padding: '0',
    userSelect: 'none',
  },

  item: {
    flex: '1 1 auto',
    padding: '5px',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }
  },
};

export interface MemberListMenuStyle extends StyleDeclaration {
  list: React.CSSProperties;
  item: React.CSSProperties;
}

const confirmPromoteDialog = (props: {}) => {
  return (
    <div>
      
    </div>
  );
}


function kickMember(m: {id: string}, groupId: string, onSuccess: () => void) {
  webAPI.GroupsAPI.kickV1(client.shardID, client.characterID, groupId, m.id)
    .then(result => {
      if (result.ok) {
        // ok
        onSuccess();
      }
    })
}


export default (props: {
  groupId: string;
  close: () => void;
  refetch: () => void;
  member: ql.FullOrderMember;
  styles?: Partial<MemberListMenuStyle>;
}) => {

  const ss = StyleSheet.create(defaultMemberListMenuStyle);
  const custom = StyleSheet.create(props.styles || {});

  return (
    <div className={css(ss.list, custom.list)}>
      <ConfirmDialog onConfirm={() => kickMember(props.member, props.groupId, props.refetch)}
          onCancel={() => 0}
          content={(props: any) => <div>Are you sure you wish to kick {props.member.name}?</div>}
          contentProps={props as any}
          cancelOnClickOutside={true} >
        <div className={css(ss.item, custom.item)}>
          Kick
        </div>
      </ConfirmDialog>
    </div>
  );
};
