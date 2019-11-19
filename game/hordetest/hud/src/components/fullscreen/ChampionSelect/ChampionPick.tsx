/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionSelectContext } from './context/ChampionSelectContext';

const Container = styled.div`
  position: relative;
  border: 5px solid #494949;
  width: 90px;
  height: 90px;
  cursor: pointer;
  margin: 0 7px;
  background-color: rgba(0, 0, 0, 0.9);
  transition: border-color 0.2s;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(to top, rgba(127, 207, 255, 0.55), transparent);
    transition: opacity 0.2s, visibility 0.2s;
    opacity: 0;
    visibility: hidden;
  }

  &:hover {
    &:after {
      opacity: 1;
      visibility: visible;
    }
  }

  &.selected {
    border-color: #7fcfff;
    &:after {
      opacity: 1;
      visibility: visible;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

export interface Props {
  id: string;
  image: string;
  isSelected: boolean;
  onClick: (championID: string) => void;
}

export function ChampionPick(props: Props) {
  const { onChampionSelect } = useContext(ChampionSelectContext);
  const selectedClass = props.isSelected ? 'selected' : '';

  function onClick(id: string) {
    props.onClick(id);
    onChampionSelect(id);
  }

  return (
    <Container className={selectedClass} onClick={() => onClick(props.id)}>
      <Image src={props.image} />
    </Container>
  );
}
