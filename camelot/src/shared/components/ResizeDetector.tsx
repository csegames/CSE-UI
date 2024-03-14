/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { floatEquals } from '@csegames/library/dist/_baseGame/utils/mathExtensions';
import * as React from 'react';

interface Props {
  onResize: (newWidth: number, newHeight: number, oldWidth: number, oldHeight: number) => void;
}

interface State {
  lastWidth: number;
  lastHeight: number;
}

export class ResizeDetector extends React.Component<Props, State> {
  private frameRef: HTMLIFrameElement;

  constructor(props: Props) {
    super(props);
    this.state = {
      lastWidth: -1,
      lastHeight: -1
    };
  }

  public render() {
    return (
      <iframe
        ref={this.setFrameRef.bind(this)}
        style={{
          position: 'absolute',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          opacity: 0,
          border: 'none',
          pointerEvents: 'none'
        }}
      />
    );
  }

  componentWillUnmount(): void {
    this.frameRef?.contentWindow?.removeEventListener('resize', this.updateSizesHandle);
  }

  private setFrameRef(ref: HTMLIFrameElement): void {
    if (ref !== this.frameRef) {
      if (ref) {
        this.frameRef?.contentWindow?.removeEventListener('resize', this.updateSizesHandle);
        ref.contentWindow?.addEventListener('resize', this.updateSizesHandle);
      } else {
        this.frameRef.contentWindow?.removeEventListener('resize', this.updateSizesHandle);
      }
      this.frameRef = ref;

      this.updateSizes();
    }
  }

  private updateSizesHandle = this.updateSizes.bind(this);
  private updateSizes(): void {
    if (this.frameRef) {
      // We are using 'offset' sizes because they include the size of borders.
      const newWidth = this.frameRef.offsetWidth;
      const newHeight = this.frameRef.offsetHeight;

      // Did the sizes change?
      if (!floatEquals(newWidth, this.state.lastWidth, 0.01) || !floatEquals(newHeight, this.state.lastHeight, 0.01)) {
        const newState: State = {
          lastWidth: newWidth,
          lastHeight: newHeight
        };

        this.props.onResize(newWidth, newHeight, this.state.lastWidth, this.state.lastHeight);
        this.setState(newState);
      }
    }
  }
}
