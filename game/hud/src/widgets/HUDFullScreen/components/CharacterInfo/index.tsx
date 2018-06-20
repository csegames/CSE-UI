/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { utils, TabPanel, TabItem, ContentItem } from '@csegames/camelot-unchained';
import styled, { css } from 'react-emotion';

import GeneralInfo from './components/GeneralInfo';
import GeneralStats from './components/GeneralStats/GeneralStats';
import DefenseInfo from './components/Defense/DefenseList';
import OffenseInfo from './components/Offense/OffenseList';
import TraitsInfo from './components/TraitsInfo/TraitsInfo';
import Session from './components/Session/Session';
import { colors } from '../../lib/constants';

export interface CharacterInfoStyle {
  tabPanelContainer: string;
  tabPanelContentContainer: string;
  tabPanelContent: string;
  tabs: string;
  tab: string;
  tabText: string;
  activeTab: string;
}

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: url(images/inventory/bag-bg.png);
`;

const GeneralInfoContainer = styled('div')`
  display: flex;
  height: 150px;
`;

const InfoContent = styled('div')`
  z-index: 1;
  flex: 1;
  height: calc(100% - 150px);
`;

const TabText = styled('span')`
  font-size: 18;
  margin: 0;
  padding: 0;
`;

export const defaultCharacterInfoStyle: CharacterInfoStyle = {
  tabPanelContainer: css`
    height: 100%;
  `,

  tabPanelContentContainer: css`
    padding-bottom: 10px;
    height: 100%;
    width: 100%;
  `,

  tabPanelContent: css`
    display: flex;
    height: 100%;
  `,

  tabs: css`
    background-color: ${colors.primaryTabPanelColor};
  `,

  tab: css`
    flex: 1;
    font-size: 18px;
    padding: 2px 5px;
    color: ${colors.tabColorRed};
    background-color: ${colors.tabColorGray};
    border-right: 1px solid ${utils.darkenColor(colors.tabColorGray, 30)};
    text-align: center;
    &:hover {
      background-color: ${colors.tabHoverColorGray};
    }
    &:active {
      background-color: ${colors.tabClickColorGray};
    }
  `,

  tabText: css`
    font-size: 18;
    margin: 0;
    padding: 0;
  `,

  activeTab: css`
    flex: 1;
    padding: 2px 5px;
    color: ${colors.tabColorGray};
    background-color: ${colors.tabColorRed};
    &:hover {
      background-color: ${colors.tabHoverColorRed};
    }
    &:active {
      background-color: ${colors.tabClickColorRed};
    }
  `,
};

export interface CharacterInfoProps {
  styles?: Partial<CharacterInfoStyle>;
}

class CharacterInfo extends React.Component<CharacterInfoProps, {}> {
  private tabPanelRef: any;
  public render() {
    const tabs: TabItem[] = [
      {
        name: 'general',
        tab: {
          render: () => <TabText>General</TabText>,
        },
        rendersContent: 'General',
      },
      {
        name: 'defense',
        tab: {
          render: () => <TabText>Defense</TabText>,
        },
        rendersContent: 'Defense',
      },
      {
        name: 'offense',
        tab: {
          render: () => <TabText>Offense</TabText>,
        },
        rendersContent: 'Offense',
      },
      {
        name: 'traits',
        tab: {
          render: () => <TabText>Boons/Banes</TabText>,
        },
        rendersContent: 'TraitsInfo',
      },
      {
        name: 'session',
        tab: {
          render: () => <TabText>Session</TabText>,
        },
        rendersContent: 'Session',
      },
    ];
    const content: ContentItem[] = [
      {
        name: 'General',
        content: { render: this.renderGeneralInfo },
      },
      {
        name: 'Defense',
        content: { render: this.renderDefenseInfo },
      },
      {
        name: 'Offense',
        content: { render: this.renderOffenseInfo },
      },
      {
        name: 'TraitsInfo',
        content: { render: this.renderTraitsInfo },
      },
      {
        name: 'Session',
        content: { render: this.renderSessionInfo },
      },
    ];

    return (
      <Container>
        <GeneralInfoContainer>
          <GeneralInfo />
        </GeneralInfoContainer>
        <InfoContent>
          <TabPanel
            ref={ref => this.tabPanelRef = ref}
            defaultTabIndex={0}
            tabs={tabs}
            onActiveTabChanged={() => {}}
            content={content}
            styles={{
              tabPanel: defaultCharacterInfoStyle.tabPanelContainer,
              tabs: defaultCharacterInfoStyle.tabs,
              tab: defaultCharacterInfoStyle.tab,
              activeTab: defaultCharacterInfoStyle.activeTab,
              contentContainer: defaultCharacterInfoStyle.tabPanelContentContainer,
              content: defaultCharacterInfoStyle.tabPanelContent,
            }}
          />
        </InfoContent>
      </Container>
    );
  }

  public componentDidCatch(error: Error, info: any) {
    console.error(error);
    console.log(info);
  }

  private renderGeneralInfo = () => <GeneralStats />;
  private renderDefenseInfo = () => <DefenseInfo />;
  private renderOffenseInfo = () => <OffenseInfo />;
  private renderSessionInfo = () => <Session />;
  private renderTraitsInfo = () => <TraitsInfo />;
}

export default CharacterInfo;
