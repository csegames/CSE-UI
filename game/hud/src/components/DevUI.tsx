import * as React from 'react';
import { css, StyleSheet } from 'aphrodite';

import { ObjectMap } from 'camelot-unchained/lib/graphql/utils';
import { client } from 'camelot-unchained';
import { TabPanel } from 'camelot-unchained/lib/components';

type Content = string | ObjectMap<any>;

export interface Button {
  title: string;
  command: string;
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
         onClick={() => client.SendSlashCommand(props.command)} >
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

class DevUI extends React.Component<{}, RootPage> {

  constructor(props: {}) {
    super(props);

    this.state = {
      width: 150,
      height: 200,
      x: 10,
      y: 50,
      visible: false,
    };
  }

  componentDidMount() {
    client.OnUpdateDevUI((rootPage: any) => {
      let page = rootPage;
      if (typeof page === 'string') {
        page = JSON.parse(page);
      }
      this.setState(page);
    });
  }

  render() {
    return (
      <div style={{
        width: `${this.state.width}px`,
        height: `${this.state.height}px`,
        left: `${this.state.x}px`,
        top: `${this.state.y}px`,
        position: 'fixed',
        background: this.state.background && this.state.background || '#111',
        visibility: this.state.visible ? 'visible' : 'hidden',
        display: 'flex',
      }}>
        <DevUIPage {...this.state} />
      </div>
    );
  }
}

export default DevUI;
