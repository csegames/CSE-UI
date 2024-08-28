/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ResizeDetector } from './ResizeDetector';

interface State {
  otherSize: string;
}

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  aspectRatio: number;
  /** Whichever dimension is specified will be retained during resize calculations. */
  retain: 'width' | 'height';
}

export class AspectRatioDiv extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { otherSize: '' };
  }

  public render() {
    const { aspectRatio, className, style, children, ...otherProps } = this.props;

    const finalStyle: React.CSSProperties = { ...(style ?? {}) };
    // We render the first time without alteration.
    if (this.state.otherSize !== '') {
      // After that, we enforce the aspect ratio on the non-retained dimension.
      if (this.props.retain === 'width') {
        finalStyle.height = this.state.otherSize;
      } else {
        finalStyle.width = this.state.otherSize;
      }
    }

    return (
      <div className={className} style={finalStyle} {...otherProps}>
        <ResizeDetector onResize={this.onResize.bind(this)} />
        {children}
      </div>
    );
  }

  private onResize(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number): void {
    // Apply aspectRatio.
    if (this.props.retain === 'width') {
      this.setState({ otherSize: `${newWidth / this.props.aspectRatio}px` });
    } else {
      this.setState({ otherSize: `${newHeight * this.props.aspectRatio}px` });
    }
  }
}
