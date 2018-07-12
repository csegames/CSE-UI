/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { HeaderBorderFoundation } from '../../TabHeader';
import { SecureTradeState } from '@csegames/camelot-unchained/lib/graphql';

const SubHeaderContainer = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  height: 35px;
  background: linear-gradient(to right, rgba(188, 163, 143, 0.6), transparent), url(images/inventory/title-bg.png);
  background-size: cover;
  color: white;
  z-index: 1;
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 3px;
  box-shadow: inset 0 0 67px rgba(0, 0, 0, 0.6);
  border: 1px black solid;
  &.gray-bg {
    background: linear-gradient(to right,rgba(200, 200, 200, 0.5), transparent ), url(images/inventory/title-bg-grey.png);
    &:before {
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.40);
    }
  }
  &.confirmed {
    background: linear-gradient(to right,rgba(255, 203, 77, 0.7), transparent ), url(images/inventory/title-bg.png);
  }
  &:before {
    content: '';
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
    border-image: linear-gradient(to right, rgba(255, 255, 255, 0.1), transparent 70%) 10% 1%;
    ${HeaderBorderFoundation}
  }
`;

export interface TradeWindowSubHeaderProps {
  text: string;
  tradeState: SecureTradeState;
  useGrayBG?: boolean;
}

class TradeWindowSubHeader extends React.Component<TradeWindowSubHeaderProps> {
  public render() {
    const { tradeState, useGrayBG, text } = this.props;
    const className = `${useGrayBG ? 'gray-bg' : ''} ${tradeState === 'Confirmed' ? 'confirmed' : ''}`;
    return (
      <SubHeaderContainer className={className}>{text}</SubHeaderContainer>
    );
  }
}

export default TradeWindowSubHeader;
