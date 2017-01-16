/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-30 10:37:02
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 16:41:31
 */

import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import { merge } from 'lodash';

import { OrderState } from '../../../services/session/order';

const defaultStyle: OverviewStyle = {
  containter: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },

  title: {
    padding: '10px',
    borderBottom: '2px solid #777',
  },

  content: {
    padding: '10px',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    alignContent: 'stretch',
    justifyContent: 'space-around',
  },

  contentTop: {
    display: 'flex',
    flex: '0 0 auto',
    alignItems: 'center',
  },

  logo: {
    width: '150px',
    height: '150px',
    border: '2px solid #777',
    padding: '5px',
    margin: '5px',
  },

  logoIMG: {
    width: '100%',
    height: '100%',
  },

  summary: {
    width: '300px',
    height: '150px',
    display: 'flex',
    flexWrap: 'wrap',
    padding: '15px',
    margin: '10px',
    border: '2px solid #777',
    alignContent: 'space-around',
  },

  summaryItem: {
    width: '50%',
  },

  summaryHeader: {
    color: '#777',
    fontWeight: 600,
  },

  row: {
    flex: '1 1 auto',
    display: 'flex',
  },

  recentActivity: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    padding: '15px',
    margin: '10px',
    border: '2px solid #777',
    alignContent: 'top',
    alignSelf: 'stretch',
    overflowY: 'scroll',
  },

  recentActivityHeader: {
    color: '#777',
    fontSize: '1.1em',
  },

  recentActivityItem: {
    margin: '0',
    padding: '0',
  },

};

export interface OverviewStyle {
  containter: React.CSSProperties;
  title: React.CSSProperties;
  content: React.CSSProperties;
  contentTop: React.CSSProperties;
  logo: React.CSSProperties;
  logoIMG: React.CSSProperties;
  summary: React.CSSProperties;
  summaryItem: React.CSSProperties;
  summaryHeader: React.CSSProperties;
  row: React.CSSProperties;
  recentActivity: React.CSSProperties;
  recentActivityHeader: React.CSSProperties;
  recentActivityItem: React.CSSProperties;
}

export default (props: {
  dispatch: (action: any) => any;
  order: OrderState;
  styles?: Partial<OverviewStyle>;
}) => {

  const ss = StyleSheet.create(merge(defaultStyle, props.styles || {}));
  const order = props.order.order;

  return (
    <div className={css(ss.containter)}>
      <h1 className={css(ss.title)}>
        {order.name}
      </h1>
      <div className={css(ss.content)}>

        <div className={css(ss.contentTop)}>
          <div className={css(ss.logo)}>
            <img className={css(ss.logoIMG)} src='images/cu-logo-white-square.png' />
          </div>

          <div className={css(ss.summary)}>
            <div className={css(ss.summaryItem)}>
              <div className={css(ss.summaryHeader)}>Created By</div>
              {order.createdBy}
            </div>

            <div className={css(ss.summaryItem)}>
              <div className={css(ss.summaryHeader)}>Members</div>
              {4}
            </div>

            <div className={css(ss.summaryItem)}>
              <div className={css(ss.summaryHeader)}>Founded</div>
              {new Date(order.created as any).toLocaleDateString()}
            </div>

            <div className={css(ss.summaryItem)}>
              <div className={css(ss.summaryHeader)}>Joined</div>
              {new Date(order.members[0].joined as any).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div className={css(ss.row)}>
          <div className={css(ss.recentActivity)}>
            <div className={css(ss.recentActivityHeader)}>Recent Activity</div>
            <div className={css(ss.recentActivityItem)}><i>{new Date(order.created as any).toLocaleString()}</i> - <a href='#'>Awesomesauce</a> has joined the Order upon accepting the <a href='#'>invite</a> from <a href='#'>{order.createdBy}</a>.</div>
            <div className={css(ss.recentActivityItem)}><i>{new Date(order.created as any).toLocaleString()}</i> - <a href='#'>Super-cheese</a> has joined the Order upon accepting the <a href='#'>invite</a> from <a href='#'>{order.createdBy}</a>.</div>
            <div className={css(ss.recentActivityItem)}><i>{new Date(order.created as any).toLocaleString()}</i> - <a href='#'>{order.createdBy}</a> sent an Order <a href='#'>invite</a> to <a href='#'>Awesomesauce</a>.</div>
            <div className={css(ss.recentActivityItem)}><i>{new Date(order.created as any).toLocaleString()}</i> - <a href='#'>{order.createdBy}</a> sent an Order <a href='#'>invite</a> to <a href='#'>Super-cheese</a>.</div>
            <div className={css(ss.recentActivityItem)}><i>{new Date(order.created as any).toLocaleString()}</i> - <a href='#'>MisterP</a> has joined the Order upon accepting the <a href='#'>invite</a> from <a href='#'>{order.createdBy}</a>.</div>
            <div className={css(ss.recentActivityItem)}><i>{new Date(order.created as any).toLocaleString()}</i> - <a href='#'>{order.createdBy}</a> sent an Order <a href='#'>invite</a> to <a href='#'>MisterP</a>.</div>
            <div className={css(ss.recentActivityItem)}><i>{new Date(order.created as any).toLocaleString()}</i> - <a href='#'>{order.createdBy}</a> joined the Order.</div>
            <div className={css(ss.recentActivityItem)}><i>{new Date(order.created as any).toLocaleString()}</i> - Order was founded by <a href='#'>{order.createdBy}</a>.</div>
          </div>
        </div>
      </div>
    </div>
  )
};
