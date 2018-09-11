/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Animate from '../../lib/Animate';
import { SoundsState } from '../../services/session/sounds';

export interface WindowHeaderProps {
  soundsState: SoundsState;
  onMuteSounds: () => void;
  onMuteMusic: () => void;
}

export interface WindowHeaderState {
  settingsOpen: boolean;
}

class WindowHeader extends React.Component<WindowHeaderProps, WindowHeaderState> {
  public name: string = 'cse-patcher-windowheader';

  constructor(props: WindowHeaderProps) {
    super(props);
    this.state = {
      settingsOpen: false,
    };
  }

  public render() {
    const soundMuteIcon = this.props.soundsState.playSound ? <img src='images/mute-fx.png' /> :
      <img src='images/muted-fx.png' />;
    const musicMuteIcon = this.props.soundsState.playMusic ? <img src='images/mute.png' /> : <img src='images/muted.png' />;
    const muteSoundsTooltip = this.props.soundsState.playSound ? 'mute sound effects' : 'un-mute sound effects';
    const muteMusicTooltip = this.props.soundsState.playMusic ? 'mute music' : 'un-mute music';
    let settings: any = null;
    if (this.state.settingsOpen) settings = <h1 style={{ color: '#fff' }} onClick={this.closeSettings}>Settings!</h1>;
    return (
      <div className='WindowHeader'>
        <a href='#' onClick={this.muteSounds} className='hint--left hint--slide' data-hint={muteSoundsTooltip}>
          {soundMuteIcon}
        </a>
        <a href='#' onClick={this.muteMusic} className='hint--left hint--slide' data-hint={muteMusicTooltip}>
          {musicMuteIcon}
        </a>
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown'
          durationEnter={400} durationLeave={500}>
          {settings}
        </Animate>
      </div>
    );
  }

  private closeSettings = () => {
    this.setState({
      settingsOpen: false,
    });
  }

  private muteSounds = () => {
    this.props.onMuteSounds();
  }

  private muteMusic = () => {
    this.props.onMuteMusic();
  }
}

export default WindowHeader;
