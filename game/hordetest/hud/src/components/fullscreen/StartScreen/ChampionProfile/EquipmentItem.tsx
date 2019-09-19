/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Skin, Rarity } from '../Store/testData';

interface ContainerProps extends React.HTMLProps<HTMLDivElement> {
  width: number;
  height: number;
}

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${(props: ContainerProps) => props.width ? `${props.width}px` : '100px'};
  height: ${(props: ContainerProps) => props.height ? `${props.height}px` : '120px'};
  margin: 5px;
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

  width?: number;
  height?: number;
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
  }

  const disabledClass = props.disabled ? 'disabled' : 'not-disabled';
  const rarityClass = props.skin ? Rarity[props.skin.rarity] : '';
  return (
    <Container
      width={props.width}
      height={props.height}
      className={`${props.className} ${rarityClass} ${disabledClass}`}
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
