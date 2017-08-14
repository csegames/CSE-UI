/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-18 11:11:09
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 14:21:27
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { utils, TabPanel, TabItem, ContentItem } from 'camelot-unchained';
import { graphql, InjectedGraphQLProps } from 'react-apollo';

import GeneralInfo from './components/GeneralInfo';
import DefenseContainer from './components/Defense/DefenseContainer';
import OffenseContainer from './components/Offense/OffenseContainer';
import { colors } from '../../lib/constants';
import queries from '../../../../gqlDocuments';
import { CharacterInfoQuery } from '../../../../gqlInterfaces';

// TEMPORARY
import testCharacterStats from './testCharacterStats';

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
    padding: '10px 10px 0 10px',
  },

  infoContent: {
    flex: 1,
    height: 'calc(100% - 180px)',
    padding: '10px',
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

export interface CharacterInfoProps extends InjectedGraphQLProps<CharacterInfoQuery> {
  styles?: Partial<CharacterInfoStyle>;
}

class CharacterInfo extends React.Component<CharacterInfoProps, {}> {
  private tabPanelRef: any;
  public render() {
    const ss = StyleSheet.create(defaultCharacterInfoStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const { myCharacter, myOrder } = this.props.data;
    const tabs: TabItem[] = [
      {
        name: 'offense',
        tab: {
          render: () => <span className={css(ss.tabText, custom.tabText)}>Offense</span>,
        },
        rendersContent: 'Offense',
      },
      {
        name: 'defense',
        tab: {
          render: () => <span className={css(ss.tabText, custom.tabText)}>Defense</span>,
        },
        rendersContent: 'Defense',
      },
    ];
    const content: ContentItem[] = [
      {
        name: 'Offense',
        content: { render: this.renderOffenseInfo },
      },
      {
        name: 'Defense',
        content: { render: this.renderDefenseInfo },
      },
    ];
    return myCharacter ? (
      <div className={css(ss.CharacterInfo, custom.CharacterInfo)}>
        <div className={css(ss.generalInfoContainer, custom.generalInfoContainer)}>
          <GeneralInfo myCharacter={myCharacter} myOrder={myOrder} />
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
    ) : null;
  }

  private renderOffenseInfo = () => {
    return (
      <OffenseContainer offenseStats={testCharacterStats.stats.offense} />
    );
  }

  private renderDefenseInfo = () => {
    return (
      <DefenseContainer defenseStats={testCharacterStats.stats.defense} />
    );
  }
}

const CharacterInfoWithQL = graphql(queries.CharacterInfo as any)(CharacterInfo);

export default CharacterInfoWithQL;
