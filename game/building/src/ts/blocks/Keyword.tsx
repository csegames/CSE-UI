/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { store } from '../stores/Building';

export interface KeywordProps {
  word: string;
  selected?: boolean;
};
export interface KeywordState {
};

class Keyword extends React.Component<KeywordProps, KeywordState> {
  public name: string = 'Keyword';

  constructor(props: KeywordProps) {
    super(props);
  }

  select = (): void => {
    store.dispatch({
      type: (this.props.selected ? 'REMOVE' : 'ADD') + '_KEYWORD',
      word: this.props.word
    } as any);
  }

  render() {
    const content: JSX.Element[] = [];
    return (
      <div className={'keyword' + (this.props.selected ? ' selected' : '')} onClick={this.select}>
        {this.props.word}
      </div>
    );
  }
}

export default Keyword;
