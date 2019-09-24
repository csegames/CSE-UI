/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ItemContainer } from '../ItemContainer';

const ItemContainerStyles = css`
  cursor: pointer;

  &:hover .checkbox.off::after {
    background-color: #222;
  }
`;

const Checkbox = styled.div`
  display: flex;
  cursor: pointer;
  position: absolute;
  right: 40px;
  width: 20px;
  height: 45px;

  ::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    margin: auto;
    left: 5px;
    width: 7px;
    height: 7px;
    border: 2px solid black;
    background-color: #111;
    transform: scale(1.5) rotate(45deg);
    z-index: 1;
    box-sizing: content-box!important;
    transition: background-color 0.2s;
  }

  &.on::after {
      background-color: #6ba1dd;
      border: 2px solid rgba(10, 50, 136, 1);
    }

`;

export interface Props {
  option: BooleanOption;
  onChange: (option: BooleanOption) => any;
}

export function CheckboxRow(props: Props) {
  function onClick() {
    let newOption = cloneDeep(props.option);
    newOption.value = !newOption.value;
    props.onChange(newOption);
  }

  const checkboxClassName = props.option.value === true ? 'on' : 'off';
  return (
    <ItemContainer className={ItemContainerStyles} onClick={onClick}>
      <div>{props.option.name.toTitleCase()}</div>
      <Checkbox className={'checkbox ' + checkboxClassName}></Checkbox>
    </ItemContainer>
  );
}
