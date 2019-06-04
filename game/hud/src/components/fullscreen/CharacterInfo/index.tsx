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
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0, 0, 0, 0.3)),
  url(../images/inventory/bag-bg-grey.png), black;
`;

// #region GeneralInfoContaier constants
const GENERAL_INFO_CONTAINER_HEIGHT = 400;
// #endregion
const GeneralInfoContainer = styled.div`
  display: flex;
  height: ${GENERAL_INFO_CONTAINER_HEIGHT}px;

  @media (max-width: 2560px) {
    height: ${GENERAL_INFO_CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${GENERAL_INFO_CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

const InfoContent = styled.div`
  z-index: 1;
  flex: 1;
  height: calc(100% - ${GENERAL_INFO_CONTAINER_HEIGHT}px);

  @media (max-width: 2560px) {
    height: calc(100% - ${GENERAL_INFO_CONTAINER_HEIGHT * MID_SCALE}px);
  }

  @media (max-width: 1920px) {
    height: calc(100% - ${GENERAL_INFO_CONTAINER_HEIGHT * HD_SCALE}px);
  }
`;

// #region TabText constants
const TAB_TEXT_FONT_SIZE = 32;
// #endregion
const TabText = styled.span`
  font-size: ${TAB_TEXT_FONT_SIZE}px;
  margin: 0;
  padding: 0;

  @media (max-width: 2560px) {
    font-size: ${TAB_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TAB_TEXT_FONT_SIZE * MID_SCALE}px;
  }
`;
// #region ContentContainer constants
const CONTENT_CONTAINER_PADDING_BOTTOM = 20;
// #endregion
// #region Tab constants
const TAB_FONT_SIZE = 36;
const TAB_LETTER_SPACING = 2;
const TAB_PADDING = 20;
const ACTIVE_TAB_ORNAMENT_HEIGHT = 12;
// #endregion
export const defaultCharacterInfoStyle: Partial<TabPanelStyle> = {
  tabPanel: css`
    height: 100%;
  `,

  contentContainer: css`
    padding-bottom: ${CONTENT_CONTAINER_PADDING_BOTTOM}px;
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
    font-size: ${TAB_FONT_SIZE}px;
    padding: ${TAB_PADDING}px;
    letter-spacing: ${TAB_LETTER_SPACING}px;
    text-transform: uppercase;
    font-family: Caudex;
    color: #757575;
    text-align: center;
    &:hover {
      color: #B3B3B3;
    }
    &:active {
      color: #D6C4A2;
    }

    @media (max-width: 2560px) {
      font-size: ${TAB_FONT_SIZE * MID_SCALE}px;
      padding: ${TAB_PADDING * MID_SCALE}px;
      letter-spacing: ${TAB_LETTER_SPACING * MID_SCALE}px;
    }

    @media (max-width: 1920px) {
      font-size: ${TAB_FONT_SIZE * HD_SCALE}px;
      padding: ${TAB_PADDING * HD_SCALE}px;
      letter-spacing: ${TAB_LETTER_SPACING * HD_SCALE}px;
    }
  `,

  activeTab: css`
    position: relative;
    flex: 1;
    color: #D6C4A2;
    font-size: ${TAB_FONT_SIZE}px;
    padding: ${TAB_PADDING}px;
    letter-spacing: ${TAB_LETTER_SPACING}px;
    text-transform: uppercase;
    font-family: Caudex;
    text-align: center;
    &:after {
      content: '';
      position: absolute;
      height: ${ACTIVE_TAB_ORNAMENT_HEIGHT}px;
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

    @media (max-width: 2560px) {
      font-size: ${TAB_FONT_SIZE * MID_SCALE}px;
      padding: ${TAB_PADDING * MID_SCALE}px;
      letter-spacing: ${TAB_LETTER_SPACING * MID_SCALE}px;
      &:before {
        height: ${ACTIVE_TAB_ORNAMENT_HEIGHT * MID_SCALE}px;
      }
    }

    @media (max-width: 1920px) {
      font-size: ${TAB_FONT_SIZE * HD_SCALE}px;
      padding: ${TAB_PADDING * HD_SCALE}px;
      letter-spacing: ${TAB_LETTER_SPACING * HD_SCALE}px;
      &:after {
        height: ${ACTIVE_TAB_ORNAMENT_HEIGHT * HD_SCALE}px;
      }
    }
  `,
};

export interface CharacterInfoProps {
}

export interface CharacterInfoState {
  searchValue: string;
}

class CharacterInfo extends React.PureComponent<CharacterInfoProps, CharacterInfoState> {
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
