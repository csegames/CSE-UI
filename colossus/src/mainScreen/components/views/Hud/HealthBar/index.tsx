/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ResourceBar } from '../../../shared/ResourceBar';
import { ChampionProfile } from './ChampionProfile';
import { LOW_HEALTH_PERCENT } from '../FullScreenEffects/LowHealth';
import { CurrentMax } from '@csegames/library/dist/_baseGame/types/CurrentMax';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { game } from '@csegames/library/dist/_baseGame';
import { EntityResource, findEntityResource } from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';

const Container = 'HealthBar-Container';
const ResourcesContainer = 'HealthBar-ResourcesContainer';
const ResourceContainer = 'HealthBar-ResourceContainer';
const TextStyles = 'HealthBar-TextStyles';
const Hearts = 'HealthBar-Hearts';

const Heart = 'HealthBar-Heart';

interface Props {
  accountID: string;
  id: string;
  raceID: number;
  isAlive: boolean;
  resources: ArrayMap<EntityResource>;
  voiceChatIconSizeVmin: number;
  resourcesWidthVmin?: number | 'auto';
  resourcesHeightVmin?: number;
  hideChampionResource?: boolean;
  championProfileStyles?: string;
  hideMax?: boolean;
  hideCurrent?: boolean;
  collectedRunes?: { [runeType: number]: number };
  runeBonuses?: { [runeType: number]: number };
  showChampionLives?: boolean;
  currentLives?: number;
  style?: object;
  name?: string;
  lifeState: LifeState;
  deathStartTime: number;
  downedStateEndTime: number;
  isSelfHealthBar: boolean;
  portraitURL: string;
}

interface State {
  downedEndTime: number;
}

export class HealthBar extends React.Component<Partial<Props>, State> {
  constructor(props: Props) {
    super(props);
    this.state = { downedEndTime: 0 };
  }
  private timeToLive: number = null;

  public render() {
    const health = findEntityResource(this.props.resources, EntityResourceIDs.Health);
    const lowHealth = health && (health.current / health.max) * 100 <= LOW_HEALTH_PERCENT;

    const resourceContainerStyle: React.CSSProperties = {};
    if (this.props.resourcesWidthVmin !== 'auto') {
      if (this.props.resourcesWidthVmin) {
        resourceContainerStyle.width = `${this.props.resourcesWidthVmin}vmin`;
      } else {
        resourceContainerStyle.width = `18.5vmin`;
      }
    }

    // there is a separate selfReviveBar, the selfHealthBar should always be the alive style
    if (!this.props.isSelfHealthBar && this.props.lifeState == LifeState.Downed) {
      if (this.timeToLive === null) {
        this.timeToLive = window.setInterval(this.getDownedTimer.bind(this), 1000);
      }
      return this.getDownedStyle(lowHealth, resourceContainerStyle);
    } else {
      return this.getAliveStyle(lowHealth, resourceContainerStyle);
    }
  }

  private getDownedStyle(lowHealth: boolean, resourceContainerStyle: React.CSSProperties): JSX.Element {
    const reviveProgress = findEntityResource(this.props.resources, EntityResourceIDs.ReviveProgress);
    const startedReviving = reviveProgress && reviveProgress.current > 0 ? true : false;
    const curMax: CurrentMax = this.getDownedCurMax(reviveProgress, startedReviving);
    const health = findEntityResource(this.props.resources, EntityResourceIDs.Health);

    return (
      <div id={this.props.id} className={Container} style={this.props.style}>
        <ChampionProfile
          accountID={this.props.accountID}
          isAlive={this.props.isAlive}
          raceID={this.props.raceID}
          containerStyles={this.props.championProfileStyles}
          name={this.props.name}
          voiceChatIconSizeVmin={this.props.voiceChatIconSizeVmin}
          portraitURL={this.props.portraitURL}
        />
        <div className={ResourcesContainer} style={resourceContainerStyle}>
          {this.barrierBar()}
          <ResourceBar
            isSquare
            unsquareText
            shouldPlayBackfill={false}
            type={startedReviving ? 'reviving' : 'down'}
            containerStyle={this.getBarStyle(this.props.resourcesHeightVmin)}
            current={curMax.current}
            max={curMax.max}
            text={this.props.hideMax && !this.props.hideCurrent && health ? health.current.toString() : ''}
            textStyles={TextStyles}
            hideText={this.props.hideMax && this.props.hideCurrent}
            showHighlights={true}
            lifeState={this.props.lifeState}
            startedReviving={startedReviving}
          />
          {this.rageBar()}
          {this.hearts()}
        </div>
      </div>
    );
  }

  private getAliveStyle(lowHealth: boolean, resourceContainerStyle: React.CSSProperties): JSX.Element {
    const health = findEntityResource(this.props.resources, EntityResourceIDs.Health);
    const noHealthInfo = !health || isNaN(health.current) || isNaN(health.max);
    return (
      <div id={this.props.id} className={Container} style={this.props.style}>
        <ChampionProfile
          accountID={this.props.accountID}
          isAlive={this.props.isAlive}
          raceID={this.props.raceID}
          containerStyles={this.props.championProfileStyles}
          name={this.props.name}
          voiceChatIconSizeVmin={this.props.voiceChatIconSizeVmin}
          portraitURL={this.props.portraitURL}
        />
        <div className={ResourcesContainer} style={resourceContainerStyle}>
          {this.barrierBar()}
          <ResourceBar
            isSquare
            unsquareText
            shouldPlayBackfill={true}
            shouldFlashBackfill={lowHealth}
            type={lowHealth ? 'red' : 'green'}
            containerStyle={this.getBarStyle(this.props.resourcesHeightVmin)}
            current={noHealthInfo ? 0 : health.current}
            max={noHealthInfo ? 0 : health.max}
            text={this.props.hideMax && !this.props.hideCurrent && !noHealthInfo ? health.current.toString() : ''}
            textStyles={TextStyles}
            hideText={this.props.hideMax && this.props.hideCurrent}
          />
          {this.rageBar()}
          {this.hearts()}
        </div>
      </div>
    );
  }

  private getDownedCurMax(reviveProgress: EntityResource, startedReviving: boolean): CurrentMax {
    if (startedReviving) {
      return { current: reviveProgress.current, max: reviveProgress.max };
    } else {
      return { current: this.state.downedEndTime, max: this.props.downedStateEndTime - this.props.deathStartTime };
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

  private barrierBar(): JSX.Element {
    const divineBarrier = findEntityResource(this.props.resources, EntityResourceIDs.Barrier);
    if (this.props.lifeState == LifeState.Downed && this.props.hideChampionResource) {
      return null;
    } else if (!divineBarrier || divineBarrier.max <= 0) {
      return null;
    } else {
      const noBarrierInfo = isNaN(divineBarrier.current) || isNaN(divineBarrier.max);
      return (
        <ResourceBar
          isSquare
          unsquareText
          shouldPlayBackfill={true}
          shouldFlashBackfill={false}
          type='blue'
          containerStyle={this.getBarStyle(this.props.resourcesHeightVmin)}
          current={noBarrierInfo ? 0 : divineBarrier.current}
          max={noBarrierInfo ? 0 : divineBarrier.max}
          text={this.props.hideMax && !this.props.hideCurrent ? divineBarrier.current.toString() : ''}
          textStyles={TextStyles}
          hideText={this.props.hideMax && this.props.hideCurrent}
        />
      );
    }
  }

  private rageBar(): JSX.Element {
    if (this.props.hideChampionResource) {
      return;
    }

    const championResource = findEntityResource(this.props.resources, EntityResourceIDs.Blood);
    /** @TODO handle 'flexEnd */
    const noResourceInfo = !championResource || isNaN(championResource.current) || isNaN(championResource.max);
    return (
      <ResourceBar
        isSquare
        hideText
        type='rage'
        containerClasses={ResourceContainer}
        current={noResourceInfo ? 0 : championResource.current}
        max={noResourceInfo ? 0 : championResource.max}
        containerStyle={{ alignSelf: 'flex-end', marginTop: '0.5vmin' }}
      />
    );
  }

  private hearts(): JSX.Element {
    if (!this.props.showChampionLives) {
      return;
    }

    const hearts = Array.from(Array(this.props.currentLives ? this.props.currentLives : 0));

    return (
      <div className={Hearts}>
        {hearts.map((_, heartIndex) => {
          return <div className={`${Heart} fs-icon-misc-heart`} key={heartIndex} />;
        })}
      </div>
    );
  }

  private getBarStyle(heightVmin?: number) {
    return { flex: 1, height: (heightVmin ? heightVmin : 2) + 'vmin', width: '100%', alignSelf: 'flex-start' };
  }
}
