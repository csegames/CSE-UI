import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

import { ObjectMap } from 'camelot-unchained/lib/graphql/utils';
import { client } from 'camelot-unchained';
import { TabPanel } from 'camelot-unchained/lib/components';

type Content = string | ObjectMap<any>;

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
  content: Content | undefined;
  pages: Partial<Page>[] | undefined;
  buttons: Button[] | undefined;
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

const DevUIButton = (props: Button) => {
  const style = StyleSheet.create(buttonStyle);
  return (
    <div className={css(style.Button)}
        onClick={() => {
          if (props.command) {
            client.SendSlashCommand(props.command)
          } else if (props.call) {
            const fn = client[props.call];
            if (props.params) {
              fn(...props.params);
            } else {
              fn();
            }
          }
        }}>
      {props.title}
    </div>
  );
};

const contentStyle: {
  Content: React.CSSProperties;
} = {
  Content: {
    display: 'flex',
    flexDirection: 'column',
    flex: '1 1 auto',
  },
};

const DevUIContent = (props: {content: Content}) => {
  const style = StyleSheet.create(contentStyle);
  return (
    <div className={css(style.Content)} >
      {typeof props.content === 'string' ? <DevUIStringContent content={props.content} /> : <DevUIObjectContent content={props.content} />}
    </div>
  );
};

const DevUIStringContent = (props: {content: string}) => <div dangerouslySetInnerHTML={{__html: props.content}} />

const DevUIObjectContent = (props: {content: ObjectMap<any>}): JSX.Element => {
  const keys = Object.keys(props.content);
  return (
    <table style={{border: '1px solid #ececec', borderCollapse: 'collapse', width: '100%'}}>
      {
        keys.map(k => (
          <tr style={{border: '1px solid #ececec', padding: '2px'}}>
            <th style={{border: '1px solid #ececec', padding: '2px'}}>{k}</th>
            <td style={{border: '1px solid #ececec', padding: '2px'}}>
              {typeof props.content[k] !== 'object' 
                ? <DevUIStringContent content={props.content[k]} /> 
                : <DevUIObjectContent content={props.content[k]} />}
            </td>
          </tr>
        ))
      }
    </table>
  );
};

const pageStyle: {
  Page: React.CSSProperties;
  pages: React.CSSProperties;
  title: React.CSSProperties;
} = {
  Page: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'auto',
    padding: '10px',
    justifyContent: 'space-between',
    color: '#ececec',
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

const DevUIPage = (props: Partial<Page>): JSX.Element => {
  const style = StyleSheet.create(pageStyle);
  return (
    <div className={css(style.Page)}>
      {props.title && <div className={css(style.title)}>{props.title}</div>}
      {props.content && <DevUIContent content={props.content} />}
      {props.buttons && <div>{props.buttons.map(b => <DevUIButton key={b.title} {...b} />)}</div>}
      {props.pages && (
        <div className={css(style.pages)}>
          <TabPanel styles={{
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
                    tabs={props.pages.map(p => {
                        return {
                          tab: {
                            render: () => <span>{p.title}</span>,
                          },
                          rendersContent: p.title || '',
                        };
                      })}                
                      content={props.pages.map(p => {
                        return {
                          name: p.title || '',
                          content: {
                            render: () => <DevUIPage {...p} />
                          },
                        };
                      })} />
        </div>)}
    </div>
  );
};

class DevUI extends React.Component<{}, ObjectMap<RootPage> | null> {

  constructor(props: {}) {
    super(props);

    this.state = null;
  }

  componentDidMount() {
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

  render() {
    if (!this.state) return null;
    const keys = Object.keys(this.state);
    return (
      <div>
        {keys.map(k => {
          const page = this.state[k];
          if (!page) return null;
          return (
            <div key={k}
                 style={{
                   width: `${page.width}px`,
                   height: `${page.height}px`,
                   left: `${page.x}px`,
                   top: `${page.y}px`,
                   position: 'fixed',
                   background: page.background && page.background || '#111',
                   visibility: page.visible ? 'visible' : 'hidden',
                   display: 'flex',
                 }}>
            { page.showCloseButton ?
              <a href={'#'}
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
                                    }
                                  })}>X</a> : null }
                <DevUIPage {...page} />
            </div>
          );
        })}
      </div>
    );
  }
}

export default DevUI;
