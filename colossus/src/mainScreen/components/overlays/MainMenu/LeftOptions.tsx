/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';

import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { LifecyclePhase, Overlay, showOverlay } from '../../../redux/navigationSlice';
import { Group, Queue } from '@csegames/library/dist/hordetest/graphql/schema';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { Dictionary } from '@reduxjs/toolkit';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';

const Container = 'MenuModal-LeftOptions-Container';
const MenuTitle = 'MenuModal-LeftOptions-MenuTitle';

const Item = 'MenuModal-LeftOptions-Item';

const StringIDMainMenuLeftTitle = 'MainMenuLeftTitle';
const StringIDMainMenuLeftSettings = 'MainMenuLeftSettings';
const StringIDMainMenuLeftExit = 'MainMenuLeftExit';
const StringIDMainMenuLeftChangeDisplayName = 'MainMenuLeftChangeDisplayName';
const StringIDMainMenuLeftCredits = 'MainMenuLeftCredits';

interface ReactProps {}

interface InjectedProps {
  group: Group;
  lifecyclePhase: LifecyclePhase;
  stringTable: Dictionary<StringTableEntryDef>;
  queues: Queue[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ALeftOptions extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Container}>
        <div className={MenuTitle}>{getStringTableValue(StringIDMainMenuLeftTitle, this.props.stringTable)}</div>
        <div className={Item} onClick={this.onSettingsClick.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)}>
          {getStringTableValue(StringIDMainMenuLeftSettings, this.props.stringTable)}
        </div>
        {this.renderChangeNameOption()}
        {this.renderCreditsOption()}
        {this.renderDebugOption()}
        <div
          className={`${Item} exit`}
          onClick={this.onExitClick.bind(this)}
          onMouseEnter={this.onMouseEnter.bind(this)}
        >
          {getStringTableValue(StringIDMainMenuLeftExit, this.props.stringTable)}
        </div>
      </div>
    );
  }

  private onSettingsClick(): void {
    this.props.dispatch(showOverlay(Overlay.Settings));
  }

  private onExitClick(): void {
    game.quit();
  }

  private showChangeDisplayName(): void {
    this.props.dispatch(showOverlay(Overlay.SetDisplayName));
  }

  private showCreditsScreen(): void {
    this.props.dispatch(showOverlay(Overlay.Credits));
  }

  private showDebugMenu(): void {
    this.props.dispatch(showOverlay(Overlay.Debug));
  }

  private onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
  }

  private renderChangeNameOption() {
    if (this.props.lifecyclePhase !== LifecyclePhase.Lobby) {
      return;
    }
    return (
      <div className={Item} onClick={this.showChangeDisplayName.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)}>
        {getStringTableValue(StringIDMainMenuLeftChangeDisplayName, this.props.stringTable)}
      </div>
    );
  }

  private renderCreditsOption() {
    if (this.props.lifecyclePhase !== LifecyclePhase.Lobby) {
      return;
    }
    return (
      <div className={Item} onClick={this.showCreditsScreen.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)}>
        {getStringTableValue(StringIDMainMenuLeftCredits, this.props.stringTable)}
      </div>
    );
  }

  private renderDebugOption(): React.ReactNode {
    // No Debug menu for the public.
    if (game.isPublicBuild) {
      return null;
    }
    return (
      <div className={Item} onClick={this.showDebugMenu.bind(this)} onMouseEnter={this.onMouseEnter.bind(this)}>
        {'DEBUG'}
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { group } = state.teamJoin;
  const { lifecyclePhase } = state.navigation;
  const { stringTable } = state.stringTable;
  const { queues } = state.match;

  return {
    ...ownProps,
    group,
    lifecyclePhase,
    stringTable,
    queues
  };
}

export const LeftOptions = connect(mapStateToProps)(ALeftOptions);
