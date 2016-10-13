/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Animate from '../../lib/Animate';
import {patcher} from '../../services/patcher';
import {SoundsState} from '../../services/session/sounds';

export interface WindowHeaderProps {
  soundsState: SoundsState;
  onMuteSounds: () => void;
  onMuteMusic: () => void;
};

export interface WindowHeaderState {
  settingsOpen: boolean;
};

class WindowHeader extends React.Component<WindowHeaderProps, WindowHeaderState> {
  public name: string = 'cse-patcher-windowheader';

  constructor(props: WindowHeaderProps) {
    super(props);
    this.state = {
      settingsOpen: false
    }
  }

  closeSettings = () => {
    this.setState({
      settingsOpen: false
    });
  }

  openSettings = () => {
    this.setState({
      settingsOpen: true
    });
  }

  muteSounds = () => {
    this.props.onMuteSounds();
  }

  muteMusic = () => {
    this.props.onMuteMusic();
  }

  render() {
    let soundMuteIcon = this.props.soundsState.playSound ? <img src='images/mute-fx.png' /> : <img src='images/muted-fx.png' />;
    let musicMuteIcon = this.props.soundsState.playMusic ? <img src='images/mute.png' /> : <img src='images/muted.png' />;
    let muteSoundsTooltip = this.props.soundsState.playSound ? 'mute sound effects' : 'un-mute sound effects';
    let muteMusicTooltip = this.props.soundsState.playMusic ? 'mute music' : 'un-mute music';
    let settings: any = null;
    if (this.state.settingsOpen) settings = <h1 style={{color:'#fff'}} onClick={this.closeSettings}>Settings!</h1>;
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
};

// DISABLED WINDOW CONTROLS FOR NOW
// <li><a href='#' onClick={patcher.closeWindow}><img src='images/close.png' /></a></li>
// <li><a href='#' onClick={patcher.maximizeWindow}><img src='images/max.png' /></a></li>
// <li><a href='#' onClick={patcher.minimizeWindow}><img src='images/min.png' /></a></li>

export default WindowHeader;

/**
 * took out from line 57. no window controls in patcher
 * <li><a href='#' onClick={patcher.closeWindow}><img src='images/close.png' /></a></li>
 * <li><a href='#' onClick={patcher.maximizeWindow}><img src='images/max.png' /></a></li>
 * <li><a href='#' onClick={patcher.minimizeWindow}><img src='images/min.png' /></a></li>
*/

// no settings available right now... waiting on some patch server side stuff
// <li>
//   <a href='#' onClick={this.openSettings} className='hint--left hint--slide' data-hint='settings'>
//     <img src='images/settings.png' />
//   </a>
// </li>
