/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client } from '@csegames/camelot-unchained';
import { colors } from '../../../lib/constants';

const Container = styled('div')`
  position: relative;
  display: flex;
  flex: 1 1 auto;
  margin-right: 10px;
`;

const Input = styled('input')`
  pointer-events: all;
  flex: 1 1 auto;
  height: 20px;
  padding: 5px;
  font-size: 18px !important;
  color: ${colors.infoText} !important;
  background-color: transparent;
  border: 0px;
  &::-webkit-input-placeholder {
    color: ${colors.infoText};
  }
  z-index: 1;
`;

const InputBackground = styled('div')`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid #604b46;
  z-index: 0;
`;

const InputOverlay = styled('div')`
  pointer-events: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: url(images/inventory/filter-input-texture.png);
  background-size: cover;
  z-index: 0;
`;

export interface FilterInputProps {
  filterText: string;
  onFilterChanged: (val: string) => void;
}

class FilterInput extends React.Component<FilterInputProps> {
  public render() {
    return (
      <Container>
        <InputBackground />
        <InputOverlay />
        <Input
          onClick={() => client.RequestInputOwnership()}
          onBlur={() => client.ReleaseInputOwnership()}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => this.props.onFilterChanged(e.target.value)}
          value={this.props.filterText}
          placeholder={'Filter'}
        />
      </Container>
    );
  }
}

export default FilterInput;
