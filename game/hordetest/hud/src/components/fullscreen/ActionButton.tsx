/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { styled } from '@csegames/linaria/react';

export const ActionButton = styled.div`
  display: flex;
  align-items: center;
  font-size: 22px;
  color: white;
  font-family: Lato;
  font-weight: bold;
  cursor: pointer;
  border: 2px solid rgba(125, 125, 125, 1);
  outline: 1px solid rgba(115, 115, 115, 1);
  outline-offset: -5px;
  padding: 5px 20px;
  background: rgba(0, 0, 0, 0.51);
  transition: background .2s, filter .2s ;

  &:hover {
    filter: brightness(130%);
    background: rgba(200, 200, 200, 0.2);
  }

  &:active {
    filter: brightness(80%);
  }
`;
