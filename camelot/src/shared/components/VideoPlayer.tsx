/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const Root = 'Shared-VideoPlayer-Root';

interface Props extends React.HTMLAttributes<HTMLVideoElement> {
  src: string;
  play: boolean;
}

export interface State {
  isPreviewReady: boolean;
}

export class VideoPlayer extends React.Component<Props, State> {
  private videoRef = React.createRef<HTMLVideoElement>();

  constructor(props: Props) {
    super(props);
    this.state = {
      // If we're just going to run immediately, no need to specially load a preview.
      isPreviewReady: props.play
    };
  }

  public render() {
    const { src, className, style, ...otherProps } = this.props;

    let finalStyle: React.CSSProperties = {
      ...(style ?? {}),
      // Until the preview is ready, don't show!
      ...(this.state.isPreviewReady ? {} : { opacity: 0 })
    };

    return (
      <video
        className={`${Root} ${className}`}
        style={finalStyle}
        ref={this.videoRef}
        {...otherProps}
        autoPlay={this.props.play || !this.state.isPreviewReady}
        loop={true}
        onTimeUpdate={
          !this.state.isPreviewReady
            ? () => {
                if (this.videoRef.current && this.videoRef.current.currentTime > 0.5) {
                  if (!this.props.play) {
                    this.videoRef.current.pause();
                  }
                  this.setState({ isPreviewReady: true });
                }
              }
            : undefined
        }
      >
        <source src={src} type='video/webm' />
      </video>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.play !== prevProps.play) {
      if (this.videoRef.current) {
        if (this.props.play) {
          this.videoRef.current.play();
        } else {
          this.videoRef.current.pause();
        }
      }
    }
  }

  componentWillUnmount(): void {
    if (this.videoRef && this.videoRef.current) {
      this.videoRef.current.pause();
    }
  }
}
