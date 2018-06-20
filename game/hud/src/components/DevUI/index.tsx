/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';

// @ts-ignore
import { client, webAPI, events } from '@csegames/camelot-unchained';
import { TabPanel } from '@csegames/camelot-unchained/lib/components';
import { ObjectMap } from '@csegames/camelot-unchained/lib/utils/ObjectMap';
import { GraphQL, GraphQLData } from '@csegames/camelot-unchained/lib/graphql/react';
import { GraphQLQuery } from '@csegames/camelot-unchained/lib/graphql/query';
import ClientInterface from '@csegames/camelot-unchained/lib/core/clientInterface';

type Content = string | ObjectMap<any>;

// @ts-ignore:no-unused-locals
window['webAPI'] = webAPI;
window['events'] = events;

export interface Button {
  title: string;

  // if set, will call slash command using this string
  command?: string;

  // if set, will call a client function of this name
  // ie.. if set to 'respawn' then 'client.respawn()' would
  // be called.
  call?: string;

  // parameters to pass into the client function call, if any
  params?: any[];
}

export interface Page {
  title: string | undefined;
  tabTitle: string | undefined;
  content: Content | undefined;
  pages: Partial<Page>[] | undefined;
  buttons: Button[] | undefined;
  data: ObjectMap<any> | undefined;
  query: string | Partial<GraphQLQuery> | undefined;
  activeTabIndex: number | undefined;
}

export interface RootPage extends Partial<Page> {
  width: number;
  height: number;
  x: number;
  y: number;
  visible: boolean;
  maximized: boolean;
  background?: string;
  showCloseButton?: boolean;
  showMaximizeButton?: boolean;
}

const Button = styled('div')`
  cursor: pointer;
  background-color: #555;
  display: inline-block;
  padding: 5px 15px;
  margin: 5px;
  text-align: center;
  &:hover {
    background-color: #777;
  }
  &:active {
    background-color: #999;
  },
`;

function evalContext(namespaces: { data: ObjectMap<any>, graphql: ObjectMap<any>, client: ClientInterface }) {
  // @ts-ignore: no-unused-locals
  const data = namespaces.data;
  // @ts-ignore: no-unused-locals
  const graphql = namespaces.graphql;
  // @ts-ignore: no-unused-locals
  const client = namespaces.client;
  // tslint:disable-next-line
  return (s: string) => { return eval(s); };
}

// @ts-ignore: no-unused-locals
function parseTemplate(template: any,
   namespaces: { data: ObjectMap<any>, graphql: ObjectMap<any>, client: ClientInterface  }) {
  const ctx = evalContext(namespaces);

  // Replace statements wrapped with %% with their retrieved data ex.) %% graphql.data.myCharacter.name %%
  return template.replace(/%%([\s\S]*?)%%/g, (m: any, key: any) => {
    return ctx(key) || '';
  });
}

class DevUIButton extends React.PureComponent<Button> {
  public render() {
    return (
      <Button
          onClick={() => {
            if (this.props.command) {
              client.SendSlashCommand(this.props.command);
            } else if (this.props.call) {
              const fn = client[this.props.call];
              if (this.props.params) {
                fn(...this.props.params);
              } else {
                fn();
              }
            }
          }}>
        {this.props.title}
      </Button>
    );
  }
}

const Content = styled('div')`
  flex: 1;
`;

class DevUIContent extends React.PureComponent<Partial<Page>> {
  public render() {
    return (
      <Content>
        {typeof this.props.content === 'string' ?
          <DevUIStringContent {...this.props} /> :
          <DevUIObjectContent {...this.props} />
        }
      </Content>
    );
  }
}

type DevUIStringContentProps = Partial<Page>;
class DevUIStringContent extends React.PureComponent<DevUIStringContentProps> {
  public render() {
    if (this.props.query) {
      return (
        <GraphQL query={this.props.query}>
          {(graphql: GraphQLData<any>) => {
            if (graphql.data) {
              const parsedContent = parseTemplate(this.props.content, {
                data: this.props.data,
                graphql: {
                  data: graphql.data,
                },
                client,
              });
              return <div dangerouslySetInnerHTML={{ __html: parsedContent }} />;
            } else {
              return <div>Loading...</div>;
            }
          }}
        </GraphQL>
      );
    } else {
      const parsedContent = parseTemplate(this.props.content, {
        data: this.props.data,
        graphql: null,
        client,
      });
      return <div dangerouslySetInnerHTML={{ __html: parsedContent }} />;
    }
  }
}

class DevUIObjectContent extends React.PureComponent<Partial<Page>> {
  public render(): JSX.Element {
    const keys = Object.keys(this.props.content);
    return (
      <table style={{ border: '1px solid #ececec', borderCollapse: 'collapse', width: '100%' }}>
        {
          keys.map(k => (
            <tr style={{ border: '1px solid #ececec', padding: '2px' }}>
              <th style={{ border: '1px solid #ececec', padding: '2px' }}>{k}</th>
              <td style={{ border: '1px solid #ececec', padding: '2px' }}>
                {typeof this.props.content[k] !== 'object'
                  ?
                    <DevUIStringContent
                      content={this.props.content[k]}
                      data={this.props.data}
                      query={this.props.query}
                    />
                  :
                    <DevUIObjectContent
                      content={this.props.content[k]}
                      data={this.props.data}
                      query={this.props.query}
                    />
                }
              </td>
            </tr>
          ))
        }
      </table>
    );
  }
}

const Page = styled('div')`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  justify-content: space-between;
  color: #ECECEC;
  user-select: none;
  -webkit-user-select: none;
`;

const Pages = styled('div')`
  flex: 1;
  display: flex;
`;

const Title = styled('div')`
  font-weight: 700;
  font-size: 1.5em;
  margin: 5px 0;
`;

class DevUIPage extends React.PureComponent<Partial<Page>> {
  private tabPanel: any;
  public render(): JSX.Element {
    return (
      <Page>
        {this.props.title && <Title>{this.props.title}</Title>}
        {this.props.content &&
          <DevUIContent
            content={this.props.content}
            data={this.props.data}
            query={this.props.query}
          />
        }
        {this.props.buttons && <div>{this.props.buttons.map(b => <DevUIButton key={b.title} {...b} />)}</div>}
        {this.props.pages && (
          <Pages>
            <TabPanel
              defaultTabIndex={this.props.activeTabIndex}
              ref={ref => this.tabPanel = ref}
              styles={{
                contentContainer: css`
                  height: auto;
                `,
                content: css`
                  position: relative;
                `,
                tabPanel: css`
                  flex: 1 1 auto;
                  width: initial;
                  height: initial;
                `,
                tab: css`
                  padding: 2px 10px;
                  background: #444;
                  border-bottom: 1px solid transparent;
                `,
                activeTab: css`
                  background: #777;
                  border-bottom: 1px solid orange;
                `,
              }}
              tabs={this.props.pages.map((p, index) => {
                return {
                  tab: {
                    render: () => <span>{p.tabTitle || p.title}</span>,
                  },
                  rendersContent: index.toString(),
                };
              })}
              content={this.props.pages.map((p, index) => {
                return {
                  name: index.toString(),
                  content: {
                    render: () => <DevUIPage {...p} />,
                  },
                };
              })} />
          </Pages>)}
      </Page>
    );
  }

  public componentWillReceiveProps(nextProps: Partial<Page>) {
    if (this.props.activeTabIndex !== nextProps.activeTabIndex) {
      this.tabPanel.activeTabIndex = nextProps.activeTabIndex;
    }
  }
}

// const testDevUI: RootPage = {
//   width: 500,
//   height: 200,
//   x: 20,
//   y: 50,
//   visible: true,
//   query: `{
//     myCharacter {
//       name
//       id
//       race
//       gender
//       traits {
//         id
//         name
//       }
//       maxHealth
//       maxBlood
//       maxStamina
//     }
//   }`,
//   content: `My Character name: %%graphql.data.myCharacter.name%% | ` +
//   `traits length: %% graphql.data.myCharacter.traits.length %% | ` +
//   `traits length * 2: %% graphql.data.myCharacter.traits.length * 2 %% |` +
//   `do you have more than 2 traits? %% graphql.data.myCharacter.traits.length > 2
//     ? '<font color="green">yes</font>' : '<font color="red">no</font>' %% | ` +
//   `traits: %%graphql.data.myCharacter.traits.map(function(t){ return t.name; }).join(', ')%%`
//   ,
// };

class DevUI extends React.PureComponent<{}, ObjectMap<RootPage> | null> {

  constructor(props: {}) {
    super(props);
    this.state = null;
  }

  public render() {
    if (!this.state) return null;
    const keys = Object.keys(this.state);
    return (
      <div>
        {keys.map((k) => {
          const page = this.state[k];
          const isMaximized = page.maximized;
          if (!page) return null;
          return (
            <div style={{
              width: isMaximized ? `100%` : `${page.width}px`,
              height: isMaximized ? `100%` : `${page.height}px`,
              top: isMaximized ? 0 : page.y,
              right: isMaximized ? 0 : 'default',
              left: isMaximized ? 0 : page.x,
              bottom: isMaximized ? 0 : 'default',
              position: 'fixed',
              visibility: page.visible ? 'visible' : 'hidden',
              background: page.background && page.background || '#111',
            }}>
            <div style={{ position: 'relative' }}>
              {page.showCloseButton ?
                <a
                  href={'#'}
                  style={{
                    position: 'absolute',
                    right: '15px',
                    top: '0px',
                    display: 'flex',
                  }}
                  onClick={() => this.setState({
                    [k]: {
                      ...page,
                      visible: false,
                    },
                  })}>X</a> : null}
                {page.showMaximizeButton ?
                  <a
                    href={'#'}
                    style={{
                      position: 'absolute',
                      right: '50px',
                      top: '0px',
                    }}
                    onClick={() => this.setState({
                      [k]: {
                        ...page,
                        maximized: isMaximized ? false : true,
                      },
                    })}>{isMaximized ? 'Minimize' : 'Maximize'}</a> : null }
              </div>
              <div
                key={k}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  overflowY: 'auto',
                  overflowX: 'hidden',
                }}>
                <div style={{ flex: 1 }}>
                  <DevUIPage {...page} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  public componentDidMount() {
    events.on('hudnav--navigate', this.onToggleUIVisibility);

    client.OnUpdateDevUI((id: string, rootPage: any) => {
      let page = rootPage;
      if (typeof page === 'string') {
        page = JSON.parse(page);
      }
      this.setState({
        [id]: page,
      });
    });
  }

  public componentDidCatch(error: any, info: any) {
    console.log(error);
    console.log(info);
  }

  private onToggleUIVisibility = (name: string) => {
    if (this.state && _.includes(Object.keys(this.state), name)) {
      const page = this.state[_.find(Object.keys(this.state), key => key === name)];
      this.setState({
        [name]: {
          ...page,
          visible: !page.visible,
        },
      });
    }
  }
}

export default DevUI;
