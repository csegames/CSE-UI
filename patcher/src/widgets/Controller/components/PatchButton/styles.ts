/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import styled, { css, keyframes } from 'react-emotion';

export const shine = keyframes`
  from {
    left: 20px;
    opacity: 1;
  }
  to {
    left: 95%;
    opacity: 0;
  }
`;

export const PatchButtonStyle = css`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 85px;
  width: 286px;
  background: url(images/controller/play-button.png) no-repeat;
  cursor: pointer;
  text-transform: uppercase;
  &:hover {
    filter: brightness(120%);
  }

  &:hover .patch-button-glow {
    opacity: 1;
  }

  &:hover:before {
    content: '';
    pointer-events: none;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    opacity: 0;
    height: 85%;
    width: 65px;
    background: linear-gradient(transparent, rgba(255,255,255,0.2));
    clip-path: polygon(80% 0%, 100% 0%, 20% 100%, 0% 100%);
    -webkit-clip-path: polygon(80% 0%, 100% 0%, 20% 100%, 0% 100%);
    -webkit-animation: ${shine} 0.5s ease forwards;
    animation: ${shine} 0.5s ease forwards;
    animation-delay: 0.3s;
    -webkit-animation-delay: 0.3s;
  }

  &:hover:after {
    content: '';
    pointer-events: none;
    opacity: 0;
    position: absolute;
    left: 0;
    right: 0;
    bottom: 5px;
    opacity: 0;
    height: 85%;
    width: 85px;
    background: linear-gradient(transparent, rgba(255,255,255,0.2));
    clip-path: polygon(80% 0%, 100% 0%, 20% 100%, 0% 100%);
    -webkit-clip-path: polygon(80% 0%, 100% 0%, 20% 100%, 0% 100%);
    -webkit-animation: ${shine} 0.5s ease forwards;
    animation: ${shine} 0.5s ease forwards;
  }
`;

export const ButtonGlow = styled('div')`
  position: absolute;
  top: 10px;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(rgba(255,255,255,0.8), transparent, transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
`;

export const ButtonText = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  margin-left: 30px;
  font-weight: bold;
  font-size: ${(props: any) => props.fontSize || 1.3}em;
  color: black;
  z-index: 1;
`;
