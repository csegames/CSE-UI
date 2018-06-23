/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from '../utils/css-helper';
import { Box } from './Box';
import { Key } from './Key';

function spacify(s: string) {
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
export interface Listening {
  name: string;
  which: number;
}

interface KeyBindProps {
  name: string;
  binds: any[];
  listening: Listening;
  toggleRebind?: (name: string, which: number) => void;
}

/* tslint:disable:function-name */
export function KeyBind(props: KeyBindProps) {
  const { binds, listening } = props;
  let i = 0;
  return (
    <Box style={{ minHeight: '45px' }}>
      { binds.map((bind: any) => {
        const which = i++;
        return (
          <Bind key={i}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              props.toggleRebind(props.name, which);
              e.stopPropagation();
              e.preventDefault();
            }}>
            <Key className={bind.code ? 'assigned' : 'unassigned'}>
              { listening && listening.which === which
                ? 'Press a key'
                : bind.label || ' '
              }
            </Key>
          </Bind>
        );
      })}
      <Name>{spacify(props.name)}</Name>
    </Box>
  );
}
