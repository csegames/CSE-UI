/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: fixed;
  top: 5px;
  left: 500px;
  pointer-events: all;
  cursor: pointer;
  color: white;
  background-color: orange;
  padding: 5px;

  &:hover {
    filter: brightness(110%);
  }
`;

const test = {"controlledEntityID":"","health":{"0":{"current":0,"wounds":0,"max":1},"1":{"current":0,"wounds":0,"max":0},"2":{"current":0,"wounds":0,"max":0},"3":{"current":0,"wounds":0,"max":0},"4":{"current":0,"wounds":0,"max":0},"5":{"current":0,"wounds":0,"max":0}},"gender":1,"entitySpecificResources":{},"entityID":"701afca","name":"CSE-AJ-Archer","blood":{"current":1,"max":1},"statuses":{},"classID":17,"faction":3,"race":16,"playerDifferentiator":1,"type":"player","isAlive":true,"stamina":{"current":0,"max":0},"position":{"x":0.8119839429855347,"y":-3.7655553817749023,"z":15.673234939575195}};

export interface Props {}
const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g']

export function TestButton(props: Props) {
  const [number, setNumber] = useState(0);
  function onClick() {
    const testEntity = cloneDeep(test);
    testEntity.name = testEntity.name + ' ' + alphabet[number];
    testEntity.entityID = testEntity.entityID + ' ' + alphabet[number];
    engine.trigger('entityState.update', testEntity);
    setNumber(number + 1);
  }
  return (
    <Container onClick={onClick}>Test Entity State</Container>
  );
}
