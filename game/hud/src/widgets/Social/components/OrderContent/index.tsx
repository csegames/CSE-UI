/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-25 18:09:02
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-30 15:19:08
 */

import * as React from 'react';

import { OrderState } from '../../services/session/order';
import { LinkAddress } from '../../services/session/navigation';

import Overview from './components/Overview';
import Members from './components/Members';

export interface OrderContentProps {
  dispatch: (action: any) => any;
  address: LinkAddress;
  order: OrderState;
}

export interface OrderContentState {

}

export class OrderContent extends React.Component<OrderContentProps, OrderContentState> {

  constructor(props: OrderContentProps) {
    super(props);
    this.state = {};
  }

  render() {

    // is fetching
    if (this.props.order.order == null) {
      // first fetch, no info
      return (
        <div className='OrderContent'>
          <div className='OrderContent--fetching'>fetching...</div>
        </div>
      )
    }

    let content: JSX.Element = null;
    switch (this.props.address.id) {
      case 'overview':
        return <Overview dispatch={this.props.dispatch} order={this.props.order} />
      case 'members':
        return <Members dispatch={this.props.dispatch} order={this.props.order} />
      default:
        return <div>NO CONTENT</div>;
    }
  }
}

export default OrderContent;
