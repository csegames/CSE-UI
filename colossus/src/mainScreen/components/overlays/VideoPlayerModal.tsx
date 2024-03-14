/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Dispatch } from 'redux';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { hideAllOverlays, VideoParams } from '../../redux/navigationSlice';
import { LocalVideoPlayer } from '../shared/LocalVideoPlayer';

interface ReactProps {
  params: VideoParams;
}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AVideoPlayerModal extends React.Component<Props> {
  private onClose() {
    this.props.dispatch(hideAllOverlays());
  }

  public render() {
    const params = this.props.params;
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)}>
        <LocalVideoPlayer src={params.src} styles={params.styles} forceStop={params.forceStop} />
      </MiddleModalDisplay>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return { ...ownProps };
}

export const VideoPlayerModal = connect(mapStateToProps)(AVideoPlayerModal);
