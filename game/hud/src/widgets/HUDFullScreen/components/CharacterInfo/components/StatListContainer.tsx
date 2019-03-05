/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

export interface StatListContainerStyles {
  StatListContainer: React.CSSProperties;
  statListContainerContent: React.CSSProperties;
  searchInput: React.CSSProperties;
}

const Container = styled.div`
  flex: 1;
  height: 100%;
  flex-direction: column;
  border-left: 2px solid #6A6260;
  border-right: 2px solid #6A6260;
  border-bottom: 2px solid #6A6260;
`;

const StatListContainerContent = styled.div`
  flex: 1;
  overflow-y: auto;
  height: 100%;
`;

export interface StatListContainerProps {
  styles?: Partial<StatListContainerStyles>;
  renderContent: () => JSX.Element;
}

const StatListContainer = (props: StatListContainerProps) => {
  return (
    <Container>
      <StatListContainerContent className='cse-ui-scroller-thumbonly'>
        {props.renderContent()}
      </StatListContainerContent>
    </Container>
  );
};

export default StatListContainer;
