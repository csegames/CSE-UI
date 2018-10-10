/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import * as CSS from 'lib/css-helper';
import { Box } from 'UI/Box';
import { Key } from 'widgets/Settings/components/Key';

export function spacify(s: string) {
  return s
    .replace(/([^A-Z])([A-Z]+)+/g, '$1 $2')
    .replace(/([^0-9])([0-9]+)/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z])/g, '$1 $2');
}

const Name = styled('div')`
  ${CSS.EXPAND_TO_FIT}
`;
const Bind = styled('div')`
  ${CSS.IS_ROW}
  width: 130px;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const InnerClass = css`
  display: flex;
  align-items: center;
`;

interface Props {
  keybind: Keybind;
  onRequestBind?: (keybind: Keybind, index: number) => void;
}

/* tslint:disable:function-name */
export function KeybindRow(props: Props) {
  return (
    <Box innerClassName={InnerClass} style={{ minHeight: '45px' }}>
      { props.keybind.binds.map((binding, index) => {
        return (
          <Bind key={index}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              props.onRequestBind(this.props.keybind, index);
              e.stopPropagation();
              e.preventDefault();
            }}>
            <Key className={binding.value ? 'assigned' : 'unassigned'}>
              { binding.name || ' ' }
            </Key>
          </Bind>
        );
      })}
      <Name>{spacify(props.keybind.description)}</Name>
    </Box>
  );
}
