/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import {
  ActionViewContext,
  ActionSlot,
  EditMode,
  ActionViewContextState,
  isSystemAnchorId,
} from '../../context/ActionViewContext';
import { ActionBtn } from 'hud/ActionButton/ActionBtn';
import { DragAndDrop, DragEvent } from 'utils/DragAndDropV2';
import { ContextMenu } from 'shared/ContextMenu';
import { showModal } from 'utils/DynamicModal';
import { KeybindModal } from './KeybindModal';

type SCProps = { radius: number; } & React.HTMLProps<HTMLDivElement>;
const SlotContainer = styled.div`
  position: relative;
  display: inline-block;
  pointer-events: none;
  width: ${(props: SCProps) => props.radius * 2}px;
  height: ${(props: SCProps) => props.radius * 2}px;
  transform: translateX(${(props: SCProps) => (props.radius * 2) + 10}px);
  margin-right: 10px;
`;

const IMG = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
  z-index: -1;
`;

const ActionWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: rotateZ(${({ angle }: { angle: number } & React.HTMLProps<HTMLDivElement>) => -angle.toFixed(0)}deg);
  pointer-events: none;
`;

const SlotActions = styled.div`
  position: absolute;
  right: -15px;
  bottom: 0;
`;

const AddSlotBtn = styled.div`
  color: white;
  font-size: 0.75em;
  pointer-events: all;
  cursor: pointer;
  &:hover {
    color: yellow;
  }
`;

const SlotWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Icon = styled.span`
  text-align: center;
  color: white;
  font-size: 0.75em;
  pointer-events: all;
  cursor: pointer;
  &:hover {
    color: yellow;
  }
`;

const BtnWrapper = styled.span`
  pointer-events: all;
`;

interface InjectedProps {
  actionViewContext: ActionViewContextState;
  uiContext: UIContext;
}

export interface ActionBarSlotProps extends ActionSlot {
  sumAngle: number; // used to orient the action in a slot correctly
  activeGroup: number; // used to identify which abilities are active in this slot
}

export interface State {
  isDragging: boolean;
  wantAngle: number;
  snapStep: number;
  keybindId: number;
  boundKeyName: string;
}

function getDefaultKeybindId(slotId: number, isSystemAnchor?: boolean, actionId?: number) {
  if (isSystemAnchor && camelotunchained.game.abilityStates[actionId]) {
    return {
      id: -1,
      binds: [camelotunchained.game.abilityStates[actionId].systemKeyBinding],
    };
  }

  const keybind = Object.values(game.keybinds).find(keybind => keybind.description === "Action Slot " + (slotId - 1));
  return keybind;
}

// tslint:disable-next-line:function-name
class ActionBarSlotWithInjectedContext extends React.Component<ActionBarSlotProps & InjectedProps, State> {
  private display: any;
  constructor(props: ActionBarSlotProps & InjectedProps) {
    super(props);

    const systemActionId = isSystemAnchorId(props.anchorId) ? Object.keys(props.actionViewContext.actions)
      .find(actionId => props.actionViewContext.actions[actionId] && props.actionViewContext.actions[actionId as any].find(a => a.slot === props.id)) : null;

    const defaultKeybind = getDefaultKeybindId(
      props.id,
      isSystemAnchorId(props.anchorId),
      systemActionId && Number(systemActionId),
    );
    this.state = {
      isDragging: false,
      wantAngle: props.angle,
      snapStep: 15,
      keybindId: defaultKeybind ? defaultKeybind.id : -1,
      boundKeyName: defaultKeybind ? defaultKeybind.binds[0].name : '',
    };
  }

  public render() {
    const { actionViewContext, uiContext } = this.props;
    const theme = uiContext.currentTheme();
    this.display = uiContext.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;
    const definition = uiContext.isUHD() ? 'uhd' : 'hd';
    const factionAbbr = FactionExt.abbreviation(camelotunchained.game.selfPlayerState.faction);

    const slottedActionID = this.getSlottedActionId();
    const inEditMode = actionViewContext.editMode !== EditMode.Disabled;
    const showEmptySlot = inEditMode && slottedActionID === null;
    return (
      <>
        <SlotContainer {...this.display}>
          <SlotActions>
            {this.props.children && this.props.children.length === 0 &&
              inEditMode && (
                <AddSlotBtn onMouseDown={this.onAddSlotClick}>
                  <i className='fas fa-plus'></i>
                </AddSlotBtn>
              )
            }
            {showEmptySlot &&
              <Icon onMouseDown={this.onRemoveSlotClick}>
                <i className='fas fa-minus'></i>
              </Icon>
            }
          </SlotActions>
          {showEmptySlot && (
            <DragAndDrop
              type='drop'
              acceptKeys={['action-button']}
              onDrop={this.onDrop}
            >
              <ContextMenu
                type='items'
                getItems={this.createContextMenuItems}
              >
                <SlotWrapper>
                  <IMG
                    src={`images/anchor/${definition}/${factionAbbr}-empty-slot.png`}
                    onMouseDown={(e: React.MouseEvent) => {
                      if (e.buttons === 2) {
                        console.log('right clicked slot');
                        return;
                      }
                    }}
                  />
                  {!actionViewContext.queuedAbilityId &&
                    <Icon className='fas fa-plus' onMouseDown={this.navigateToAbilityBook}></Icon>}
                </SlotWrapper>
              </ContextMenu>
            </DragAndDrop>
          )}
          {slottedActionID !== -1 && this.renderAbility()}
        </SlotContainer>
        {this.props.children && this.props.children.map(id => (
          <ActionBarSlotWithInjectedContext
            key={id}
            sumAngle={this.state.wantAngle + this.props.sumAngle}
            activeGroup={this.props.activeGroup}
            actionViewContext={actionViewContext}
            uiContext={uiContext}
            {...actionViewContext.slots[id]}
          />
        ))}
      </>
    );
  }

  private getSlottedActionId = () => {
    let slottedActionID: number | null = null;
    for (const actionId in this.props.actionViewContext.actions) {
      if (this.props.actionViewContext.actions[actionId].findIndex(p =>
          p.slot === this.props.id && p.group === this.props.activeGroup) >= 0) {
        slottedActionID = Number(actionId);
        break;
      }
    }

    return slottedActionID;
  }

  private onConfirmBind = (newBind: Binding) => {
    game.actions.assignKeybind(this.props.id, newBind.value);
    this.setState({ boundKeyName: newBind.name });
  }

  private createContextMenuItems = () => {
    if (isSystemAnchorId(this.props.anchorId)) {
      return [];
    }
    return [
      {
        title: 'Bind Key',
        onSelected: () => {
          showModal({
            render: props => (
              <KeybindModal keybindId={this.state.keybindId} onConfirmBind={this.onConfirmBind} onClose={props.onClose} />
            ),
            onClose: (key: Binding) => console.log(key.name),
          });
        },
      },
    ];
  }

  private onAddSlotClick = (e: React.MouseEvent) => {
    if (e.button === 0) {
      this.props.actionViewContext.addSlot(false, this.props.id);
    }
  }

  private onRemoveSlotClick = (e: React.MouseEvent) => {
    if (e.button === 0) {
      this.props.actionViewContext.removeSlot(this.props.id);
    }
  }

  private onDrop = (e: DragEvent) => {
    if (typeof e.dataTransfer.queuedAbilityId === 'number') {
      const actionId = e.dataTransfer.queuedAbilityId;
      this.props.actionViewContext.addAction(actionId, this.props.activeGroup, this.props.id);
      return;
    }

    const from = {
      groupId: e.dataTransfer.groupId,
      slotId: e.dataTransfer.slotId,
      anchorId: e.dataTransfer.anchorId,
    };
    const target = {
      groupId: this.props.activeGroup,
      slotId: this.props.id,
      anchorId: this.props.anchorId,
    };

    this.props.actionViewContext.addAndRemoveAction(
      e.dataTransfer.actionId,
      from,
      target,
    );
  }

  private navigateToAbilityBook = () => {
    game.trigger('navigate', 'ability-book');
  }

  private onDropAbility = (e: DragEvent) => {
    const target = {
      actionId: this.getSlottedActionId(),
      groupId: this.props.activeGroup,
      slotId: this.props.id,
    };

    if (typeof e.dataTransfer.queuedAbilityId === 'number') {
      const actionId = e.dataTransfer.queuedAbilityId;
      this.props.actionViewContext.replaceOrSwapAction({ actionId }, target);
      return;
    }

    let from = e.dataTransfer;
    this.props.actionViewContext.replaceOrSwapAction(from, target);
    return;
  }

  private renderAbility = () => {
    const slottedActionID = this.getSlottedActionId();
    if (slottedActionID === null) return null;

    return (
      <ActionWrapper angle={this.state.wantAngle + this.props.sumAngle}>
        {this.props.actionViewContext.editMode !== EditMode.Disabled ? (
          <DragAndDrop
            type='drag-and-drop'
            dataTransfer={{
              anchorId: this.props.anchorId,
              actionId: slottedActionID,
              groupId: this.props.activeGroup,
              slotId: this.props.id,
            }}
            dataKey='action-button'
            acceptKeys={['action-button']}
            dragRender={() => (
              <ActionBtn
                disableInteractions
                additionalStyles={{ filter: 'brightness(75%)' }}
                actionId={slottedActionID}
                slotId={this.props.id}
              />
            )}
            dragRenderOffset={{ x: -this.display.radius, y: -this.display.radius }}
            onDragStart={(e) => {
              this.setState({
                isDragging: true,
              });
            }}
            onDragEnd={(e) => {
              this.setState({
                isDragging: false,
              });
              if (!e.dropTargetID) {
                // remove
                this.props.actionViewContext.removeAction(slottedActionID, this.props.activeGroup, this.props.id);
              }
            }}
            onDrop={this.onDropAbility}
          >
            <BtnWrapper>
              <ActionBtn
                actionId={slottedActionID}
                slotId={this.props.id}
                keybindName={this.state.boundKeyName}
                keybindId={this.state.keybindId}
                getContextMenuItems={this.createContextMenuItems}
                additionalStyles={{
                  [this.state.isDragging && 'filter']: 'brightness(75%)',
                }}
              />
            </BtnWrapper>
          </DragAndDrop>
        ) :
          <ActionBtn
            actionId={slottedActionID}
            slotId={this.props.id}
            keybindName={this.state.boundKeyName}
            keybindId={this.state.keybindId}
            getContextMenuItems={this.createContextMenuItems}
          />
        }
      </ActionWrapper>
    );
  };
}

export function ActionBarSlot(props: ActionBarSlotProps) {
  const actionViewContext = useContext(ActionViewContext);
  const uiContext = useContext(UIContext);
  return (
    <ActionBarSlotWithInjectedContext {...props} actionViewContext={actionViewContext} uiContext={uiContext} />
  );
}
