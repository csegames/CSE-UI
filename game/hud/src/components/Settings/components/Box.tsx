/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CONFIG from '../config';
import * as CSS from '../utils/css-helper';

const Outer = styled('div')`
  ${CSS.DONT_GROW} ${CSS.IS_ROW}
  margin-bottom: 5px;
  padding: 3px;
  background-color: ${CONFIG.BOX_BACKGROUND_COLOR};
  ${CSS.ALLOW_MOUSE}
`;

const Border = styled('div')`
  ${CSS.EXPAND_TO_FIT} ${CSS.IS_ROW}
  border: 1px solid ${CONFIG.BOX_BORDER_INNER_COLOR};
  position: relative;
  &::before {
    /* Border texture */
    position: absolute;
    content: '';
    background-image: url(images/settings/settings-permissions-texture.png);
    background-size: contain;
    width: calc(100% + 2px);
    height: calc(100% + 2px);
    top: -1px;
    left: -1px;
    ${CSS.NO_MOUSE}
  }
  &::after {
    /* Inset Shadow from edge of box */
    position: absolute;
    content: '';
    width: calc(100% + 6px);
    height: calc(100% + 6px);
    top: -3px;
    left: -3px;
    box-shadow: inset 0 0 15px rgba(0,0,0,0.5);
    ${CSS.NO_MOUSE}
  }
`;

const Inner = styled('div')`
  ${CSS.EXPAND_WITH_WRAP} ${CSS.IS_ROW}
  background-color: ${CONFIG.BOX_BACKGROUND_COLOR};
  color: ${CONFIG.HIGHLIGHTED_TEXT_COLOR};
  font-size: 15px;
  padding: 5px;
  position: relative;
  &.no-pad { padding: 0; }
  &.uppercase { text-transform: uppercase; }
  ${(props: any) => {
    return `
      ${props.justify ? `justify-content: ${props.justify};` : ''}
      ${props.align ? `text-align: ${props.align};` : ''}
    `;
  }}
`;

interface BoxProps {
  id?: string;
  align?: string;
  justify?: string;
  uppercase?: boolean;
  children?: any;
  padding?: boolean;                // inner padding
  style?: any;                      // outer custom styles
  onClick?: (id: string) => void;
}

/* tslint:disable:function-name */
export function Box(props: BoxProps) {
  const cls: string[] = [];
  if (props.padding === false) cls.push('no-pad');
  if (props.uppercase) cls.push('uppercase');
  return (
    <Outer style={props.style} onClick={(e: React.MouseEvent<HTMLDivElement>) => {
      if (props.onClick) {
        props.onClick(props.id);
        e.stopPropagation();
        e.preventDefault();
      }
    }}>
      <Border>
        <Inner className={cls.join(' ')}
          align={props.align}
          justify={props.justify}>
          {props.children}
        </Inner>
      </Border>
    </Outer>
  );
}
