/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { VideoParams } from '../../redux/navigationSlice';

const VideoPlayerContainer = 'Shared-LocalVideoPlayer-VideoPlayerContainer';
const Video = 'Shared-LocalVideoPlayer-Video';
const PlayButton = 'Shared-LocalVideoPlayer-PlayButton';
const ProgressBarBackground = 'Shared-LocalVideoPlayer-ProgressBarBackground';
const ProgressBar = 'Shared-LocalVideoPlayer-ProgressBar';

type Props = VideoParams;

export interface State {
  isPreviewReady: boolean;
  isPlaying: boolean;
  videoProgress: number;
}

export class LocalVideoPlayer extends React.Component<Props, State> {
  private videoRef = React.createRef<HTMLVideoElement>();
  private progressTimer: NodeJS.Timer;

  constructor(props: Props) {
    super(props);
    this.state = {
      isPreviewReady: false,
      isPlaying: false,
      videoProgress: 0
    };
  }

  public render() {
    if (!this.state.isPreviewReady) {
      this.preparePreview();
    }

    const playingClass = this.isPlaying() ? 'playing' : '';
    const startedClass =
      this.isPlaying && this.state.videoProgress > 0 && this.state.videoProgress < 1 ? 'started' : '';

    return (
      <div className={`${VideoPlayerContainer} ${this.props.styles || ''}`}>
        <video
          className={Video}
          ref={this.videoRef}
          onEnded={this.onVideoEnded.bind(this)}
          onClick={this.togglePlaying.bind(this)}
        >
          <source src={this.props.src} type="video/webm" />
        </video>
        <div className={`${PlayButton} ${playingClass}`} />
        <div className={`${ProgressBarBackground} ${startedClass}`}>
          <div className={ProgressBar} style={{ width: `${this.state.videoProgress * 100}%` }} />
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // If the src changed, or a forceStop has been requested, reload and reset the video.
    const didSrcChange = prevProps.src !== this.props.src;
    const shouldForceStop = this.props.forceStop && !prevProps.forceStop;
    if (didSrcChange || shouldForceStop) {
      if (this.videoRef.current) {
        this.videoRef.current.pause();
        if (didSrcChange) this.videoRef.current.load();
        if (shouldForceStop) this.videoRef.current.currentTime = 0;

        this.setState({
          isPreviewReady: false,
          isPlaying: false,
          videoProgress: 0
        });
      }
    }
  }

  componentWillUnmount(): void {
    if (this.videoRef && this.videoRef.current) {
      this.videoRef.current.pause();
    }
    if (this.progressTimer) {
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    }
  }

  private preparePreview(): void {
    // Local videos don't automatically load a preview image, so we let them run for one frame and then pause.
    requestAnimationFrame(() => {
      if (this.videoRef && this.videoRef.current) {
        const cleanup = () => {
          this.videoRef.current.pause();
          this.videoRef.current.removeEventListener('playing', cleanup);
          this.setState({ isPreviewReady: true });
        };
        this.videoRef.current.addEventListener('playing', cleanup);
        this.videoRef.current.play();
      }
    });
  }

  private isPlaying(): boolean {
    return this.videoRef && this.videoRef.current && !this.videoRef.current.paused;
  }

  private togglePlaying(): void {
    if (this.isPlaying()) {
      this.videoRef.current.pause();
      clearInterval(this.progressTimer);
      this.progressTimer = null;
    } else {
      if (this.videoRef && this.videoRef.current) {
        this.videoRef.current.play();
        this.progressTimer = setInterval(this.onVideoTimeUpdate.bind(this), 33);
      }
    }
    this.setState({ isPlaying: !this.state.isPlaying });
  }

  private onVideoEnded(): void {
    if (this.videoRef.current) {
      this.videoRef.current.currentTime = 0;
      this.videoRef.current.load();
    }
    this.setState({
      isPlaying: false,
      isPreviewReady: false,
      videoProgress: 0
    });
    clearInterval(this.progressTimer);
    this.progressTimer = null;
  }

  private onVideoTimeUpdate(): void {
    this.setState({
      videoProgress: this.videoRef.current.currentTime / this.videoRef.current.duration
    });
  }
}
