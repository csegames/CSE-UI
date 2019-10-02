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

  &:hover {
    filter: brightness(130%);
  }

  &:active {
    filter: brightness(80%);
  }
`;
