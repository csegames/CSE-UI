/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Skin, Rarity, Champion } from '../Store/testData';

interface ContainerProps extends React.HTMLProps<HTMLDivElement> {
  width: string;
  height: string;
  margin: string;
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props: ContainerProps) => props.width ? props.width : '100px'};
  height: ${(props: ContainerProps) => props.height ? props.height : '120px'};
  margin: ${(props: ContainerProps) => props.margin ? props.margin : '5px'};
  background-color: #161616;
  box-shadow: inset 0 0 0 2px #2c2c2c;

  &.Rare {
    box-shadow: inset 0 0 0 2px #45a724;
    background-color: #304629;
  }

  &.Epic {
    box-shadow: inset 0 0 0 2px #d424d1;
    background-color: #350734;
  }

  &.Legendary {
    box-shadow: inset 0 0 0 2px #eec06a;
    background-color: #251f16;
  }

  &.Amazon {
    background: url(../images/fullscreen/startscreen/store/weapons-bg-red.jpg) no-repeat;
    background-size: cover;
  }

  &.Berserker {
    background: url(../images/fullscreen/startscreen/store/weapons-bg-blue.jpg) no-repeat;
    background-size: cover;
  }

  &.Knight {
    background: url(../images/fullscreen/startscreen/store/weapons-bg-yellow.jpg) no-repeat;
    background-size: cover;
  }

  &.Celt {
    background: url(../images/fullscreen/startscreen/store/weapons-bg-green.jpg) no-repeat;
    background-size: cover;
  }

  &.isComingSoon:after {
    content: 'Coming soon';
    font-family: Colus;
    font-size: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    width: 170px;
    color: white;
    text-align: center;
    outline: 1px solid rgba(255, 255, 255, 0.32);
    outline-offset: -4px;
    display: block;
    padding: 5px 10px;
    background: rgba( 0, 0, 0, 0.7);
    transform: translate(-50%, -50%);
  }

  &.not-disabled {
    cursor: pointer;
    &:before {
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      background: linear-gradient(to top, rgba(102, 185, 252, 0.7), transparent);
      opacity: 0;
      transition: box-shadow 0.2s, opacity 0.2s;
    }

    &:active:before {
      background: linear-gradient(to top, rgba(56, 105, 144, 0.7), transparent);
    }

    &:hover {
      box-shadow: inset 0 0 0 2px #66b9fc;
      &:before {
        opacity: 1;
      }
    }

    &.selected-preview {
      box-shadow: inset 0 0 0 5px #66b9fc;
    }
  }
`;

const Image = styled.img`
  width: 90%;
  height: 90%;
  object-fit: contain;
`;

const LockedIcon = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  color: white;
`;

const LockedOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  pointer-events: none;
  background-color: rgba(0, 0, 0, 0.6);
`;

const CheckIcon = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  color: #40ff00;
`;

export interface Props {
  skin: Skin;

  width?: string;
  height?: string;
  margin?: string;
  isSelected?: boolean;
  shouldShowStatus?: boolean;
  className?: string;
  onClick?: (skin: Skin) => void;
  onDoubleClick?: (skin: Skin) => void;
  onMouseEnter?: (skin: Skin) => void;
  onMouseLeave?: () => void;
  children?: JSX.Element | JSX.Element[];
  disabled?: boolean;
}

export function EquipmentItem(props: Props) {
  function onClick() {
    if (typeof props.onClick !== 'undefined') {
      props.onClick(props.skin);
    }

    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  function onDoubleClick() {
    if (typeof props.onDoubleClick !== 'undefined') {
      props.onDoubleClick(props.skin);
    }
  }

  function onMouseEnter() {
    if (typeof props.onMouseEnter !== 'undefined') {
      props.onMouseEnter(props.skin);
    }

    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  const disabledClass = props.disabled ? 'disabled' : 'not-disabled';
  const rarityClass = props.skin ? Rarity[props.skin.rarity] : '';
  const championClass = props.skin ? Champion[props.skin.champion] : '';
  const isComingSoonClass = props.skin ? 'isComingSoon' : '';
  return (
    <Container
      width={props.width}
      height={props.height}
      margin={props.margin}
      className={`${props.className} ${rarityClass} ${disabledClass} ${championClass} ${isComingSoonClass}`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={props.onMouseLeave}>
      {props.skin && <Image src={props.skin.image} />}
      {props.shouldShowStatus && (props.skin && !props.skin.isUnlocked &&
        <>
          <LockedOverlay />
          <LockedIcon className='far fa-lock' />
        </>
      )}
      {props.shouldShowStatus && props.isSelected && <CheckIcon className='far fa-check' />}
      {props.children}
    </Container>
  );
}
