/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { ActionViewContext, ActionSlot, EditMode } from '../../context/ActionViewContext';
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

export interface ActionBarSlotProps extends ActionSlot {
  sumAngle: number; // used to orient the action in a slot correctly
  activeGroup: number; // used to identify which abilities are active in this slot
}

// tslint:disable-next-line:function-name
export function ActionBarSlot(props: ActionBarSlotProps): JSX.Element {
  const actionViewContext = useContext(ActionViewContext);

  const [internalState, setInternalState] = useState({
    isDragging: false,
    wantAngle: props.angle,
    snapStep: 15,
  });

  const defaultKeybind = getDefaultKeybindId();
  const [keybindId] = useState(defaultKeybind ? defaultKeybind.id : -1);
  const [boundKeyName, setBoundKeyName] = useState(defaultKeybind ? defaultKeybind.binds[0].name : '');

  const ui = useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;
  const definition = ui.isUHD() ? 'uhd' : 'hd';
  const factionAbbr = FactionExt.abbreviation(camelotunchained.game.selfPlayerState.faction);

  let slottedActionID: number | null = null;
  for (const actionId in actionViewContext.actions) {
    if (actionViewContext.actions[actionId].findIndex(p => p.slot === props.id && p.group === props.activeGroup) >= 0) {
      slottedActionID = Number(actionId);
      break;
    }
  }

  // get ability info from game, for now use temp

  const inEditMode = actionViewContext.editMode !== EditMode.Disabled;
  const showEmptySlot = inEditMode && slottedActionID === null;

  function onConfirmBind(newBind: Binding) {
    game.actions.assignKeybind(props.id, newBind.value);
    setBoundKeyName(newBind.name);
  }

  function getDefaultKeybindId() {
    const keybindsClone = cloneDeep(game.keybinds);
    const keybind = Object.values(keybindsClone).find(keybind => keybind.description === "Action Slot " + (props.id - 1));
    return keybind;
  }

  function createContextMenuItems() {
    return [
      {
        title: 'Bind Key',
        onSelected: () => {
          showModal({
            render: props => (
              <KeybindModal keybindId={keybindId} onConfirmBind={onConfirmBind} onClose={props.onClose} />
            ),
            onClose: (key: Binding) => console.log(key.name),
          });
        },
      },
    ];
  }

  const renderAbility = () => {
    if (slottedActionID === null) return null;

    function onDrop(e: DragEvent) {
      const target = {
        actionId: slottedActionID,
        groupId: props.activeGroup,
        slotId: props.id,
      };

      if (typeof e.dataTransfer.queuedAbilityId === 'number') {
        const actionId = e.dataTransfer.queuedAbilityId;
        actionViewContext.replaceOrSwapAction({ actionId }, target);
        return;
      }

      let from = e.dataTransfer;
      actionViewContext.replaceOrSwapAction(from, target);
      return;
    }

    return (
      <ActionWrapper angle={internalState.wantAngle + props.sumAngle}>
        {inEditMode ? (
          <DragAndDrop
            type='drag-and-drop'
            dataTransfer={{
              actionId: slottedActionID,
              groupId: props.activeGroup,
              slotId: props.id,
            }}
            dataKey='action-button'
            acceptKeys={['action-button']}
            dragRender={() => (
              <ActionBtn
                disableInteractions
                additionalStyles={{ filter: 'brightness(75%)' }}
                actionId={slottedActionID}
                slotId={props.id}
              />
            )}
            dragRenderOffset={{ x: -display.radius, y: -display.radius }}
            onDragStart={(e) => {
              setInternalState({
                ...internalState,
                isDragging: true,
              });
            }}
            onDragEnd={(e) => {
              setInternalState({
                ...internalState,
                isDragging: false,
              });
              if (!e.dropTargetID) {
                // remove
                actionViewContext.removeAction(slottedActionID, props.activeGroup, props.id);
              }
            }}
            onDrop={onDrop}
          >
            <BtnWrapper>
              <ActionBtn
                actionId={slottedActionID}
                disableInteractions={true}
                slotId={props.id}
                keybindName={boundKeyName}
                keybindId={keybindId}
                getContextMenuItems={createContextMenuItems}
                additionalStyles={{
                  [internalState.isDragging && 'filter']: 'brightness(75%)',
                }}
              />
            </BtnWrapper>
          </DragAndDrop>
        ) :
          <ActionBtn
            actionId={slottedActionID}
            slotId={props.id}
            keybindName={boundKeyName}
            keybindId={keybindId}
            getContextMenuItems={createContextMenuItems}
          />
        }
      </ActionWrapper>
    );
  };

  function onAddSlotClick(e: React.MouseEvent) {
    if (e.button === 0) {
      actionViewContext.addSlot(false, props.id);
    }
  }

  function onRemoveSlotClick(e: React.MouseEvent) {
    if (e.button === 0) {
      actionViewContext.removeSlot(props.id);
    }
  }

  function onDrop(e: DragEvent) {
    if (typeof e.dataTransfer.queuedAbilityId === 'number') {
      const actionId = e.dataTransfer.queuedAbilityId;
      actionViewContext.addAction(actionId, props.activeGroup, props.id);
      return;
    }

    const from = {
      groupId: e.dataTransfer.groupId,
      slotId: e.dataTransfer.slotId,
    };
    const target = {
      groupId: props.activeGroup,
      slotId: props.id,
    };

    actionViewContext.addAndRemoveAction(
      e.dataTransfer.actionId,
      from,
      target,
    );
  }

  function navigateToAbilityBook() {
    game.trigger('navigate', 'ability-book');
  }

  return (
    <>
      <SlotContainer {...display}>
        <SlotActions>
          {props.children && props.children.length === 0 &&
            inEditMode && (
              <AddSlotBtn onMouseDown={onAddSlotClick}>
                <i className='fas fa-plus'></i>
              </AddSlotBtn>
            )
          }
          {showEmptySlot &&
            <Icon onMouseDown={onRemoveSlotClick}>
              <i className='fas fa-minus'></i>
            </Icon>
          }
        </SlotActions>
        {showEmptySlot && (
          <DragAndDrop
            type='drop'
            acceptKeys={['action-button']}
            onDrop={onDrop}
          >
            <ContextMenu
              type='items'
              getItems={createContextMenuItems}
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
                  <Icon className='fas fa-plus' onMouseDown={navigateToAbilityBook}></Icon>}
              </SlotWrapper>
            </ContextMenu>
          </DragAndDrop>
        )}
        {slottedActionID !== -1 && renderAbility()}
      </SlotContainer>
      {props.children && props.children.map(id => (
        <ActionBarSlot
          key={id}
          sumAngle={internalState.wantAngle + props.sumAngle}
          activeGroup={props.activeGroup}
          {...actionViewContext.slots[id]}
        />
      ))}
    </>
  );
}
