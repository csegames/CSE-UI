import * as React from 'react';
import * as _ from 'lodash';
import { css, StyleSheet } from 'aphrodite';

// @ts-ignore
import { client, webAPI, events } from 'camelot-unchained';
import { TabPanel } from 'camelot-unchained/lib/components';
import { ObjectMap } from 'camelot-unchained/lib/graphql/utils';
import { QuickQLQuery } from 'camelot-unchained/lib/graphql/query';
import { GraphQL, GraphQLData } from 'camelot-unchained/lib/graphql/react';
import ClientInterface from 'camelot-unchained/lib/core/clientInterface';

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
  query: string | Partial<QuickQLQuery> | undefined;
  activeTabIndex: number | undefined;
}

export interface RootPage extends Partial<Page> {
  width: number;
  height: number;
  x: number;
  y: number;
  visible: boolean;
  background?: string;
  showCloseButton?: boolean;
}


const buttonStyle: {
  Button: React.CSSProperties;
} = {
  Button: {
    cursor: 'pointer',
    backgroundColor: '#555',
    display: 'inline-block',
    padding: '5px 15px',
    margin: '5px',
    textAlign: 'center',
    ':hover': {
      backgroundColor: '#777',
    },
    ':active': {
      backgroundColor: '#999',
    },
  },
};

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
    const style = StyleSheet.create(buttonStyle);
    return (
      <div className={css(style.Button)}
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
      </div>
    );
  }
}

const contentStyle: {
  Content: React.CSSProperties;
} = {
  Content: {
    flex: '1 1 auto',
  },
};

class DevUIContent extends React.PureComponent<Partial<Page>> {
  public render() {
    const style = StyleSheet.create(contentStyle);
    return (
      <div className={css(style.Content)}>
        {typeof this.props.content === 'string' ?
          <DevUIStringContent {...this.props} /> :
          <DevUIObjectContent {...this.props} />
        }
      </div>
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

const pageStyle: {
  Page: React.CSSProperties;
  pages: React.CSSProperties;
  title: React.CSSProperties;
} = {
  Page: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    padding: '10px',
    justifyContent: 'space-between',
    color: '#ececec',
    userSelect: 'none',
    WebkitUserSelect: 'none',
  },
  pages: {
    flex: '1 1 auto',
    display: 'flex',
  },
  title: {
    fontWeight: 700,
    fontSize: '1.5em',
    margin: '5px 0px',
  },
};

class DevUIPage extends React.PureComponent<Partial<Page>> {
  private tabPanel: any;
  public render(): JSX.Element {
    const style = StyleSheet.create(pageStyle);
    return (
      <div className={css(style.Page)}>
        {this.props.title && <div className={css(style.title)}>{this.props.title}</div>}
        {this.props.content &&
          <DevUIContent
            content={this.props.content}
            data={this.props.data}
            query={this.props.query}
          />
        }
        {this.props.buttons && <div>{this.props.buttons.map(b => <DevUIButton key={b.title} {...b} />)}</div>}
        {this.props.pages && (
          <div className={css(style.pages)}>
            <TabPanel
              defaultTabIndex={this.props.activeTabIndex}
              ref={ref => this.tabPanel = ref}
              styles={{
                contentContainer: {
                  height: 'auto',
                },
                content: {
                  position: 'relative',
                },
                tabPanel: {
                  flex: '1 1 auto',
                  width: 'initial',
                  height: 'initial',
                },
                tab: {
                  padding: '2px 10px',
                  background: '#444',
                  borderBottom: '1px solid transparent',
                },
                activeTab: {
                  background: '#777',
                  borderBottom: '1px solid orange',
                },
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
          </div>)}
      </div>
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
          if (!page) return null;
          return (
            <div style={{
              width: `${page.width}px`,
              height: `${page.height}px`,
              left: `${page.x}px`,
              top: `${page.y}px`,
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
