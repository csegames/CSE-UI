/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { ql, client } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { CUQuery, MessageOfTheDay } from '@csegames/camelot-unchained/lib/graphql';
import { CloseButton } from 'UI/CloseButton';

const STORAGE_PREFIX = 'cse-MOTD-hide-start';

const query = {
  namedQuery: 'motd',
  variables: {
    channel: client.patchResourceChannel,
  },
};

const Container = styled('div')`
  position: relative;
`;

const InnerContainer = styled('div')`
  position: relative;
  pointer-events: all;
  width: 800px;
  height: 400px;
  padding: 0px;
  margin:0 auto;
  background-color: gray;
  color: white;
  background: url(images/motd/motd-bg-grey.png) no-repeat;
  z-index: 1;
  border: 1px solid #6e6c6c;
  box-shadow: 0 0 30px 0 #000;
`;

const MOTDTitle = styled('div')`
  text-align: center;
  background: url(images/motd/motd-top-title.png) center top no-repeat;
  margin: 0 auto -9px auto;
  position: relative;
  z-index: 999;
  width: 319px;
  height: 23px;
  h6 {
    color: #848484;
    font-size: 10px;
    text-transform: uppercase;
    padding: 7px 0 0 0;
    margin: 0 0 0 0;
    font-family: 'Caudex', serif;
  }
`;

const MOTDCorner = styled('div')`
  position: absolute;
  min-width: 800px;
  min-height: 400px;
  background:
  url(images/motd/motd-ornament-top-left.png) left 0 top 0 no-repeat,
  url(images/motd/motd-ornament-top-right.png) right 0 top 0 no-repeat,
  url(images/motd/motd-ornament-bottom-left.png) left 0 bottom 0 no-repeat,
  url(images/motd/motd-ornament-bottom-right.png) right 0 bottom 0 no-repeat;
  z-index: 1;
`;
const MOTDMotdTitle = styled('div')`
  height: 40px;
  h4 {
    color: #cebd9d;
    line-height: 40px;
    margin-left: 20px;
  }
`;
const MOTDContent = styled('div')`
  height: 284px;
  margin-top: 0px;
  max-height: 295px;
  padding: 10px 20px;
  box-sizing: border-box;
  overflow-x: hidden;
  overflow-y: auto;
  border-top: 1px solid #3b3634;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  width: calc(100% - 40px);
  position: absolute;
`;

const MOTDFooter = styled('div')`
  position: absolute;
  min-width: 800px;
  height: 55px;
  bottom: 0;
  left: 0;
  background: rgba(55, 52, 51, 0.3);
  border-top: 1px solid #3b3634;
  z-index: 11;
`;

const MOTDButton = styled('div')`
  &.btn {
    background: url(images/motd/button-off.png) no-repeat;
    width: 95px;
    height: 30px;;
    border: none;
    margin: 12px 16px 0 16px;
    cursor: pointer;
    color: #848484;
    font-family: 'Caudex', serif;
    font-size: 10px;
    text-transform: uppercase;
    text-align: center;
    line-height: 30px;
    &:hover {
      background: url(images/motd/button-on.png) no-repeat;
      color: #fff;
    }
  }
`;

const MOTDFooterBorder = styled('div')`
  position: absolute;
  border: 1px solid #2e2b28;
  margin: 7px 10px 0;
  display: block;
  width: 780px;
  height: 40px;
  z-index: 3;
`;

const MOTDFooterOuter = styled('div')` {
  position: absolute;
  z-index: 4;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const MOTDFooterLeft = styled('div')` {
  background: url(images/motd/motd-botnav-left-ornament.png) no-repeat;
  height: 55px;
  width: 75px
`;

const MOTDFooterRight = styled('div')` {
  background: url(images/motd/motd-botnav-right-ornament.png) no-repeat;
  height: 55px;
  width: 75px
`;

const CloseButtonPosition = css`
  position: absolute;
  top: 6px;
  right: 7px;
`;

export interface WelcomeProps {
  setVisibility: (vis: boolean) => void;
}

export interface WelcomeState {
  visible: boolean;
  storageInvalidate: string;
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
      visible: false,
      storageInvalidate: null,
    };
  }

  public render() {
    return (
      <GraphQL query={query} onQueryResult={this.handleQueryResult}>
        {(graphql: GraphQLResult<{ motd: ql.schema.MessageOfTheDay }>) => {
          const gqlData = typeof graphql.data === 'string' ? JSON.parse(graphql.data) : graphql.data;
          if (graphql.loading || !gqlData || !this.state.visible) return null;
          const latestMotd = gqlData.motd && gqlData.motd[gqlData.motd.length - 1];

          return (
            <Container>
              <MOTDTitle><h6>MOTD</h6></MOTDTitle>
              <InnerContainer className='cse-ui-scroller-thumbonly'>
                <CloseButton onClick={this.hide} className={CloseButtonPosition} />
                <MOTDCorner />
                <MOTDMotdTitle>
                  <h4>{ latestMotd ? latestMotd.title : 'Welcome to Camelot Unchained' }</h4>
                </MOTDMotdTitle>
                <MOTDContent>
                      {
                        latestMotd ? <div key='100' dangerouslySetInnerHTML={{ __html: latestMotd.htmlContent }} />
                        : this.defaultMessage
                      }
                </MOTDContent>
                <MOTDFooter>
                  <MOTDFooterBorder />
                  <MOTDFooterOuter>
                      <MOTDFooterLeft />
                      <MOTDButton
                        className='btn'
                        onClick={() => this.onHideDelayClick(latestMotd)}>
                        Dismiss for 24h
                      </MOTDButton>
                      <MOTDFooterRight />
                  </MOTDFooterOuter>
                </MOTDFooter>
              </InnerContainer>
            </Container>
          );
        }}
      </GraphQL>
    );
  }

  private handleQueryResult = (result: GraphQLResult<Pick<CUQuery, 'motd'>>) => {
    const gqlData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
    const latestMotd = gqlData.motd && gqlData.motd[gqlData.motd.length - 1];
    this.initMotd(latestMotd);
  }

  private initMotd = (motd: MessageOfTheDay) => {
    // manage visibility of motd widget based on localStorage
    try {
      const delayInMin: number = 24 * 60;
      const motdStoragePayload = localStorage.getItem(`${STORAGE_PREFIX}-${client.characterID}`);
      if (motdStoragePayload) {
        const { hideDelayStart, storageInvalidate } = JSON.parse(motdStoragePayload);

        if (motd && storageInvalidate !== motd.id) {
          // Message of the day has changed, override the 24h dismiss to show the new message
          this.setState({ visible: true });
          return;
        }

        const currentDate: Date = new Date();
        const savedDelayDate: Date = new Date(hideDelayStart);
        savedDelayDate.setTime(savedDelayDate.getTime() + (delayInMin * 60 * 1000));
        if (currentDate > savedDelayDate) {
          // It has been longer than 24h since last dismiss. Show the motd.
          this.setState({ visible: true });
        }
      } else {
        this.setState({ visible: true });
      }
    } catch (error) {
      console.log(error);
    }
  }

  private hide = (): void => {
    this.props.setVisibility(false);
  }

  private onHideDelayClick = (motd: MessageOfTheDay): void => {
    this.hide();
    const hideDelayStart: Date = new Date();
    const motdStoragePayload = {
      hideDelayStart,
      storageInvalidate: motd ? motd.id : '',
    };
    localStorage.setItem(`${STORAGE_PREFIX}-${client.characterID}`, JSON.stringify(motdStoragePayload));
  }
}

export default Welcome;
