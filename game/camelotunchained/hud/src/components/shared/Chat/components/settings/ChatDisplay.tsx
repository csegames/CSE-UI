/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import Prefixer from '../utils/Prefixer';
import BooleanOption from './BooleanOption';
import { display, prefixes } from './chat-defaults';
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

  public render() {
    const options = [];
    for (const key in display) {
      const option = display[key];
      switch (option.type) {
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
    );
  }

  // initialize state from local storage
  private initializeState = (): ChatDisplayState =>  {
    const state = {} as ChatDisplayState;
    for (const key in display) {
      const option = (display)[key];
      const val = JSON.parse(localStorage.getItem(pre.prefix(option.key)));
      state[option.key] = val == null ? option.default : val;
    }
    return state;
  }

  private updateItem = (key: string, value: any) => {
    localStorage.setItem(pre.prefix(key), value);
    chatConfig.refresh();
    this.setState(this.initializeState());
  }

  private generateBooleanOption = (option: any) => {
    const state = this.state;
    return (
      <BooleanOption
        key={option.key}
        optionKey={option.key}
        title={option.title}
        description={option.description}
        isChecked={state[option.key]}
        onChecked={this.updateItem}
      />
    );
  }
}

export default ChatDisplay;
