/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Theme } from '../../themes/themeConstants';
import { AbilityGroup, ButtonLayout } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { Faction } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { AbilityBarSlot } from './AbilityBarSlot';
import { FactionDef } from '../../dataSources/manifest/factionManifest';

// Styles
const Root = 'HUD-AbilityBar-Root';
const GroupIcon = 'HUD-AbilityBar-GroupIcon';

interface ReactProps {
  layoutId: number;
  widgetId: string;
}

interface InjectedProps {
  layout: ButtonLayout;
  group: AbilityGroup;
  myFaction: FactionDef;
  currentTheme: Theme;
  selectedWidgetId: string;
  isShown: boolean;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBar extends React.Component<Props> {
  render(): React.ReactNode {
    // If this bar is selected in the HUDEditor, we will need to render it even if normally we wouldn't.
    const isSelectedInEditor = this.props.selectedWidgetId === this.props.widgetId;

    if (!isSelectedInEditor && !this.props.isShown) {
      return null;
    }

    // No need for dummy data in ability bars, since they have an anchor icon that will appear even if there
    // are no abilities set in the current abilityGroup.

    // We display a "group number" instead of the groupID so as not to confuse the user, since technically
    // you might have created groups 1, 2, and 3, then deleted group 1.
    const currentGroupNumber: number = this.props.layout.groupCycle.indexOf(this.props.layout.groupID) + 1;
    const buttonRadius: number = this.props.currentTheme.abilityButtons.display.radius;

    return (
      <div className={Root}>
        <img
          className={GroupIcon}
          draggable={false}
          style={{ width: `${buttonRadius * 2}vmin`, height: `${buttonRadius * 2}vmin` }}
          src={this.props.myFaction?.abilityBarDockImages[currentGroupNumber - 1]}
          onMouseDown={this.handleMouseDown.bind(this)}
          onWheel={this.handleWheel.bind(this)}
        />
        {this.props.group &&
          this.props.group.abilities.map((abilityId: number, slotIndex: number) => {
            return <AbilityBarSlot layoutId={this.props.layoutId} abilityId={abilityId} slotIndex={slotIndex} />;
          })}
      </div>
    );
  }

  private handleMouseDown(e: React.MouseEvent) {
    // Left mouse button only.
    if (e.button !== 0) return;

    // No need to cycle groups if there's only one!
    if (this.props.layout.groupCycle.length === 1) return;

    // The game client should respond to these requests by sending a new `ability.layoutUpdated` event,
    // which abilitiesDataSource will process and send to Redux.
    if (e.ctrlKey) {
      clientAPI.selectPrevAbilityLayoutGroup(this.props.layoutId);
    } else {
      clientAPI.selectNextAbilityLayoutGroup(this.props.layoutId);
    }
  }

  private handleWheel(e: React.WheelEvent) {
    // No need to cycle groups if there's only one!
    if (this.props.layout.groupCycle.length === 1) return;

    // The game client should respond to these requests by sending a new `ability.layoutUpdated` event,
    // which abilitiesDataSource will process and send to Redux.
    if (e.deltaY < 0) {
      clientAPI.selectPrevAbilityLayoutGroup(this.props.layoutId);
    } else {
      clientAPI.selectNextAbilityLayoutGroup(this.props.layoutId);
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentTheme } = state.themes;
  const { selectedWidgetId } = state.hud.editor;
  const layout = state.abilities ? state.abilities.layouts[ownProps.layoutId] : null;
  const group = state.abilities ? state.abilities.groups[layout.groupID] : null;
  const isShown = group ? group.abilities.length > 0 : false;

  return {
    ...ownProps,
    layout,
    group,
    myFaction: state.gameDefs.factions[Faction[state.player.faction]],
    currentTheme,
    selectedWidgetId,
    isShown
  };
}

export const AbilityBar = connect(mapStateToProps)(AAbilityBar);
