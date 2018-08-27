/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import styled from 'react-emotion';

export const MODAL_ACCENT = 'rgba(255, 234, 194, 0.4)';
export const MODAL_HIGHLIGHT_STRONG = 'rgba(255, 234, 194, 0.2)';
export const MODAL_HIGHLIGHT_WEAK = 'rgba(255, 234, 194, 0.0)';

export const ModalContainer = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
`;

export const ModalButtonContainer = styled('div')`
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalButton = styled('div')`
  position: relative;
  pointer-events: all;
  background: url(images/progression/button-off.png) no-repeat;
  width: 95px;
  height: 30px;;
  border: none;
  margin: 12px 16px 0 16px;
  cursor: pointer;
  color: #848484;
  font-family: 'Caudex', serif;
  font-size: 10px;
  text-transform: uppercase;
  text-align: center;
  line-height: 30px;
  &:hover {
    background: url(images/progression/button-on.png) no-repeat;
    color: #fff;
    &::before {
      content: '';
      position: absolute;
      background-image: url(images/progression/button-glow.png);
      width: 93px;
      height: 30px;
      left: 0;
      background-size: cover;
  }
`;
