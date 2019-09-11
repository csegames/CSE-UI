/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { engineEvents } from 'lib/engineEvents';
import { HealthBar } from './HealthBar';

export enum WorldUIWidgetType {
  Default,
  ProgressBar,
  HealthBar,
}

export interface WorldUIState {
  type: WorldUIWidgetType;
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  html?: HTMLElement;
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

export type WorldUIType = WorldUIState | ProgressBarState | HealthBarState;

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
  }

  private renderWorldUI = (worldUI: WorldUIType) => {
    switch (worldUI.type) {
      case WorldUIWidgetType.ProgressBar: {
        return null;
      }

      case WorldUIWidgetType.HealthBar: {
        return <HealthBar worldUI={worldUI as HealthBarState} />;
      }

      default: {
        return null;
      }
    }
  }

  private handleUpdateWorldUI = (id: number, x: number, y: number, width: number, height: number, html: HTMLElement) => {
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
    const newProgressBarState: ProgressBarState  = {
      type: WorldUIWidgetType.ProgressBar,
      id,
      x,
      y,
      width,
      height,
      percent,
    };
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
    const newHealthBarState: HealthBarState = {
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
    };
    this.createOrUpdateWorldUI(newHealthBarState);
  }

  private createOrUpdateWorldUI = (newWorldUI: WorldUIType) => {
    const worldUIs = { ...this.state.worldUIs };
    worldUIs[newWorldUI.id] = newWorldUI;
    this.setState({ worldUIs });
  }

  private removeWorldUI = (id: number) => {
    const worldUIs = { ...this.state.worldUIs };
    delete worldUIs[id];
    this.setState({ worldUIs });
  }
}
