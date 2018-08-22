/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import styled from 'react-emotion';

const ContextMenuActionView = styled('div')`
  display: flex;
  justify-content: space-between;
  background-color: ${(props: any) => props.disabled ? '#434343' : 'gray' };
  color: white;
  pointer-events: all;
  border-bottom: 1px solid #222;
  max-width: 300px;
  padding: 5px;
  cursor: ${(props: any) => props.disabled ? 'not-allowed' : 'pointer'};
  opacity: ${(props: any) => props.disabled ? 0.5 : 1};

  &:hover {
    -webkit-filter: brightness(120%);
    filter: brightness(120%);
  }

  &:active {
    ${(props: any) => props.disabled ? '' : 'box-shadow: inset 0 0 3px rgba(0,0,0,0.5)'};
  }
`;

export default ContextMenuActionView;
