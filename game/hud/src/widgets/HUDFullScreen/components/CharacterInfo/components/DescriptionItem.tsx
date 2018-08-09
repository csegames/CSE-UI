/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import styled from 'react-emotion';

const DescriptionItem = styled('div')`
  display: flex;
  justify-content: space-between;
  position: relative;
  cursor: default;
  padding: 0 5px;
  height: 25px;
  line-height: 25px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.8;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  color: #C3A186;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
`;

export default DescriptionItem;
