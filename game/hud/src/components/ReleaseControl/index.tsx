/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {client} from 'camelot-unchained';
import {StyleSheet, css, StyleDeclaration} from 'aphrodite';

interface ReleaseControlButtonStyle extends StyleDeclaration {
  container: React.CSSProperties;
}
export interface ReleaseControlButtonProps {
  styles?: Partial<ReleaseControlButtonStyle>;
  className?: string;
}

export interface ReleaseControlButtonState {
  visible: boolean;
}

export const defaultReleaseControlButtonStyle: ReleaseControlButtonStyle = {
  container: {
    width: '140px',
    height: '35px',
    lineHeight: '35px',
    color: 'white',
    textAlign: 'center',
    backgroundColor: '#444',
    cursor: 'pointer',
    opacity: 0.7,
    userSelect: 'none',
    boxShadow: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    pointerEvents: 'auto',
    ':hover': {
      backgroundColor: '#888',
      transform: 'ease .2s',
    },
    ':active': {
      backgroundColor: '#0c0',
      transform: 'ease',
    },
  },
};

class ReleaseControl extends React.Component<ReleaseControlButtonProps, ReleaseControlButtonState> {

  constructor(props: ReleaseControlButtonProps) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultReleaseControlButtonStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    if (this.state.visible) {
      return (
        <div className={[css(ss.container, custom.container), this.props.className].join(' ')}  onClick={this.sendCommand}>
          Exit Siege Engine
        </div>
      );
    } else { return null; }
  }

  public componentDidMount() {
    client.OnCharacterCanReleaseControlChanged((canRelease: boolean) => {
      this.setState((state, props) => { return {visible: canRelease}; });
    });
  }

  private sendCommand = (): void => {
    client.SendSlashCommand('siege exit');
  }
}

export default ReleaseControl;
