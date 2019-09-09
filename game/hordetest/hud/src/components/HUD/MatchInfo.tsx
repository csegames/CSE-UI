/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const MatchInfoContainer = styled.div`
  display: flex;
  width: 300px;
  justify-content: space-between;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 20px;
  color: white;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
`;

const ItemIcon = styled.span`
  margin-right: 5px;
`;

export interface Props {
}

export function MatchInfo(props: Props) {
  function renderMatchInfoItem(iconClass: string, text: string) {
    return (
      <Item>
        <ItemIcon className={iconClass}></ItemIcon>
        {text}
      </Item>
    );
  }
  return (
    <MatchInfoContainer>
      {renderMatchInfoItem('far fa-clock', '30:13')}
      {renderMatchInfoItem('icon-enemy', 'Wave 13')}
      {renderMatchInfoItem('icon-sword-tab', '1523')}
    </MatchInfoContainer>
  );
}
