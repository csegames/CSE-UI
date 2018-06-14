/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

const Watermark = styled('i')`
  width: 340px;
  height: 20px;
  line-height: 20px;
  position: fixed;
  left: 50%;
  top: 15px;
  transform: translateX(-50%);
  color: #FFF;
  font-size: 13px;
  font-family: 'Merriweather Sans', sans-serif;
  fotn-weight: bold;
  text-align: right;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  -webkit-touch-callout: none;
  user-select: none;
  cursor: default;
`;

export interface WatermarkStyle {
  watermark: React.CSSProperties;
}

export default (props: {
  style?: Partial<WatermarkStyle>;
}) => {
  return <Watermark>Engine/Tech Alpha - Do not stream or distribute.</Watermark>;
};
