/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: black;
`;

export interface Props {
  onIntroVideoEnd: () => void;
}

export class IntroVideo extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <video
          autoPlay
          width='100%'
          height='100%'
          onEnded={this.props.onIntroVideoEnd}>
            {/* <source src='images/fullscreen/test_intro.webm' type='video/webm'></source> */}
        </video>
      </Container>
    );
  }

  public componentDidMount() {
    // We don't actually have a video yet, so just end it ASAP
    this.props.onIntroVideoEnd();
  }
}
