/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';
import { useChatTabs } from '../state/tabsState';
import { TabHeader } from './TabHeader';
import { TabBody } from './TabBody';

type ContainerProps = {width: number; height: number} & React.HTMLProps<HTMLDivElement>;
const Container = styled.div`
  width: ${(props: ContainerProps) => props.width}px;
  height: ${(props: ContainerProps) => props.height}px;
`;

const TabHeaders = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-items: flex-start;
  justify-content: flex-start;
  align-items: flex-end;
  align-content: flex-end;
`;

const Menu = styled.div`
  flex: 0 0 25px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer !important;
`;

const AddTab = styled.div`
  flex: 0 0 25px;
  width: 25px;
  height: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer !important;
`;

export interface Props {
  tabs: string[]; // what tabs to show and the order they are shown
  position: {
    width: number;
    height: number;
  }
}

export function Pane(props: Props) {
  const [tabs] = useChatTabs();

  const [state, setState] = useState({
    currentBody: props.tabs[0],
  });

  useEffect(() => {
    if (state.currentBody !== tabs.activeTab && props.tabs[tabs.activeTab]) {
      setState({
        ...state,
        currentBody: tabs.activeTab,
      });
    }
  }, [tabs.activeTab])

  return (
    <Container {...props.position}>
      <TabHeaders>
        <Menu onClick={e => console.log('menu')}>
          <i className="fas fa-bars"></i>
        </Menu>
        {props.tabs.map(id => {
            const tab = tabs.tabs[id];
            if (!tab) return null;
            <TabHeader 
              id={id}
              name={tab.name}
              icon={''}
              active={id === tabs.activeTab}
              editMode={false}
            />
          })}
        <AddTab onClick={e => console.log('add tab')}>
          <i className="fal fa-plus"></i>
        </AddTab>
        <TabBody
          isActive={state.currentBody === tabs.activeTab}
          info={tabs[state.currentBody]}
        />
      </TabHeaders>

    </Container>
  );
}
