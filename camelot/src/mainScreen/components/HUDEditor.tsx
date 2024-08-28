/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import {
  HUDWidget,
  resetAllWidgets,
  resetWidget,
  setSelectedWidget,
  unregisterWidget,
  updateWidgetStates
} from '../redux/hudSlice';
import { RootState } from '../redux/store';

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import AnchorTopLeftURL from '../../images/hudeditor/anchor-topleft.png';
import AnchorTopURL from '../../images/hudeditor/anchor-top.png';
import AnchorTopRightURL from '../../images/hudeditor/anchor-topright.png';
import AnchorLeftURL from '../../images/hudeditor/anchor-left.png';
import AnchorCenterURL from '../../images/hudeditor/anchor-center.png';
import AnchorRightURL from '../../images/hudeditor/anchor-right.png';
import AnchorBottomLeftURL from '../../images/hudeditor/anchor-bottomleft.png';
import AnchorBottomURL from '../../images/hudeditor/anchor-bottom.png';
import AnchorBottomRightURL from '../../images/hudeditor/anchor-bottomright.png';
import AnchorSelectedTopLeftURL from '../../images/hudeditor/anchor-selected-topleft.png';
import AnchorSelectedTopURL from '../../images/hudeditor/anchor-selected-top.png';
import AnchorSelectedTopRightURL from '../../images/hudeditor/anchor-selected-topright.png';
import AnchorSelectedLeftURL from '../../images/hudeditor/anchor-selected-left.png';
import AnchorSelectedCenterURL from '../../images/hudeditor/anchor-selected-center.png';
import AnchorSelectedRightURL from '../../images/hudeditor/anchor-selected-right.png';
import AnchorSelectedBottomLeftURL from '../../images/hudeditor/anchor-selected-bottomleft.png';
import AnchorSelectedBottomURL from '../../images/hudeditor/anchor-selected-bottom.png';
import AnchorSelectedBottomRightURL from '../../images/hudeditor/anchor-selected-bottomright.png';
import ArrowDownURL from '../../images/hudeditor/arrow-down.png';
import ArrowLeftURL from '../../images/hudeditor/arrow-left.png';
import ArrowRightURL from '../../images/hudeditor/arrow-right.png';
import ArrowUpURL from '../../images/hudeditor/arrow-up.png';
import EyeURL from '../../images/icons/eye.png';
import EyeSlashURL from '../../images/icons/eye-slash.png';
import LightbulbURL from '../../images/icons/lightbulb.png';
import MagnifyingGlassURL from '../../images/icons/magnifying-glass.png';
import MinusURL from '../../images/icons/minus.png';
import PlusURL from '../../images/icons/plus.png';
import ResetURL from '../../images/icons/reset.png';
import Draggable from './Draggable';
import DraggableHandle, { DropHandlerDraggableData } from './DraggableHandle';
import TooltipSource from './TooltipSource';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { hideModal, showModal } from '../redux/modalsSlice';
import { AbilityEditStatus, AbilityGroup, ButtonLayout } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import Escapable from './Escapable';
import {
  HUDHorizontalAnchor,
  HUDVerticalAnchor,
  HUDWidgetState
} from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

// Styles.
const Root = 'HUD-HUDEditor-Root';
const Contents = 'HUD-HUDEditor-Contents';
const ActionButton = 'HUD-HUDEditor-ActionButton';
const Header = 'HUD-HUDEditor-Header';
const HeaderText = 'HUD-HUDEditor-HeaderText';
const ResetAllButton = 'HUD-HUDEditor-ResetAllButton';
const ListContainer = 'HUD-HUDEditor-ListContainer';
const ListItem = 'HUD-HUDEditor-ListItem';
const ListItemName = 'HUD-HUDEditor-ListItem-Name';
const Footer = 'HUD-HUDEditor-Footer';
const SelectedWidgetName = 'HUD-HUDEditor-SelectedWidgetName';
const ToolbarRow = 'HUD-HUDEditor-ToolbarRow';
const ToolbarItem = 'HUD-HUDEditor-ToolbarItem';
const ToolbarIcon = 'HUD-HUDEditor-ToolbarIcon';
const ToolbarControls = 'HUD-HUDEditor-ToolbarItemControls';
const ToolbarButton = 'HUD-HUDEditor-ToolbarItemControls-Button';
const ToolbarText = 'HUD-HUDEditor-ToolbarItemControls-Text';
const MovementContainer = 'HUD-HUDEditor-MovementControls-Container';
const MovementUp = 'HUD-HUDEditor-MovementControls-Up';
const MovementDown = 'HUD-HUDEditor-MovementControls-Down';
const MovementLeft = 'HUD-HUDEditor-MovementControls-Left';
const MovementRight = 'HUD-HUDEditor-MovementControls-Right';
const AnchorContainer = 'HUD-HUDEditor-AnchorControls-Container';
const AnchorButton = 'HUD-HUDEditor-AnchorControls-Button';
const ControlHeaderText = 'HUD-HUDEditor-ControlHeaderText';
const Scroller = 'Scroller-ThumbOnly';
const AddAbilityBarsSection = 'HUD-HUDEditor-AddAbilityBarsSection';
const AddAbilityBarsSectionLabel = 'HUD-HUDEditor-AddAbilityBarsSection-Label';
const AbilityBarSection = 'HUD-HUDEditor-AbilityBarSection';
const AbilityBarSectionRow = 'HUD-HUDEditor-AbilityBarSection-Row';
const AbilityBarSectionButtonRow = 'HUD-HUDEditor-AbilityBarSection-ButtonRow';
const AbilityBarSectionLabel = 'HUD-HUDEditor-AbilityBarSection-Label';
const PlusMinusButton = 'HUD-HUDEditor-AbilityBarSection-PlusMinusButton';

const FirstButtonRepeatTimeoutMS = 400;
const ButtonRepeatTimeoutMS = 80;

const DraggableID = 'HUDEditor';

interface ReactProps {}

interface InjectedProps {
  hudWidth: number;
  hudHeight: number;
  widgets: Dictionary<HUDWidget>;
  selectedWidgetID: string;
  selectedWidgetBounds: DOMRect;
  editStatus: AbilityEditStatus;
  layouts: Dictionary<ButtonLayout>;
  groups: Dictionary<AbilityGroup>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  offset: [number, number];
}

class HUDEditor extends React.Component<Props, State> {
  private buttonHeldHandle: number;
  private isApplyingChanges = false;

  constructor(props: Props) {
    super(props);
    this.state = { offset: clientAPI.getHUDEditorOffset() };
  }

  render(): JSX.Element {
    // Having renderDraggableContents as a separate function makes it very easy to use as the `draggingRender` param later.
    return (
      <Draggable
        className={Root}
        draggableID={DraggableID}
        style={{ transform: `translate(${this.state.offset[0]}vmin,${this.state.offset[1]}vmin)` }}
      >
        <Escapable
          escapeID={'closeHUDEditor'}
          onEscape={() => {
            clientAPI.requestEditMode(false);
          }}
        />
        {this.renderDraggableContents()}
      </Draggable>
    );
  }

  private renderDraggableContents(): JSX.Element {
    // The -2 is to account for Siege and BuildMode (system bars).
    const numBars =
      Object.keys(this.props.widgets).filter((widgetName) => {
        return this.props.widgets[widgetName].registration && widgetName.startsWith('Bar:');
      }).length - 2;

    const addLayoutDisabledClass = this.props.editStatus.canAddButtons ? '' : 'disabled';

    return (
      <div className={Contents}>
        <DraggableHandle
          className={Header}
          draggableID={DraggableID}
          draggingRender={this.renderDraggableContents.bind(this)}
          dropHandler={this.handleDragEnded.bind(this)}
        >
          <div className={HeaderText}>HUD Widgets</div>
        </DraggableHandle>
        <div className={ResetAllButton} onClick={this.onResetAllClicked.bind(this)}>
          Reset All
        </div>
        <div className={AddAbilityBarsSection}>
          <div className={AddAbilityBarsSectionLabel}>{`Ability Bars: ${numBars}/9`}</div>
          <div className={`${ActionButton} ${addLayoutDisabledClass}`} onClick={this.onAddNewLayoutClicked.bind(this)}>
            Add New
          </div>
        </div>
        <div className={`${ListContainer} ${Scroller}`}>
          {Object.keys(this.props.widgets)
            .filter((widgetID) => this.props.widgets[widgetID].registration)
            .sort() // Alphabetical order
            .map((widgetID) => {
              const selectedClass = widgetID === this.props.selectedWidgetID ? 'selected' : '';
              const hiddenClass = this.props.widgets[widgetID].state.visible ? '' : 'hidden';
              return (
                <div
                  className={`${ListItem} ${selectedClass} ${hiddenClass}`}
                  key={widgetID}
                  onClick={this.onWidgetSelected.bind(this, widgetID)}
                >
                  <div className={ListItemName}>{widgetID}</div>
                </div>
              );
            })}
        </div>
        <div className={Footer}>{this.renderWidgetControls()}</div>
        {this.renderAbilityBarControls()}
      </div>
    );
  }

  private renderAbilityBarControls(): React.ReactNode {
    // Only show bar controls if we're inspecting an editable AbilityBar!
    if (!this.props.selectedWidgetID?.startsWith('Bar: Abilities')) {
      return null;
    }

    const selectedLayoutId = +this.props.selectedWidgetID.slice(15);
    const selectedLayout: ButtonLayout = this.props.layouts[selectedLayoutId];
    if (!selectedLayout) {
      return null;
    }
    const selectedGroup: AbilityGroup = this.props.groups[selectedLayout.groupID];
    if (!selectedGroup) {
      return null;
    }

    const groupPlusDisabledClass = selectedLayout.groupCycle.length >= 6 ? 'disabled' : '';
    const groupMinusDisabledClass = selectedLayout.groupCycle.length <= 1 ? 'disabled' : '';

    const slotPlusDisabledClass = selectedGroup.abilities.length >= 20 ? 'disabled' : '';
    const slotMinusDisabledClass = selectedGroup.abilities.length <= 1 ? 'disabled' : '';

    return (
      <div className={AbilityBarSection}>
        <div className={AbilityBarSectionRow}>
          <div className={AbilityBarSectionLabel}>{`Bar Groups ${selectedLayout.groupCycle.length}/6`}</div>
          <div
            className={`${PlusMinusButton} ${groupPlusDisabledClass}`}
            onClick={this.onAddGroupClicked.bind(this, selectedLayout)}
          >
            +
          </div>
          <div
            className={`${PlusMinusButton} ${groupMinusDisabledClass}`}
            onClick={this.onDeleteGroupClicked.bind(this, selectedLayout)}
          >
            -
          </div>
        </div>
        <div className={AbilityBarSectionRow}>
          <div className={AbilityBarSectionLabel}>{`Ability Slots ${selectedGroup.abilities.length}/20`}</div>
          <div
            className={`${PlusMinusButton} ${slotPlusDisabledClass}`}
            onClick={this.onAddSlotClicked.bind(this, selectedLayout)}
          >
            +
          </div>
          <div
            className={`${PlusMinusButton} ${slotMinusDisabledClass}`}
            onClick={this.onDeleteSlotClicked.bind(this, selectedLayout)}
          >
            -
          </div>
        </div>
        {
          // Can't delete "Bar: Abilities 1".
          selectedLayoutId !== 1 && (
            <div className={AbilityBarSectionButtonRow}>
              <div className={ActionButton} onClick={this.onDeleteButtonLayoutClicked.bind(this, selectedLayout)}>
                Delete this Ability Bar
              </div>
            </div>
          )
        }
      </div>
    );
  }

  private async onAddGroupClicked(layout: ButtonLayout): Promise<void> {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;
    // Create the group.
    const newGroupId: number = await clientAPI.createAbilityGroup(`layout${layout.id}group${layout.groupCycle.length}`);
    if (newGroupId === 0) {
      this.props.dispatch(
        showModal({
          id: 'AbilityGroupCreateError',
          content: {
            title: 'Error!',
            message: 'An error occurred while attempting to create an Ability Group.  Please try again later.'
          },
          escapable: true
        })
      );
    } else {
      // Add some button slots to the new group.  Same number as the current group.
      clientAPI.setVisibleAbilitySlots(newGroupId, this.props.groups[layout.groupID].abilities.length);
      // Add the group to the current layout.
      const groupCycle: number[] = [...layout.groupCycle, newGroupId];
      clientAPI.selectAbilityLayoutGroupCycle(layout.id, groupCycle);
      // Select the newly added group.
      clientAPI.selectAbilityLayoutGroup(layout.id, newGroupId);
    }
    this.isApplyingChanges = false;
  }

  private onDeleteGroupClicked(layout: ButtonLayout): void {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;

    let groupIndex: number = layout.groupCycle.indexOf(layout.groupID);
    // Remove the group from this layout.
    const groupCycle: number[] = layout.groupCycle.filter((groupId) => {
      return groupId !== layout.groupID;
    });
    clientAPI.selectAbilityLayoutGroupCycle(layout.id, groupCycle);
    // Select an adjacent group.
    if (groupIndex >= groupCycle.length) {
      groupIndex -= 1;
    }
    clientAPI.selectAbilityLayoutGroup(layout.id, groupCycle[groupIndex]);
    // Destroy the group itself.
    clientAPI.deleteAbilityGroup(layout.groupID);
    // If this was not the last group in the layout, rename the following groups.
    for (let i = groupIndex + 1; i < groupCycle.length; ++i) {
      const newName = `layout${layout.id}group${i}`;
      clientAPI.renameAbilityGroup(groupCycle[i], newName);
    }

    this.isApplyingChanges = false;
  }

  private onAddSlotClicked(layout: ButtonLayout): void {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;

    // We expect all groups in a particular layout to have the same number of button slots.
    layout.groupCycle.forEach((groupId) => {
      clientAPI.setVisibleAbilitySlots(groupId, this.props.groups[layout.groupID].abilities.length + 1);
    });

    this.isApplyingChanges = false;
  }

  private onDeleteSlotClicked(layout: ButtonLayout): void {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;

    // Remove the last slot for all groups in this layout to maintain consistent ability slot counts.
    const newSlotCount = this.props.groups[layout.groupID].abilities.length - 1;
    layout.groupCycle.forEach((groupId) => {
      // Clear the last ability slot manually, since "setVisibleSlots" doesn't actually shrink the array.
      clientAPI.clearAbility(groupId, newSlotCount);
      // Then, reduce the number of visible slots by one.
      clientAPI.setVisibleAbilitySlots(groupId, newSlotCount);
    });

    this.isApplyingChanges = false;
  }

  private onDeleteButtonLayoutClicked(layout: ButtonLayout): void {
    if (this.isApplyingChanges) {
      return;
    }
    this.isApplyingChanges = true;

    this.props.dispatch(
      showModal({
        id: 'ConfirmDeleteButtonLayout',
        content: {
          title: 'Confirm Deletion',
          message: `Are you sure you wish to delete Ability Bar ${layout.id}?  This cannot be undone.`,
          buttons: [
            {
              text: 'Delete',
              onClick: () => {
                clientAPI.deleteAbilityLayout(layout.id);
                // The client treats groups as independent objects, so we have to manually clean up
                // any groups associated with this anchor.
                layout.groupCycle.forEach((groupId) => {
                  clientAPI.deleteAbilityGroup(groupId);
                });

                this.props.dispatch(unregisterWidget(`Bar: Abilities ${layout.id}`));
                this.props.dispatch(hideModal());
                this.props.dispatch(setSelectedWidget(null));

                this.isApplyingChanges = false;
              }
            },
            {
              text: 'Cancel',
              onClick: () => {
                this.props.dispatch(hideModal());
                this.isApplyingChanges = false;
              }
            }
          ]
        }
      })
    );
  }

  private renderWidgetControls(): JSX.Element {
    if (this.props.selectedWidgetID?.length > 0) {
      const widget = this.props.widgets[this.props.selectedWidgetID];
      return (
        <>
          <div className={SelectedWidgetName}>{`- ${widget.registration.name} -`}</div>
          <div className={ToolbarRow}>
            <TooltipSource
              className={ToolbarItem}
              id={'ToggleVisibility'}
              tooltipParams={{ content: 'Toggle Visibility', id: 'HUDEditor-ToggleVisibility' }}
            >
              <img
                src={widget.state.visible ? EyeURL : EyeSlashURL}
                className={`${ToolbarIcon} button`}
                onClick={this.toggleVisibility.bind(this)}
              ></img>
            </TooltipSource>
            <TooltipSource
              className={ToolbarItem}
              id={'Opacity'}
              tooltipParams={{ content: 'Change Opacity', id: 'HUDEditor-ChangeOpacity' }}
            >
              <img src={LightbulbURL} className={ToolbarIcon}></img>
              <div className={ToolbarControls}>
                <img
                  className={ToolbarButton}
                  src={MinusURL}
                  onMouseDown={this.onOpacityMinusMouseDown.bind(this)}
                  onMouseUp={this.onButtonMouseUp.bind(this)}
                ></img>
                <div className={ToolbarText}>{Math.round(widget.state.opacity * 100)}%</div>
                <img
                  className={ToolbarButton}
                  src={PlusURL}
                  onMouseDown={this.onOpacityPlusMouseDown.bind(this)}
                  onMouseUp={this.onButtonMouseUp.bind(this)}
                ></img>
              </div>
            </TooltipSource>
            <TooltipSource
              className={ToolbarItem}
              id={'Scale'}
              style={{ marginLeft: '0.5vmin' }}
              tooltipParams={{ content: 'Change Size', id: 'HUDEditor-ChangeSize' }}
            >
              <img src={MagnifyingGlassURL} className={ToolbarIcon}></img>
              <div className={ToolbarControls}>
                <img
                  className={ToolbarButton}
                  src={MinusURL}
                  onMouseDown={this.onScaleMinusMouseDown.bind(this)}
                  onMouseUp={this.onButtonMouseUp.bind(this)}
                ></img>
                <div className={ToolbarText}>{Math.round(widget.state.scale * 100)}%</div>
                <img
                  className={ToolbarButton}
                  src={PlusURL}
                  onMouseDown={this.onScalePlusMouseDown.bind(this)}
                  onMouseUp={this.onButtonMouseUp.bind(this)}
                ></img>
              </div>
            </TooltipSource>
            <TooltipSource
              className={ToolbarItem}
              id={'ResetWidget'}
              tooltipParams={{ content: 'Reset Widget', id: 'HUDEditor-ResetWidget' }}
            >
              <img
                src={ResetURL}
                className={`${ToolbarIcon} button`}
                onClick={this.onResetWidgetClicked.bind(this)}
              ></img>
            </TooltipSource>
          </div>
          <div className={ToolbarRow}>
            {this.renderMovementControls()}
            {this.renderAnchorControls()}
          </div>
        </>
      );
    } else {
      return <div className={SelectedWidgetName}>- No Widget Selected -</div>;
    }
  }

  private renderMovementControls(): JSX.Element {
    return (
      <TooltipSource className={ToolbarItem} tooltipParams={{ content: 'Move Widget', id: 'HUDEditor-MoveWidget' }}>
        <div className={ControlHeaderText}>Position</div>
        <div className={MovementContainer}>
          <img
            className={MovementUp}
            src={ArrowUpURL}
            onMouseDown={this.onUpMouseDown.bind(this)}
            onMouseUp={this.onButtonMouseUp.bind(this)}
          />
          <img
            className={MovementDown}
            src={ArrowDownURL}
            onMouseDown={this.onDownMouseDown.bind(this)}
            onMouseUp={this.onButtonMouseUp.bind(this)}
          />
          <img
            className={MovementLeft}
            src={ArrowLeftURL}
            onMouseDown={this.onLeftMouseDown.bind(this)}
            onMouseUp={this.onButtonMouseUp.bind(this)}
          />
          <img
            className={MovementRight}
            src={ArrowRightURL}
            onMouseDown={this.onRightMouseDown.bind(this)}
            onMouseUp={this.onButtonMouseUp.bind(this)}
          />
        </div>
      </TooltipSource>
    );
  }

  private renderAnchorControls(): JSX.Element {
    const widget = this.props.widgets[this.props.selectedWidgetID];
    const t = widget.state.yAnchor === HUDVerticalAnchor.Top;
    const m = widget.state.yAnchor === HUDVerticalAnchor.Center;
    const b = widget.state.yAnchor === HUDVerticalAnchor.Bottom;
    const l = widget.state.xAnchor === HUDHorizontalAnchor.Left;
    const c = widget.state.xAnchor === HUDHorizontalAnchor.Center;
    const r = widget.state.xAnchor === HUDHorizontalAnchor.Right;
    return (
      <TooltipSource className={ToolbarItem} tooltipParams={{ content: 'Change Anchor', id: 'HUDEditor-ChangeAnchor' }}>
        <div className={ControlHeaderText}>Anchor</div>
        <div className={AnchorContainer}>
          <img
            className={`${AnchorButton} corner top left`}
            src={t && l ? AnchorSelectedTopLeftURL : AnchorTopLeftURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Left, HUDVerticalAnchor.Top)}
          />
          <img
            className={AnchorButton}
            src={t && c ? AnchorSelectedTopURL : AnchorTopURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Center, HUDVerticalAnchor.Top)}
          />
          <img
            className={`${AnchorButton} corner top right`}
            src={t && r ? AnchorSelectedTopRightURL : AnchorTopRightURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Right, HUDVerticalAnchor.Top)}
          />
          <img
            className={AnchorButton}
            src={m && l ? AnchorSelectedLeftURL : AnchorLeftURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Left, HUDVerticalAnchor.Center)}
          />
          <img
            className={AnchorButton}
            src={m && c ? AnchorSelectedCenterURL : AnchorCenterURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Center, HUDVerticalAnchor.Center)}
          />
          <img
            className={AnchorButton}
            src={m && r ? AnchorSelectedRightURL : AnchorRightURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Right, HUDVerticalAnchor.Center)}
          />
          <img
            className={`${AnchorButton} corner bottom left`}
            src={b && l ? AnchorSelectedBottomLeftURL : AnchorBottomLeftURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Left, HUDVerticalAnchor.Bottom)}
          />
          <img
            className={AnchorButton}
            src={b && c ? AnchorSelectedBottomURL : AnchorBottomURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Center, HUDVerticalAnchor.Bottom)}
          />
          <img
            className={`${AnchorButton} corner bottom right`}
            src={b && r ? AnchorSelectedBottomRightURL : AnchorBottomRightURL}
            onClick={this.changeAnchors.bind(this, HUDHorizontalAnchor.Right, HUDVerticalAnchor.Bottom)}
          />
        </div>
      </TooltipSource>
    );
  }

  private async onAddNewLayoutClicked(): Promise<void> {
    const newLayoutId = await clientAPI.createAbilityLayout();
    if (newLayoutId === 0) {
      this.showAbilityBarCreateErrorModal();
      return;
    }

    // Create a default group for the new layout.
    const newGroupId: number = await clientAPI.createAbilityGroup(`layout${newLayoutId}group1`);
    if (newGroupId === 0) {
      this.showAbilityBarCreateErrorModal();
      // Failed to create a group for the layout, so get rid of the broken ButtonLayout.
      await clientAPI.deleteAbilityLayout(newLayoutId);
      return;
    } else {
      // Add a button slot to the new group (otherwise it won't render).
      clientAPI.setVisibleAbilitySlots(newGroupId, 1);
      // Add the group to the new layout.
      const groupCycle: number[] = [newGroupId];
      clientAPI.selectAbilityLayoutGroupCycle(newLayoutId, groupCycle);
      // Select the newly added group.
      clientAPI.selectAbilityLayoutGroup(newLayoutId, newGroupId);

      // And select the new AbilityBar in the HUDEditor!
      // Have to wait a frame so the new ButtonLayout's update event arrives before we select it.
      requestAnimationFrame(() => {
        this.onWidgetSelected(`Bar: Abilities ${newLayoutId}`);
      });
    }
  }

  private showAbilityBarCreateErrorModal(): void {
    this.props.dispatch(
      showModal({
        id: 'ButtonLayoutCreateError',
        content: {
          title: 'Error!',
          message: 'An error occurred while attempting to create an Ability Bar.  Please try again later.'
        },
        escapable: true
      })
    );
  }

  private handleDragEnded(_data: unknown, { dragDelta }: DropHandlerDraggableData): void {
    // Save the widget's overridden location.
    // We want it in vmin to reduce the chance of getting lost offscreen.
    const pxToVmin = Math.min(this.props.hudHeight, this.props.hudWidth) / 100;
    // Append the delta, since the old value was the delta that got it to its current position.
    const vminOffset: [number, number] = [
      this.state.offset[0] + dragDelta[0] / pxToVmin,
      this.state.offset[1] + dragDelta[1] / pxToVmin
    ];
    clientAPI.setHUDEditorOffset(vminOffset);
    this.setState({ offset: vminOffset });
  }

  componentWillUnmount(): void {
    if (this.buttonHeldHandle) {
      clearInterval(this.buttonHeldHandle);
      this.buttonHeldHandle = null;
    }
  }

  private toggleVisibility(): void {
    // Copy the original state.
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    // Modify the state.
    state.visible = !state.visible;
    // Save to HUDLocalStore.
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    // Save to Redux.
    const delta: Dictionary<HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private performRepeatableButtonAction(action: () => void): void {
    // Perform the action once right away.
    action();

    // Then delay a bit before starting to rapid-fire the event, so the user can still
    // get single-click events as expected.
    this.buttonHeldHandle = window.setInterval(() => {
      clearInterval(this.buttonHeldHandle);
      // And if the button is still held after the initial delay, start rapid-firing.
      this.buttonHeldHandle = window.setInterval(() => {
        action();
      }, ButtonRepeatTimeoutMS);
    }, FirstButtonRepeatTimeoutMS);
  }

  private onOpacityMinusMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changeOpacity(-0.01);
    });
  }

  private onOpacityPlusMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changeOpacity(0.01);
    });
  }

  private onScaleMinusMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changeScale(-0.01);
    });
  }

  private onScalePlusMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changeScale(0.01);
    });
  }

  private getHorizontalMove(delta: number): [number, number] {
    const state = this.props.widgets[this.props.selectedWidgetID].state;
    if (state.xAnchor === HUDHorizontalAnchor.Right) {
      return [-delta, 0];
    } else {
      return [delta, 0];
    }
  }

  private getVerticalMove(delta: number): [number, number] {
    const state = this.props.widgets[this.props.selectedWidgetID].state;
    if (state.yAnchor === HUDVerticalAnchor.Bottom) {
      return [0, -delta];
    } else {
      return [0, delta];
    }
  }

  private onLeftMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changePosition(this.getHorizontalMove(-0.1));
    });
  }

  private onRightMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changePosition(this.getHorizontalMove(0.1));
    });
  }

  private onUpMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changePosition(this.getVerticalMove(-0.1));
    });
  }

  private onDownMouseDown(): void {
    this.performRepeatableButtonAction(() => {
      this.changePosition(this.getVerticalMove(0.1));
    });
  }

  private onButtonMouseUp(): void {
    clearInterval(this.buttonHeldHandle);
    this.buttonHeldHandle = null;
  }

  private changeOpacity(opacityDelta: number): void {
    // Copy the original state.
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    // Modify the state. (clamped between 0 and 1)
    state.opacity = Math.max(0, Math.min(state.opacity + opacityDelta, 1));
    // Save to HUDLocalStore.
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    // Save to Redux.
    const delta: Dictionary<HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private changeScale(scaleDelta: number): void {
    // Copy the original state.
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    // Modify the state. (clamped between 0.5 and 3)
    state.scale = Math.max(0.5, Math.min(state.scale + scaleDelta, 3));
    // Save to HUDLocalStore.
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    // Save to Redux.
    const delta: Dictionary<HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private changePosition(pDelta: [number, number]): void {
    // Copy the original state.
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };
    // Modify the state.
    state.xOffset = Math.round((state.xOffset + pDelta[0]) * 100) / 100;
    state.yOffset = Math.round((state.yOffset + pDelta[1]) * 100) / 100;
    // Save to HUDLocalStore.
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    // Save to Redux.
    const delta: Dictionary<HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private changeAnchors(xAnchor: HUDHorizontalAnchor, yAnchor: HUDVerticalAnchor): void {
    // Copy the original state.
    const state = { ...this.props.widgets[this.props.selectedWidgetID].state };

    const pxToVmin = Math.min(this.props.hudHeight, this.props.hudWidth) / 100;

    // Modify the state.
    // Recalculate the offsets so the widget doesn't actually move when you change anchors.
    if (xAnchor !== state.xAnchor) {
      if (xAnchor === HUDHorizontalAnchor.Left) {
        state.xOffset = this.props.selectedWidgetBounds.x / pxToVmin;
      } else if (xAnchor === HUDHorizontalAnchor.Center) {
        const hudCenter = this.props.hudWidth / 2;
        const widgetCenter = this.props.selectedWidgetBounds.x + this.props.selectedWidgetBounds.width / 2;
        state.xOffset = (widgetCenter - hudCenter) / pxToVmin;
      } else {
        state.xOffset = (this.props.hudWidth - this.props.selectedWidgetBounds.right) / pxToVmin;
      }
      state.xOffset = Math.round(state.xOffset * 100) / 100;
    }
    if (yAnchor !== state.yAnchor) {
      if (yAnchor === HUDVerticalAnchor.Top) {
        state.yOffset = this.props.selectedWidgetBounds.y / pxToVmin;
      } else if (yAnchor === HUDVerticalAnchor.Center) {
        const hudCenter = this.props.hudHeight / 2;
        const widgetCenter = this.props.selectedWidgetBounds.y + this.props.selectedWidgetBounds.height / 2;
        state.yOffset = (widgetCenter - hudCenter) / pxToVmin;
      } else {
        state.yOffset = (this.props.hudHeight - this.props.selectedWidgetBounds.bottom) / pxToVmin;
        state.yOffset = Math.round(state.yOffset * 100) / 100;
      }
    }
    state.xAnchor = xAnchor;
    state.yAnchor = yAnchor;
    // Save to HUDLocalStore.
    clientAPI.updateWidgetState(this.props.selectedWidgetID, state);
    // Save to Redux.
    const delta: Dictionary<HUDWidgetState> = {};
    delta[this.props.selectedWidgetID] = state;
    this.props.dispatch(updateWidgetStates(delta));
  }

  private onResetWidgetClicked(): void {
    // Clear in HUDLocalStore.
    clientAPI.clearWidgetState(this.props.selectedWidgetID);
    // Clear in Redux.
    this.props.dispatch(resetWidget(this.props.selectedWidgetID));
  }

  private onResetAllClicked(): void {
    // And reset ourself for good measure.
    clientAPI.setHUDEditorOffset([0, 0]);
    this.setState({ offset: [0, 0] });
    // Clear in HUDLocalStore.
    clientAPI.clearAllWidgetStates();
    // Clear in Redux.
    this.props.dispatch(resetAllWidgets());
  }

  private onWidgetSelected(widgetID: string): void {
    this.props.dispatch(setSelectedWidget(widgetID));
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { hudWidth, hudHeight, widgets } = state.hud;
  const { selectedWidgetId: selectedWidgetID, selectedWidgetBounds } = state.hud.editor;
  const { editStatus, layouts, groups } = state.abilities;
  return {
    ...ownProps,
    hudWidth,
    hudHeight,
    widgets,
    selectedWidgetID,
    selectedWidgetBounds,
    editStatus,
    layouts,
    groups
  };
}

export default connect(mapStateToProps)(HUDEditor);
