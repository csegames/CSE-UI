/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from 'lib/css-helper';
import { Box } from 'UI/Box';
import { Key } from './Key';
import { Bind, BoundKey } from '../utils/keyboard';

export function spacify(s: string) {
  return s
    .replace(/([^A-Z])([A-Z]+)+/g, '$1 $2')
    .replace(/([^0-9])([0-9]+)/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z])/g, '$1 $2');
}

const Name = styled('div')`
  ${CSS.EXPAND_TO_FIT}
  line-height: 27px;
`;
const Bind = styled('div')`
  ${CSS.IS_ROW} ${CSS.DONT_GROW}
  width: 130px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

interface KeyBindProps {
  name: string;
  bind: Bind;
  toggleRebind?: (keybind: Bind, alias: number) => void;
}

/* tslint:disable:function-name */
export function KeyBind(props: KeyBindProps) {
  const { bind } = props;
  let i = 0;
  return (
    <Box style={{ minHeight: '45px' }}>
      { bind.boundKeys.map((bind: BoundKey) => {
        const alias = i++;
        return (
          <Bind key={i}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              props.toggleRebind(props.bind, alias);
              e.stopPropagation();
              e.preventDefault();
            }}>
            <Key className={bind.value ? 'assigned' : 'unassigned'}>
              { bind.name || ' ' }
            </Key>
          </Bind>
        );
      })}
      <Name>{spacify(props.name)}</Name>
    </Box>
  );
}
