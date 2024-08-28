/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { hideRightPanel } from '../../../redux/navigationSlice';

const Container = 'RightModal-Container';
const ScreenOverlay = 'RightModal-ScreenOverlay';

const ContentContainer = 'RightModal-ContentContainer';

interface ReactProps {}

interface InjectedProps {
  content: React.ReactNode;
  veilContent?: React.ReactNode;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ARightModal extends React.Component<Props> {
  public componentDidUpdate(prevProps: Readonly<Props>): void {
    if (this.props.content && !prevProps.content) {
      game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_SIDEBAR_OPEN);
    }
    if (prevProps.content && !this.props.content) {
      game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_SIDEBAR_CLOSE);
    }
  }

  public render() {
    const visibleClass = this.props.content ? 'visible' : '';
    return (
      <>
        <div className={`${ScreenOverlay} ${visibleClass}`} onClick={this.onClick.bind(this)}>
          {this.props.veilContent ?? null}
        </div>
        <div id='RightModal' className={`${Container} ${visibleClass}`}>
          <div className={ContentContainer}>{this.props.content}</div>
        </div>
      </>
    );
  }

  public onClick() {
    if (!this.props.veilContent) {
      this.props.dispatch(hideRightPanel());
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { rightPanelContent, rightPanelVeilContent } = state.navigation;

  return {
    ...ownProps,
    content: rightPanelContent,
    veilContent: rightPanelVeilContent
  };
}

export const RightModal = connect(mapStateToProps)(ARightModal);
