import * as React from 'react';
import { events, client, jsKeyCodes, ListenerInfo, TabPanel, TabItem, ContentItem } from 'camelot-unchained';
import { StyleDeclaration, css, StyleSheet } from 'aphrodite';

import Social from '../widgets/Social';
import Character from '../widgets/Character';

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
}

export interface FullScreenNavProps {
  styles?: Partial<HUDFullScreenStyle>;
}

class HUDFullScreen extends React.Component<FullScreenNavProps, FullScreenNavState> {
  private navigateListener: ListenerInfo;
  private tabPanelRef: TabPanel;
  private fullScreenRef: HTMLDivElement;

  constructor(props: any) {
    super(props);
    this.state = {
      visibleComponent: '',
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
        name: 'Social',
        content: {
          render: this.renderSocial,
        },
      },
    ];
    return (
      <div
        tabIndex={1}
        ref={ref => this.fullScreenRef = ref}
        style={this.state.visibleComponent === '' ? { visibility: 'hidden' } : {}}>
        <TabPanel
          ref={(ref) => this.tabPanelRef = ref}
          tabs={tabs}
          content={content}
          styles={{
            tabPanel: defaultHUDFullScreenStyle.hudFullScreen,
            tabs: defaultHUDFullScreenStyle.navigationContainer,
            tab: defaultHUDFullScreenStyle.navTab,
            activeTab: defaultHUDFullScreenStyle.activeNavTab,
            content: defaultHUDFullScreenStyle.contentContainer,
          }}          
          onActiveTabChanged={this.onActiveTabChanged}
          alwaysRenderContent={true}
        />
        <div className={css(ss.close, custom.close)} onClick={this.onCloseFullScreen}>
          <i className='fa fa-times click-effect'></i>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.navigateListener = events.on('hudnav--navigate', this.handleNavigation);
    window.addEventListener('keydown', this.onKeyDown);
  }

  public componentWillUnmount() {
    events.off(this.navigateListener);
    window.removeEventListener('keydown', this.onKeyDown);
  }

  private renderCharacter = (prop: { active: boolean }) => {
    return <Character />;
  }

  private renderSocial = (prop: { active: boolean }) => {
    return <Social />;
  }

  private handleNavigation = (name: string) => {
    switch (name) {
      case 'character': {
        this.tabPanelRef.activeTabIndex = 0;
        this.setVisibleComponent(name);
        break;
      }
      case 'inventory': {
        this.tabPanelRef.activeTabIndex = 1;
        this.setVisibleComponent(name);
        break;
      }
      case 'equippedgear': {
        this.tabPanelRef.activeTabIndex = 1;
        this.setVisibleComponent(name);
        break;
      }
      case 'social': {
        this.tabPanelRef.activeTabIndex = 2;
        this.setVisibleComponent(name);
        break;
      }
    }
  }

  private onActiveTabChanged = (tabIndex: number, name: string) => {
    events.fire('hudnav--navigate', name);
  }

  private setVisibleComponent = (name: string) => {
    if (this.state.visibleComponent !== name) {
      this.setState({ visibleComponent: name });
      client.RequestInputOwnership();
    } else {
      this.setState({ visibleComponent: '' });
      client.ReleaseInputOwnership();
    }
  }

  private onCloseFullScreen = () => {
    events.fire('hudnav--navigate', this.state.visibleComponent);
  }

  private onKeyDown = (e : KeyboardEvent) => {
    if ((e.which === jsKeyCodes.ESC || e.which === jsKeyCodes.C || e.which === jsKeyCodes.I)
        && this.state.visibleComponent !== '') {
      this.onCloseFullScreen();
      setTimeout(() => client.ReleaseInputOwnership(), 100);
    }
  }
}

export default HUDFullScreen;
