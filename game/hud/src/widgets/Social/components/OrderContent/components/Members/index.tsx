/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-30 14:52:18
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 16:43:02
 */

import * as React from 'react';
import * as moment from 'moment';
import * as className from 'classnames';
import { merge } from 'lodash';

import Tooltip from '../../../../../../components/Tooltip';
import Flyout from '../../../../../../components/Flyout';

import { OrderState } from '../../../../services/session/order';
import { OrderMember } from 'camelot-unchained';

import styles from './style';
import { StyleSheet, css } from 'aphrodite';

import MemberMenu from './components/MemberMenu';

export interface MembersStyle {
  container: React.CSSProperties;
  title: React.CSSProperties;
  list: React.CSSProperties;
  listHeader: React.CSSProperties;
  listSection: React.CSSProperties;
  item: React.CSSProperties;
  name: React.CSSProperties;
  rank: React.CSSProperties;
  joined: React.CSSProperties;
  more: React.CSSProperties;
}

export interface MembersProps {
  dispatch: (action: any) => any;
  order: OrderState;
  style?: MembersStyle;
}

const renderMember = (m: OrderMember, ss: any, dispatch: (action: any) => any) => {
  return (
    <div className={css(ss.listSection)} key={m.id}>
      <span className={css(ss.item, ss.name)}>{m.name}</span>
      <span className={css(ss.item, ss.rank)}>{m.rank}</span>
      <span className={css(ss.item, ss.joined)}>
        <Tooltip content={new Date(m.joined).toLocaleString()}
          style={{
            backgroundColor: '#444',
            border: '1px solid #4A4A4A',
          }}>
          {moment(m.joined as any).fromNow()}
        </Tooltip>
      </span>
      <span className={css(ss.item, ss.more)}>
        <Flyout content={MemberMenu}
          contentProps={{
            dispatch: dispatch,
            member: m,
          }}
          style={{
            backgroundColor: '#444',
            border: '1px solid #4A4A4A',
          }}>
          <i className='fa fa-ellipsis-v click-effect'></i>
        </Flyout>
      </span>
    </div>
  );
}

export default (props: MembersProps) => {

  const order = props.order.order;
  const ss = StyleSheet.create(merge(styles, props.style || {}));

  return (
    <div className={css(ss.container)}>
      <h1 className={css(ss.title)}>
        {order.name}
      </h1>

      <div className={css(ss.list)}>
        <div className={css(ss.listHeader)}>
          <span className={css(ss.item, ss.name)}>Name</span>
          <span className={css(ss.item, ss.rank)}>Rank</span>
          <span className={css(ss.item, ss.joined)}>Joined</span>
          <span className={css(ss.item, ss.more)}></span>
        </div>

        {order.members.map(m => renderMember(m, ss, props.dispatch))}
        {order.members.map(m => renderMember(m, ss, props.dispatch))}
        {order.members.map(m => renderMember(m, ss, props.dispatch))}

      </div>
    </div>
  )
};
