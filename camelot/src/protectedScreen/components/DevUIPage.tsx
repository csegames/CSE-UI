/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';

import { BaseGameInterface } from '@csegames/library/dist/_baseGame/BaseGameInterface';
import { DevUIButtonParams } from '@csegames/library/dist/devUI/DevUIButtonParams';
import { Content, DevUIPageModel } from '@csegames/library/dist/devUI/DevUIPageModel';
import { TabPanel } from '../../shared/components/TabPanel';

//Styles
const Root = 'DevUI-DevUIPage-Root';
const Title = 'DevUI-DevUIPage-Title';
const Pages = 'DevUI-DevUIPage-Pages';
const Button = 'DevUI-DevUIPage-Button';
const ContentContainerStyle = 'DevUI-DevUIPage-ContentContainer';
const ContentStyle = 'DevUI-DevUIPage-Content';
const ContentRoot = 'DevUI-DevUIPage-ContentRoot';
const TabPanelStyle = 'DevUI-DevUIPage-TabPanel';
const TabStyle = 'DevUI-DevUIPage-Tab';
const ActiveTabStyle = 'DevUI-DevUIPage-ActiveTab';
const TableRoot = 'DevUI-DevUIPage-TableRoot';
const TableContentWrapper = 'DevUI-DevUIPage-TableContentWrapper';

interface Props {
  page: Partial<DevUIPageModel>;
  game: BaseGameInterface;
}

export class DevUIPage extends React.PureComponent<Props> {
  private tabPanel: any;
  public render(): JSX.Element {
    const page = this.props.page;
    // tslint:disable-next-line:no-eval
    if (page.script) {
      // TODO : purge evil
      eval(page.script);
    }

    return (
      <div className={Root}>
        {page.title && <div className={Title}>{page.title}</div>}
        {page.content && <div className={ContentRoot}>{this.renderContent(page.content)}</div>}
        {page.buttons && <div>{page.buttons.map((b) => this.renderDevButton(b))}</div>}
        {page.pages && (
          <div className={Pages}>
            <TabPanel
              defaultTabIndex={page.activeTabIndex}
              ref={(ref) => (this.tabPanel = ref)}
              styles={{
                contentContainer: ContentContainerStyle,
                content: ContentStyle,
                tabPanel: TabPanelStyle,
                tab: TabStyle,
                activeTab: ActiveTabStyle
              }}
              tabs={page.pages.map((page, index) => {
                return {
                  tab: {
                    tabTitle: page.tabTitle,
                    title: page.title
                  },
                  rendersContent: index.toString()
                };
              })}
              renderTab={(tab: { tabTitle?: string; title?: string }) => <span>{tab.tabTitle || tab.title}</span>}
              content={page.pages.map((page, index) => {
                return {
                  name: index.toString(),
                  content: {
                    render: () => <DevUIPage game={this.props.game} page={page} />
                  }
                };
              })}
            />
          </div>
        )}
      </div>
    );
  }

  public componentWillReceiveProps(nextProps: Props): void {
    if (this.props.page.activeTabIndex !== nextProps.page.activeTabIndex) {
      this.tabPanel.activeTabIndex = nextProps.page.activeTabIndex;
    }
  }

  private renderDevButton(button: DevUIButtonParams): JSX.Element {
    return (
      <div
        key={button.title}
        className={Button}
        onClick={() => {
          if (button.command) {
            this.props.game.sendSlashCommand(button.command);
          } else if (button.call) {
            const fn = this.props.game[button.call];
            if (typeof fn === 'function') {
              if (button.params) {
                fn.call(this, ...button.params);
              } else {
                fn.call(this);
              }
            }
          }
        }}
      >
        {this.props.page.title}
      </div>
    );
  }

  private renderContent(content: Content): JSX.Element {
    if (typeof content === 'string') {
      return <div dangerouslySetInnerHTML={{ __html: this.parseTemplate(content) }} />;
    }
    return (
      <table className={TableRoot}>
        {Object.keys(content).map((k) => (
          <tr className={TableContentWrapper}>
            <th className={TableContentWrapper}>{k}</th>
            <td className={TableContentWrapper}>{this.renderContent(content[k])}</td>
          </tr>
        ))}
      </table>
    );
  }

  // TODO : we need to ditch eval() here in favor of always using an explicit set of supported keys to look up
  private parseTemplate(template: string): string {
    // Replace statements wrapped with %% with their retrieved data ex.) %% graphql.data.myCharacter.name %%
    return template.replace(/%%([\s\S]*?)%%/g, (m: any, key: any) => {
      // @ts-ignore: no-unused-locals
      const data = this.props.data;
      // @ts-ignore: no-unused-locals
      const game = this.props.game;
      // TODO : purge evil
      return eval(key) || '';
    });
  }
}
