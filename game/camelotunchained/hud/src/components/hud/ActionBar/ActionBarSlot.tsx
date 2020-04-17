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

function getAbility(clientAbility: AbilityState) {
  if (!clientAbility) {
    return null;
  }

  let abilityInfo = {
    ...cloneDeep(clientAbility),
    name: '',
    icon: '',
    description: '',
    tracks: [] as any,
  };

  const apiAbilityInfo = camelotunchained.game.store.getAbilityInfo(clientAbility.id);
  if (apiAbilityInfo) {
    abilityInfo = {
      ...clientAbility,
      ...apiAbilityInfo,
    };
  }

  if (apiAbilityInfo) {
    Object.keys(apiAbilityInfo).forEach((key) => {
      // If client has same key, check if it's a truthy value. If so, override API data. Otherwise, don't.
      if (clientAbility[key]) {
        // Value is truthy, override.
        abilityInfo[key] = clientAbility[key];
      }
    });
  }

  return abilityInfo;
}

export interface ActionBarSlotProps extends ActionSlot {
  sumAngle: number; // used to orient the action in a slot correctly
  activeGroup: string; // used to identify which abilities are active in this slot
}

// tslint:disable-next-line:function-name
export function ActionBarSlot(props: ActionBarSlotProps): JSX.Element {
  const actionViewContext = useContext(ActionViewContext);

  const [internalState, setInternalState] = useState({
    isDragging: false,
    wantAngle: props.angle,
    snapStep: 15,
  });

  const ui = useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;
  const definition = ui.isUHD() ? 'uhd' : 'hd';
  const factionAbbr = FactionExt.abbreviation(camelotunchained.game.selfPlayerState.faction);

  let slottedActionID: string = '';
  for (const actionId in actionViewContext.actions) {
    if (actionViewContext.actions[actionId].findIndex(p => p.slot === props.id && p.group === props.activeGroup) >= 0) {
      slottedActionID = actionId;
      break;
    }
  }

  // get ability info from game, for now use temp
  const abilityState = slottedActionID ? getAbility(camelotunchained.game.abilityStates[slottedActionID]) : null;
  const slottedAction = abilityState ? {
    name: abilityState.name,
    icon: abilityState.icon,
    description: abilityState.description,
    id: abilityState.id,
    tracks: abilityState.tracks,
    current: abilityState,
    keybind: abilityState.boundKeyName,
  } : null;

  const inEditMode = actionViewContext.editMode !== EditMode.Disabled;
  const showEmptySlot = inEditMode && !slottedAction;

  function createContextMenuItems() {
    return [
      {
        title: 'Bind Key',
        onSelected: () => {
          showModal({
            render: props => (
              <div>
                Hello World!
                <button onMouseDown={() => props.onClose({ name: 'success', value: 1 })}>close</button>
              </div>
            ),
            onClose: (key: Binding) => console.log(key.name),
          });
        },
      },
    ];
  }

  const renderAbility = () => {
    if (!slottedAction) return null;

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
                {...slottedAction as any}
                disableInteractions
                additionalStyles={{ filter: 'brightness(75%)' }}
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
            <ContextMenu
              type='items'
              getItems={createContextMenuItems}
            >
              <BtnWrapper>
                <ActionBtn
                  {...slottedAction as any}
                  disableInteractions={true}
                  additionalStyles={{
                    [internalState.isDragging && 'filter']: 'brightness(75%)',
                  }}
                />
              </BtnWrapper>
            </ContextMenu>
          </DragAndDrop>
        ) : <ActionBtn {...slottedAction as any} />}
      </ActionWrapper>
    );
  };

  function onAddSlotClick(e: React.MouseEvent) {
    if (e.button === 0) {
      actionViewContext.addSlot(props.id);
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

    console.log(e.dataTransfer);

    actionViewContext.addAndRemoveAction(
      e.dataTransfer.actionId,
      from,
      target,
    );
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
                {/* <Icon className='fas fa-plus' onMouseDown={onAddSlotClick}></Icon> */}
              </SlotWrapper>
            </ContextMenu>
          </DragAndDrop>
        )}
        {slottedAction && renderAbility()}
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
