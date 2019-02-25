/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from 'linaria/react';

const Watermark = styled.div`
  position: fixed;
  margin: auto;
  left: 50%;
  text-align: center;
  transform: translateX(-50%);
  color: #FFF;
  font-family: 'Merriweather Sans', sans-serif;
  font-weight: bold;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: default;
  z-index: 9999;
  pointer-events: none;
  top: 94px;
  font-size: 26px;
  width: 680px;
  height: 40px;
  line-height: 40px;

  @media (max-width: 1920px) {
    font-size: 13px;
    top: 47px;
    width: 340px;
    height: 20px;
    line-height: 20px;
  }
`;

export interface WatermarkStyle {
  watermark: React.CSSProperties;
}

export default (props: {
  style?: Partial<WatermarkStyle>;
}) => {
  return <Watermark style={props.style ? props.style.watermark : {}}>Beta 1 - Do not stream or distribute.</Watermark>;
};
