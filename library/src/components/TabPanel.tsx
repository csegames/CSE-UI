/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css, cx } from 'react-emotion';

export interface TabPanelStyle {
  tabPanel: string;
  tabs: string;
  tab: string;
  activeTab: string;
  contentContainer: string;
  content: string;
  contentHidden: string;
}

const Container = styled('div')`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-content: stretch;
`;

const Tabs = styled('div')`
  flex: 0 0 auto;
  display: flex;
`;

const Tab = styled('div')`
  flex: 0 0 auto;
  -webkit-user-select: none;
  cursor: pointer;
`;

const ContentContainer = styled('div')`
  flex: 1;
  position: relative;
  height: 0;
  overflow: hidden;
`;

const Content = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
`;

const ContentHidden = css`
  visibility: hidden;
  -webkit-user-select: none;
  pointer-events: none;
`;

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
    const customStyles = this.props.styles || {};

    return (
      <Container className={customStyles.tabPanel}>
        {this.renderTabs(customStyles)}
        <ContentContainer className={customStyles.contentContainer}>
          {this.props.alwaysRenderContent
            ? this.renderAllContent(customStyles)
            : this.renderActiveContent(customStyles)}
        </ContentContainer>
      </Container>
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
      <Tabs className={customStyle.tabs}>
        {this.props.tabs.map((tabItem, index) => {
          const selected = index === this.activeTabIndex;
          return (
            <Tab
              key={index}
              className={selected ? cx(customStyle.tab, customStyle.activeTab) : customStyle.tab}
              onClick={() => this.selectIndex(index, tabItem.name)}>
                <tabItem.tab.render active={selected} {...tabItem.tab.props} />
            </Tab>
          );
        })}
      </Tabs>
    );
  }

  // Renders active content visibly, renders inactive content hidden
  private renderAllContent = (customStyles: Partial<TabPanelStyle>) => {
    return this.props.content.map((content, index) => {
      const active = this.props.tabs[this.activeTabIndex].rendersContent === content.name;
      return (
        <Content
          key={index}
          className={!active ? cx(customStyles.content, ContentHidden, customStyles.contentHidden) : customStyles.content}>
            <content.content.render {...content.content.props} />
        </Content>
      );
    });
  }

  // Render only the active content.
  private renderActiveContent = (customStyles: Partial<TabPanelStyle>) => {
    const activeItem = _.find(this.props.content, content =>
      this.props.tabs[this.activeTabIndex].rendersContent === content.name);
    return (
      <Content className={customStyles.content}>
        <activeItem.content.render {...activeItem.content.props} />
      </Content>
    );
  }

  private selectIndex = (index: number, name: string) => {
    if (this.activeTabIndex === index) return;
    this.setState({ activeIndex: index });
    if (this.props.onActiveTabChanged) this.props.onActiveTabChanged(index, name);
  }
}

export default TabPanel;
