/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { Ability } from '../../redux/abilitiesSlice';
import { AbilityDisplayData } from '../../redux/gameDefsSlice';
import { RootState } from '../../redux/store';
import { Theme } from '../../themes/themeConstants';
import Draggable from '../Draggable';
import TooltipSource from '../TooltipSource';
import {
  AbilityStateFlags,
  AbilityErrorFlags,
  ButtonLayout,
  AbilityGroup
} from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { InnerRing } from './InnerRing';
import { OuterRing } from './OuterRing';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import DraggableHandle from '../DraggableHandle';

// Styles
const Root = 'HUD-AbilityButton-Root';
const Handle = 'HUD-AbilityButton-DraggableHandle';
const TooltipWrapper = 'HUD-AbilityButton-TooltipWrapper';
const TooltipTitle = 'HUD-AbilityButton-TooltipTitle';
const TooltipDescription = 'HUD-AbilityButton-TooltipDescription';
const Icon = 'HUD-AbilityButton-Icon';
const OverlayShadow = 'HUD-AbilityButton-OverlayShadow';
const KeybindInfo = 'HUD-AbilityButton-KeybindInfo';
const QueuedTick = 'HUD-AbilityButton-QueuedTick';
const OverlayUnusable = 'HUD-AbilityButton-OverlayUnusable';
const OverlayNoWeapon = 'HUD-AbilityButton-OverlayNoWeapon';
const OverlayNoAmmo = 'HUD-AbilityButton-OverlayNoAmmo';

export const DropTypeAbilityButton = 'abilityButton';

interface ReactProps {
  layoutId: number;
  abilityId: number;
  slotIndex: number;
}

interface InjectedProps {
  abilityStatus: Ability;
  layout: ButtonLayout;
  groups: Dictionary<AbilityGroup>;
  group: AbilityGroup;
  currentTheme: Theme;
  inEditMode: boolean;
  displayData: AbilityDisplayData;
  keybinds: Dictionary<Keybind>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityButton extends React.Component<Props> {
  render(): React.ReactNode {
    return (
      <TooltipSource className={Root} tooltipParams={{ id: 'AbilityButton', content: this.renderTooltip.bind(this) }}>
        <Draggable className={Root} draggableID={this.getDraggableID()} onClick={this.onClick.bind(this)}>
          {this.renderButtonContents()}
          {this.props.inEditMode && (
            <DraggableHandle
              draggableID={this.getDraggableID()}
              draggingRender={this.renderButtonContents.bind(this)}
              className={Handle}
              dropHandler={this.onAbilityDropped.bind(this)}
              dropType={DropTypeAbilityButton}
            ></DraggableHandle>
          )}
        </Draggable>
      </TooltipSource>
    );
  }

  private renderButtonContents(): React.ReactNode {
    // If no ability is assigned, then we dont' have to render anything.
    if (!this.props.abilityStatus) {
      return null;
    }

    const queued = (this.props.abilityStatus.state & AbilityStateFlags.Queued) !== 0;
    const unusable = (this.props.abilityStatus.state & AbilityStateFlags.Unusable) !== 0;
    const noWeapon = (this.props.abilityStatus.errors & AbilityErrorFlags.NoWeapon) !== 0;
    const noAmmo = (this.props.abilityStatus.errors & AbilityErrorFlags.NoAmmo) !== 0;
    const keybindText: string =
      this.props.keybinds[this.props.layout.keybindBegin + this.props.slotIndex]?.binds[0]?.name ?? '???';

    return (
      <>
        <img className={Icon} src={this.props.displayData?.icon} />
        <div className={OverlayShadow} />
        <div className={KeybindInfo}>{keybindText}</div>
        <InnerRing abilityStatus={this.props.abilityStatus} />
        <OuterRing abilityStatus={this.props.abilityStatus} />
        {queued && <div className={QueuedTick} />}
        {unusable && <div className={OverlayUnusable} />}
        {noWeapon && <div className={OverlayNoWeapon} />}
        {noAmmo && <div className={OverlayNoAmmo} />}
      </>
    );
  }

  private onAbilityDropped(dropTargetId: string): void {
    if (!dropTargetId || dropTargetId.length === 0) {
      // Abilities from system bars cannot be removed (as there's no way to add them back!).
      if (this.props.group.isSystem) {
        return;
      }
      // The ability was dropped away from any ability bar, so we should remove it from this slot.
      clientAPI.clearAbility(this.props.group.id, this.props.slotIndex);
    } else {
      const ids = dropTargetId.split(':');
      const newGroupId = +ids[0];
      const newSlotIndex = +ids[1];
      const newGroup = this.props.groups[newGroupId];

      // Abilities in system bars can only be swapped inside that same bar.
      if (this.props.group.isSystem && newGroupId !== this.props.group.id) {
        return;
      }
      // Abilities in non-system bars cannot be swapped into system bars.
      if (this.props.group.isSystem !== newGroup.isSystem) {
        return;
      }

      if (newGroupId !== this.props.group.id || newSlotIndex !== this.props.slotIndex) {
        // We dropped this ability on a different slot, so we should swap the two.
        clientAPI.setAbility(newGroupId, newSlotIndex, this.props.abilityId);
        clientAPI.setAbility(this.props.group.id, this.props.slotIndex, newGroup.abilities[newSlotIndex]);
      }
    }
  }

  private onClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button === 0) {
      // During edit mode, we only want to drag abilities around, not trigger them.
      if (this.props.inEditMode) {
        return;
      }

      clientAPI.executeAbility(this.props.group.id, this.props.slotIndex);
    }
  }

  private getDraggableID(): string {
    return `DraggableL:${this.props.layoutId},S:${this.props.slotIndex}`;
  }

  private renderTooltip(): React.ReactNode {
    const title = this.props.displayData?.name ?? 'Failed to retrieve data from API server';
    const description = this.props.displayData?.description ?? '';

    return (
      <div className={TooltipWrapper}>
        <div className={TooltipTitle}>{title}</div>
        <div className={TooltipDescription}>{description}</div>
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const layout = state.abilities.layouts[ownProps.layoutId];
  const { groups } = state.abilities;
  const group = groups[layout.groupID];
  const { currentTheme } = state.themes;
  const displayData = state.gameDefs.abilityDisplayData[ownProps.abilityId];
  const abilityStatus = state.abilities.abilities[ownProps.abilityId];
  return {
    ...ownProps,
    layout,
    groups,
    group,
    currentTheme,
    inEditMode: state.abilities.editStatus.canEdit,
    displayData,
    abilityStatus,
    keybinds: state.keybinds
  };
}

export const AbilityButton = connect(mapStateToProps)(AAbilityButton);
