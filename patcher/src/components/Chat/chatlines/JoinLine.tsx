/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { useChatOptions } from '../state/optionsState';
import { RoomJoined } from '../../../protobuf/chatProtoTypes';

const Join = styled.span`
  color: ${(props: { color: string; }) => props.color};
`;

export function JoinLine(props: { msg: RoomJoined } ) {
  const [opts] = useChatOptions();
  if (!opts.showJoins) return null;

  return <Join color={'green'}>{props.msg.name} joined</Join>
}
