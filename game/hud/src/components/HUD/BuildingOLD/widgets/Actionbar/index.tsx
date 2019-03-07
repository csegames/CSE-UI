/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';

import buildingActions from '../../services/session/requester';
import { GlobalState } from '../../services/session/reducer';
import ActionButton from './components/ActionButton';
import SavedDraggable, { Anchor } from '../SavedDraggable';

export interface ActionBarProps {
  buildingMode: BuildingMode;
  dispatch: (action: any) => void;
}

export interface ActionBarState {
  minimized: boolean;
}

class ActionBar extends React.Component<ActionBarProps, ActionBarState> {

  constructor(props: ActionBarProps) {
    super(props);
    this.state = {
      minimized: false,
    };
  }

  public render() {

    const ACTION_BAR_IMAGES = {
      actionBarSelect: 'images/building/action-bar-select.png',
      actionBarAddBlock: 'images/building/action-bar-add-block.png',
      actionBarDelBlock: 'images/building/action-bar-del-block.png',
      actionBarUndo: 'images/building/action-bar-undo.png',
      actionBarRedo: 'images/building/action-bar-redo.png',
      actionBarRotateX: 'images/building/action-bar-rotate-x.png',
      actionBarRotateY: 'images/building/action-bar-rotate-y.png',
      actionBarRotateZ: 'images/building/action-bar-rotate-z.png',
      actionBarFlipX: 'images/building/action-bar-flip-x.png',
      actionBarFlipY: 'images/building/action-bar-flip-y.png',
      actionBarFlipZ: 'images/building/action-bar-flip-z.png',
    };

    return (
     <SavedDraggable saveName='building/actionbar'
        defaultX={[0, Anchor.TO_START]}
        defaultY={[-200, Anchor.TO_CENTER]}
 >

      <div className='action-bar'>
        <header className='action-bar-header'>
            <div className='dragHandle'></div>
        </header>
        <ul className='action-bar-container'>

          <li className='action-bar-item' onClick={() => this.onSelect() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarSelect} />
            {this.state.minimized ? null : <em>`</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onComit()}>
            <ActionButton isActive={false}
              icon={this.props.buildingMode < 4 ? ACTION_BAR_IMAGES.actionBarAddBlock : ACTION_BAR_IMAGES.actionBarDelBlock}
            />
            {this.state.minimized ? null : <em>1</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onUndo() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarUndo} />
            {this.state.minimized ? null : <em>2</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onRedo() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarRedo} />
            {this.state.minimized ? null : <em>3</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onRotX() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarRotateX} />
            {this.state.minimized ? null : <em>4</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onRotY() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarRotateY} />
            {this.state.minimized ? null : <em>5</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onRotZ() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarRotateZ} />
            {this.state.minimized ? null : <em>6</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onFlipX() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarFlipX} />
            {this.state.minimized ? null : <em>7</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onFlipY() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarFlipY} />
            {this.state.minimized ? null : <em>8</em>}
          </li>

          <li className='action-bar-item' onClick={() => this.onFlipZ() }>
            <ActionButton isActive={false}
              icon={ACTION_BAR_IMAGES.actionBarFlipZ} />
            {this.state.minimized ? null : <em>9</em>}
          </li>

        </ul>
      </div>
      </SavedDraggable>
    );
  }

  private onSelect() {
    if (this.props.buildingMode !== window.BuildingMode.SelectingBlocks) {
      buildingActions.changeMode(window.BuildingMode.SelectingBlocks);
    } else {
      buildingActions.changeMode(window.BuildingMode.PlacingPhantom);
    }
  }

  private onComit() {
    buildingActions.commit();
  }

  private onUndo() {
    buildingActions.undo();
  }

  private onRedo() {
    buildingActions.redo();
  }

  private onRotX() {
    buildingActions.rotX();
  }

  private onRotY() {
    buildingActions.rotY();
  }

  private onRotZ() {
    buildingActions.rotZ();
  }

  private onFlipX() {
    buildingActions.flipX();
  }

  private onFlipY() {
    buildingActions.flipY();
  }

  private onFlipZ() {
    buildingActions.flipZ();
  }
}

function select(state: GlobalState) {
  return {
    buildingMode: state.building.mode,
  };
}

export default connect(select)(ActionBar);
