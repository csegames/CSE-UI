/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import { css } from 'emotion';
import styled from 'react-emotion';

const Wrapper = styled('div')`
  display: inline-block;
  position: relative;
`;

const inputStyle = css`
  position: relative;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: none;
  margin: 5px;
`;

const ClickDiv = styled('div')`
  display: inline-block;
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  pointer-events: auto;
`;

type Props = React.InputHTMLAttributes<HTMLInputElement> & { inputClassName?: string; };

export const CheckInput = (props: Props) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const toggleChecked = () => {
    inputRef.current.checked = !inputRef.current.checked;
  };

  return (
    <Wrapper>
      <input
        className={props.inputClassName + ' ' + inputStyle}
        type='checkbox'
        ref={inputRef}
        {...props}
      />
      <ClickDiv onClick={toggleChecked} />
    </Wrapper>
  );
};
