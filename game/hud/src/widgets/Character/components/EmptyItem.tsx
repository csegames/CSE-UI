/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

const Item = styled('div')`
  vertical-align: baseline;
  background-size: cover;
  width: ${(props: any) => props.width};
  height: ${(props: any) => props.height};
  position: relative;
  overflow: hidden;
  cursor: pointer;
`;

export interface EmptyItemProps {
  height?: number;
  width?: number;
  index?: number;
}

export const EmptyItem = (props: EmptyItemProps) => {
  return (
    <div style={{ position: 'relative' }}>
      <Item width={props.width ? `${props.width}px` : '100%'} height={props.height ? `${props.height}px` : '100%'} />
    </div>
  );
};

export default EmptyItem;
