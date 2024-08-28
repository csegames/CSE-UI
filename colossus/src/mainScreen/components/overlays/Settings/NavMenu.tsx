/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { Header } from '../../shared/Header';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';

const Container = 'Settings-NavMenu-Container';

const ButtonIcon = 'Settings-NavMenu-ButtonIcon';

const StrigIDSettingsMenu = 'SettingsMenu';

export enum SettingsRoute {
  Keybinds,
  Input,
  Audio,
  Graphics,
  Miscellaneous
}

interface ReactProps {
  selectedRoute: SettingsRoute;
  onSelectRoute: (route: SettingsRoute) => void;
}

interface InjectedProps {
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class ANavMenu extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    return (
      <div className={Container}>
        {this.props.usingGamepad && this.props.usingGamepadInMainMenu && <div className={`${ButtonIcon} icon-xb-lb`} />}
        {this.renderRouteButton(SettingsRoute.Keybinds)}
        {this.renderRouteButton(SettingsRoute.Input)}
        {this.renderRouteButton(SettingsRoute.Audio)}
        {this.renderRouteButton(SettingsRoute.Graphics)}
        {this.renderRouteButton(SettingsRoute.Miscellaneous)}
        {this.props.usingGamepad && this.props.usingGamepadInMainMenu && <div className={`${ButtonIcon} icon-xb-rb`} />}
      </div>
    );
  }

  private onClick(route: SettingsRoute): void {
    this.props.onSelectRoute(route);
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_CLICK);
  }

  private onMouseEnter(): void {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
  }

  private renderRouteButton(route: SettingsRoute, extraJSX?: JSX.Element | JSX.Element[]): JSX.Element {
    const isSelected = this.props.selectedRoute === route;
    return (
      <Header isSelected={isSelected} onClick={() => this.onClick(route)} onMouseEnter={this.onMouseEnter.bind(this)}>
        {toTitleCase(getStringTableValue(StrigIDSettingsMenu + SettingsRoute[route], this.props.stringTable))}
        {extraJSX || ''}
      </Header>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    usingGamepad,
    usingGamepadInMainMenu,
    stringTable
  };
}

export const NavMenu = connect(mapStateToProps)(ANavMenu);
