/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 15:57:50
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-14 12:52:49
 */

import * as React from 'react';
import * as _ from 'lodash';

import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

export interface TabPanelStyle extends StyleDeclaration {
  tabPanel: React.CSSProperties;
  tabs: React.CSSProperties;
  tab: React.CSSProperties;
  activeTab: React.CSSProperties;
  contentContainer: React.CSSProperties;
  content: React.CSSProperties;
  contentHidden: React.CSSProperties;
}

export const defaultTabPanelStyle: TabPanelStyle = {
  tabPanel: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignContent: 'stretch',
  },

  tabs: {
    flex: '0 0 auto',
    display: 'flex',
  },

  tab: {
    flex: '0 0 auto',
    '-webkit-user-select': 'none',
    cursor: 'pointer',
  },

  activeTab: {
    flex: '0 0 auto',
    '-webkit-user-select': 'none',
  },

  contentContainer: {
    flex: '1',
    position: 'relative',
    height: 0,
    overflow: 'hidden',
  },

  content: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    height: '100%',
    width: '100%',
  },

  contentHidden: {
    visibility: 'hidden',
    '-webkit-user-select': 'none',
    pointerEvents: 'none',
  },
};

export interface TabItem {
  name?: string;
  tab: RenderItem<Partial<{ active: boolean }>>;
  rendersContent: string;
}

export interface ContentItem {
  name?: string;
  content: RenderItem<Partial<{ active: boolean }>>;
}

export interface RenderItem<T> {
  render: (props: T) => JSX.Element;
  props?: any;
}

export interface TabPanelProps {
  styles?: Partial<TabPanelStyle>;

  // Array of tabs that reference content
  tabs: TabItem[];

  // Array of content that gets referenced by rendersContent field of tabs prop
  content: ContentItem[];

  // the default tab which will be selected on initial render. (default 0)
  defaultTabIndex?: number;
  onActiveTabChanged?: (tabIndex: number, name: string) => void;

  // Should this component render all tab content hidden. (default false)
  alwaysRenderContent?: boolean;
}

export interface TabPanelState {
  activeIndex: number;
}

export class TabPanel extends React.Component<TabPanelProps, TabPanelState> {
  private didMount: boolean;

  public get activeTabIndex(): number {
    return this.state.activeIndex;
  }

  public set activeTabIndex(idx: number) {
    if (!this.didMount || this.state.activeIndex === idx) return;
    this.setState({ activeIndex: idx });
  }


  constructor(props: TabPanelProps) {
    super(props);
    this.state = {
      activeIndex: props.defaultTabIndex || 0,
    };
  }

  public render() {
    const style = StyleSheet.create(defaultTabPanelStyle);
    const customStyle = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(style.tabPanel, customStyle.tabPanel)}>
        {this.renderTabs(style, customStyle)}
        <div className={css(style.contentContainer, customStyle.contentContainer)}>
          {this.props.alwaysRenderContent
            ? this.renderAllContent(style, customStyle)
            : this.renderActiveContent(style, customStyle)}
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

  private renderTabs = (style: TabPanelStyle, customStyle: Partial<TabPanelStyle>) => {
    return (
      <div className={css(style.tabs, customStyle.tabs)}>
        {this.props.tabs.map((tabItem, index) => {
          const selected = index === this.activeTabIndex;
          return (
            <div
              className={css(
                style.tab,
                customStyle.tab,
                selected && style.activeTab,
                selected && customStyle.activeTab,
              )}
              onClick={() => this.selectIndex(index, tabItem.name)}
              key={index}>
              <tabItem.tab.render active={selected} {...tabItem.tab.props} />
            </div>
          );
        })}
      </div>
    );
  }

  // Renders active content visibly, renders inactive content hidden
  private renderAllContent = (style: TabPanelStyle, customStyle: Partial<TabPanelStyle>) => {
    return this.props.content.map((content, index) => {
      const active = this.props.tabs[this.activeTabIndex].rendersContent === content.name;
      return (
        <div key={index}
            className={css(
              style.content,
              customStyle.content,
              !active && style.contentHidden,
              !active && customStyle.contentHidden,
            )}>
          <content.content.render {...content.content.props} />
        </div>
      );
    });
  }

  // Render only the active content.
  private renderActiveContent = (style: TabPanelStyle, customStyle: Partial<TabPanelStyle>) => {
    const activeItem = _.find(this.props.content, content =>
      this.props.tabs[this.activeTabIndex].rendersContent === content.name);
    return (
      <div className={css(style.content, customStyle.content)}>
        <activeItem.content.render {...activeItem.content.props} />
      </div>
    );
  }

  private selectIndex = (index: number, name: string) => {
    if (this.activeTabIndex === index) return;
    this.setState({ activeIndex: index });
    if (this.props.onActiveTabChanged) this.props.onActiveTabChanged(index, name);
  }
}

export default TabPanel;
