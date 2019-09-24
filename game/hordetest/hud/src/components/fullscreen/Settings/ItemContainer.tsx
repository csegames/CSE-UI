/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { styled } from '@csegames/linaria/react';

export const ItemContainer = styled.div`
  position: relative;
  background-color: #0f0f0f;
  width: calc(100% - 30px);
  height: 45px;
  padding: 0 15px;
  font-family: Lato;
  font-weight: bold;
  color: white;
  margin: 4px 0;
  z-index: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid #171717;
  transition: border-color 0.2s;

  &:hover {
    border-color: #66b9fc;
  }

  &:before {
    content: '';
    position: absolute;
    z-index: -1;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.07), transparent);
    pointer-events: none;
  }
`;
