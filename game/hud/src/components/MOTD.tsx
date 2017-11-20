/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { utils, client } from 'camelot-unchained';
import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { withGraphQL, GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';
import { CUQuery } from 'camelot-unchained/lib/graphql/schema';

export interface WelcomeStyles extends StyleDeclaration {
  Welcome: React.CSSProperties;
  welcomeHeader: React.CSSProperties;
  welcomeContent: React.CSSProperties;
  welcomeFooter: React.CSSProperties;
  dismissButton: React.CSSProperties;
  close: React.CSSProperties;
}

export const defaultWelcomeStyles: WelcomeStyles = {
  Welcome: {
    pointerEvents: 'all',
    userSelect: 'none',
    webkitUserSelect: 'none',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '450px',
    backgroundColor: 'rgba(0,0,0,0.8)',
    border: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  welcomeHeader: {
    width: '100%',
    padding: '5px 0',
    textAlign: 'center',
    color: 'white',
    backgroundColor: '#202020',
    borderBottom: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  welcomeContent: {
    flex: 1,
    color: 'white',
    padding: '5px',
    overflow: 'auto',
  },

  welcomeFooter: {
    padding: '5px 0',
    backgroundColor: '#202020',
    textAlign: 'center',
    borderTop: `1px solid ${utils.lightenColor('#202020', 30)}`,
  },

  dismissButton: {
    cursor: 'pointer',
  },

  close: {
    position: 'fixed',
    top: 2,
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
};

export interface WelcomeProps extends GraphQLInjectedProps<Pick<CUQuery, 'motd'>> {
  styles?: Partial<WelcomeStyles>;
  setVisibility: (vis: boolean) => void;
}

export interface WelcomeState {
}

export interface WelcomeData {
  id: string;
  message: string;
  duration: number;
}

class Welcome extends React.Component<WelcomeProps, WelcomeState> {
  public name: string = 'Welcome';
  private defaultMessage: JSX.Element[] = [<div key='0'>Loading...</div>];

  constructor(props: WelcomeProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultWelcomeStyles);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.Welcome, custom.Welcome)}>
        <div className={css(ss.welcomeHeader, custom.welcomeHeader)}>
          <div className=''>
            { this.props.graphql.data && this.props.graphql.data.motd && this.props.graphql.data.motd[0]
              ? this.props.graphql.data.motd[0].title
              : 'Welcome to Camelot Unchained'
            }
          </div>
          <div className={css(ss.close, custom.close)} onClick={this.hide}>
            <i className='fa fa-times click-effect'></i>
          </div>
        </div>
        <div className={css(ss.welcomeContent, custom.welcomeContent)}>
        {
          this.props.graphql.data && this.props.graphql.data.motd && this.props.graphql.data.motd[0]
          ? <div key='100' dangerouslySetInnerHTML={{ __html: this.props.graphql.data.motd[0].htmlContent }} />
          : this.defaultMessage
        }
        </div>
        <div className={css(ss.welcomeFooter, custom.welcomeFooter)}>
          <a className={css(ss.dismissButton, custom.dismissButton)} onClick={this.hideDelay}>Dismiss For 24h</a>
        </div>
      </div>
    );
  }
  private hide = (): void => {
    this.props.setVisibility(false);
  }

  private hideDelay = (): void => {
    this.hide();
    const hideDelayStart: Date = new Date();
    localStorage.setItem('cse-welcome-hide-start', JSON.stringify(hideDelayStart));
  }
}

export default withGraphQL({
  query: `query {
    motd(channel: ${client.patchResourceChannel}) {
      id
      title
      htmlContent
    }
  }`,
})(Welcome);
