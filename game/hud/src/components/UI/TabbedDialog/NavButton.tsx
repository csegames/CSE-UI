/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import styled from 'react-emotion';
import * as CONFIG from '../config';
import { DIALOG_FONT, FOOTER_BORDER_COLOR_RGB } from './config';

const NAV_BUTTON_WIDTH = 147;
const NAV_BUTTON_HEIGHT = 45;

const NavButtonLabel = styled('span')`
  position: absolute;
  line-height: ${NAV_BUTTON_HEIGHT - 5}px;
  text-align: center;
  text-transform: uppercase;
  font-size: 12px;
  letter-spacing: 2px;
  width: 100%;
`;

const NavButton = styled('div')`
  width: ${NAV_BUTTON_WIDTH}px;
  height: ${NAV_BUTTON_HEIGHT}px;
  x-line-height: ${NAV_BUTTON_HEIGHT - 5}px;
  overflow: visible;
  ${DIALOG_FONT}
  position: relative;
  cursor: pointer;
  pointer-events: all;

  /* Normal Nav Button, with arrow pointing up */
  color: ${CONFIG.NAV_NORMAL_TEXT_COLOR};
  border: ${CONFIG.NAV_BUTTON_BORDER_WIDTH}px rgba(0,0,0,0) solid;
  background-image: url(images/settings/settings-topnav-arrow-up.png);
  background-position: center 35px;
  background-repeat: no-repeat;
  box-sizing: border-box!important;

  ::after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: -1px;
    width: 147px;
    height: 40px;
    z-index: -1;

    /* non-selected button edge ticks */
    border: 1px solid rgba(255,255,255,0.5);
    border-image: linear-gradient(
      to top,
      rgb(${FOOTER_BORDER_COLOR_RGB}) 0%,
      rgba(0,0,0,0) 60%,
      rgba(0,0,0,0) 80%
    ) 0 1 1 1;
  }

  &:hover {
    background-color: rgba(39,39,39,0.6);
    height: 41px;
  }

  &.selected {

    /* selected button highlight */
    span {
      color: ${CONFIG.NAV_HIGHLIGHT_TEXT_COLOR};

      /* Background */
      background: linear-gradient(
        to bottom,
        rgba(${CONFIG.HIGHLIGHTED_BUTTON_BORDER},0.2) 0%,
        rgba(0,0,0,0) 50%
      );
    }

    background: black;
    height: 42px;

    /* Border */
    border: ${CONFIG.NAV_BUTTON_BORDER_WIDTH}px rgb(${CONFIG.HIGHLIGHTED_BUTTON_BORDER}) solid;
    border-bottom: none;
    border-image: linear-gradient(
      to bottom,
      rgba(${CONFIG.HIGHLIGHTED_BUTTON_BORDER},0.7) 0%,
      rgba(${CONFIG.HIGHLIGHTED_BUTTON_BORDER},0.5) 50%,
      rgba(0,0,0,0) 100%
    ) 1 1 0 1;

    /* Selected Nav Button texture (sits over border) */
    ::before {
      content: '';
      position: absolute;
      width: 147px;
      height: 42px;
      top: -1px;
      left: -1px;
      z-index: 1;
      border: none;
      background-image: url(images/settings/settings-topnav-texture.png);
      background-repeat: no-repeat;
    }

    /* Selected Nav button down arrow */
    ::after {
      content: '';
      position: absolute;
      border: 0;
      background-image: url(images/settings/settings-topnav-arrow-down.png);
      background-position: center 36px;
      background-repeat: no-repeat;
      width: 147px;
      height: 47px;
      z-index: 1;
    }
  }
`;

export { NavButton, NavButtonLabel };
