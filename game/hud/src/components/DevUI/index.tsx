import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

// @ts-ignore
import { client, webAPI } from 'camelot-unchained';
import { TabPanel } from 'camelot-unchained/lib/components';
import { ObjectMap } from 'camelot-unchained/lib/graphql/utils';
import { QuickQLQuery } from 'camelot-unchained/lib/graphql/query';
import { withGraphQL, GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';

type Content = string | ObjectMap<any>;

// @ts-ignore:no-unused-locals
window['webAPI'] = webAPI;

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
  gql: string | Partial<QuickQLQuery> | undefined;
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

function evalContext(namespaces: { data: ObjectMap<any>, graphql: ObjectMap<any> }) {
  // @ts-ignore: no-unused-locals
  const data = namespaces.data;
  // @ts-ignore: no-unused-locals
  const graphql = namespaces.graphql;
  // tslint:disable-next-line
  return (s: string) => { return eval(s); };
}

// @ts-ignore: no-unused-locals
function parseTemplate(template: any, namespaces: { data: ObjectMap<any>, graphql: ObjectMap<any> }) {
  const ctx = evalContext(namespaces);
  return template.replace(/\${([^\s]*)}/g, (m: any, key: any) => {
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
          <DevUIStringContentWithQL content={this.props.content} data={this.props.data} gql={this.props.gql} /> :
          <DevUIObjectContent content={this.props.content} data={this.props.data} gql={this.props.gql} />
        }
      </div>
    );
  }
}

type DevUIStringContentProps = Partial<Page> & GraphQLInjectedProps<any>;
class DevUIStringContent extends React.PureComponent<DevUIStringContentProps> {
  public render() {
    if (this.props.gql) {
      if (!this.props.graphql.loading && this.props.graphql.data) {
        const parsedContent = parseTemplate(this.props.content, {
          data: this.props.data,
          graphql: {
            data: this.props.graphql.data,
          },
        });
        return <div dangerouslySetInnerHTML={{ __html: parsedContent }} />;
      }
      return <div>Loading...</div>;
    } else if (this.props.data && !this.props.graphql) {
      const parsedContent = parseTemplate(this.props.content, {
        data: this.props.data,
        graphql: null,
      });
      return <div dangerouslySetInnerHTML={{ __html: parsedContent }} />;
    } else {
      return <div dangerouslySetInnerHTML={{
        __html: this.props.content as any,
      }} />;
    }
  }
}

const DevUIStringContentWithQL = withGraphQL<DevUIStringContentProps>((props: any): any => (props.gql ? {
  query: props.gql,
} : {}))(DevUIStringContent);

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
                    <DevUIStringContentWithQL
                      content={this.props.content[k]}
                      data={this.props.data}
                      gql={this.props.gql}
                    />
                  :
                    <DevUIObjectContent
                      content={this.props.content[k]}
                      data={this.props.data}
                      gql={this.props.gql}
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
            gql={this.props.gql}
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
            <div
              key={k}
              style={{
                width: `${page.width}px`,
                height: `${page.height}px`,
                left: `${page.x}px`,
                top: `${page.y}px`,
                position: 'fixed',
                background: page.background && page.background || '#111',
                visibility: page.visible ? 'visible' : 'hidden',
                display: 'flex',
                overflowY: 'auto',
                overflowX: 'hidden',
              }}>
            <div style={{ flex: 1 }}>
              {page.showCloseButton ?
                <a
                  href={'#'}
                  style={{
                    position: 'absolute',
                    right: '0px',
                    top: '0px',
                    display: 'flex',
                  }}
                  onClick={() => this.setState({
                    [k]: {
                      ...page,
                      visible: false,
                    },
                  })}>X</a> : null}
                <DevUIPage {...page} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  public componentDidMount() {
    client.OnOpenUI(this.onOpenUI);
    client.OnCloseUI(this.onCloseUI);
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

  private onOpenUI = (name: string) => {
    if (this.state[name]) {
      this.setState({
        [name]: {
          ...this.state[name],
          visible: true,
        },
      });
      return;
    }
  }

  private onCloseUI = (name: string) => {
    if (this.state[name]) {
      this.setState({
        [name]: {
          ...this.state[name],
          visible: false,
        },
      });
      return;
    }
  }
}

export default DevUI;
