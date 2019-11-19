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
  color: white;
  margin: 2px;
  border: 0;
  padding: 0 10px;
  outline: none;
  box-shadow: 0 0 1px transparent;
  transition: box-shadow 0.3s;

  &:focus {
    box-shadow: 0 0 1px rgba(239,190,152,1);
  }
`;
