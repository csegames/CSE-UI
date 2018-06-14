/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { utils, Input } from '@csegames/camelot-unchained';
import styled from 'react-emotion';

import { colors } from '../../../lib/constants';

export interface StatListContainerStyles {
  StatListContainer: React.CSSProperties;
  statListContainerContent: React.CSSProperties;
  searchInput: React.CSSProperties;
}

const Container = styled('div')`
  flex: 1;
  height: 100%;
  flex-direction: column;
  border-left: 2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  border-right: 2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  border-bottom: 2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
`;

const StatListContainerContent = styled('div')`
  flex: 1;
  overflow: auto;
  height: calc(100% - 42px);
`;

const InputStyle = {
  input: {
    fontSize: '20px',
  },
};

export interface StatListContainerProps {
  styles?: Partial<StatListContainerStyles>;
  renderContent: () => JSX.Element;
  searchValue: string;
  onSearchChange: (searchValue: string) => void;
}

const StatListContainer = (props: StatListContainerProps) => {
  return (
    <Container>
      <Input
        placeholder='Filter'
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => props.onSearchChange(e.target.value)}
        value={props.searchValue}
        styles={InputStyle}
      />
      <StatListContainerContent>{props.renderContent()}</StatListContainerContent>
    </Container>
  );
};

export default StatListContainer;
