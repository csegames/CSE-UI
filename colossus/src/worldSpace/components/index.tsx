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
  BaseEntityStateModel,
  EntityResource,
  findEntityResource,
  WorldUIPositionMapModel,
  WorldUIPositionModel
} from '@csegames/library/dist/hordetest/game/GameClientModels/EntityState';
import { CharacterKind } from '@csegames/library/dist/hordetest/game/types/CharacterKind';
import { clientAPI } from '@csegames/library/dist/hordetest/WorldSpaceClientAPI';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ArrayMap } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityResourceIDs } from '@csegames/library/dist/hordetest/game/types/EntityResourceIDs';
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
  entity: BaseEntityStateModel;
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

  public componentDidMount() {
    this.handles = [
      clientAPI.bindDamageTextListener(this.handleUpdateDamageText),
      clientAPI.bindHealthBarListener(this.handleUpdateHealthBar),
      clientAPI.bindInteractionBarListener(this.handleUpdateInteractionBar),
      clientAPI.bindObjectiveListener(this.handleUpdateObjective),
      clientAPI.bindProgressBarListener(this.handleUpdateProgressBar),
      clientAPI.bindWorldUIRemovedListener(this.handleRemoveWorldUI),
      clientAPI.bindWorldUIUpdatedListener(this.handleUpdateWorldUI),
      clientAPI.bindWorldUIPositionMapUpdatedListener(this.handleUpdateWorldUIPositionMap)
    ];
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

  private handleUpdateWorldUI = (id: number, x: number, y: number, width: number, height: number, html: string) => {
    const newWorldUIState: WorldUIState = { type: WorldUIWidgetType.Default, id, x, y, width, height, html };
    this.createOrUpdateWorldUI(newWorldUIState);
  };

  private handleRemoveWorldUI = (id: number) => {
    this.removeWorldUI(id);
  };

  private handleUpdateWorldUIPositionMap = (newState: WorldUIPositionMapModel) => {
    this.updateWorldUIPositionMap(newState);
  };

  private handleUpdateProgressBar = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    percent: number
  ) => {
    this.createOrUpdateWorldUI({ type: WorldUIWidgetType.ProgressBar, id, x, y, width, height, percent });
  };

  private handleUpdateHealthBar = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    kind: HealthBarKind,
    voiceChatStatus: VoiceChatMemberStatus,
    voiceChatVolume: number,
    barColor: number,
    isShielded: boolean,
    healthBarIcon: string,
    rank: CharacterKind,
    lifeState: LifeState,
    deathStartTime: number,
    downedStateEndTime: number,
    interactionName: string,
    interactionEnabled: boolean,
    interactionDisabledReason: string,
    interactionRange: number,
    bindingName: string,
    bindingIconClass: string,
    worldTime: number,
    resources: ArrayMap<EntityResource>
  ) => {
    this.createOrUpdateWorldUI({
      type: WorldUIWidgetType.HealthBar,
      id,
      x,
      y,
      width,
      height,
      name,
      kind,
      voiceChatStatus,
      voiceChatVolume,
      barColor,
      isShielded,
      healthBarIcon,
      rank,
      lifeState,
      deathStartTime,
      downedStateEndTime,
      interactionName,
      interactionEnabled,
      interactionDisabledReason,
      interactionRange,
      bindingName,
      bindingIconClass,
      worldTime,
      resources
    });
  };

  private handleUpdateInteractionBar = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    description: string,
    gameplayType: ItemGameplayType,
    title: string,
    enabled: boolean,
    disabledReason?: string,
    progress?: number,
    keybind?: Binding
  ) => {
    const keybindCopy = keybind ? cloneDeep(keybind) : undefined;
    this.createOrUpdateWorldUI({
      type: WorldUIWidgetType.InteractionBar,
      id,
      x,
      y,
      width,
      height,
      name,
      description,
      gameplayType,
      title,
      enabled,
      disabledReason,
      progress,
      keybind: keybindCopy
    });
  };

  private handleUpdateObjective = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    currentWorldTime: number,
    entity: BaseEntityStateModel
  ) => {
    //this code cannot trust that the entity information from the game client for an objective is set completely,
    // so I'm adding a bunch of defensive code to account for it here until the great worldspace refactoring! --DM
    if (!entity || !entity.objective) {
      console.warn(
        'Either objectiveState is undefined or objectiveState.objective is undefined.  This could possibly generate an error state: ',
        entity
      );
    }

    // The worldspace ui does not seem to know the current game time from moment to moment
    // we'll use the information that we get from this update to figure out how long ago the decrease happened
    // and store it in a way we can check against it later on.
    const lastDecreaseDate = new Date();
    const lastDecreaseTime =
      findEntityResource(entity.resources, EntityResourceIDs.CaptureProgress)?.lastDecreaseTime ?? 0;
    lastDecreaseDate.setSeconds(lastDecreaseDate.getSeconds() - currentWorldTime + lastDecreaseTime);

    let indicator: string;
    if (!entity.objective || isNaN(+entity.objective.indicator)) {
      indicator = '';
    } else {
      indicator = String.fromCharCode(entity.objective.indicator);
    }

    const newObjectiveState: ObjectiveState = {
      type: WorldUIWidgetType.Objective,
      id,
      x,
      y,
      width,
      height,
      entity,
      lastDecreaseDate,
      indicator
    };

    this.createOrUpdateWorldUI(newObjectiveState);
  };

  private handleUpdateDamageText = (id: number, x: number, y: number, width: number, height: number, text: string) => {
    const newWorldUIState: DamageTextState = {
      type: WorldUIWidgetType.DamageText,
      id,
      x,
      y,
      width,
      height,
      text
    };
    this.createOrUpdateWorldUI(newWorldUIState);
  };

  private createOrUpdateWorldUI = (newWorldUI: WorldUIType) => {
    const worldUIs = cloneDeep(this.state.worldUIs);
    worldUIs[newWorldUI.id] = newWorldUI;
    this.setState({ worldUIs, worldUIPositionMap: this.state.worldUIPositionMap });
  };

  private removeWorldUI = (id: number) => {
    const worldUIs = cloneDeep(this.state.worldUIs);
    delete worldUIs[id];
    this.setState({ worldUIs, worldUIPositionMap: this.state.worldUIPositionMap });
  };

  private updateWorldUIPositionMap = (newMap: WorldUIPositionMapModel) => {
    this.setState({ worldUIs: this.state.worldUIs, worldUIPositionMap: newMap });
  };
}
