/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { engineEvents } from 'lib/engineEvents';
import { HealthBar } from './HealthBar';
import { InteractionBar } from './InteractionBar';
import { Interactable } from './Interactable';
import { PlayerDifferentiator } from './PlayerDifferentiator';
import { Objective } from './Objective';

// tslint:disable-next-line
const OBJECTIVE_INDICATORS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']

interface ContainerProps extends React.HTMLProps<HTMLDivElement> {
  worldUIState: WorldUIState;
}

const WorldUIContainer = styled.div`
  position: fixed;
  pointer-events: none;
  width: ${(props: ContainerProps) => props.worldUIState.width}px;
  height: ${(props: ContainerProps) => props.worldUIState.height}px;
  top: ${(props: ContainerProps) => props.worldUIState.y}px;
  left: ${(props: ContainerProps) => props.worldUIState.x}px;
  overflow: hidden;
`;

export enum WorldUIWidgetType {
  Default,
  ProgressBar,
  HealthBar,
  Interactable,
  InteractionBar,
  PlayerDifferentiator,
  Objective,
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
  isEnemy: boolean;
  current: number;
  max: number;
}

export interface InteractableState extends WorldUIState {
  type: WorldUIWidgetType.Interactable;
  name: string;
}

export interface InteractionBarState extends WorldUIState {
  type: WorldUIWidgetType.InteractionBar;
  name: string,
  description: string,
  gameplayType: ItemGameplayType,
  iconClass: string,
  iconURL: string,
  progress?: number,
  keybind?: Binding,
}

export interface PlayerDifferentiatorState extends WorldUIState {
  type: WorldUIWidgetType.PlayerDifferentiator;
  differentiator: number;
}

export interface ObjectiveState extends WorldUIState {
  type: WorldUIWidgetType.Objective;
  objectiveState: ObjectiveEntityState;
  indicator: string;
}

export type WorldUIType = WorldUIState | ProgressBarState | HealthBarState |
  InteractableState | InteractionBarState | PlayerDifferentiatorState;

export interface State {
  worldUIs: { [id: number]: WorldUIType };
}

export class WorldUI extends React.Component<{}, State> {
  constructor(props: {}) {
    super(props);
    this.state = {
      worldUIs: {},
    };
  }

  public render() {
    return (
      <>
        {Object.values(this.state.worldUIs).map(this.renderWorldUI)}
      </>
    );
  }

  public componentDidMount() {
    engineEvents.onUpdateWorldUI(this.handleUpdateWorldUI);
    engineEvents.onRemoveWorldUI(this.handleRemoveWorldUI);
    engineEvents.onUpdateProgressBar(this.handleUpdateProgressBar);
    engineEvents.onUpdateHealthBar(this.handleUpdateHealthBar);
    engineEvents.onUpdateInteractionBar(this.handleUpdateInteractionBar);
    engineEvents.onUpdateObjective(this.handleUpdateObjective);
    // engineEvents.onUpdatePlayerDifferentiator(this.handleUpdatePlayerDifferentiator);
  }

  private renderWorldUI = (worldUI: WorldUIType) => {
    switch (worldUI.type) {
      case WorldUIWidgetType.ProgressBar: {
        return null;
      }

      case WorldUIWidgetType.HealthBar: {
        return (
          <WorldUIContainer worldUIState={worldUI}>
            <HealthBar state={worldUI as HealthBarState} />
          </WorldUIContainer>
        );
      }

      case WorldUIWidgetType.Interactable: {
        return (
          <WorldUIContainer worldUIState={worldUI}>
            <Interactable state={worldUI as InteractableState} />
          </WorldUIContainer>
        );
      }

      case WorldUIWidgetType.InteractionBar: {
        return (
          <WorldUIContainer worldUIState={worldUI}>
            <InteractionBar state={worldUI as InteractionBarState} />
          </WorldUIContainer>
        );
      }

      case WorldUIWidgetType.PlayerDifferentiator: {
        return (
          <WorldUIContainer worldUIState={worldUI}>
            <PlayerDifferentiator state={worldUI as PlayerDifferentiatorState} />
          </WorldUIContainer>
        );
      }

      case WorldUIWidgetType.Objective: {
        return (
          <WorldUIContainer worldUIState={worldUI}>
            <Objective state={worldUI as ObjectiveState} />
          </WorldUIContainer>
        );
      }

      default: {
        if (!worldUI.html) return null;

        return (
          <WorldUIContainer worldUIState={worldUI} dangerouslySetInnerHTML={{ __html: worldUI.html }}></WorldUIContainer>
        );
      }
    }
  }

  private handleUpdateWorldUI = (id: number, x: number, y: number, width: number, height: number, html: string) => {
    const newWorldUIState: WorldUIState = {
      type: WorldUIWidgetType.Default,
      id,
      x,
      y,
      width,
      height,
      html,
    };
    this.createOrUpdateWorldUI(newWorldUIState);
  }

  private handleRemoveWorldUI = (id: number) => {
    this.removeWorldUI(id);
  }

  private handleUpdateProgressBar = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    percent: number
  ) => {
    const newProgressBarState: ProgressBarState  = cloneDeep({
      type: WorldUIWidgetType.ProgressBar,
      id,
      x,
      y,
      width,
      height,
      percent,
    });
    this.createOrUpdateWorldUI(newProgressBarState);
  }

  private handleUpdateHealthBar = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    isEnemy: boolean,
    current: number,
    max: number
  ) => {
    const newHealthBarState: HealthBarState = cloneDeep({
      type: WorldUIWidgetType.HealthBar,
      id,
      x,
      y,
      width,
      height,
      name,
      isEnemy,
      current,
      max,
    });
    this.createOrUpdateWorldUI(newHealthBarState);
  }

  private handleUpdateInteractionBar = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    name: string,
    description: string,
    gameplayType: ItemGameplayType,
    iconClass: string,
    iconURL: string,
    progress?: number,
    keybind?: Binding,
  ) => {
    const newInteractionBarState: InteractionBarState = cloneDeep({
      type: WorldUIWidgetType.InteractionBar,
      id,
      x,
      y,
      width,
      height,
      name,
      description,
      gameplayType,
      iconClass,
      iconURL,
      progress,
      keybind,
    });

    this.createOrUpdateWorldUI(newInteractionBarState);
  }

  // private handleUpdatePlayerDifferentiator = (
  //   id: number,
  //   x: number,
  //   y: number,
  //   width: number,
  //   height: number,
  //   differentiator: number,
  // ) => {
  //   const newDifferentiatorState: PlayerDifferentiatorState = {
  //     type: WorldUIWidgetType.PlayerDifferentiator,
  //     id,
  //     x,
  //     y,
  //     width,
  //     height,
  //     differentiator,
  //   };

  //   this.createOrUpdateWorldUI(newDifferentiatorState);
  // }

  private handleUpdateObjective = (
    id: number,
    x: number,
    y: number,
    width: number,
    height: number,
    objectiveState: ObjectiveEntityState,
  ) => {
    const objectiveStateCopy = cloneDeep(objectiveState);
    const newObjectiveState: ObjectiveState = {
      type: WorldUIWidgetType.Objective,
      id,
      x,
      y,
      width,
      height,
      objectiveState: objectiveStateCopy,
      indicator: OBJECTIVE_INDICATORS[objectiveStateCopy.objective.index],
    };

    // CODE IS USED TO FIND A BUG. DELETE WHEN FIXED
    const worldUIs = cloneDeep(this.state.worldUIs);
    const foundSameCoord = Object.values(worldUIs).find(ui => ui.x === x && ui.y === y);
    if (foundSameCoord && foundSameCoord.id !== id) {
      this.removeWorldUI(foundSameCoord.id);
      console.error(`Hey Matt! There was an Objective indicator with the
        same coordinates as another but does not have the same id.`);
    }

    const isBadObjective = objectiveState.objective.progress.current === 0 && objectiveState.objective.progress.max === 0;
    if (isBadObjective) {
      console.error(`There was an Objective indicator that had capture progress current: 0 and max: 0. That's bad!`);
      return;
    }
    // CODE IS USED TO FIND A BUG. DELETE WHEN FIXED

    this.createOrUpdateWorldUI(newObjectiveState);
  }

  private createOrUpdateWorldUI = (newWorldUI: WorldUIType) => {
    const worldUIs = cloneDeep(this.state.worldUIs);
    worldUIs[newWorldUI.id] = newWorldUI;
    this.setState({ worldUIs });
  }

  private removeWorldUI = (id: number) => {
    const worldUIs = cloneDeep(this.state.worldUIs);
    delete worldUIs[id];
    this.setState({ worldUIs });
  }
}
