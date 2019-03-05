/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { TabPanel, TabItem, ContentItem, TabPanelStyle } from '@csegames/camelot-unchained';
import { styled } from '@csegames/linaria/react';
import { css } from '@csegames/linaria';

import GeneralInfo from './components/GeneralInfo';
import GeneralStats from './components/GeneralStats/GeneralStats';
import DefenseInfo from './components/Defense/DefenseList';
import OffenseInfo from './components/Offense/OffenseList';
import TraitsInfo from './components/TraitsInfo/TraitsInfo';
import Session from './components/Session';
import SearchInput from './components/SearchInput';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0, 0, 0, 0.3)),
  url(../images/inventory/bag-bg-grey.png), black;
`;

const GeneralInfoContainer = styled.div`
  display: flex;
  height: 200px;
`;

const InfoContent = styled.div`
  z-index: 1;
  flex: 1;
  height: calc(100% - 200px);
`;

const TabText = styled.span`
  font-size: 16px;
  margin: 0;
  padding: 0;
`;

export const defaultCharacterInfoStyle: Partial<TabPanelStyle> = {
  tabPanel: css`
    height: 100%;
  `,

  contentContainer: css`
    padding-bottom: 10px;
    height: 100%;
    width: 100%;
  `,

  content: css`
    display: flex;
    height: 100%;
  `,

  tabs: css`
    background-color: rgba(0, 0, 0, 0.5);
  `,

  tab: css`
    flex: 1;
    font-size: 18px;
    padding: 10px;
    text-transform: uppercase;
    font-family: Caudex;
    letter-spacing: 1px;
    color: #757575;
    text-align: center;
    &:hover {
      color: #B3B3B3;
    }
    &:active {
      color: #D6C4A2;
    }
  `,

  activeTab: css`
    position: relative;
    flex: 1;
    color: #D6C4A2;
    &:after {
      content: '';
      position: absolute;
      height: 6px;
      left: 0;
      right: 0;
      bottom: 5px;
      background: url(../images/character-stats/ornament-nav.png) no-repeat;
      background-size: contain;
      background-position: center;
    }
    &:hover {
      color: #D6C4A2;
    }
  `,
};

export interface CharacterInfoProps {
}

export interface CharacterInfoState {
  searchValue: string;
}

class CharacterInfo extends React.PureComponent<CharacterInfoProps, CharacterInfoState> {
  private tabPanelRef: any;
  constructor(props: CharacterInfoProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }
  public render() {
    const tabs: TabItem<{ title: string }>[] = [
      { name: 'general', tab: { title: 'General' }, rendersContent: 'General' },
      { name: 'defense', tab: { title: 'Defense' }, rendersContent: 'Defense' },
      { name: 'offense', tab: { title: 'Offense' }, rendersContent: 'Offense' },
      { name: 'traits', tab: { title: 'Traits' }, rendersContent: 'TraitsInfo' },
      { name: 'session', tab: { title: 'Session' }, rendersContent: 'Session' },
    ];
    const content: ContentItem[] = [
      { name: 'General', content: { render: this.renderGeneralInfo } },
      { name: 'Defense', content: { render: this.renderDefenseInfo } },
      { name: 'Offense', content: { render: this.renderOffenseInfo } },
      { name: 'TraitsInfo', content: { render: this.renderTraitsInfo } },
      { name: 'Session', content: { render: this.renderSessionInfo } },
    ];

    return (
      <Container>
        <GeneralInfoContainer>
          <GeneralInfo />
        </GeneralInfoContainer>
        <InfoContent>
          <TabPanel
            ref={ref => this.tabPanelRef = ref}
            alwaysRenderContent
            defaultTabIndex={0}
            tabs={tabs}
            renderTab={(tab: { title: string }) => <TabText>{tab.title}</TabText>}
            renderExtraTabItems={() => (
              <SearchInput
                searchValue={this.state.searchValue}
                onSearchChange={this.onSearchChange}
                placeholder='Filter'
              />
            )}
            onActiveTabChanged={() => {}}
            content={content}
            styles={{
              tabPanel: defaultCharacterInfoStyle.tabPanel,
              tabs: defaultCharacterInfoStyle.tabs,
              tab: defaultCharacterInfoStyle.tab,
              activeTab: defaultCharacterInfoStyle.activeTab,
              contentContainer: defaultCharacterInfoStyle.contentContainer,
              content: defaultCharacterInfoStyle.content,
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

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }

  private renderGeneralInfo = () => <GeneralStats searchValue={this.state.searchValue} />;
  private renderDefenseInfo = () => <DefenseInfo searchValue={this.state.searchValue} />;
  private renderOffenseInfo = () => <OffenseInfo searchValue={this.state.searchValue} />;
  private renderSessionInfo = () => <Session searchValue={this.state.searchValue} />;
  private renderTraitsInfo = () => <TraitsInfo searchValue={this.state.searchValue} />;
}

export default CharacterInfo;
