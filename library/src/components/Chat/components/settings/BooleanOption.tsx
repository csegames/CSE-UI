/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface BooleanOptionProps {
  key: string;
  optionKey: string;
  title: string;
  description: string;
  isChecked: boolean;
  onChecked: (key: string, value: any) => any;
}

export interface BooleanOptionState {

}

class BooleanOption extends React.Component<BooleanOptionProps, BooleanOptionState> {
  public render() {
    return (
      <div className='row'>
          <div className='col s6'>
            {this.props.title}
          </div>
          <div className='col s6'>
            <div className='switch'>
              <label>
                No
                <input type='checkbox' defaultChecked={this.props.isChecked} onClick={this.clicked}/>
                <span className='lever'></span>
                Yes
              </label>
            </div>
          </div>
          <div className='col s12'>
            <i>{this.props.description}</i>
          </div>
        </div>
    );
  }

  private clicked = () => {
    this.props.onChecked(this.props.optionKey, !this.props.isChecked);
  }
}

export default BooleanOption;
