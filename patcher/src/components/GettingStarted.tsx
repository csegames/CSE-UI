/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  top: 150px;
  left: 50px;
  position: absolute;
  z-index: 99;
`;

const Dudes = styled.div`
  margin-bottom: -6px;
`;

const Image = styled.img`
  zoom: 100% !important;
`;

const Anvil = styled.div`
  position: relative;
  z-index: -1;
`;

const LinksContainer = styled.div`
  margin: -15px 0px 0px 43px;
  z-index: 1;
`;

const Link = styled.a`
  font-family: Titillium Web;
  font-weight: bold;
  color: black;
  font-size: 16px;
  text-decoration: none;
  text-align: center;
  padding-top: 12px;
  margin-top: -10px;
  width: 205px;
  height: 48px;
  display: block;
  cursor: pointer;
  background: url(/ui/images/getting-started/grey-button.png) no-repeat;
  &.no-margin {
    margin-top: 0px;
  }
  &:hover {
    background: url(/ui/images/getting-started/hovered-button.png) no-repeat;
  }
`;

export interface Props {

}

export interface State {

}

class GettingStarted extends React.Component<Props, State> {
  public render() {
    return (
      <Container>
        <Dudes>
          <Image src='images/getting-started/Animated-dudes.gif' />
        </Dudes>
        <Anvil>
          <Image src='images/getting-started/anvil-beta-is-here.png' />
        </Anvil>
        <LinksContainer>
          <Link
            className='no-margin'
            target='_blank'
            href='https://s3.amazonaws.com/camelot-unchained/docs/Beta-1-Players-Guide.pdf'>
            English Beta 1 Guide
          </Link>
          <Link
            target='_blank'
            href='https://s3.amazonaws.com/camelot-unchained/docs/French-Beta-1-Players-Guide.pdf'>
            French Beta 1 Guide
          </Link>
          <Link
            target='_blank'
            href='https://s3.amazonaws.com/camelot-unchained/docs/German-Beta-1-Players-Guide.pdf'>
            German Beta 1 Guide
          </Link>
        </LinksContainer>
      </Container>
    );
  }
}

export default GettingStarted;
