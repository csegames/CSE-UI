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
import { useChatPanes } from '../state/panesState';

const Container = styled.div`
  position: absolute;
  left: 40px;
  top: 400px;
  color: #999;
`;

const TabHeaders = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap-reverse;
  justify-items: flex-start;
  justify-content: flex-start;
  align-items: stretch;
  align-content: flex-end;
`;

const Menu = styled.div`
  flex: 0 0 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer !important;
  background: #0f0f0f;
  padding: 7px 5px;
`;

const AddTab = styled.div`
  flex: 0 0 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer !important;
  background: #0f0f0f;
  padding: 7px 5px;
`;

export interface Props {
  pane: string;
}

export function Pane(props: Props) {
  const [tabs] = useChatTabs();
  const [panes] = useChatPanes();

  const pane = panes.panes[props.pane];

  const [state, setState] = useState({
    currentBody: pane.tabs[0],
  });

  useEffect(() => {
    if (state.currentBody !== tabs.activeTab && pane.tabs[tabs.activeTab]) {
      setState({
        ...state,
        currentBody: tabs.activeTab,
      });
    }
  }, [tabs.activeTab]);

  return (
    <Container id={'chat-pane-' + props.pane} {...pane.position}>
      <TabHeaders>
        <Menu onClick={e => console.log('menu')}>
          <i className="fas fa-bars"></i>
        </Menu>
        {pane.tabs.map(id => {
            const tab = tabs.tabs[id];
            if (!tab) return null;
            return <TabHeader 
              id={id}
              key={id}
              name={tab.name}
              icon={''}
              active={id === tabs.activeTab}
              editMode={false}
            />;
          })}
        <AddTab onClick={e => console.log('add tab')}>
          <i className="fal fa-plus"></i>
        </AddTab>
      </TabHeaders>
      <TabBody
        isActive={state.currentBody === tabs.activeTab}
        info={tabs.tabs[state.currentBody]}
      />
    </Container>
  );
}
