/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { CurrentMax } from '@csegames/library/dist/_baseGame/types/CurrentMax';
import { ResourceBar } from '../../../shared/ResourceBar';
import { game } from '@csegames/library/dist/_baseGame';
import { Button } from '../../../shared/Button';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { getActiveBindForKey, KeybindIDs } from '../../../../redux/keybindsSlice';
import { hordetest } from '@csegames/library/dist/hordetest';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResource, findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';

const SelfReviveBarContainer = 'HealthBar-SelfReviveBar-Container';
const SelfReviveText = 'HealthBar-SelfReviveBar-Text';
const SelfReviveButton = 'HealthBar-SelfReviveBar-Button';

interface ReactProps {}

interface InjectedProps {
  lifeState: LifeState;
  resources: ArrayMap<EntityResource>;
  deathStartTime: number;
  downedStateEndTime: number;
  usingGamepad: boolean;
  keybindToRevive: Keybind;
  currentDeaths: number;
  maxDeaths: number;
}

type Props = ReactProps & InjectedProps;

interface State {
  downedEndTime: number;
}

class ASelfReviveBar extends React.Component<Props, State> {
  private controllerSelectEVH: ListenerHandle;

  constructor(props: Props) {
    super(props);
    this.state = { downedEndTime: 0 };
  }
  private timeToLive: number = null;

  public render() {
    if (this.props.lifeState === LifeState.Downed) {
      if (this.timeToLive === null) {
        this.timeToLive = window.setInterval(this.getDownedTimer.bind(this), 1000);
      }
      const reviveProgress = findEntityResource(this.props.resources, EntityResourceIDs.ReviveProgress);
      const startedReviving: boolean = reviveProgress.current > 0 ? true : false;
      const reviveTitle: string = startedReviving ? 'REVIVING' : 'DOWN!';
      const curMax: CurrentMax = this.getDownedCurMax(reviveProgress, startedReviving);
      const selectKeybind = getActiveBindForKey(this.props.usingGamepad, this.props.keybindToRevive);
      const buttonHighlight = this.props.usingGamepad ? 'highlight' : '';
      const numHearts = this.props.maxDeaths - this.props.currentDeaths;
      const disabledButton = startedReviving || numHearts < 2 ? true : false;

      return (
        <div id='SelfReviveBar' className={SelfReviveBarContainer}>
          <span className={`${SelfReviveText} ${reviveTitle}`}>{reviveTitle}</span>
          <ResourceBar
            isSquare={true}
            unsquareText={true}
            shouldPlayBackfill={false}
            type={startedReviving ? 'reviving' : 'down'}
            containerStyle={this.getBarStyle()}
            current={curMax.current}
            max={curMax.max}
            text={startedReviving ? curMax.current.toString() : ''}
            textStyles={SelfReviveText}
            hideText={startedReviving ? true : false}
            showHighlights={true}
            lifeState={this.props.lifeState}
            startedReviving={startedReviving}
          />
          <Button
            type='primary'
            text={
              <div className={buttonHighlight}>
                {selectKeybind && selectKeybind.iconClass && <span className={selectKeybind.iconClass} />}
                Respawn Costs 1 Life
              </div>
            }
            disabled={disabledButton}
            onClick={this.releaseDownedState.bind(this)}
            styles={SelfReviveButton}
          />
        </div>
      );
    } else {
      return null;
    }
  }

  public componentDidMount() {
    if (this.props.usingGamepad) {
      this.connectControllerSelectButton();
    } else {
      game.releaseMouseCapture();
    }
  }

  public componentDidUpdate(prevProps: Props) {
    // we're showing the revive ui, but did the we swap to/from using the gamepad?
    if (!prevProps.usingGamepad && this.props.usingGamepad) {
      this.connectControllerSelectButton();
    }

    if (prevProps.usingGamepad && !this.props.usingGamepad) {
      game.setWaitingForSelect(false);
      this.controllerSelectEVH.close();
    }
  }

  public componentWillUnmount() {
    if (this.controllerSelectEVH) {
      this.controllerSelectEVH.close();
    }

    if (this.props.usingGamepad) {
      this.setWaitingForSelect(false);
    }
  }

  // This function creates an interval so that the health bars will increment without needing
  // an update from the server or other components for every time the world time changes.
  private getDownedTimer() {
    const difference = this.props.downedStateEndTime - game.worldTime;
    if (difference < 0) {
      window.clearInterval(this.timeToLive);
      this.setState({ downedEndTime: 0 });
      this.timeToLive = null;
      return;
    } else {
      this.setState({ downedEndTime: difference });
    }
  }

  private getDownedCurMax(reviveProgress: EntityResource, startedReviving: boolean): CurrentMax {
    if (startedReviving) {
      return { current: reviveProgress.current, max: reviveProgress.max };
    } else {
      return { current: this.state.downedEndTime, max: this.props.downedStateEndTime - this.props.deathStartTime };
    }
  }

  private getBarStyle() {
    return { flex: 1, height: 2 + 'vmin', width: '100%', alignSelf: 'flex-start', border: '0.3vmin solid black' };
  }

  private releaseDownedState() {
    hordetest.game.selfPlayerState.respawn('-1');
  }

  private connectControllerSelectButton() {
    this.setWaitingForSelect(true);
    this.controllerSelectEVH = game.onControllerSelect(this.releaseDownedState.bind(this));
  }

  private setWaitingForSelect(isWaitingForSelect: boolean) {
    game.setWaitingForSelect(isWaitingForSelect);
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps) {
  const keybindsState = state.keybinds;
  const keybindToRevive = keybindsState[KeybindIDs.UISelect];

  return {
    lifeState: state.player.lifeState,
    resources: state.player.resources,
    deathStartTime: state.player.deathStartTime,
    downedStateEndTime: state.player.downedStateEndTime,
    usingGamepad: state.baseGame.usingGamepad,
    keybindToRevive: keybindToRevive,
    currentDeaths: state.player.currentDeaths,
    maxDeaths: state.player.maxDeaths,
    ...ownProps
  };
}

export const SelfReviveBar = connect(mapStateToProps)(ASelfReviveBar);
