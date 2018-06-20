/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { HeaderBorderFoundation } from '../../TabHeader';

const SubHeaderContainer = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: url(${(props: any) => props.grayBG ? 'images/inventory/title-bg-grey.png' : 'images/inventory/title-bg.png' });
  background-size: cover;
  -webkit-mask-image: url(images/inventory/title-mask.png);
  -webkit-mask-size: cover;
  padding: 0 20px;
  height: 35px;
  color: ${(props: any) => props.grayBG ? '#DFDFDF' : '#D9BC8D'};
  z-index: 1;
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 3px;
  box-shadow: inset 0 0 67px rgba(0, 0, 0, 0.6);
  &:before {
    content: '';
    box-shadow: 0 0 6px rgba(0, 0, 0, 0.5);
    border-image: ${(props: any) => `linear-gradient(to right, ${props.borderColor}, transparent 70%) 10% 1%`};
    ${HeaderBorderFoundation}
  }
  &:after {
    content: '';
    background: ${(props: any) => `linear-gradient(to right, ${props.backgroundColor}, transparent 70%)`};
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
  }
`;

export interface TradeWindowSubHeaderProps {
  text: string;
  borderColor: string;
  backgroundColor: string;
  borderBackgroundColor: string;
  useGrayBG?: boolean;
}

class TradeWindowSubHeader extends React.Component<TradeWindowSubHeaderProps> {
  public render() {
    const { useGrayBG, borderColor, backgroundColor, borderBackgroundColor } = this.props;
    return (
      <SubHeaderContainer
        grayBG={useGrayBG}
        borderColor={borderColor}
        backgroundColor={backgroundColor}
        borderBackgroundColor={borderBackgroundColor}
      >
        {this.props.text}
      </SubHeaderContainer>
    );
  }
}

export default TradeWindowSubHeader;
