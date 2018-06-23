/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ql, utils, client } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

const query = {
  namedQuery: 'motd',
  variables: {
    channel: client.patchResourceChannel,
  },
};

export interface MOTDStyles {
  MOTD: React.CSSProperties;
  MOTDHeader: React.CSSProperties;
  MOTDContent: React.CSSProperties;
  MOTDFooter: React.CSSProperties;
  dismissButton: React.CSSProperties;
  close: React.CSSProperties;
}

const Container = styled('div')`
  pointer-events: all;
  user-select: none;
  -webkit-user-select: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 450px;
  background-color: rgba(0, 0, 0, 0.8);
  border: 1px solid ${utils.lightenColor('#202020', 30)};
`;

const Header = styled('div')`
  width: 100%;
  padding: 5px 0;
  text-align: center;
  color: white;
  background-color: #202020;
  border-bottom: 1px solid ${utils.lightenColor('#202020', 30)};
`;

const Content = styled('div')`
  flex: 1;
  color: white;
  padding: 5px;
  overflow: auto;
`;

const Footer = styled('div')`
  padding: 5px 0;
  background-color: #202020;
  text-align: center;
  border-top: 1px solid ${utils.lightenColor('#202020', 30)};
`;

const DismissButton = styled('a')`
  cursor: pointer;
`;

const Close = styled('div')`
  position: absolute;
  top: 2px;
  right: 5px;
  color: #CDCDCD;
  font-size: 20px;
  margin-right: 5px;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #BBB;
  }
`;

export interface MOTDProps {
  styles?: Partial<MOTDStyles>;
  setVisibility: (vis: boolean) => void;
}

export interface MOTDState {
}

export interface MOTDData {
  id: string;
  message: string;
  duration: number;
}

class MOTD extends React.Component<MOTDProps, MOTDState> {
  public name: string = 'MOTD';
  private defaultMessage: JSX.Element[] = [<div key='0'>Loading...</div>];

  constructor(props: MOTDProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    return (
      <GraphQL query={query}>
        {(graphql: GraphQLResult<{ motd: ql.schema.MessageOfTheDay }>) => {
          const gqlData = typeof graphql.data === 'string' ? JSON.parse(graphql.data) : graphql.data;
          if (graphql.loading || !gqlData) return null;

          return (
            <Container>
              <Header>
                <div className=''>
                  { gqlData && gqlData.motd && gqlData.motd[0]
                    ? gqlData.motd[0].title
                    : 'MOTD to Camelot Unchained'
                  }
                </div>
                <Close onClick={this.hide}>
                  <i className='fa fa-times click-effect'></i>
                </Close>
              </Header>
              <Content>
              {
                gqlData && gqlData.motd && gqlData.motd[0]
                ? <div key='100' dangerouslySetInnerHTML={{ __html: gqlData.motd[0].htmlContent }} />
                : this.defaultMessage
              }
              </Content>
              <Footer>
                <DismissButton onClick={this.hideDelay}>Dismiss For 24h</DismissButton>
              </Footer>
            </Container>
          );
        }}
      </GraphQL>
    );
  }
  private hide = (): void => {
    this.props.setVisibility(false);
  }

  private hideDelay = (): void => {
    this.hide();
    const hideDelayStart: Date = new Date();
    localStorage.setItem('cse-MOTD-hide-start', JSON.stringify(hideDelayStart));
  }
}

export default MOTD;
