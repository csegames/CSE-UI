/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration, addConditionalWidgetExiting } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralTimeInSeconds
} from '../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../dataSources/manifest/stringTableManifest';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { FactionBorder, BorderType, BorderBackground } from './FactionBorder';
import { FactionButton } from './FactionButton';
import { FormattedTextDiv } from '../../shared/components/FormattedTextDiv';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';

// These are mapped to a similar enum in the client repo, currently in `UIViewListener.cpp`.
enum RespawnLocation {
  Keep = 0,
  Home = 1
}

// CSS classes
const Root = 'HUD-Respawn-Root';
const ChooseLabel = 'HUD-Respawn-ChooseLabel';
const DestinationButtons = 'HUD-Respawn-DestinationButtons';
const Button = 'HUD-Respawn-Button';
const CountdownContainer = 'HUD-Respawn-CountdownContainer';
const CountdownText = 'HUD-Respawn-CountdownText';
const CountdownNumber = 'HUD-Respawn-CountdownNumber';

// String IDs
const StringIDRespawnTitle = 'RespawnTitle';
const StringIDRespawnChooseDestination = 'RespawnChooseDestination';
const StringIDRespawnDestinationHomeIsland = 'RespawnDestinationHomeIsland';
const StringIDRespawnDestinationKeep = 'RespawnDestinationKeep';
const StringIDRespawnForcedRespawnTimer = 'RespawnForcedRespawnTimer';
const StringIDRespawnKeepUnavailable = 'RespawnKeepUnavailable';
const StringIDRespawnSpawnDelayed = 'RespawnSpawnDelayed';

interface State {
  animationHandle: ListenerHandle;
  worldTimeSeconds: number;
}

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  isKeepAvailable: boolean;
  respawnTimestamp: number;
  idleRespawnTimestamp: number;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ARespawn extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { worldTimeSeconds: 0, animationHandle: clientAPI.startAnimation(this.animate.bind(this)) };
  }

  render(): JSX.Element {
    const forceRespawnSecondsLeft = Math.max(0, this.props.idleRespawnTimestamp - this.state.worldTimeSeconds);
    const keepRespawnSecondsLeft = Math.max(0, this.props.respawnTimestamp - this.state.worldTimeSeconds);

    const isWaitingForKeep = keepRespawnSecondsLeft > 0;

    return (
      <FactionBorder
        className={Root}
        type={BorderType.Decorative}
        background={BorderBackground.PatternLarge}
        titleText={getStringTableValue(StringIDRespawnTitle, this.props.stringTable)}
      >
        <div className={ChooseLabel}>
          {getStringTableValue(StringIDRespawnChooseDestination, this.props.stringTable)}
        </div>
        <div className={DestinationButtons}>
          <FactionButton
            className={Button}
            onClick={this.respawn.bind(this, RespawnLocation.Keep)}
            disabled={!this.props.isKeepAvailable || isWaitingForKeep}
            disabledTooltip={this.getDisabledTooltipText()}
          >
            {isWaitingForKeep
              ? getTokenizedStringTableValue(StringIDGeneralTimeInSeconds, this.props.stringTable, {
                  TIME: keepRespawnSecondsLeft.toFixed(0)
                })
              : getStringTableValue(StringIDRespawnDestinationKeep, this.props.stringTable)}
          </FactionButton>
          <FactionButton className={Button} onClick={this.respawn.bind(this, RespawnLocation.Home)}>
            {getStringTableValue(StringIDRespawnDestinationHomeIsland, this.props.stringTable)}
          </FactionButton>
        </div>
        <FormattedTextDiv
          text={getTokenizedStringTableValue(StringIDRespawnForcedRespawnTimer, this.props.stringTable, {
            SECONDS: forceRespawnSecondsLeft.toFixed(0)
          })}
          textAlign={'center'}
          className={CountdownContainer}
          textClasses={[CountdownText, CountdownNumber]}
          nodes={[]}
        />
      </FactionBorder>
    );
  }

  private animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    // animate() triggers every frame, but we only need to update once per second.
    // Using a half second because we don't update regularly enough, so sometimes we were skipping
    // display for one of the seconds.
    if (data.worldTime >= this.state.worldTimeSeconds + 0.5) {
      this.setState({ worldTimeSeconds: data.worldTime });
    }
  }

  private getDisabledTooltipText(): string {
    if (!this.props.isKeepAvailable) {
      return getStringTableValue(StringIDRespawnKeepUnavailable, this.props.stringTable);
    }
    if (Date.now() < this.props.respawnTimestamp) {
      return getStringTableValue(StringIDRespawnSpawnDelayed, this.props.stringTable);
    }
    return '';
  }

  componentWillUnmount(): void {
    if (this.state.animationHandle) {
      this.state.animationHandle.close();
    }
  }

  respawn(location: RespawnLocation): void {
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_RESPAWN));
    clientAPI.playGameSound(SoundEvents.PLAY_UI_RESPAWN_SELECTED);
    clientAPI.respawn('', location);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    isKeepAvailable: state.entities.self?.isKeepAvailable ?? false,
    respawnTimestamp: state.entities.self?.respawnTimestamp ?? 0,
    idleRespawnTimestamp: state.entities.self?.idleRespawnTimestamp ?? 0
  };
};

const Respawn = connect(mapStateToProps)(ARespawn);

export const WIDGET_ID_RESPAWN = 'Respawn';
export const respawnRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_RESPAWN,
  nameStringID: 'HUDEditorWidgetNameRespawn',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Center,
    xOffset: 0,
    yOffset: 0
  },
  layer: HUDLayer.Menus,
  isConditional: true,
  render: (isDragCopy: boolean) => {
    return <Respawn isDragCopy={isDragCopy} />;
  }
};
