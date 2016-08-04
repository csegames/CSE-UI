/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {buildUIMode} from 'camelot-unchained';

import buildingActions from '../../services/session/requester';
import {GlobalState} from '../../services/session/reducer';
import ActionButton from './components/ActionButton';
import SavedDraggable, {Anchor} from '../SavedDraggable';

function select(state: GlobalState): any {
  return {
    buildingMode: state.building.mode
  }
}

export interface ActionBarProps {
  buildingMode: number;
}

export interface ActionBarState {
  minimized: boolean;
}

class ActionBar extends React.Component<ActionBarProps, ActionBarState> {
  private modeListener: { (buildingMode: number):void } = (buildingMode: number) => {
    this.setState({buildingMode: buildingMode} as any);
  };

  constructor(props: ActionBarProps) {
    super(props);
    this.state = {
      minimized: false,
    }    
  }

  onMinMax() {
    this.setState({
      minimized: !this.state.minimized,
    });
  }

  onSelect() {
    if (this.props.buildingMode != buildUIMode.SELECTINGBLOCK) {
      buildingActions.changeMode(buildUIMode.SELECTINGBLOCK);
    } else {
      buildingActions.changeMode(buildUIMode.PLACINGPHANTOM);
    }
  }

  onComit() {
    buildingActions.commit();
  }

  onUndo() {
    buildingActions.undo();
  }

  onRedo() {
    buildingActions.redo();
  }

  onRotX() {
    buildingActions.rotX();
  }

  onRotY() {
    buildingActions.rotY();
  }

  onRotZ() {
    buildingActions.rotZ();
  }

  onFlipX() {
    buildingActions.flipX();
  }

  onFlipY() {
    buildingActions.flipY();
  }

  onFlipZ() {
    buildingActions.flipZ();
  }

  render() {

    return (
     <SavedDraggable saveName="building/actionbar" 
        defaultX={[0, Anchor.TO_START]} 
        defaultY={[-200, Anchor.TO_CENTER]} 
 >

      <div className='action-bar'>
        <header>
            <div className="dragHandle"></div>
        </header>
        <ul>

          <li onClick={() => this.onSelect() }>
            <ActionButton isActive={false}
              icon={'images/action-bar-select.png'} />
            {this.state.minimized ? null : <em>`</em>}
          </li>

          <li onClick={() => this.onComit()}>
            <ActionButton isActive={false}
              icon={this.props.buildingMode < 4 ? 'images/action-bar-add-block.png' : 'images/action-bar-del-block.png'} />
            {this.state.minimized ? null : <em>1</em>}
          </li>

          <li onClick={() => this.onUndo() } >
            <ActionButton isActive={false}
              icon={'images/action-bar-undo.png'} />
            {this.state.minimized ? null : <em>2</em>}
          </li>

          <li onClick={() => this.onRedo() } >
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
      </SavedDraggable>
    )
  }
}

export default connect(select)(ActionBar);

