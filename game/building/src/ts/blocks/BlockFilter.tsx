/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { BuildingState } from '../stores/Building';
import Keyword from './Keyword';

export interface BlockFilterProps {
  state: BuildingState;
  filter: string[];
};
export interface BlockFilterState {
};

class BlockFilter extends React.Component<BlockFilterProps, BlockFilterState> {
  public name: string = 'BlockFilter';

  constructor(props: BlockFilterProps) {
    super(props);
  }

  render() {
    const pick: JSX.Element[] = [];
    const picked: JSX.Element[] = [];
    const keywords: string[] = this.props.filter;
    const words: string[] = this.props.state.filter.words;
    if (keywords) {
      let i: number = 0;
      keywords.forEach((word: string): void => {
        const selected: boolean = words.indexOf(word) !== -1;
        if (selected) {
          picked.push(<Keyword key={i++} selected={true} word={word}/>)
        } else {
          pick.push(<Keyword key={i++} word={word}/>)
        }
      });
    }
    return (
      <div className="block-filter">
        { picked.length ?
          <div className="picked thin-scroll">
            {picked}
          </div>
          : undefined
        }
        <div className="pick thin-scroll">
          {pick}
        </div>
      </div>
    );
  }
}

export default BlockFilter;
