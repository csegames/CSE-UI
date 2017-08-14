/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 15:27:25
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-14 15:56:05
 */

import * as React from 'react';

import { ListenerInfo, events, TabPanel, TabItem, ContentItem } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import CharacterInfo from './CharacterInfo/CharacterInfo';
import Inventory from './Inventory/Inventory';
import PaperDoll from './PaperDoll/PaperDollContainer';
import { InventoryItemFragment } from '../../../gqlInterfaces';
import { colors } from '../lib/constants';

export interface CharacterMainStyle extends StyleDeclaration {
  characterMain: React.CSSProperties;
  tabPanelContainer: React.CSSProperties;
  tab: React.CSSProperties;
  tabText: React.CSSProperties;
  tabsContainer: React.CSSProperties;
  activeTab: React.CSSProperties;
  splitPanel: React.CSSProperties;
  backgroundImg: React.CSSProperties;
}

export const defaultCharacterMainStyle: CharacterMainStyle = {
  characterMain: {
    display: 'flex',
    flex: '1 1 auto',
    width: '100%',
    height: '100%',
    alignItems: 'stretch',
    overflowX: 'hidden',
    overflowY: 'hidden',
    userSelect: 'none',
    '-webkit-user-select': 'none',
  },

  tabPanelContainer: {
    borderLeft: '1px solid #444',
  },

  tabsContainer: {
    zIndex: 1,
    backgroundColor: colors.primaryTabPanelColor,
  },

  tab: {
    flex: 1,
    padding: '5px 15px',
    color: colors.tabColorRed,
    backgroundColor: colors.tabColorGray,
    cursor: 'pointer',
    ':hover': {
      backgroundColor: colors.tabHoverColorGray,
    },
    ':active': {
      backgroundColor: colors.tabClickColorGray,
    },
  },

  activeTab: {
    flex: 1,
    padding: '5px 15px',
    color: colors.tabColorGray,
    backgroundColor: colors.tabColorRed,
    borderBottom: `2px inset ${colors.tabActiveBorder}`,
    ':hover': {
      backgroundColor: colors.tabHoverColorRed,
    },
    ':active': {
      backgroundColor: colors.tabClickColorRed,
    },
  },

  tabText: {
    fontSize: '24px',
    margin: 0,
    padding: 0,
  },

  splitPanel: {
    position: 'relative',
    width: '50%',
    height: '100%',
  },
  
  backgroundImg: {
    position: 'absolute',
    pointerEvents: 'none',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    zIndex: 0,
  },
};

export interface CharacterMainProps {
  styles?: Partial<CharacterMainStyle>;
  visibilityState?: VisibilityState;
  visibleComponent: string;
}

export interface CharacterMainState {
  inventoryItems: InventoryItemFragment[];
}

class CharacterMain extends React.Component<CharacterMainProps, CharacterMainState> {
  private hudnavListener: ListenerInfo;
  private tabPanelRef: TabPanel;

  constructor(props: CharacterMainProps) {
    super(props);
    this.state = {
      inventoryItems: [],
    };
  }

  public render() {
    const style = StyleSheet.create(defaultCharacterMainStyle);
    const customStyle = StyleSheet.create(this.props.styles || {});

    const tabs: TabItem[] = [
      {
        name: 'character',
        tab: {
          render: () => <span className={css(style.tabText, customStyle.tabText)}>CHARACTER</span>,
        },
        rendersContent: 'Character',
      },
      {
        name: 'inventory',
        tab: {
          render: () => <span className={css(style.tabText, customStyle.tabText)}>INVENTORY</span>,
        },
        rendersContent: 'Inventory',
      },
    ];

    const content: ContentItem[] = [
      {
        name: 'Character',
        content: { render: this.renderCharacterInfo },
      },
      {
        name: 'Inventory',
        content: { render: this.renderInventory },
      },
    ];
    
    return (
      <div className={css(style.characterMain, customStyle.characterMain)}>
        <div className={css(style.splitPanel, customStyle.splitPanel)}>
          <PaperDoll inventoryItems={this.state.inventoryItems} visibleComponent={this.props.visibleComponent} />
        </div>
        <div className={css(style.splitPanel, customStyle.splitPanel)}>
          <img src={'images/inventorybg.png'} className={css(style.backgroundImg, customStyle.backgroundImg)} />
          <TabPanel
            ref={ref => this.tabPanelRef = ref}
            defaultTabIndex={1}
            tabs={tabs}
            content={content}
            styles={{
              tabPanel: defaultCharacterMainStyle.tabPanelContainer,
              tabs: defaultCharacterMainStyle.tabsContainer,
              tab: defaultCharacterMainStyle.tab,
              activeTab: defaultCharacterMainStyle.activeTab,
            }}
            onActiveTabChanged={this.selectTab}
            alwaysRenderContent={true}
          />
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.hudnavListener = events.on('hudnav--navigate', this.onHudNavigate);
  }

  public componentWillUnmount() {
    events.off(this.hudnavListener);
  }
  
  private renderCharacterInfo = () => {
    return <CharacterInfo />;
  }

  private renderInventory = () => {
    return (
      <Inventory
        inventoryItems={this.state.inventoryItems}
        onChangeInventoryItems={this.onChangeInventoryItems}
        visibleComponent={this.props.visibleComponent} />
    );
  }

  private onHudNavigate = (name: string) => {
    switch (name) {
      case 'inventory': {
        this.tabPanelRef.activeTabIndex = 1;
        break;
      }
      case 'equippedgear': {
        this.tabPanelRef.activeTabIndex = 0;
        break;
      }
      case 'character': {
        this.tabPanelRef.activeTabIndex = 0;
        break;
      }
      default: {
        break;
      }
    }
  }

  private selectTab = (index: number, name: string) => {
    events.fire('hudnav--navigate', name);
  }

  private onChangeInventoryItems = (inventoryItems: InventoryItemFragment[]) => {
    this.setState({ inventoryItems });
  }
}

export default CharacterMain;
