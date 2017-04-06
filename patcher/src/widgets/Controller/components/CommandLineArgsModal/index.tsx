/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 12:08:12
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-10 11:41:35
 */

import * as React from 'react';

export interface CommandLineArgsModalProps {
  ok: (s: string) => void;
  cancel: () => void;
}

export interface CommandLineArgsModalState {
}

class CommandLineArgsModal extends React.Component<CommandLineArgsModalProps, CommandLineArgsModalState> {

  constructor(props: CommandLineArgsModalProps) {
    super(props);
  }

  public render() {
    return (
      <div className='commane-line-args-modal'>
        <input type='text' ref='args-input'/>
			  <button className='accept' onClick={this.onOk}>OK</button>
			  <button className='decline' onClick={this.props.cancel}>Cancel</button>
      </div>
    );
  }
  
  private onOk = () => {
    const input = this.refs['args-input'] as HTMLInputElement;
    this.props.ok(input.value);
  }
}

export default CommandLineArgsModal;
