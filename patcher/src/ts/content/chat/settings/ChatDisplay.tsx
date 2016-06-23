/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Prefixer from '../utils/Prefixer';
import BooleanOption from './BooleanOption';
import {display, prefixes} from './chat-defaults';
import { chatConfig } from '../ChatConfig';

const pre = new Prefixer(prefixes.display);

export interface ChatDisplayProps {
}

export interface ChatDisplayState {
  embedImages: boolean;
  showColors: boolean;
  showEmoticons: boolean;
  showMarkdown: boolean;
  timestamps: boolean;
}

class ChatDisplay extends React.Component<ChatDisplayProps, ChatDisplayState> {

  constructor(props: ChatDisplayProps) {
    super(props);
    this.state = this.initializeState();
  }

  // initialize state from local storage
  initializeState = (): ChatDisplayState =>  {
    let state: any = {};
    for (let key in display) {
      let option = (display as any)[key];
      let val = JSON.parse(localStorage.getItem(pre.prefix(option.key)));
      state[option.key] = val == null ? option.default : val;
    }
    return state;
  }

  updateItem = (key: string, value: any) => {
    localStorage.setItem(pre.prefix(key), value);
    chatConfig.refresh();
    this.setState(this.initializeState())
  }

  setDefaults = () => {
    localStorage.setItem('embed-images', 'True');

    return {

    }
  }

  generateBooleanOption = (option: any) => {
    let state: any = this.state;
    return <BooleanOption key={option.key}
          optionKey={option.key}
          title={option.title}
          description={option.description}
          isChecked={state[option.key]}
          onChecked={this.updateItem}
          />;
  }

  render() {

    let options = new Array();
    for (let key in display) {
      let option = (display as any)[key];
      switch(option.type) {
        case 'boolean':
          options.push(this.generateBooleanOption(option));
          break;
        default: break;
      }
    }

    return (
      <div>
        {options}
      </div>
    )
  }
}

export default ChatDisplay;
