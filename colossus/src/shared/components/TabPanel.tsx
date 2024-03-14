/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { mockEvents } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

export interface TabPanelStyle {
  tabPanel: string;
  tabs: string;
  tab: string;
  activeTab: string;
  contentContainer: string;
  content: string;
  contentHidden: string;
}

const Container = 'Shared-TabPanel-Container';
const Tabs = 'Shared-TabPanel-Tabs';
const Tab = 'Shared-TabPanel-Tab';
const ContentContainer = 'Shared-TabPanel-ContentContainer';
const Content = 'Shared-TabPanel-Content';
const ContentHidden = 'Shared-TabPanel-ContentHidden';

export interface TabItem<T> {
  name?: string;
  shouldTriggerNavEvent?: boolean;
  rendersContent: string;
  tab: T;
}

export interface ContentItem {
  name?: string;
  content: RenderItem<Partial<{ active: boolean }>>;
}

export interface RenderItem<T> {
  render: JSX.Element | ((props: T) => JSX.Element);
  props?: any;
}

export interface TabPanelProps<T> {
  styles?: Partial<TabPanelStyle>;

  // Array of tabs that reference content
  tabs: TabItem<T>[];
  renderTab: (tab: T, active?: boolean) => JSX.Element;

  // Array of content that gets referenced by rendersContent field of tabs prop
  content: ContentItem[];

  // the default tab which will be selected on initial render. (default 0)
  defaultTabIndex?: number;
  activeTabIndex?: number;
  onActiveTabChanged?: (tabIndex: number, name: string) => void;

  // Should this component render all tab content hidden. (default false)
  alwaysRenderContent?: boolean;

  // Render a divider between tabs. OPTIONAL (default null)
  renderTabDivider?: () => JSX.Element;

  // Render extra items alongside the tabs e.g. Search Input. OPTIONAL (defualt null)
  renderExtraTabItems?: () => JSX.Element;
}

export interface TabPanelState {
  activeIndex: number;
}

export class TabPanel<TabData> extends React.Component<TabPanelProps<TabData>, TabPanelState> {
  private didMount: boolean;

  public get activeTabIndex(): number {
    return typeof this.props.activeTabIndex === 'number' ? this.props.activeTabIndex : this.state.activeIndex;
  }

  public set activeTabIndex(idx: number) {
    if (!this.didMount || this.state.activeIndex === idx) return;
    this.setState({ activeIndex: idx });
  }

  constructor(props: TabPanelProps<any>) {
    super(props);
    this.state = {
      activeIndex: props.defaultTabIndex || 0
    };
  }

  public render() {
    const customStyles = this.props.styles || {};

    return (
      <div className={`${Container} ${customStyles.tabPanel}`}>
        {this.renderTabs(customStyles)}
        <div className={`${ContentContainer} ${customStyles.contentContainer}`}>
          {this.props.alwaysRenderContent
            ? this.renderAllContent(customStyles)
            : this.renderActiveContent(customStyles)}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    this.didMount = true;
  }

  public componentWillUnmount() {
    this.didMount = false;
  }

  private renderTabs = (customStyle: Partial<TabPanelStyle>) => {
    return (
      <div className={`${Tabs} ${customStyle.tabs ? customStyle.tabs : ''}`}>
        {this.props.tabs.map((tabItem, index) => {
          const selected = index === this.activeTabIndex;
          if (typeof this.props.renderTabDivider === 'function') {
            return [
              <div
                key={index}
                className={`${Tab} ${selected ? customStyle.activeTab : customStyle.tab}`}
                onClick={() => this.selectIndex(index, tabItem.name, tabItem.shouldTriggerNavEvent)}
              >
                {this.props.renderTab(tabItem.tab, selected)}
              </div>,
              index !== this.props.tabs.length - 1 ? (
                <React.Fragment key={`tab-divider-${index}`}>{this.props.renderTabDivider()}</React.Fragment>
              ) : null
            ];
          } else {
            return (
              <div
                key={index}
                className={`${Tab} ${selected ? customStyle.activeTab : customStyle.tab}`}
                onClick={() => this.selectIndex(index, tabItem.name, tabItem.shouldTriggerNavEvent)}
              >
                {this.props.renderTab(tabItem.tab, selected)}
              </div>
            );
          }
        })}
        {this.props.renderExtraTabItems && this.props.renderExtraTabItems()}
      </div>
    );
  };

  // Renders active content visibly, renders inactive content hidden
  private renderAllContent = (customStyles: Partial<TabPanelStyle>) => {
    return this.props.content.map((content, index) => {
      const active = this.props.tabs[this.activeTabIndex].rendersContent === content.name;
      const ContentRender =
        typeof content.content.render === 'function' ? <content.content.render /> : content.content.render;
      return (
        <div key={index} className={`${Content} ${!active ? ContentHidden : customStyles.content}`}>
          {ContentRender}
        </div>
      );
    });
  };

  // Render only the active content.
  private renderActiveContent = (customStyles: Partial<TabPanelStyle>) => {
    let activeItem: ContentItem;
    for (const content of this.props.content) {
      if (this.props.tabs[this.activeTabIndex].rendersContent === content.name) {
        activeItem = content;
      }
    }
    if (!activeItem || !activeItem.content) {
      console.warn(`Tab Panel activeItem has no content`);
      return <div className={`${Content} ${customStyles.content}`}>-</div>;
    }
    const ContentRender =
      typeof activeItem.content.render === 'function' ? (
        <activeItem.content.render {...activeItem.content.props} />
      ) : (
        activeItem.content.render
      );
    return <div className={`${Content} ${customStyles.content}`}>{ContentRender}</div>;
  };

  private selectIndex = (index: number, name: string, shouldTriggerNavEvent: boolean) => {
    if (shouldTriggerNavEvent) {
      mockEvents.triggerNavigate(name);
    }
    if (this.activeTabIndex === index) return;
    if (!this.props.activeTabIndex) {
      this.setState({ activeIndex: index });
    }
    if (this.props.onActiveTabChanged) {
      this.props.onActiveTabChanged(index, name);
    }
  };
}
