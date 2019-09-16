/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface Props {
  styles?: string;
  backgroundUrl: string;

  numberOfRows: number;
  numberOfColumns: number;
  spriteWidth: number;
  spriteHeight: number;
  lastFrame: number;

  // default to UI update frame timing
  fps?: number;
}

export interface State {
  currentRow: number;
  currentColumn: number;
}

export class SpriteSheetAnimator extends React.Component<Props, State> {
  private fpsTimeout: number;
  private requestAnimationFrameID: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      currentRow: 0,
      currentColumn: 0,
    };
  }

  public render() {
    const { spriteWidth, spriteHeight } = this.props;
    const { currentRow, currentColumn } = this.state;
    return (
      <div
        className={this.props.styles}
        style={{
          backgroundImage: `url(${this.props.backgroundUrl})`,
          backgroundPosition: `-${currentRow * spriteWidth}px -${currentColumn * spriteHeight}px`,
        }}
      />
    );
  }

  public componentDidMount() {
    this.requestAnimationFrameID = window.requestAnimationFrame(this.updateAnimStep);
  }

  public componentWillUnmount() {
    if (this.fpsTimeout) {
      window.clearTimeout(this.fpsTimeout);
    }

    if (this.requestAnimationFrameID) {
      window.cancelAnimationFrame(this.requestAnimationFrameID);
    }
  }

  private updateAnimStep = () => {
    const { lastFrame } = this.props;
    let newCurrentRow = this.state.currentRow + 1;
    let newCurrentColumn = this.state.currentColumn;

    if (this.state.currentRow === this.props.numberOfRows - 1) {
      newCurrentRow = 0;
      newCurrentColumn += 1;
    }

    if (this.state.currentColumn === this.props.numberOfColumns) {
      newCurrentColumn = 0;
    }

    const currentFrameCount = this.state.currentRow * this.props.numberOfColumns + this.state.currentColumn;
    if (currentFrameCount === lastFrame) {
      newCurrentRow = 0;
      newCurrentColumn = 0;
    }

    this.setState({ currentRow: newCurrentRow, currentColumn: newCurrentColumn });

    if (this.props.fps) {
      this.fpsTimeout = window.setTimeout(() => {
        this.requestAnimationFrameID = window.requestAnimationFrame(this.updateAnimStep);
      }, 1000 / this.props.fps);
    } else {
      this.requestAnimationFrameID = window.requestAnimationFrame(this.updateAnimStep);
    }
  }
}
