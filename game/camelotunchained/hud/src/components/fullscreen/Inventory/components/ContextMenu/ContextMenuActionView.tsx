/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const View = styled.div`
  display: flex;
  justify-content: space-between;
  font-weight: bold;
  border: 1px solid transparent;
  padding: 1px 4px;
  font-size: 14px;
  color: #ccc;
  cursor: pointer;
  &:hover {
    color: #ffdbac;
    border: 1px solid;
    border-image-source: linear-gradient(to right, #ae8b6f 20%, transparent);
    border-image-slice: 1;
    box-shadow: inset 0px 0px 10px 0px #000000;
    background-color: #221d17;
  }

  &:active {
    box-shadow: inset 0 0 3px rgba(0,0,0,0.5);
  }
`;

const ContextMenuActionView = (props: React.Props<HTMLDivElement> & {
  disabled: boolean,
  onClick: (e: React.MouseEvent<HTMLDivElement>) => void,
}) => {
  return (
    <View
      {...props}
      style={{
        pointerEvents: props.disabled ? 'none' : 'all',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
      }}>
      {props.children}
    </View>
  );
};

export default ContextMenuActionView;
