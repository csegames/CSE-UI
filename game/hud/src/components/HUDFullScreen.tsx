/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-14 12:43:04
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2017-09-12 16:52:52
 */

import * as React from 'react';
import {events, client, TabPanel, TabItem, ContentItem} from 'camelot-unchained';
import {StyleDeclaration, css, StyleSheet} from 'aphrodite';

import Social from '../widgets/Social';
import Character from '../widgets/Character';
import Map from '../widgets/Map';

export interface HUDFullScreenStyle extends StyleDeclaration {
  hudFullScreen: React.CSSProperties;
  navigationContainer: React.CSSProperties;
  contentContainer: React.CSSProperties;
  close: React.CSSProperties;
  navTab: React.CSSProperties;
  activeNavTab: React.CSSProperties;
}

const defaultHUDFullScreenStyle: HUDFullScreenStyle = {
  hudFullScreen: {
    position: 'fixed',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    userSelect: 'none',
    webkitUserSelect: 'none',
  },
  navigationContainer: {
    display: 'flex',
    alignItems: 'center',
    height: '35px',
    width: '100%',
    backgroundColor: '#151515',
    zIndex: 10,
  },
  contentContainer: {
    height: '100%',
    width: '100%',
    backgroundColor: '#333333',
  },
  close: {
    position: 'fixed',
    top: 5,
    right: 5,
    color: '#cdcdcd',
    fontSize: '20px',
    marginRight: '5px',
    cursor: 'pointer',
    userSelect: 'none',
    ':hover': {
      color: '#bbb',
    },
  },
  navTab: {
    minWidth: '100px',
    color: '#4C4C4C',
    borderRight: '1px solid #4C4C4C',
    textAlign: 'center',
    cursor: 'pointer',
    ':hover': {
      color: 'white',
    },
    ':active': {
      textShadow: '0px 0px 5px #fff',
    },
  },
  activeNavTab: {
    minWidth: '100px',
    color: '#E5E5E5',
    borderRight: '1px solid #4C4C4C',
    textAlign: 'center',
    cursor: 'pointer',
    ':hover': {
      color: 'white',
    },
  },
};

export interface FullScreenNavState {
  visibleComponent: string;
  initial: boolean;
}

export interface FullScreenNavProps {
  styles?: Partial<HUDFullScreenStyle>;
}

class HUDFullScreen extends React.Component<FullScreenNavProps, FullScreenNavState> {
  private navigateListener: EventListener;
  private tabPanelRef: TabPanel;

  constructor(props: any) {
    super(props);
    this.state = {
      visibleComponent: '',
      initial: true,
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultHUDFullScreenStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const tabs: TabItem[] = [
      {
        name: 'character',
        tab: {
          render: () => <span>Character</span>,
        },
        rendersContent: 'Character',
      },
      {
        name: 'inventory',
        tab: {
          render: () => <span>Inventory</span>,
        },
        rendersContent: 'Character',
      },
      {
        name: 'map',
        tab: {
          render: () => <span>Map</span>,
        },
        rendersContent: 'Map',
      },
      {
        name: 'social',
        tab: {
          render: () => <span>Social</span>,
        },
        rendersContent: 'Social',
      },
    ];

    const content: ContentItem[] = [
      {
        name: 'Character',
        content: {
          render: this.renderCharacter,
        },
      },
      {
        name: 'Map',
        content: {
          render: this.renderMap,
        },
      },
      {
        name: 'Social',
        content: {
          render: this.renderSocial,
        },
      },
    ];

    return (
      <div style={this.state.visibleComponent === '' ? {visibility: 'hidden'} : {}}>
        <TabPanel
          ref={ref => this.tabPanelRef = ref}
          tabs={tabs}
          content={content}
          styles={{
            tabPanel: defaultHUDFullScreenStyle.hudFullScreen,
            tabs: defaultHUDFullScreenStyle.navigationContainer,
            tab: defaultHUDFullScreenStyle.navTab,
            activeTab: defaultHUDFullScreenStyle.activeNavTab,
            content: defaultHUDFullScreenStyle.contentContainer,
          }}
          alwaysRenderContent={true}
          onActiveTabChanged={this.onActiveTabChanged}
        />
        <div className={css(ss.close, custom.close)} onClick={() => this.onCloseFullScreen()}>
          <i className='fa fa-times click-effect'></i>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.navigateListener = events.on('hudnav--navigate', this.handleNavigation);
    client.OnOpenUI((name: string) => {
      // a hacky way to close widget with ESC because focus() doesn't work
      // and window doesn't pick up keydown events unless window is focused
      // will need to change this one day
      if (name === 'gamemenu' && this.state.visibleComponent !== '') {
        events.fire('hudnav--navigate', 'gamemenu');
        this.onCloseFullScreen();
      }
    });
  }

  public componentWillUnmount() {
    events.off(this.navigateListener);
  }

  private renderCharacter = (prop: { active: boolean }) => {
    return <Character visibleComponent={this.state.visibleComponent} />;
  }

  private renderSocial = (prop: { active: boolean }) => {
    return <Social visibleComponent={this.state.visibleComponent} />;
  }

  private renderMap = (prop: { active: boolean }) => {
    return <Map visibleComponent={this.state.visibleComponent} />;
  }

  private handleNavigation = (name: string) => {
    switch (name) {
      case 'character': {
        this.setActiveTabIndex(0);
        this.setVisibleComponent(name);
        break;
      }
      case 'inventory': {
        this.setActiveTabIndex(1);
        this.setVisibleComponent(name);
        break;
      }
      case 'equippedgear': {
        this.setActiveTabIndex(0);
        this.setVisibleComponent(name);
        break;
      }
      case 'map': {
        this.setActiveTabIndex(2);
        this.setVisibleComponent(name);
        break;
      }
      case 'social': {
        this.setActiveTabIndex(3);
        this.setVisibleComponent(name);
        break;
      }
    }
  }

  private onActiveTabChanged = (tabIndex: number, name: string) => {
    events.fire('hudnav--navigate', name);
  }

  private setVisibleComponent = (name: string) => {
    if (this.state.initial) {
      this.setState({initial: false});
    }
    if (this.state.visibleComponent !== name) {
      this.setState({visibleComponent: name});
    } else {
      this.setState({visibleComponent: ''});
      setTimeout(() => client.ReleaseInputOwnership(), 100);
    }
  }

  private setActiveTabIndex = (tabIndex: number) => {
    if (this.state.initial) {
      setTimeout(() => this.tabPanelRef.activeTabIndex = tabIndex, 10);
    } else {
      this.tabPanelRef.activeTabIndex = tabIndex;
    }
  }

  private onCloseFullScreen = (visibleComp?: string) => {
    events.fire('hudnav--navigate', visibleComp || this.state.visibleComponent);
  }
}

export default HUDFullScreen;
