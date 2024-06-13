/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Hero = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  align-content: stretch;
  align-items: stretch;
  justify-content: flex-start;
  flex-wrap: nowrap;
  user-select: none !important;
  -webkit-user-select: none !important;
  transition: opacity 2s ease;
`;

const Content = styled.div`
  width: 100%;
  height: 100%;
  flex: 1 1 auto;
`;

const Logo = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export function ToolsHero(props: {}) {
  return (
    <Hero>
      <Content>
        <Logo src='images/uce/login-uce.jpg' />
      </Content>
    </Hero>
  );
}
