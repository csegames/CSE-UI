/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { HealthBar } from './HealthBar';
import { InteractionBar } from './InteractionBar';
import { PlayerDifferentiator } from './PlayerDifferentiator';
import { Objective } from './Objective';
import { HealthBarKind } from '@csegames/library/dist/hordetest/game/types/HealthBarKind';
import { LifeState } from '@csegames/library/dist/hordetest/game/types/LifeState';
import { ItemGameplayType } from '@csegames/library/dist/hordetest/game/types/ItemGameplayType';
import { Binding } from '@csegames/library/dist/_baseGame/types/Keybind';
import {
  BaseEntityState,
  EntityResource,
  WorldUIPositionMapModel,
  WorldUIPositionModel
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { VoiceChatMemberStatus } from '@csegames/library/dist/_baseGame/types/VoiceChatMemberSettings';

const WorldUIContainer = 'WorldSpace-WorldUIContainer';
const WorldUIDamageText = 'WorldSpace-WorldUIDamageText';

function makeWorldUIContainerStyles(worldUIState: WorldUIState) {
  return {
    width: `${worldUIState.width}px`,
    height: `${worldUIState.height}px`,
    top: `${worldUIState.y}px`,
    left: `${worldUIState.x}px`
  };
}

export enum WorldUIWidgetType {
  Default,
  ProgressBar,
  HealthBar,
  InteractionBar,
  PlayerDifferentiator,
  Objective,
  DamageText
}

export interface WorldUIState {
  type: WorldUIWidgetType;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  html?: string;
}

export interface ProgressBarState extends WorldUIState {
  type: WorldUIWidgetType.ProgressBar;
  percent: number;
}

export interface HealthBarState extends WorldUIState {
  type: WorldUIWidgetType.HealthBar;
  name: string;
  kind: HealthBarKind;
  voiceChatStatus: VoiceChatMemberStatus;
  voiceChatVolume: number;
  barColor: number;
  isShielded: boolean;
  healthBarIcon: string;
  rank: number;
  lifeState: LifeState;
  deathStartTime: number;
  downedStateEndTime: number;
  interactionName: string;
  interactionEnabled: boolean;
  interactionDisabledReason: string;
  interactionRange: number;
  bindingName: string;
  bindingIconClass: string;
  worldTime: number;
  resources: ArrayMap<EntityResource>;
}

export interface InteractionBarState extends WorldUIState {
  type: WorldUIWidgetType.InteractionBar;
  name: string;
  description: string;
  gameplayType: ItemGameplayType;
  title: string;
  enabled: boolean;
  disabledReason?: string;
  progress?: number;
  keybind?: Binding;
}

export interface PlayerDifferentiatorState extends WorldUIState {
  type: WorldUIWidgetType.PlayerDifferentiator;
  differentiator: number;
}

export interface ObjectiveState extends WorldUIState {
  type: WorldUIWidgetType.Objective;
  entity: BaseEntityState;
  indicator: string;
  lastDecreaseDate: Date;
}

export interface DamageTextState extends WorldUIState {
  type: WorldUIWidgetType.DamageText;
  text: string;
  // TODO: Raw number? Damage type?  Damage color?
}

export type WorldUIType =
  | WorldUIState
  | ProgressBarState
  | HealthBarState
  | InteractionBarState
  | PlayerDifferentiatorState
  | DamageTextState;

export interface State {
  worldUIs: { [id: number]: WorldUIType };
  worldUIPositionMap: WorldUIPositionMapModel;
}

export class WorldUI extends React.Component<{}, State> {
  private handles: ListenerHandle[] = [];

  constructor(props: {}) {
    super(props);
    this.state = { worldUIs: {}, worldUIPositionMap: {} };
  }

  public render() {
    return (
      <>
        {Object.keys(this.state.worldUIs).map((cellID) =>
          this.renderWorldUI(
            this.state.worldUIs[cellID as unknown as number],
            this.state.worldUIPositionMap[cellID as unknown as number]
          )
        )}
      </>
    );
  }

  public componentWillUnmount(): void {
    this.handles.forEach((h) => h.close());
    this.handles = [];
  }

  private renderWorldUI = (worldUI: WorldUIType, position: WorldUIPositionModel) => {
    if (!position) {
      return null;
    }

    switch (worldUI.type) {
      case WorldUIWidgetType.ProgressBar: {
        return null;
      }

      case WorldUIWidgetType.HealthBar: {
        return (
          <div className={WorldUIContainer} style={makeWorldUIContainerStyles(worldUI)} key={worldUI.id}>
            <HealthBar state={worldUI as HealthBarState} position={position} />
          </div>
        );
      }

      case WorldUIWidgetType.InteractionBar: {
        return (
          <div className={WorldUIContainer} style={makeWorldUIContainerStyles(worldUI)} key={worldUI.id}>
            <InteractionBar state={worldUI as InteractionBarState} />
          </div>
        );
      }

      case WorldUIWidgetType.PlayerDifferentiator: {
        return (
          <div className={WorldUIContainer} style={makeWorldUIContainerStyles(worldUI)} key={worldUI.id}>
            <PlayerDifferentiator state={worldUI as PlayerDifferentiatorState} />
          </div>
        );
      }

      case WorldUIWidgetType.Objective: {
        return (
          <div className={WorldUIContainer} style={makeWorldUIContainerStyles(worldUI)} key={worldUI.id}>
            <Objective state={worldUI as ObjectiveState} position={position} />
          </div>
        );
      }

      case WorldUIWidgetType.DamageText: {
        return (
          <div className={WorldUIContainer} style={makeWorldUIContainerStyles(worldUI)} key={worldUI.id}>
            <span className={WorldUIDamageText}>{(worldUI as DamageTextState).text}</span>
          </div>
        );
      }

      default: {
        if (!worldUI.html) return null;

        return (
          <div
            className={WorldUIContainer}
            style={makeWorldUIContainerStyles(worldUI)}
            key={worldUI.id}
            dangerouslySetInnerHTML={{ __html: worldUI.html }}
          />
        );
      }
    }
  };
}
