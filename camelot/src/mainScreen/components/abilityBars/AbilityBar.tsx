/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { AbilityGroup, ButtonLayout } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { AbilityBarSlot } from './AbilityBarSlot';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { isHighestActiveAbilityBar } from '../../helpers/abilityBarHelpers';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getFactionData } from '../../gameData/factionData';

// Styles
const Root = 'HUD-AbilityBar-Root';
const Pagination = 'HUD-AbilityBar-Pagination';
const PaginationLeft = 'HUD-AbilityBar-PaginationLeft';
const PaginationRight = 'HUD-AbilityBar-PaginationRight';
const PaginationUp = 'HUD-AbilityBar-PaginationUp';
const PaginationDown = 'HUD-AbilityBar-PaginationDown';
const PaginationNumber = 'HUD-AbilityBar-PaginationNumber';
const DecorationCenterTop = 'HUD-AbilityBar-DecorationCenterTop';
const DecorationCenterBottom = 'HUD-AbilityBar-DecorationCenterBottom';
const DecorationLeft = 'HUD-AbilityBar-DecorationLeft';
const DecorationRight = 'HUD-AbilityBar-DecorationRight';

interface ReactProps {
  isDragCopy: boolean;
  layoutId: number;
  widgetId: string;
}

interface InjectedProps {
  layout: ButtonLayout;
  group: AbilityGroup;
  uiFactionID: string;
  selectedWidgetID: string;
  selectedGroupMemberIDs: string[];
  isShown: boolean;
  allLayouts: Dictionary<ButtonLayout>;
  allGroups: Dictionary<AbilityGroup>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBar extends React.Component<Props> {
  render(): React.ReactNode {
    // If this bar is being edited in the HUDEditor — selected directly, or as a member of the active
    // group (e.g. the Ability Bars group) — we render it even if it normally wouldn't show.
    const isEditedInEditor =
      this.props.selectedWidgetID === this.props.widgetId ||
      this.props.selectedGroupMemberIDs.includes(this.props.widgetId);

    if (!isEditedInEditor && !this.props.isShown) {
      return null;
    }
    const currentGroupNumber: number = this.props.layout.groupCycle.indexOf(this.props.layout.groupID) + 1;

    const paginationContents = (
      <>
        <svg
          className={PaginationUp}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 320 512'
          onClick={this.cycleUp.bind(this)}
        >
          <path
            fill='white'
            d='M182.6 137.4c-12.5-12.5-32.8-12.5-45.3 0l-128 128c-9.2 9.2-11.9 22.9-6.9 34.9s16.6 19.8 29.6 19.8H288c12.9 0 24.6-7.8 29.6-19.8s2.2-25.7-6.9-34.9l-128-128z'
          />
        </svg>
        <div className={PaginationNumber}>{currentGroupNumber}</div>
        <svg
          className={PaginationDown}
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 320 512'
          onClick={this.cycleDown.bind(this)}
        >
          <path
            fill='white'
            d='M137.4 374.6c12.5 12.5 32.8 12.5 45.3 0l128-128c9.2-9.2 11.9-22.9 6.9-34.9s-16.6-19.8-29.6-19.8L32 192c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9l128 128z'
          />
        </svg>
      </>
    );

    const factionData = getFactionData(this.props.uiFactionID);

    return (
      <div className={Root}>
        {this.props.group && (
          <>
            {isHighestActiveAbilityBar(this.props.layoutId, this.props.allLayouts, this.props.allGroups) === true && (
              <img className={DecorationCenterTop} src={factionData.abilityBarCenterDecorTopImage} />
            )}
            {this.props.layoutId <= 1 && (
              <img className={DecorationCenterBottom} src={factionData.abilityBarCenterDecorBottomImage} />
            )}
            <img
              className={DecorationLeft}
              src={this.props.layoutId <= 1 ? factionData.abilityBarLeftImage : factionData.abilityBarLeftBlankImage}
            />
            <img
              className={DecorationRight}
              src={this.props.layoutId <= 1 ? factionData.abilityBarRightImage : factionData.abilityBarRightBlankImage}
            />
            {this.props.group.abilities.map((abilityId: number, slotIndex: number) => {
              return (
                <AbilityBarSlot
                  layoutId={this.props.layoutId}
                  abilityId={abilityId}
                  slotIndex={slotIndex}
                  key={slotIndex}
                />
              );
            })}
            {this.props.layout.groupCycle.length > 1 && (
              <>
                <div className={`${Pagination} ${PaginationLeft}`} onWheel={this.handleWheel.bind(this)}>
                  {paginationContents}
                </div>
                <div className={`${Pagination} ${PaginationRight}`} onWheel={this.handleWheel.bind(this)}>
                  {paginationContents}
                </div>
              </>
            )}
          </>
        )}
      </div>
    );
  }

  private cycleUp(): void {
    clientAPI.selectNextAbilityLayoutGroup(this.props.layoutId);
  }

  private cycleDown(): void {
    clientAPI.selectPrevAbilityLayoutGroup(this.props.layoutId);
  }

  private handleWheel(e: React.WheelEvent) {
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
  const { selectedWidgetID, selectedGroupMemberIDs } = state.hud.editor;
  const layout = state.abilities ? state.abilities.layouts[ownProps.layoutId] : null;
  const group = state.abilities ? state.abilities.groups[layout.groupID] : null;
  const isShown = group ? group.abilities.length > 0 : false;
  const allLayouts = state.abilities ? state.abilities.layouts : null;
  const allGroups = state.abilities ? state.abilities.groups : null;
  return {
    ...ownProps,
    layout,
    group,
    uiFactionID: state.hud.uiFactionID,
    selectedWidgetID,
    selectedGroupMemberIDs,
    isShown,
    allLayouts,
    allGroups
  };
}

export const AbilityBar = connect(mapStateToProps)(AAbilityBar);
