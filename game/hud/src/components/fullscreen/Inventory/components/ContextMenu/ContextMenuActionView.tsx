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
  color: white;
  pointer-events: all;
  border-bottom: 1px solid #222;
  max-width: 300px;
  padding: 5px;

  &:hover {
    -webkit-filter: brightness(120%);
    filter: brightness(120%);
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
        color: props.disabled ? 'gray' : 'white',
        cursor: props.disabled ? 'not-allowed' : 'pointer',
        opacity: props.disabled ? 0.5 : 1,
      }}>
      {props.children}
    </View>
  );
};

export default ContextMenuActionView;
