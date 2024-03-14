/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ResizeDetector } from './ResizeDetector';

export type FittingViewHorizontalAlignment = 'left' | 'center' | 'right';
export type FittingViewVerticalAlignment = 'top' | 'middle' | 'bottom';

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  contentClassName?: string;
  horizontalAlignment?: FittingViewHorizontalAlignment;
  verticalAlignment?: FittingViewVerticalAlignment;
}

interface State {
  sizeMultiplier: number;
}

export class FittingView extends React.Component<Props, State> {
  containerWidth: number = -1;
  containerHeight: number = -1;
  contentWidth: number = -1;
  contentHeight: number = -1;

  constructor(props: Props) {
    super(props);
    this.state = {
      sizeMultiplier: 1
    };
  }

  public render() {
    const { className, contentClassName, children, style, horizontalAlignment, verticalAlignment, ...otherProps } =
      this.props;
    let containerStyle: React.CSSProperties = { position: 'relative' };
    if (style) {
      containerStyle = { ...containerStyle, ...style };
    }
    return (
      <div style={containerStyle} className={className} {...otherProps}>
        <ResizeDetector onResize={this.onContainerResize.bind(this)} />
        <div className={contentClassName} style={this.getContentStyle()}>
          <ResizeDetector onResize={this.onContentResize.bind(this)} />
          {children}
        </div>
      </div>
    );
  }

  private getContentStyle(): React.CSSProperties {
    const style: React.CSSProperties = {
      transform: `scale(${this.state.sizeMultiplier}) translate(-50%,-50%)`,
      transformOrigin: 'top left',
      position: 'absolute'
    };
    const horizontalAlignment = this.props.horizontalAlignment ?? 'center';
    const pxWidth = (this.containerWidth - this.contentWidth * this.state.sizeMultiplier) / 2;
    switch (horizontalAlignment) {
      case 'center': {
        style.left = '50%';
        break;
      }
      case 'left': {
        style.left = `calc(50% - ${pxWidth}px)`;
        break;
      }
      case 'right': {
        style.left = `calc(50% + ${pxWidth}px)`;
        break;
      }
    }
    const verticalAlignment = this.props.verticalAlignment ?? 'middle';
    const pxHeight = (this.containerHeight - this.contentHeight * this.state.sizeMultiplier) / 2;
    switch (verticalAlignment) {
      case 'middle':
        style.top = '50%';
        break;
      case 'top': {
        style.top = `calc(50% - ${pxHeight}px)`;
        break;
      }
      case 'bottom': {
        style.top = `calc(50% + ${pxHeight}px)`;
        break;
      }
    }
    return style;
  }

  private onContainerResize(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number): void {
    this.containerWidth = newWidth;
    this.containerHeight = newHeight;

    this.calculateSizeMultiplier();
  }

  private onContentResize(newWidth: number, newHeight: number, oldWidth: number, oldHeight: number): void {
    this.contentWidth = newWidth;
    this.contentHeight = newHeight;

    this.calculateSizeMultiplier();
  }

  private calculateSizeMultiplier(): void {
    // Only calculate once both content and container have been initialized.
    const { containerWidth, containerHeight, contentWidth, contentHeight } = this;
    if (containerWidth >= 0 && contentWidth >= 0) {
      let sizeMultiplier = 1.0;
      if (contentWidth === 0 || contentHeight === 0 || containerWidth === 0 || containerHeight === 0) {
        // Content is invisible, so might as well hide it.
        sizeMultiplier = 0;
      } else if (contentWidth / contentHeight > containerWidth / containerHeight) {
        // Content is Wide, so width should match perfectly.
        sizeMultiplier = containerWidth / contentWidth;
      } else {
        // Content is Tall, so height should match perfectly.
        sizeMultiplier = containerHeight / contentHeight;
      }

      requestAnimationFrame(() => {
        this.setState({ sizeMultiplier });
      });
    }
  }
}
