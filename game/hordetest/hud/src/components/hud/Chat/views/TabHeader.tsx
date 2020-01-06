/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { useChatTabs } from '../state/tabsState';
import { useChatTheme } from '../theme';

const Container = styled.div`
  flex: 0 0 auto;
  position: relative;
  padding: 4px 5px;
  display: flex;
  flex-direction: row;
  cursor: pointer;
  background: #0f0f0f;
  border-bottom: 2px solid #0f0f0f;
  border-left: 2px solid #2f2f2f;
  border-right: 2px solid #2f2f2f;
`;

const ActiveContainer = styled.div`
  flex: 0 0 auto;
  padding: 4px 5px;
  display: flex;
  flex-direction: row;
  border-bottom: 2px solid #ddd;
  border-left: 2px solid #2f2f2f;
  border-right: 2px solid #2f2f2f;
  position: relative;
  background: #0f0f0f;
  cursor: pointer;

  &::before {
    content: "";
    background-image: -webkit-linear-gradient(transparent, #ddd);
    background-image: linear-gradient(transparent, #ddd);
    position: absolute;
    top: -2px;
    bottom: -2px;
    left: -2px;
    width: 2px;
  }

  &::after {
    content: "";
    background-image: -webkit-linear-gradient(transparent, #ddd);
    background-image: linear-gradient(transparent, #ddd);
    position: absolute;
    top: -2px;
    bottom: -2px;
    width: 2px;
    right: -2px;
  }
`;

const ActiveOrnament = styled.img`
  position: absolute;
  bottom: 5px;
`;

const Icon = styled.img`
  flex: 0 0 auto;
  width: 1em;
  height: 1em;
  display: none;
`;

type TitleProps = { fontFamily: string; } & React.HTMLProps<HTMLSpanElement>;
const Title = styled.span`
  flex: 1 1 auto;
  text-overflow: ellipsis;
  font-size: 16px;
  font-family: ${(props: TitleProps) => props.fontFamily};
`;

const ConfigBtn = styled.i`
  flex: 0 0 auto;
  display: none;
  font-size: 14px;
`;

const CloseBtn = styled.i`
  flex: 0 0 auto;
  display: none;
  font-size: 12px;
  font-family: Caudex;
`;

export interface Props {
  name: string;
  icon: string;
  id: string;
  active: boolean;
  editMode: boolean;
}

export function TabHeader(props: Props) {
  const [tabs, setTabs] = useChatTabs();
  const theme = useChatTheme();

  const Wrapper = props.active ? ActiveContainer : Container;
  return (
    <Wrapper onClick={() => setTabs({...tabs, activeTab: props.id})}>
      <Icon src={props.icon} />
      <Title fontFamily={theme.tab.fontFamily}>{props.name}</Title>
      <ConfigBtn className='fas fa-cog' />
      <CloseBtn>X</CloseBtn>
      { props.active && <ActiveOrnament src={theme.tab.activeOrnament.hd} />}
    </Wrapper>
  );
}
