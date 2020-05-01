/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import WarbandMemberDisplay from './WarbandMemberDisplay';
import {
  GroupMemberState,
} from 'gql/interfaces';
const Container = styled.div`
  user-select: none;
  pointer-events: none;
  height: 100%;
  display: flex;
  flex-flow: column nowrap;
`;

export interface Props {
  activeMembers?: GroupMemberState[];
}

export function WarbandDisplayView(props: Props) {
  return (
    <Container className={'warbandDisplayView_Container'}>
      {
        props.activeMembers &&
          props.activeMembers.map(m => <WarbandMemberDisplay key={m.entityID} member={m as any} />)
      }
    </Container>
  );
}
