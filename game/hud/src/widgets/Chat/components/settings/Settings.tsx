/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {components} from 'camelot-unchained';
let Animate = components.Animate;

import BooleanOption from './BooleanOption';
import ChatDisplay from './ChatDisplay';

export interface SettingsProps {
    key: string;
}

export interface SettingsState {
  section: any;
  sectionName: string;
  checked: boolean;
}

class Settings extends React.Component<SettingsProps, SettingsState> {
  
  constructor(props: SettingsProps) {
    super(props);
    this.state = {
      section: null,
      sectionName: '',
      checked: true
    }
  }
  
  generateSection = (sectionName: string) => {
    if (sectionName == '') return null;
    return <div key={sectionName} className='fly-out'><ChatDisplay /></div>
  }
  
  navigate = (sectionName: string) => {
    let name = this.state.sectionName == sectionName ? '' : sectionName;
    this.setState({
      section: this.generateSection(name),
      sectionName: name,
      checked: this.state.checked
    });
  }
  
  onChecked = (id: string) => {
    this.setState({
      section: this.state.section,
      sectionName: this.state.sectionName,
      checked: !this.state.checked
    });
  }
  
  render() {
    let flyout = this.state.section;
    return (
      <div className='chat-settings-menu'>
        <ul className='chat-settings-list'>
          <li onClick={this.navigate.bind(this, 'chat-display')} key={1}>
            Chat Display<br />
            <i>Change what you see in the chatbox.</i>
          </li>
          <li onClick={this.navigate.bind(this, '')} key={2}>
            Rooms<br />
            <i>Available rooms &amp; autojoin settings.</i>
          </li>
        </ul>
        <Animate animationEnter='slideInLeft' animationLeave='slideOutLeft'
          durationEnter={300} durationLeave={300}>
          {flyout}
        </Animate>
      </div>
    );
  }
}

export default Settings;
