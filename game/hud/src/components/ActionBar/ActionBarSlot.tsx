/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { useActionStateReducer, ActionSlot, EditMode } from 'services/session/ActionViewState';
import { SkillTracks } from 'gql/interfaces';
import { ActionBtn } from '../ActionButton/ActionBtn';
import { DragAndDrop } from '../Utilities/DragAndDropV2';
import { Drag } from 'components/Utilities/Drag';
import { ContextMenu } from '../ContextMenu';
import { showModal } from '../DynamicModal';

const Rotator = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  transform: rotateZ(${({ angle }: { angle: number } & React.HTMLProps<HTMLDivElement>) => angle.toFixed(0)}deg);
  pointer-events: none;
`;

type SCProps = { radius: number; } & React.HTMLProps<HTMLDivElement>;
const SlotContainer = styled.div`
  position: relative;
  display: inline-block;
  pointer-events: none;
  width: ${(props: SCProps) => props.radius * 2}px;
  height: ${(props: SCProps) => props.radius * 2}px;
  transform: translateX(${(props: SCProps) => (props.radius * 2) + 10}px)
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

const RotatorHandle = styled.div`
  position: absolute;
  top: -15px;
  left: 0;
  color: white;
  font-size: 0.75em;
  pointer-events: all;
  cursor: move;
  &:hover {
    color: yellow;
  }
`;

const AddSlotBtn = styled.div`
  position: absolute;
  right: -15px;
  bottom: 0;
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


const action = {
  name: 'test',
  icon: 'https://camelot-unchained.s3.amazonaws.com/game/4/icons/components/Acidic_Concoction.png',
  notes: 'info about action',
  id: 'one',
  tracks: SkillTracks.EitherWeaponPreferPrimary,

  keybind: '3',

  current: {
    id: 0,
    type: AbilityButtonType.Standard,
    track: AbilityTrack.EitherWeaponPreferPrimary,
    keyActionID: 0,
    boundKeyName: '',
    status: AbilityButtonState.Cooldown,
    timing: {
      start: Date.now(),
      duration: 20000,
    },
  } as any,
};

const action2 = {
  name: 'test2',
  icon: 'https://camelot-unchained.s3.amazonaws.com/game/4/icons/skills/Blackgaurd-Adept-Shot.png',
  notes: 'info about action 2',
  id: 'two',
  tracks: SkillTracks.EitherWeaponPreferPrimary,

  keybind: '4',

  current: {
    id: 0,
    type: AbilityButtonType.Standard,
    track: AbilityTrack.EitherWeaponPreferPrimary,
    keyActionID: 0,
    boundKeyName: '',
    status: AbilityButtonState.Running | AbilityButtonState.Preparation,
    timing: {
      start: Date.now(),
      duration: 10000,
    },
  } as any,
};

enum Quadrant {
  Right, // 315-45
  Bottom, // 45-135
  Left, // 135-225
  Top, // 225-315
}

function getQuadrant(degrees: number) {
  if (degrees <= 45) return Quadrant.Right;
  if (degrees <= 135) return Quadrant.Bottom;
  if (degrees <= 225) return Quadrant.Left;
  if (degrees <= 315) return Quadrant.Top;
  return Quadrant.Right;
}

function closestSnapAngle(degrees: number, snapStep: number) {
  const halfStep = snapStep / 2;
  for (let angle = 0; angle <= 360; angle += snapStep) {
    if (degrees < angle + halfStep) {
      return angle;
    }
  }
  return 0;
}

function getNewAngleFromMove(currentAngle: number, move: {x: number; y: number;}, snapStep: number = 1) {
  const quadrant = getQuadrant(currentAngle);
  switch (quadrant) {
    case Quadrant.Right:
      if (move.y < 0) {
        return addDegrees(currentAngle, -Math.max(Math.abs(move.x), Math.abs(move.y)), snapStep);
      } else if (move.y > 0) {
        return addDegrees(currentAngle, Math.max(Math.abs(move.x), Math.abs(move.y)), snapStep);
      }
      break;
    case Quadrant.Bottom:
      if (move.x < 0) {
        return addDegrees(currentAngle, Math.max(Math.abs(move.x), Math.abs(move.y)), snapStep);
      } else if (move.x > 0) {
        return addDegrees(currentAngle, -Math.max(Math.abs(move.x), Math.abs(move.y)), snapStep);
      }
      break;
    case Quadrant.Left:
      if (move.y < 0) {
        return addDegrees(currentAngle, Math.max(Math.abs(move.x), Math.abs(move.y)), snapStep);
      } else if (move.y > 0) {
        return addDegrees(currentAngle, -Math.max(Math.abs(move.x), Math.abs(move.y)), snapStep);
      }
      break;
    case Quadrant.Top:
      if (move.x < 0) {
        return addDegrees(currentAngle, -Math.max(Math.abs(move.x), Math.abs(move.y)), snapStep);
      } else if (move.x > 0) {
        return addDegrees(currentAngle, Math.max(Math.abs(move.x), Math.abs(move.y)), snapStep);
      }
      break;
  }
  return currentAngle;
}

function addDegrees(currentAngle: number, degrees: number, snapStep: number): number {
  if (currentAngle === undefined) return 0;
  let angle = Number(currentAngle) + Number(degrees);
  if (angle > 360) angle = angle - 360;
  if (angle < 0) angle = angle + 360;
  angle = closestSnapAngle(angle, snapStep);
  angle = Number(angle.toFixed(0));
  return angle;
}

export interface ActionBarSlotProps extends ActionSlot {
  sumAngle: number; // used to orient the action in a slot correctly
  activeGroup: string; // used to identify which abilities are active in this slot
}

// tslint:disable-next-line:function-name
export function ActionBarSlot(props: ActionBarSlotProps): JSX.Element {
  const [state, dispatch] = useActionStateReducer();

  const [internalState, setInternalState] = useState({
    isDragging: false,
    wantAngle: props.angle,
    snapStep: 15,
  });

  const ui = useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;
  const definition = ui.isUHD() ? 'uhd' : 'hd';
  const factionAbbr = FactionExt.abbreviation(game.selfPlayerState.faction);

  let slottedActionID: string = '';
  for (const abilityID in state.actions) {
    if (state.actions[abilityID].findIndex(p => p.slot === props.id && p.group === props.activeGroup) >= 0) {
      slottedActionID = abilityID;
      break;
    }
  }

  // get ability info from game, for now use temp
  game.abilityStates[slottedActionID];
  let slottedAction = slottedActionID === action.id ? action : null;
  if (!slottedAction && slottedActionID === action2.id) {
    slottedAction = action2;
  }

  const inEditMode = state.editMode !== EditMode.Disabled;
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

    return (
      <ActionWrapper angle={internalState.wantAngle + props.sumAngle}>
        {inEditMode ? (
          <DragAndDrop
            type='drag-and-drop'
            dataTransfer={{
              action: slottedActionID,
              group: props.activeGroup,
              slot: props.id,
            }}
            dataKey='action-button'
            acceptKeys={['action-button']}
            dragRender={() => <ActionBtn
              {...slottedAction}
              disableInteractions
              additionalStyles={{ filter: 'brightness(75%)' }}
            />}
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
                dispatch({
                  type: 'remove-action',
                  action: slottedActionID,
                  group: props.activeGroup,
                  slot: props.id,
                });
              }
            }}
            onDrop={(e) => {
              dispatch({
                type: 'replace-or-swap-action',
                target: {
                  action: slottedActionID,
                  group: props.activeGroup,
                  slot: props.id,
                },
                from: e.dataTransfer as any,
              });
              return;
            }}
          >
            <ContextMenu
              type='items'
              getItems={createContextMenuItems}
            >
              <BtnWrapper>
                <ActionBtn
                  {...slottedAction}
                  disableInteractions={true}
                  additionalStyles={{
                    [internalState.isDragging && 'filter']: 'brightness(75%)',
                  }}
                />
              </BtnWrapper>
            </ContextMenu>
          </DragAndDrop>
        ) : <ActionBtn {...slottedAction} />}
      </ActionWrapper>
    );
  };

  return (
    <Rotator angle={internalState.wantAngle}>
      <SlotContainer {...display}>
        {
          inEditMode && (
            <Drag
              onDrag={(e) => {
                setInternalState({
                  ...internalState,
                  wantAngle: getNewAngleFromMove(internalState.wantAngle, e.move, internalState.snapStep),
                });
              }}
              onDragEnd={() => {
                dispatch({
                  type: 'set-slot-angle',
                  slot: props.id,
                  angle: internalState.wantAngle,
                });
              }}
            >
              <RotatorHandle>
                <i className='fa fa-sync-alt'></i>
              </RotatorHandle>
            </Drag>
          )
        }
        {
          inEditMode && (
            <AddSlotBtn onMouseDown={(e: React.MouseEvent) => {
              if (e.buttons !== 1) return;
              dispatch({
                type: 'add-slot',
                parent: props.id,
              });
            }}>
              <i className='fas fa-plus'></i>
            </AddSlotBtn>
          )
        }
        {showEmptySlot && (
          <DragAndDrop
            type='drop'
            acceptKeys={['action-button']}
            onDrop={(e) => {
              dispatch({
                type: 'add-and-remove-action',
                action: (e.dataTransfer as any).action,
                from: {
                  group: (e.dataTransfer as any).group,
                  slot: (e.dataTransfer as any).slot,
                },
                target: {
                  group: props.activeGroup,
                  slot: props.id,
                },
              });
            }}
          >
            <ContextMenu
              type='items'
              getItems={createContextMenuItems}
            >
              <SlotWrapper>
                <IMG
                  src={`images/anchor/${definition}/${factionAbbr}-empty-slot.png`}
                  onMouseDown={(e: React.MouseEvent) => {
                    if (e.buttons !== 2) return;
                    console.log('right clicked slot');
                  }}
                />
                <Icon onMouseDown={(e: React.MouseEvent) => {
                  if (e.buttons !== 1) return;
                  dispatch({
                    type: 'remove-slot',
                    slot: props.id,
                  });
                }}
                >
                  <i className='fas fa-minus'></i>
                </Icon>
              </SlotWrapper>
            </ContextMenu>
          </DragAndDrop>
        )}
        {slottedAction && renderAbility()}
        {props.children && props.children.map(id => (
          <ActionBarSlot
            key={id}
            sumAngle={internalState.wantAngle + props.sumAngle}
            activeGroup={props.activeGroup}
            {...state.slots[id]}
          />
        ))}
      </SlotContainer>
    </Rotator>
  );
}
