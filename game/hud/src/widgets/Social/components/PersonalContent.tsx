/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ql } from 'camelot-unchained';
import { LinkAddress } from '../services/session/nav/navTypes';

import InvitesList from './InvitesList';

export interface PersonalContentProps {
  dispatch: (action: any) => any;
  address: LinkAddress;
  refetch: () => void;
  myCharacter: Partial<ql.CUCharacter>;
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
