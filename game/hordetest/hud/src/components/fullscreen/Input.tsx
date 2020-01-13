/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { styled } from '@csegames/linaria/react';

export const Input = styled.input`
  height: 25px;
  width: 100%;
  background-color: black;
  margin: 2px;
  border: 0;
  padding: 0 10px;
  outline: none;
  border: 2px solid #4D4D4D;
  border-color: #4D4D4D;
  color: white;
  transition: border-color 0.2s;

  &:focus {
    border-color: #52CFFD;
  }
`;
