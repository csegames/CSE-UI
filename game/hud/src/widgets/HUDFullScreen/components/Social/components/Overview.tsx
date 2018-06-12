/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { /*ql,*/ client, Card, Spinner, TitleCard } from '@csegames/camelot-unchained';
import { graphql } from 'react-apollo';

import GroupTitle from './GroupTitle';
import InlineCharacter from './InlineCharacter';
import InlineOrder from './InlineOrder';

const defaultStyle: OverviewStyle = {
  containter: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
  },

  title: {
    padding: '15px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.19)',
    backgroundColor: '#4d573e',
  },

  content: {
    padding: '10px',
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'row-reverse',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'space-around',
    overflowY: 'scroll',
  },

  contentTop: {
    display: 'flex',
    flexDirection: 'column',
    flex: '0 0 300px',
    alignItems: 'center',
  },

  logo: {
    width: '150px',
    height: '150px',
    padding: '5px',
    margin: '5px',
  },

  logoIMG: {
    width: '100%',
    height: '100%',
  },

  summary: {
    width: '300px',
    height: '150px',
    display: 'flex',
    flexWrap: 'wrap',
    paddingLeft: '15px',
    alignContent: 'space-around',
    justifyContent: 'space-around',
  },

  summaryItem: {
    flex: '1 1 auto',
    minWidth: '40%',
    maxWidth: '50%',
  },

  summaryHeader: {
    color: '#777',
    fontWeight: 600,
  },

  row: {
    flex: '1 1 auto',
    display: 'flex',
  },

  recentActivity: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column',
    margin: '10px',
    alignContent: 'flex-start',
    alignSelf: 'stretch',
    overflowX: 'hidden',
  },

  recentActivityHeader: {
    color: '#777',
    fontSize: '1.1em',
  },

  recentActivityItem: {
    margin: '0',
    padding: '0',
  },
};

export interface OverviewStyle extends StyleDeclaration {
  containter: React.CSSProperties;
  title: React.CSSProperties;
  content: React.CSSProperties;
  contentTop: React.CSSProperties;
  logo: React.CSSProperties;
  logoIMG: React.CSSProperties;
  summary: React.CSSProperties;
  summaryItem: React.CSSProperties;
  summaryHeader: React.CSSProperties;
  row: React.CSSProperties;
  recentActivity: React.CSSProperties;
  recentActivityHeader: React.CSSProperties;
  recentActivityItem: React.CSSProperties;
}

export interface OrderOverviewProps {
  dispatch: (action: any) => any;
  refetch: () => void;
  order: any; // ql.FullOrder;
  styles?: Partial < OverviewStyle >;
  data?: any;
}

interface InlineCardComponentDetails {
  replace: string;
  component: any; // #TODO: real types!
  componentProps?: any;
}


function parseFor(s: string, regex: RegExp, component: any, shard: number): InlineCardComponentDetails[] {
  const result = [];
  let match = regex.exec(s);
  while (match != null) {
    result.push({
      replace: match[0],
      component,
      componentProps: {
        id: match[1],
        shard,
      },
    });
    match = regex.exec(s);
    if (match === null || !match) return result;
  }
  return result;
}

function parseForCharacter(s: string, shard: number): InlineCardComponentDetails[] {
  return parseFor(s, new RegExp(/<CharacterID:(\w+)>/g), InlineCharacter, shard);
}

function parseForOrder(s: string, shard: number): InlineCardComponentDetails[] {
  return parseFor(s, new RegExp(/<GroupID:(\w+)>/g), InlineOrder, shard);
}

function generateMessage(s: string, currentIndex: number, elements: InlineCardComponentDetails[]): JSX.Element {
  if (s === '') return null;

  if (currentIndex >= elements.length) {
    return <span>{s}</span>;
  }

  const current = elements[currentIndex];
  if (s.indexOf(current.replace) === -1) return generateMessage(s, currentIndex + 1, elements);

  const split = s.split(new RegExp(`${current.replace}(.*)`));
  return (
    <span>
      {generateMessage(split[0], currentIndex + 1, elements)}
        <current.component {...current.componentProps} />
      {generateMessage(split[1], currentIndex + 1, elements)}
    </span>
  );
}

function unCamelize(s: string) {
  return s.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => { return str.toUpperCase(); });
}

class Overview extends React.Component<OrderOverviewProps, {}> {

  public render() {
    const ss = StyleSheet.create(defaultStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const order = this.props.order;

    return (
      <div className={css(ss.containter, custom.containter)}>
          <GroupTitle styles={{
            title: ss.title,
          }}
                      refetch={this.props.refetch}>
          {order.name}
          </GroupTitle>
        <div className={css(ss.content, custom.content)}>

          <Card>
            <div className={css(ss.contentTop, custom.contentTop)}>
              <div className={css(ss.logo, custom.logo)}>
                <img className={css(ss.logoIMG, custom.logoIMG)} src='images/guild-banner.png'/>
              </div>

              <div className={css(ss.summary, custom.summary)}>
                <div className={css(ss.summaryItem, custom.summaryItem)}>
                  <div className={css(ss.summaryHeader, custom.summaryHeader)}>Created By</div>
                  {order.creator}
                </div>

                <div className={css(ss.summaryItem, custom.summaryItem)}>
                  <div className={css(ss.summaryHeader, custom.summaryHeader)}>Members</div>
                  {order.members.length}
                </div>

                <div className={css(ss.summaryItem, custom.summaryItem)}>
                  <div className={css(ss.summaryHeader, custom.summaryHeader)}>Founded</div>
                  {new Date(order.created as any).toLocaleDateString()}
                </div>

                <div className={css(ss.summaryItem, custom.summaryItem)}>
                  <div className={css(ss.summaryHeader, custom.summaryHeader)}>Joined</div>
                  {new Date(order.members[0].joined as any).toLocaleDateString()}
                </div>
              </div>
            </div>
          </Card>

          <div className={css(ss.row, custom.row)}>
            <div className={css(ss.recentActivity, custom.recentActivity)}>
              <div className={css(ss.recentActivityHeader, custom.recentActivityHeader)}>Recent Activity</div>

              {
                this.props.data.loading
                  ? <Spinner />
                  : this.props.data.order.recentActions.map((a: any, index: number) =>
                    this.renderActionCard(a, index, ss, custom))
              }
            </div>
          </div>
        </div>
      </div>
    );
  }

  private renderActionCard = (action: any, /*ql.MemberAction,*/ key: number,
     ss: OverviewStyle, custom: Partial<OverviewStyle>) => {
    const elements = parseForCharacter(action.message, client.shardID)
      .concat(parseForOrder(action.message, client.shardID));
    return (
      <TitleCard key={key} title={unCamelize(action.type)} date={new Date(action.when)}>
        <div className={css(ss.recentActivityItem, custom.recentActivityItem)}>
          {generateMessage(action.message, 0, elements)}
        </div>
      </TitleCard>
    );
  }
}

const OverviewQL = graphql(null/*ql.queries.OrderActions*/, {
  options: (props: OrderOverviewProps) => ({
    variables: {
      id: props.order.id,
      shard: client.shardID,
    },
    // poll every 30 seconds for updated data
    pollInterval: 30000,
  }),
})(Overview);
export default OverviewQL;
