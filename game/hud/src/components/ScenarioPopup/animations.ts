/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { keyframes } from 'react-emotion';

export const slideDownBounceUp = keyframes`
  0%, 10% {
    top: -300px;
    opacity: 0;
  }

  80% {
    top: 0px;
  }

  100% {
    top: -20px;
    opacity: 1;
  }
`;

export const slideDown = keyframes`
0%, 10% {
  top: -80px;
  opacity: 0;
}

100% {
  top: 0px;
  opacity: 1;
}
`;

export const slideUpTitle = keyframes`
  0%, 10% {
    bottom: 0px;
    opacity: 0;
  }

  100% {
    bottom: 35px;
    opacity: 1;
  }
`;

export const slideUpMsg = keyframes`
  0%, 10% {
    bottom: 0px;
    opacity: 0;
  }

  100% {
    bottom: 30px;
    opacity: 1;
}
`;

export const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export const fadeOut = keyframes`
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
`;

export const fadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
`;

export const glow = keyframes`
  0% {
    -webkit-filter: brightness(100%);
  }
  50% {
    -webkit-filter: brightness(150%);
  }
  100% {
    -webkit-filter: brightness(100%);
  }
`;

export const blast = keyframes`
  from {
    opacity: 1;
    background-size: 10% 10%;
  }
  to {
    opacity: 0;
    background-size: 120% 120%;
  }
`;

export const shine = keyframes`
  0% {
    width: 0%;
  }
  99.9% {
    width: 100%;
  }
  100% {
    width: 0%;
  }
`;
