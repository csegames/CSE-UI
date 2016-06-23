/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { store } from '../stores/Building';

export interface BlockSectionProps {
  className: string;
  title: string;
  icon?: string;
  onClickIcon?: (e: React.MouseEvent, icon: string) => void;
  children?: JSX.Element[];
};
export interface BlockSectionState {
};

class BlockSection extends React.Component<BlockSectionProps, BlockSectionState> {
  public name: string = 'BlockSection';

  constructor(props: BlockSectionProps) {
    super(props);
  }

  filter = (): void => {
    store.dispatch({ type: 'TOGGLE_FILTER' } as any);
  }

  render() {
    let title: JSX.Element;
    if (this.props.className === "material") {
      title = (
        <div className="block-section-title button" onClick={this.filter}>
          { this.props.icon ?
            <span className={'status-icon ' + this.props.icon} onClick={(e: React.MouseEvent) => this.props.onClickIcon(e, this.props.icon)}></span>
            : undefined }
          {this.props.title}
        </div>
      );
    } else {
      title = (
        <div className="block-section-title">
          {this.props.title}
        </div>
      );
    }
    return (
      <div className={'block-section ' + this.props.className + '-section'}>
        {title}
        <div className="block-section-content scrollable">{this.props.children}</div>
      </div>
    );
  }
}

export default BlockSection;
