/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext, useState } from 'react';
import { styled } from 'linaria/react';
import { useAbilityStateReducer, AbilitySlot } from 'services/session/AbilityViewState';
import { SkillTracks } from 'gql/interfaces';
import { AbilityBtn } from '../AbilityBtn';
import { DragAndDrop } from '../Utilities/DragAndDropV2';

const Rotator = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  width: 100%;
  height: 100%;
  display: inline-block;
  transform: rotateZ(${({ angle }: { angle: number }) => angle.toFixed(0)}deg);
  pointer-events: none;
`;

const SlotContainer = styled.div`
  position: relative;
  display: inline-block;
  pointer-events: none;
  ${(props: { radius: number }) => {
    const diameter = props.radius * 2;
    return `
      width: ${diameter}px;
      height: ${diameter}px;
      transform: translateX(${diameter + 10}px)
    `;
  }}
`;

const IMG = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  pointer-events: all;
`;

const AbilityWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  transform: rotateZ(${({ angle }: { angle: number }) => -angle.toFixed(0)}deg);
  pointer-events: none;
`;


const ability = {
  name: 'test',
  icon: 'https://camelot-unchained.s3.amazonaws.com/game/4/icons/components/winter shadow/Winter-Shadow_Ambush-Shot.png',
  notes: 'info about ability',
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

const ability2 = {
  name: 'test2',
  icon: 'https://camelot-unchained.s3.amazonaws.com/game/4/icons/skills/Blackgaurd-Adept-Shot.png',
  notes: 'info about ability',
  id: 'two',
  tracks: SkillTracks.EitherWeaponPreferPrimary,

  keybind: '4',

  current: {
    id: 0,
    type: AbilityButtonType.Standard,
    track: AbilityTrack.EitherWeaponPreferPrimary,
    keyActionID: 0,
    boundKeyName: '',
    status: AbilityButtonState.Cooldown,
    timing: {
      start: Date.now(),
      duration: 10000,
    },
  } as any,
};

// tslint:disable-next-line:function-name
function EmptySlotView() {
  const ui = useContext(UIContext);
  const definition = ui.isUHD() ? 'uhd' : 'hd';
  const factionAbbr = FactionExt.abbreviation(game.selfPlayerState.faction);
  return <IMG src={`images/anchor/${definition}/${factionAbbr}-empty-slot.png`}/>;
}


export interface AbilityBarSlotProps extends AbilitySlot {
  sumAngle: number; // used to orient the ability in a slot correctly
  activeGroup: string; // used to identify which abilities are active in this slot
}

// tslint:disable-next-line:function-name
export function AbilityBarSlot(props: AbilityBarSlotProps): JSX.Element {
  const [state, dispatch] = useAbilityStateReducer();

  const [internalState, setInternalState] = useState({
    isDragging: false,
  });

  const ui = useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.abilityButtons.display.uhd : theme.abilityButtons.display.hd;

  let slottedAbilityID: string = '';
  for (const abilityID in state.abilities) {
    if (state.abilities[abilityID].findIndex(p => p.slot === props.id && p.group === props.activeGroup) >= 0) {
      slottedAbilityID = abilityID;
      break;
    }
  }

  // get ability info from game, for now use temp
  game.abilityStates[slottedAbilityID];
  let slottedAbility = slottedAbilityID === ability.id ? ability : null;
  if (!slottedAbility && slottedAbilityID === ability2.id) {
    slottedAbility = ability2;
  }

  const showEmptySlot = state.editMode && !slottedAbility;
  const enableDrag = state.editMode;

  const renderAbility = () => {
    if (!slottedAbility) return null;

    return (
      <AbilityWrapper angle={props.angle + props.sumAngle}>
        {enableDrag ? (
          <DragAndDrop
            type='drag-and-drop'
            dataTransfer={{
              ability: slottedAbilityID,
              group: props.activeGroup,
              slot: props.id,
            }}
            dataKey='ability-button'
            acceptKeys={['ability-button']}
            dragRender={() => <AbilityBtn {...slottedAbility} additionalStyles={{ filter: 'brightness(75%)' }}/>}
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
                  type: 'remove-ability',
                  ability: slottedAbilityID,
                  group: props.activeGroup,
                  slot: props.id,
                });
              }
            }}
            onDrop={(e) => {
              dispatch({
                type: 'replace-or-swap-ability',
                target: {
                  ability: slottedAbilityID,
                  group: props.activeGroup,
                  slot: props.id,
                },
                from: e.dataTransfer as any,
              });
              return;
            }}
          >
            <AbilityBtn
              {...slottedAbility}
              disableInteractions={true}
              additionalStyles={{
                [internalState.isDragging && 'filter']: 'brightness(75%)',
              }}
            />
          </DragAndDrop>
        ) : <AbilityBtn {...slottedAbility} />}
      </AbilityWrapper>
    );
  };

  return (
    <Rotator angle={props.angle}>
      <SlotContainer {...display}>
        {showEmptySlot && (
          <DragAndDrop
            type='drop'
            acceptKeys={['ability-button']}
            onDrop={(e) => {
              dispatch({
                type: 'add-and-remove-ability',
                ability: (e.dataTransfer as any).ability,
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
            <EmptySlotView />
          </DragAndDrop>
        )}
        {slottedAbility && renderAbility()}
        {props.children && props.children.map(id => (
          <AbilityBarSlot
            key={id}
            sumAngle={props.angle + props.sumAngle}
            activeGroup={props.activeGroup}
            {...state.slots[id]}
          />
        ))}
      </SlotContainer>
    </Rotator>
  );
}
