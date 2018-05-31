/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { utils, TabPanel, TabItem, ContentItem } from '@csegames/camelot-unchained';
import styled from 'react-emotion';

import GeneralInfo from './components/GeneralInfo';
import GeneralStats from './components/GeneralStats/GeneralStats';
import DefenseInfo from './components/Defense/DefenseList';
import OffenseInfo from './components/Offense/OffenseList';
import TraitsInfo from './components/TraitsInfo/TraitsInfo';
import Session from './components/Session/Session';
import { colors } from '../../lib/constants';

export interface CharacterInfoStyle extends StyleDeclaration {
  CharacterInfo: React.CSSProperties;
  generalInfoContainer: React.CSSProperties;
  tabPanelContainer: React.CSSProperties;
  tabPanelContentContainer: React.CSSProperties;
  tabPanelContent: React.CSSProperties;
  tabs: React.CSSProperties;
  tab: React.CSSProperties;
  tabText: React.CSSProperties;
  activeTab: React.CSSProperties;
  infoContent: React.CSSProperties;
}

const TabText = styled('span')`
  font-size: 18;
  margin: 0;
  padding: 0;
`;

export const defaultCharacterInfoStyle: CharacterInfoStyle = {
  CharacterInfo: {
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    width: '100%',
  },

  generalInfoContainer: {
    height: '150px',
    display: 'flex',
  },

  infoContent: {
    flex: 1,
    height: 'calc(100% - 150px)',
  },

  tabPanelContainer: {
    height: '100%',
  },

  tabPanelContentContainer: {
    paddingBottom : '10px',
    height: '100%',
    width: '100%',
  },

  tabPanelContent: {
    display: 'flex',
    height: '100%',
  },

  tabs: {
    backgroundColor: colors.primaryTabPanelColor,
  },

  tab: {
    flex: 1,
    fontSize: '18px',
    padding: '2px 5px',
    color: colors.tabColorRed,
    backgroundColor: colors.tabColorGray,
    borderRight: `1px solid ${utils.darkenColor(colors.tabColorGray, 30)}`,
    textAlign: 'center',
    ':hover': {
      backgroundColor: colors.tabHoverColorGray,
    },
    ':active': {
      backgroundColor: colors.tabClickColorGray,
    },
  },

  tabText: {
    fontSize: 18,
    margin: 0,
    padding: 0,
  },

  activeTab: {
    flex: 1,
    padding: '2px 5px',
    color: colors.tabColorGray,
    backgroundColor: colors.tabColorRed,
    ':hover': {
      backgroundColor: colors.tabHoverColorRed,
    },
    ':active': {
      backgroundColor: colors.tabClickColorRed,
    },
  },
};

export interface CharacterInfoProps {
  styles?: Partial<CharacterInfoStyle>;
}

class CharacterInfo extends React.Component<CharacterInfoProps, {}> {
  private tabPanelRef: any;
  public render() {
    const ss = StyleSheet.create(defaultCharacterInfoStyle);
    const custom = StyleSheet.create(this.props.styles || {});
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
      <div className={css(ss.CharacterInfo, custom.CharacterInfo)}>
        <div className={css(ss.generalInfoContainer, custom.generalInfoContainer)}>
          <GeneralInfo />
        </div>
        <div className={css(ss.infoContent, custom.infoContent)}>
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
        </div>
      </div>
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
