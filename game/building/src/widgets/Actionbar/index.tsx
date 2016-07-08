/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {client, channelId, events} from 'camelot-unchained';

import ActionButton from './components/ActionButton';

export interface ActionBarProps {
}

export interface ActionBarState {
  minimized: boolean;
  buildingMode: number;
}

class ActionBar extends React.Component<ActionBarProps, ActionBarState> {

  constructor(props: ActionBarProps) {
    super(props);
    this.state = {
      minimized: false,
      buildingMode: 1
    }
  }

  componentDidMount() {
    client.OnBuildingModeChanged((buildingMode: number) => {
      this.setState({buildingMode: buildingMode} as any);
    });
  }

  onMinMax() {
    this.setState({
      minimized: !this.state.minimized,
      buildingMode: 1
    });
  }

  onSelect() {
    if (this.state.buildingMode < 4) {
      client.SetBuildingMode(4);
      this.setState({buildingMode: 4} as any);
    } else {
      client.SetBuildingMode(1);
      this.setState({buildingMode: 1} as any);
    }
  }

  onComit() {
    client.CommitBlock();
  }

  onUndo() {
    client.UndoCube();
  }

  onRedo() {
    client.RedoCube();
  }

  onRotX() {
    client.BlockRotateX();
  }

  onRotY() {
    client.BlockRotateY();
  }

  onRotZ() {
    client.BlockRotateZ();
  }

  onFlipX() {
    client.BlockFlipX();
  }

  onFlipY() {
    client.BlockFlipY();
  }

  onFlipZ() {
    client.BlockFlipZ();
  }

  render() {
    const CUBE_CHANNEL:any = 27;
    const cube = channelId == CUBE_CHANNEL;
    const hideIfCube = { display: cube ? 'none' : '' };

    return (
      <div className='action-bar'>
        <header>
          <span className='min-max' onClick={() => this.onMinMax() }>
            {this.state.minimized ? '>>' : '<<'}
          </span>
        </header>
        <ul>

          <li onClick={() => this.onSelect() }>
            <ActionButton isActive={false}
              icon={'images/action-bar-select.png'} />
            {this.state.minimized ? null : <em>`</em>}
          </li>

          <li onClick={() => this.onComit()}>
            <ActionButton isActive={false}
              icon={this.state.buildingMode < 4 ? 'images/action-bar-add-block.png' : 'images/action-bar-del-block.png'} />
            {this.state.minimized ? null : <em>1</em>}
          </li>

          <li onClick={() => this.onUndo() } style={hideIfCube}>
            <ActionButton isActive={false}
              icon={'images/action-bar-undo.png'} />
            {this.state.minimized ? null : <em>2</em>}
          </li>

          <li onClick={() => this.onRedo() } style={hideIfCube}>
            <ActionButton isActive={false}
              icon={'images/action-bar-redo.png'} />
            {this.state.minimized ? null : <em>3</em>}
          </li>

          <li onClick={() => this.onRotX() }>
            <ActionButton isActive={false}
              icon={'images/action-bar-rotate-x.png'} />
            {this.state.minimized ? null : <em>4</em>}
          </li>

          <li onClick={() => this.onRotY() }>
            <ActionButton isActive={false}
              icon={'images/action-bar-rotate-y.png'} />
            {this.state.minimized ? null : <em>5</em>}
          </li>

          <li onClick={() => this.onRotZ() }>
            <ActionButton isActive={false}
              icon={'images/action-bar-rotate-z.png'} />
            {this.state.minimized ? null : <em>6</em>}
          </li>

          <li onClick={() => this.onFlipX() }>
            <ActionButton isActive={false}
              icon={'images/action-bar-flip-x.png'} />
            {this.state.minimized ? null : <em>7</em>}
          </li>

          <li onClick={() => this.onFlipY() }>
            <ActionButton isActive={false}
              icon={'images/action-bar-flip-y.png'} />
            {this.state.minimized ? null : <em>8</em>}
          </li>

          <li onClick={() => this.onFlipZ() }>
            <ActionButton isActive={false}
              icon={'images/action-bar-flip-z.png'} />
            {this.state.minimized ? null : <em>9</em>}
          </li>

        </ul>
      </div>
    )
  }
}

export default ActionBar;
