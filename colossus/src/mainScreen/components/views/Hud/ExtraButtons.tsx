/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { LifecyclePhase, setLifecycleOverride } from '../../../redux/navigationSlice';
import { mockEvents } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { RootState } from '../../../redux/store';

const ExtraButtonsContainer = 'MainScreen-ExtraButtonsContainer';

const ExtraButton = 'MainScreen-ExtraButton';

interface ReactProps {}

interface InjectedProps {
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AExtraButtons extends React.Component<Props> {
  public render(): React.ReactNode {
    return !game.isPublicBuild ? (
      <div id='ExtraButtonsContainer_HUD' className={ExtraButtonsContainer}>
        <button className={ExtraButton} onClick={() => game.reloadUI()}>
          <span className='fs-icon-misc-sync' />
        </button>
        <button className={ExtraButton} onClick={() => this.props.dispatch(setLifecycleOverride(LifecyclePhase.Lobby))}>
          <span className='fs-icon-misc-expand' />
        </button>
        <button className={ExtraButton} onClick={() => mockEvents.triggerNavigate('console')}>
          <span className='fs-icon-misc-terminal' />
        </button>
        <button className={ExtraButton} onClick={() => mockEvents.triggerNavigate('mocks')}>
          <span className='fs-icon-misc-tasks' />
        </button>
      </div>
    ) : null;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export const ExtraButtons = connect(mapStateToProps)(AExtraButtons);
