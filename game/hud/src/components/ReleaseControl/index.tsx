/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client } from '@csegames/camelot-unchained';

const Container = styled('div')`
  width: 140px;
  height: 35px;
  line-height: 35px;
  color: white;
  text-align: center;
  background-color: #444;
  cursor: pointer;
  opacity: 0.7;
  user-select: none;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23);
  pointer-events: auto;
  &:hover {
    background-color: #888;
    transform: ease 0.2s;
  },
  &:active {
    background-color: #0C0;
    transform: ease;
  },
`;

interface ReleaseControlButtonStyle {
  container: React.CSSProperties;
}
export interface ReleaseControlButtonProps {
  styles?: Partial<ReleaseControlButtonStyle>;
  className?: string;
}

export interface ReleaseControlButtonState {
  visible: boolean;
}

class ReleaseControl extends React.Component<ReleaseControlButtonProps, ReleaseControlButtonState> {

  constructor(props: ReleaseControlButtonProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    if (this.state.visible) {
      return (
        <Container className={this.props.className} onClick={this.sendCommand}>
          Exit Siege Engine
        </Container>
      );
    } else { return null; }
  }

  public componentDidMount() {
    client.OnCharacterCanReleaseControlChanged((canRelease: boolean) => {
      this.setState((state, props) => { return { visible: canRelease }; });
    });
  }

  private sendCommand = (): void => {
    client.SendSlashCommand('siege exit');
  }
}

export default ReleaseControl;
