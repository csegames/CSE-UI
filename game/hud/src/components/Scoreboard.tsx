/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { events } from 'camelot-unchained';

const Container = styled('div')`
  width: 500px;
  height: 500px;
  background-color: white;
  color: blue;
  pointer-events: all;
`;

export interface ScoreboardProps {

}

export interface ScoreboardState {
  // controls visibility of the widget
  visible: boolean;
}

class Scoreboard extends React.Component<ScoreboardProps, ScoreboardState> {
  constructor(props: ScoreboardProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    return this.state.visible ? (
      <Container>
        <button onClick={this.toggleVisibility}>
          Close widget
        </button>

        <h1>This is a temporary widget which will eventually be a scoreboard.</h1>
      </Container>
    ) : null;
  }

  public componentDidMount() {
    events.on('hudnav--navigate', (name: string) => {
      if (name === 'scoreboard') {
        this.toggleVisibility();
      }
    });
  }

  private toggleVisibility = () => {
    this.setState({ visible: !this.state.visible });
  }
}

export default Scoreboard;
