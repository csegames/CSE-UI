/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ResizeDetector } from '../../shared/components/ResizeDetector';

const Root = 'CollapsingDrawer-Root';
const ContentRoot = 'CollapsingDrawer-ContentRoot';

interface State {
  contentHeight: number;
}

interface ReactProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

export class CollapsingDrawer extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { contentHeight: -1 };
  }

  render(): React.ReactNode {
    const { isOpen, className, children, ...otherProps } = this.props;

    return (
      <div
        {...otherProps}
        className={`${Root} ${className}`}
        style={{ height: isOpen && this.state.contentHeight > 0 ? `${this.state.contentHeight}px` : '0px' }}
      >
        <div className={ContentRoot}>
          <ResizeDetector
            onResize={(nw, nh, ow, oh) => {
              if (nh !== this.state.contentHeight && nh > 0) {
                this.setState({ contentHeight: nh });
              }
            }}
          />
          {children}
        </div>
      </div>
    );
  }
}
