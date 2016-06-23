/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

export interface LoadingProps {
  message?: string;
};
export interface LoadingState {
};

class Loading extends React.Component<LoadingProps, LoadingState> {
  public name: string = 'Loading';

  constructor(props: LoadingProps) {
    super(props);
  }

  onClick = (): void => {
  }

  render() {
    return (
      <div className="loading">
        {this.props.message||'Loading...'}
      </div>
    );
  }
}

export default Loading;
