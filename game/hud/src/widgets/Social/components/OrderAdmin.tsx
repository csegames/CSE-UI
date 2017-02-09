/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-24 00:27:11
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-27 12:04:00
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { client,
         ql,
         webAPI,
         RaisedButton,
         Spinner,
         ConfirmDialog,
       } from 'camelot-unchained';
import GroupTitle from './GroupTitle';
import { selectLink } from '../services/session/navigation';
import { SocialCategory } from '../services/session/nav/navTypes';

export interface OrderAdminStyle extends StyleDeclaration {
  container: React.CSSProperties;
  section: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  sectionText: React.CSSProperties;
  sectionActions: React.CSSProperties;
  sectionActionErrors: React.CSSProperties;
}

export const defaultOrderAdminStyle: OrderAdminStyle = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignContent: 'flex-start',
  },

  section: {
    flex: '1 1 50%',
    border: '1px solid #111',
  },

  sectionTitle: {
    fontSize: '1.2em',
  },

  sectionText: {

  },

  sectionActionErrors: {
    color: 'darkred',
    fontSize: '0.9em',
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },

  sectionActions: {
    display: 'flex',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  }
};

export interface OrderAdminProps {
  dispatch: (action: any) => any;
  refetch: () => void;
  order: ql.FullOrder;
  styles?: Partial<OrderAdminStyle>;
}

export interface OrderAdminState {
  abandoning: boolean;
  abandonError: string;
  disbanding: boolean;
  disbandError: string;
}

export class OrderAdmin extends React.Component<OrderAdminProps, OrderAdminState> {

  constructor(props: OrderAdminProps) {
    super(props);
    this.state = {
      abandoning: false,
      abandonError: null,
      disbanding: false,
      disbandError: null,
    };
  }

  abandon = () => {
    webAPI.OrdersAPI.abandonV1(client.shardID, client.characterID)
      .then(result => {
        if (result.ok) {
          this.setState({
            abandoning: false,
            abandonError: null,
          });
          this.props.dispatch(selectLink({
            kind: 'Primary',
            category: SocialCategory.Order,
            id: 'create'
          }));
          this.props.refetch();
          return;
        }
        this.setState({
            abandoning: false,
            abandonError: result.data,
          });
      });
  }

  disband = () => {
    webAPI.OrdersAPI.disbandV1(client.shardID, client.characterID)
      .then(result => {
        if (result.ok) {
          this.setState({
            disbanding: false,
            disbandError: null,
          });
          this.props.dispatch(selectLink({
            kind: 'Primary',
            category: SocialCategory.Order,
            id: 'create'
          }));
          this.props.refetch();
          return;
        }
        this.setState({
            disbanding: false,
            disbandError: result.data,
          });
      });
  }

  render() {
    const ss = StyleSheet.create(defaultOrderAdminStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    return (
      <div className={css(ss.container, custom.container)}>
        <GroupTitle refetch={this.props.refetch}>
          {this.props.order.name}
        </GroupTitle>

        {/* ABANDON */}
        <div className={css(ss.section, custom.section)}>
          <div className={css(ss.sectionTitle, custom.sectionTitle)}>
            Abandon Order
          </div>
          <div className={css(ss.sectionText, custom.sectionText)}>
            This action will abandon this order for this character. You will no longer be a member of the order and will be able to join another or create a new one.
          </div>
          <div className={css(ss.sectionActionErrors, custom.sectionActionErrors)}>
            {this.state.abandonError}
          </div>
          <div className={css(ss.sectionActions, custom.sectionActions)}>
            <ConfirmDialog onConfirm={this.abandon}
                           onCancel={() => null}
                           content={() => <span>Are you sure you wish to abandon your Order?</span>}>
            <RaisedButton>
              { this.state.abandoning ? <Spinner /> : <span>Abandon</span> }
            </RaisedButton>
            </ConfirmDialog>
          </div>
        </div>

        {/* DISBAND */}
        {
          ql.hasPermission(this.props.order.myMemberInfo.permissions, 'everything') ?
          (
            <div className={css(ss.section, custom.section)}>
              <div className={css(ss.sectionTitle, custom.sectionTitle)}>
                Disband Order
              </div>
              <div className={css(ss.sectionText, custom.sectionText)}>
                This action will disband the order. You will no longer be a member of the order and will be able to join another or create a new one.
              </div>
              <div className={css(ss.sectionActionErrors, custom.sectionActionErrors)}>
                {this.state.disbandError}
              </div>
              <div className={css(ss.sectionActions, custom.sectionActions)}>
                <ConfirmDialog onConfirm={this.disband}
                               onCancel={() => null}
                               content={() => <span>Are you sure you wish to disband your Order?</span>}>
                <RaisedButton>
                  { this.state.disbanding ? <Spinner /> : <span>Disband</span> }
                </RaisedButton>
                </ConfirmDialog>
              </div>
            </div>
          ) : null
        }

      </div>
    );
  }
}

export default OrderAdmin;
