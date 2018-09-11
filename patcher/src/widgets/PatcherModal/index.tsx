/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from 'emotion';
export interface Props {
  accentColor: string;
  highlightColorStrong: string;
  highlightColorWeak: string;
}

export default ({ accentColor, highlightColorStrong, highlightColorWeak, className, children, ...rest }
  : Props & React.HTMLProps<HTMLDivElement>) => (
  <div
    {...rest }
    className={css`
      flex: 0 0 auto;
      width: 500px;
      background: radial-gradient(${highlightColorStrong}, ${highlightColorWeak} 60%, transparent) 0% -140px no-repeat,
        url(images/modal/modal-bg.jpg);
      background-size: cover;
      border-top: 1px solid ${accentColor};
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      box-shadow: 0px 0px 16px #111;

      &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        pointer-events: none;
        border-width: 1px;
        border-style: solid;
        border-image: linear-gradient(to bottom, ${accentColor}, transparent) 1 50%;
      }

      input {
        width: calc(100% - 40px);
        margin: 5px;
        padding: 15px 10px;
        border: 1px #2c2c2c solid;
        color: #8f8f8f;
        mask-image: url(images/button-long-mask.png);
        mask-repeat: no-repeat;
        mask-size: cover;
        background: #2a2a2a;
        font-family:"Titillium Web";
        font-size: 1em;
        transition: border .2s;
        border: 1px solid #111 !important;
        &:focus {
          border: 1px solid ${accentColor} !important;
          box-shadow: 0 1px 2px ${accentColor} !important;
          outline: none;
        }
        &::placeholder {
          color: #6f6f6f;
          opacity: 1;
        }
        &:-ms-input-placeholder {
          color: #6f6f6f;
        }
        &::-ms-input-placeholder {
          color: #6f6f6f;
        }
      }
      @media only screen and (min-device-width : 320px) and (max-device-width : 480px) {
        width: calc(100% - 2px);
        height: auto;
      }
    `}
  >
    {children}
  </div>
);
