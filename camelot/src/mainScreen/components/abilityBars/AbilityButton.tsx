/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AbilityWithActivation } from '../../redux/abilitiesSlice';
import { RootState } from '../../redux/store';
import Draggable from '../Draggable';
import TooltipSource from '../TooltipSource';
import { AbilityStateFlags, ButtonLayout, AbilityGroup } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import DraggableHandle from '../DraggableHandle';
import { AbilityDisplayDef } from '../../dataSources/manifest/abilityDisplayManifest';
import { AbilityBarSlotDropTargetData } from './AbilityBarSlot';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { CooldownOverlay } from './CooldownOverlay';
import { AbilityTooltip } from './AbilityTooltip';

// Styles
const Root = 'HUD-AbilityButton-Root';
const Border = 'HUD-AbilityButton-Border';
const BorderQueued = 'HUD-AbilityButton-BorderQueued';
const DraggableContainer = 'HUD-AbilityButton-DraggableContainer';
const Handle = 'HUD-AbilityButton-DraggableHandle';
const DraggingContainer = 'HUD-AbilityButton-DraggingContainer';
const Icon = 'HUD-AbilityButton-Icon';
const KeybindInfo = 'HUD-AbilityButton-KeybindInfo';
const OverlayUnusable = 'HUD-AbilityButton-OverlayUnusable';
const OverlayError = 'HUD-AbilityButton-OverlayError';
const OverlayActive = 'HUD-AbilityButton-OverlayActive';
const OverlayActiveVisible = 'HUD-AbilityButton-OverlayActiveVisible';
const FaithRim = 'HUD-AbilityButton-FaithRim';
const JudgmentRim = 'HUD-AbilityButton-JudgmentRim';
const CourageRim = 'HUD-AbilityButton-CourageRim';

export const DropTypeAbilityButton = 'abilityButton';

interface ReactProps {
  layoutID: number;
  abilityID: number;
  slotIndex: number;
}

interface InjectedProps {
  abilityStatus: AbilityWithActivation;
  layout: ButtonLayout;
  groups: Dictionary<AbilityGroup>;
  group: AbilityGroup;
  inEditMode: boolean;
  displayData: AbilityDisplayDef;
  keybinds: Dictionary<Keybind>;
}

type Props = ReactProps & InjectedProps;

class AAbilityButton extends React.Component<Props> {
  render(): React.ReactNode {
    // If no ability is assigned, then we dont' have to render anything.
    if (!this.props.abilityStatus) {
      return null;
    }

    return (
      <TooltipSource
        className={Root}
        tooltipID={`TooltipL:${this.props.layoutID},S:${this.props.slotIndex}`}
        content={() => <AbilityTooltip abilityID={this.props.abilityID} />}
        positionType='mouse'
      >
        <Draggable
          className={DraggableContainer}
          draggableID={this.getDraggableID()}
          onClick={this.onClick.bind(this)}
          draggingRender={() => <div className={DraggingContainer}>{this.renderButtonContents()}</div>}
        >
          {this.renderButtonContents()}
          {this.props.inEditMode && (
            <DraggableHandle
              draggableID={this.getDraggableID()}
              className={Handle}
              dropHandler={this.onAbilityDropped.bind(this)}
              dropType={DropTypeAbilityButton}
            />
          )}
        </Draggable>
      </TooltipSource>
    );
  }

  private renderButtonContents(): React.ReactNode {
    const keybindText: string =
      this.props.keybinds[this.props.layout.keybindBegin + this.props.slotIndex]?.binds[0]?.name;

    const queued = (this.props.abilityStatus.state & AbilityStateFlags.Queued) !== 0;
    const unusable = (this.props.abilityStatus.state & AbilityStateFlags.Unusable) !== 0;
    const running = (this.props.abilityStatus.state & AbilityStateFlags.Running) !== 0;
    const recovery = (this.props.abilityStatus.state & AbilityStateFlags.Recovery) !== 0;

    const hasActiveEffect = running && !recovery;

    const usesFaith = (this.props.abilityStatus?.stats?.['Cost.Faith'] ?? 0) > 0;

    const judgmentCost = this.props.abilityStatus?.stats?.['Cost.Judgment'] ?? 0;
    const usesJudgment = judgmentCost > 0;

    const courageCost = this.props.abilityStatus?.stats?.['Cost.Courage'] ?? 0;
    const usesCourage = courageCost > 0;

    return (
      <>
        <img className={Icon} src={this.props.displayData?.iconURL} />
        {usesFaith && <div className={FaithRim} />}
        {usesJudgment && <div className={JudgmentRim} />}
        {usesCourage && <div className={CourageRim} />}
        {unusable && <div className={OverlayUnusable} />}
        {!unusable && !!this.props.abilityStatus.errors && <div className={OverlayError} />}
        <CooldownOverlay abilityID={this.props.abilityID} />
        {keybindText && <div className={KeybindInfo}>{keybindText}</div>}
        {!hasActiveEffect && <div className={queued ? `${Border} ${BorderQueued}` : Border} />}
        <div className={hasActiveEffect ? `${OverlayActive} ${OverlayActiveVisible}` : OverlayActive} />
      </>
    );
  }

  private onAbilityDropped(dropData: AbilityBarSlotDropTargetData | null): void {
    if (!dropData) {
      // Abilities from system bars cannot be removed (as there's no way to add them back!).
      if (this.props.group.isSystem) {
        clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
        return;
      }
      // The ability was dropped away from any ability bar, so we should remove it from this slot.
      clientAPI.clearAbility(this.props.group.id, this.props.slotIndex);
      clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
    } else {
      const { groupID, slotIndex } = dropData;
      const newGroup = this.props.groups[groupID];

      // Abilities in system bars can only be swapped inside that same bar.
      if (this.props.group.isSystem && groupID !== this.props.group.id) {
        clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
        return;
      }
      // Abilities in non-system bars cannot be swapped into system bars.
      if (this.props.group.isSystem !== newGroup.isSystem) {
        clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_BAD_DROP);
        return;
      }

      if (groupID !== this.props.group.id || slotIndex !== this.props.slotIndex) {
        // We dropped this ability on a different slot, so we should swap the two.
        clientAPI.setAbility(groupID, slotIndex, this.props.abilityID);
        clientAPI.setAbility(this.props.group.id, this.props.slotIndex, newGroup.abilities[slotIndex]);
        clientAPI.playGameSound(SoundEvents.PLAY_UI_ABILITY_RELEASE);
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
    return `DraggableL:${this.props.layoutID},S:${this.props.slotIndex}`;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const layout = state.abilities.layouts[ownProps.layoutID];
  const { groups } = state.abilities;
  const group = groups[layout.groupID];
  const abilityStatus = state.abilities.abilities[ownProps.abilityID];
  const displayData = state.gameDefs.abilityDisplayDefsByNumericID[abilityStatus?.displayDefID];

  return {
    ...ownProps,
    layout,
    groups,
    group,
    inEditMode: state.abilities.editStatus.canEdit,
    displayData,
    abilityStatus,
    keybinds: state.keybinds
  };
}

export const AbilityButton = connect(mapStateToProps)(AAbilityButton);
