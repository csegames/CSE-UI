/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-01 12:39:02
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-01 16:50:37
 */

import * as React from 'react';
import { OrderMember } from 'camelot-unchained';
import * as className from 'classnames';
import { merge } from 'lodash';

import { StyleSheet, css } from 'aphrodite';
import ConfirmDialog from '../../../../../../../components/ConfirmDialog';

const defaultStyles = {
  list: {
    margin: '0',
    padding: '0',
  },

  item: {
    padding: '5px',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
    }
  },
};

const confirmPromoteDialog = (props: {}) => {
  return (
    <div>
      
    </div>
  );
}


export default (props: {
  close: () => void;
  dispatch: (action: any) => any;
  member: OrderMember;
  style?: Partial<{
    list: React.CSSProperties;
    item: React.CSSProperties;
  }>;
}) => {

  var ss = StyleSheet.create(merge(defaultStyles, props.style || {}));

  return (
    <ul className={css(ss.list)}>
      <li className={css(ss.item)}>
        <ConfirmDialog onConfirm={() => props.close()}
          onCancel={() => props.close()}
          content={(props: any) => <div>Hello World</div>}
          cancelOnClickOutside={true} >
          <span className='click-effect'>
            Promote
            </span>
        </ConfirmDialog>
      </li>
      <li className={className('click-effect', css(ss.item))}>Kick</li>
      <li className={className('click-effect', css(ss.item))}>Profile</li>
    </ul>
  );
};
