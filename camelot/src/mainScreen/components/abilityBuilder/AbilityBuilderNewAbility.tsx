/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { AbilityDisplayData, AbilityNetworkDefData } from '../../redux/gameDefsSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import TooltipSource from '../TooltipSource';
import Draggable from '../Draggable';
import DraggableHandle from '../DraggableHandle';
import { DropTypeAbilityButton } from '../abilityBars/AbilityButton';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { AbilityEditStatus, AbilityGroup } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { AbilityBarSlotDropTargetData } from '../abilityBars/AbilityBarSlot';

const SaveButtonText = 'HUD-AbilityBuilderCreate-SaveButtonText';
const CreatedRoot = 'HUD-AbilityBuilderCreate-CreatedRoot';
const CreatedContentRoot = 'HUD-AbilityBuilderCreate-CreatedContentRoot';
const CreatedBanner = 'HUD-AbilityBuilderCreate-CreatedBanner';
const CreatedBannerBackground = 'HUD-AbilityBuilderCreate-CreatedBannerBackground';
const CreatedBannerText = 'HUD-AbilityBuilderCreate-CreatedBannerText';
const CreatedAbilityContainer = 'HUD-AbilityBuilderCreate-CreatedAbilityContainer';
const CreatedInstructions = 'HUD-AbilityBuilderCreate-CreatedInstructions';
const TooltipRoot = 'HUD-AbilityBookPage-TooltipRoot';
const TooltipHeader = 'HUD-AbilityBookPage-TooltipHeader';
const TooltipDescription = 'HUD-AbilityBookPage-TooltipDescription';
const AbilityCellIcon = 'HUD-AbilityBookPage-AbilityCellIcon';
const ResetButton = 'HUD-AbilityBuilderCreate-ResetButton';
const ResetButtonBackground = 'HUD-AbilityBuilderCreate-ResetButtonBackground';
const NewAbility = 'HUD-AbilityBuilderCreate-NewAbility';
const FlareOne = 'HUD-AbilityBuilderCreate-NewAbilityFlareOne';
const FlareTwo = 'HUD-AbilityBuilderCreate-NewAbilityFlareTwo';

interface State {
  displayedAbilityId: number | null;
  displayedAbilityType: string;
}

interface ReactProps {
  selectedAbilityType: string;
  newAbilityId: number | null;
  onReset: () => void;
}

interface InjectedProps {
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  abilityDisplayData: Dictionary<AbilityDisplayData>;
  editStatus: AbilityEditStatus;
  groups: Dictionary<AbilityGroup>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBuilderNewAbility extends React.Component<Props, State> {
  private wasInEditMode: boolean = false;

  constructor(props: Props) {
    super(props);

    this.state = {
      displayedAbilityId: props.newAbilityId,
      displayedAbilityType: props.selectedAbilityType
    };
  }

  render(): React.ReactNode {
    // If there's no new ability, then there's no need to render anything!
    if (!this.props.abilityDisplayData[this.state.displayedAbilityId]) return null;

    const abilityNetwork = this.props.abilityNetworks[this.state.displayedAbilityType];
    const draggableId = `NewAbility${this.state.displayedAbilityId}`;
    const hueRotation = `hue-rotate(${abilityNetwork?.AbilityBuilderHueRotation ?? '0deg'})`;
    return (
      <div className={CreatedRoot}>
        <div className={CreatedContentRoot}>
          <div className={CreatedBanner} style={{ filter: `${hueRotation} drop-shadow(0 0 0.5vmin gray)` }}>
            <div className={CreatedBannerBackground} />
            <div className={CreatedBannerText}>{'Success!'}</div>
          </div>
          <div className={CreatedAbilityContainer}>
            <div className={FlareOne} />
            <div className={FlareTwo} />
            <TooltipSource
              className={NewAbility}
              tooltipParams={{
                id: `abilityCell${this.state.displayedAbilityId}`,
                content: this.renderNewAbilityTooltip.bind(this)
              }}
            >
              <Draggable draggableID={draggableId}>
                <DraggableHandle
                  draggableID={draggableId}
                  draggingRender={this.renderNewAbilityIcon.bind(this)}
                  dragStartHandler={this.onAbilityDragStart.bind(this)}
                  dropHandler={this.onAbilityDropped.bind(this)}
                  dropType={DropTypeAbilityButton}
                >
                  {this.renderNewAbilityIcon()}
                </DraggableHandle>
              </Draggable>
            </TooltipSource>
          </div>
          <div className={CreatedInstructions} style={{ filter: hueRotation }}>{`${
            this.props.abilityDisplayData[this.state.displayedAbilityId].name
          } is ready for use.  You can drag it onto your ability bars now, or you can find it in your Ability Book later.`}</div>
          <div className={ResetButton} onClick={this.onResetClicked.bind(this)}>
            <div className={ResetButtonBackground} style={{ filter: `${hueRotation} drop-shadow(0 0 0.5vmin gray)` }} />
            <div className={SaveButtonText} style={{ filter: hueRotation }}>
              {'Create Another'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    // Keep the old "new" ability to display until we replace it.
    if (this.props.newAbilityId !== null && this.state.displayedAbilityId !== this.props.newAbilityId) {
      this.setState({ displayedAbilityId: this.props.newAbilityId });
    }

    // Keep the old ability type to display until we replace it.
    if (
      this.props.selectedAbilityType.length > 0 &&
      this.state.displayedAbilityType !== this.props.selectedAbilityType
    ) {
      this.setState({ displayedAbilityType: this.props.selectedAbilityType });
    }
  }

  private renderNewAbilityTooltip(): React.ReactNode {
    const ability = this.props.abilityDisplayData[this.state.displayedAbilityId];
    return (
      <div className={TooltipRoot}>
        <div className={TooltipHeader}>{ability.name}</div>
        <div className={TooltipDescription}>{ability.description}</div>
      </div>
    );
  }

  private renderNewAbilityIcon(): React.ReactNode {
    const ability = this.props.abilityDisplayData[this.state.displayedAbilityId];
    return <img className={AbilityCellIcon} src={ability.icon} />;
  }

  private onResetClicked(): void {
    this.props.onReset();
  }

  private onAbilityDragStart(): void {
    // Track previous edit status so we don't stomp it if the user was already editing the UI.
    this.wasInEditMode = this.props.editStatus.canEdit || this.props.editStatus.requestedCanEdit;

    if (!this.wasInEditMode) {
      // When the user starts dragging an ability, turn on edit mode so the client doesn't reject updates.
      clientAPI.requestEditMode(true);
    }
  }

  private onAbilityDropped(data: AbilityBarSlotDropTargetData): void {
    if (!this.wasInEditMode) {
      // When the user drops an ability, revert to the previous edit status.
      clientAPI.requestEditMode(false);
    }

    // Do nothing if we didn't drop onto an ability slot.
    if (!data) {
      return;
    }

    const group = this.props.groups[data.groupID];

    // Not allowed to muck up system bars, and possibly some others.
    if (group.isSystem || !group.canReplace) {
      return;
    }

    // Nothing else is in the way, so let's set the ability!
    clientAPI.setAbility(data.groupID, data.slotIndex, +this.state.displayedAbilityId);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityNetworks, abilityDisplayData } = state.gameDefs;
  const { editStatus, groups } = state.abilities;
  return {
    ...ownProps,
    abilityNetworks,
    abilityDisplayData,
    editStatus,
    groups
  };
};

export const AbilityBuilderNewAbility = connect(mapStateToProps)(AAbilityBuilderNewAbility);
