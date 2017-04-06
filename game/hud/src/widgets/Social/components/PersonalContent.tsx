/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-25 18:09:02
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-06 15:41:01
 */

import * as React from 'react';
import {
  ql,
  webAPI,
} from 'camelot-unchained';
import { LinkAddress } from '../services/session/nav/navTypes';

import InvitesList from './InvitesList';

export interface PersonalContentProps {
  dispatch: (action: any) => any;
  address: LinkAddress;
  refetch: () => void;
  myCharacter: ql.FullCharacter;
}

/* tslint:disable */
export function PersonalContent(props: PersonalContentProps) {
  switch (props.address.id) {
    case 'invites':
      return <InvitesList dispatch={props.dispatch}
                          refetch={props.refetch} />;
  }

  return <div>NO CONTENT</div>;
}

export default PersonalContent;
