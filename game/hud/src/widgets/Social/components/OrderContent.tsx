/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-25 18:09:02
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-03-08
 */

import * as React from 'react';
import { ql, Spinner } from 'camelot-unchained';
import { LinkAddress, SocialCategory } from '../services/session/nav/navTypes';
import { selectLink } from '../services/session/navigation';

import Overview from './Overview';
import RankList from './RankList';
import MemberList from './MemberList';
import CreateGroup from './CreateGroup';
import OrderAdmin from './OrderAdmin';
import OrdersList from './OrdersList';

export interface OrderContentProps {
  dispatch: (action: any) => any;
  address: LinkAddress;
  order: ql.FullOrder;
  refetch: () => void;
}

export interface OrderContentState {

}

export class OrderContent extends React.Component<OrderContentProps, OrderContentState> {

  constructor(props: OrderContentProps) {
    super(props);
    this.handleJoinLeaveNavUpdate(props);
    this.state = {};
  }

  componentWillReceiveProps(nextProps: OrderContentProps) {
    this.handleJoinLeaveNavUpdate(nextProps);
  }

  handleJoinLeaveNavUpdate = (props: OrderContentProps) => {
    if (props.order && props.address.id === 'create') {
      props.dispatch(selectLink({
        kind: 'Primary',
        category: SocialCategory.Order,
        id: 'overview'
      }));
    }

    if (!props.order) {
      switch (props.address.id) {
        case 'create':
        case 'list':
          break;
        default:
          if (!props.order) {
            props.dispatch(selectLink({
              kind: 'Primary',
              category: SocialCategory.Order,
              id: 'create'
            }));
          }
      }
    }
  }

  render() {

    switch (this.props.address.id) {
      case 'create':
        return <CreateGroup category={SocialCategory.Order}
                            refetch={this.props.refetch}
                            dispatch={this.props.dispatch} />;
      case 'list':
        return <OrdersList refetch={this.props.refetch} />;
    }

    if (!this.props.order) {
      return <Spinner />
    }

    switch (this.props.address.id) {
      case 'overview':
        return <Overview dispatch={this.props.dispatch}
                         refetch={this.props.refetch}
                         order={this.props.order} />;
      case 'members':
        return <MemberList dispatch={this.props.dispatch}
                           group={this.props.order}
                           userPermissions={this.props.order.myMemberInfo.permissions}
                           refetch={this.props.refetch} />
      case 'ranks':
        return <RankList dispatch={this.props.dispatch}
                      group={this.props.order}
                      userPermissions={this.props.order.myMemberInfo.permissions}
                      refetch={this.props.refetch} />
      case 'admin':
        return <OrderAdmin dispatch={this.props.dispatch}
                           order={this.props.order}
                           refetch={this.props.refetch} />
      default:
        return <div>NO CONTENT</div>;
    }
  }
}

export default OrderContent;
