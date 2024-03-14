/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/WorldSpaceClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';
import * as React from 'react';

// Styles
const Container = 'WorldSpace-WorldUIContainer';
const ProgressBarWrapper = 'ProgressBar-Wrapper';
const ProgressBarImage = 'ProgressBar-Image';
const ProgressBarBar = 'ProgressBar-Bar';
const ProgressBarMask = 'ProgressBar-Mask';

export enum WorldUIWidgetType {
  Default,
  ProgressBar
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

// These styles are in px because we are really just drawing onto a
// texture atlas that is being used to wrap quads in the client, and
// that atlas is always a consistent size.  No need for scaling here.
function makeWorldUIContainerStyles(worldUIState: WorldUIState) {
  return {
    width: `${worldUIState.width}px`,
    height: `${worldUIState.height}px`,
    top: `${worldUIState.y}px`,
    left: `${worldUIState.x}px`
  };
}

type WorldUIType = WorldUIState | ProgressBarState;

interface Props {}

interface State {
  // Single shared type so we can easily add/update/remove.
  worldUIs: { [id: number]: WorldUIType };
}

export class WorldUI extends React.Component<Props, State> {
  private listeners: ListenerHandle[] = [];

  constructor(props: Props) {
    super(props);
    this.state = {
      worldUIs: {}
    };
  }

  render(): JSX.Element {
    return (
      <>
        {Object.values(this.state.worldUIs).map((widget) => {
          switch (widget.type) {
            case WorldUIWidgetType.ProgressBar: {
              return this.renderProgressBarWidget(widget as ProgressBarState);
            }
            default: {
              return this.renderHTMLWidget(widget);
            }
          }
        })}
      </>
    );
  }

  renderHTMLWidget(model: WorldUIState): JSX.Element {
    // We don't want to use this type if we can avoid it.
    // Raw HTML means that the client repo is managing UI code, instead of
    // the UI repo managing UI code.
    return (
      <div
        key={model.id}
        className={Container}
        style={makeWorldUIContainerStyles(model)}
        dangerouslySetInnerHTML={{ __html: model.html }}
      ></div>
    );
  }

  renderProgressBarWidget(model: ProgressBarState): JSX.Element {
    return (
      <div key={model.id} className={Container} style={makeWorldUIContainerStyles(model)}>
        <div className={ProgressBarWrapper}>
          <img className={ProgressBarImage} src={'images/progressbar/bg.png'} />
          <div className={ProgressBarMask}>
            <div className={ProgressBarBar} style={{ width: (model.percent * 100).toFixed(0) }}></div>
          </div>
          <img className={ProgressBarImage} src={'images/progressbar/overlay.png'} />
        </div>
      </div>
    );
  }

  componentDidMount(): void {
    this.listeners = [
      clientAPI.bindProgressBarListener(this.updateProgressBar.bind(this)),
      clientAPI.bindWorldUIRemovedListener(this.removeWorldUI.bind(this)),
      clientAPI.bindWorldUIUpdatedListener(this.updateWorldUI.bind(this))
    ];
  }

  componentWillUnmount(): void {
    this.listeners.forEach((listener) => listener.close());
    this.listeners = [];
  }

  updateWorldUI(id: number, x: number, y: number, width: number, height: number, html: string) {
    const newWorldUIState: WorldUIState = { type: WorldUIWidgetType.Default, id, x, y, width, height, html };
    this.createOrUpdateWorldUI(newWorldUIState);
  }

  private updateProgressBar = (id: number, x: number, y: number, width: number, height: number, percent: number) => {
    this.createOrUpdateWorldUI({ type: WorldUIWidgetType.ProgressBar, id, x, y, width, height, percent });
  };

  private createOrUpdateWorldUI = (newWorldUI: WorldUIType) => {
    const worldUIs = cloneDeep(this.state.worldUIs);
    worldUIs[newWorldUI.id] = newWorldUI;
    this.setState({ worldUIs });
  };

  private removeWorldUI = (id: number) => {
    const worldUIs = cloneDeep(this.state.worldUIs);
    delete worldUIs[id];
    this.setState({ worldUIs });
  };
}
