/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import * as CSS from '../../lib/css-helper';
import { Box } from './Box';
import { Field } from './Field';

const CHECK_BG_COLOR = 'rgb(15,16,18)';
const CHECK_FG_COLOR = 'rgb(252,211,179)';
const CHECK_LINE_COLOR = '53,53,53';

const CheckBoxContainer = styled('div')`
  ${CSS.IS_ROW}
  position: absolute;
  right: 40px;
  top: -8px;
  width: 20px;
  height: 50px;
  ::before {
    content: '';
    position: absolute;
    top: 0;
    width: 2px;
    height: 50px;
    left: 9px;
    background: linear-gradient(
      to bottom,
      rgba(${CHECK_LINE_COLOR},0.5) 0%,
      rgba(${CHECK_LINE_COLOR},0.5) 36%,
      rgba(${CHECK_LINE_COLOR},0.5) 71%,
      rgba(${CHECK_LINE_COLOR},0.5) 100%
    );
  }
  ::after {
    content: '';
    position: absolute;
    top: 20px;
    left: 5px;
    width: 6px;
    height: 6px;
    border: 2px inset ${CHECK_BG_COLOR};
    background-color: ${CHECK_BG_COLOR};
    transform: scale(1.5) rotate(45deg);
    z-index: 1;
    box-sizing: content-box!important;
  }
  &.on {
    ::after {
      background-color: ${CHECK_FG_COLOR};
    }
  }
`;

interface CheckBoxProps {
  on?: boolean;
}

/* tslint:disable:function-name */
export function CheckBox(props: CheckBoxProps) {
  const cls = props.on ? 'on' : 'off';
  return (
    <CheckBoxContainer className={cls}/>
  );
}

interface CheckBoxFieldProps {
  id?: string;
  label: string;
  on: boolean;
  onToggle?: (id: string) => void;
}

export function CheckBoxField(props: CheckBoxFieldProps) {
  const cls = 'fixed-height';
  return (
    <Box onClick={() => props.onToggle(props.id)}>
      <Field className={`${cls} expand ellipsis`}>{props.label}</Field>
      <Field className={`${cls} right-align`} style={{ width: '100px' }}>
        <CheckBox on={props.on}/>
      </Field>
    </Box>
  );
}
