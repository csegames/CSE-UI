/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as moment from 'moment';
import styled from 'react-emotion';

import Card, { CardLevel } from './Card';
export { CardLevel } from './Card';

const Title = styled('div')`
  font-size: 1.2em;
  color: #AAA;
  width: 100%;
`;

const Date = styled('div')`
  font-size: 0.8em;
  color: #777;
  text-align: right;
`;

export interface TitleCardStyle {
  title: React.CSSProperties;
  date: React.CSSProperties;
}

export const TitleCard = (props: {
  title: string;
  date?: Date;
  styles?: Partial<TitleCardStyle>;
  level?: CardLevel;
  children?: React.ReactNode;
}) => {
  return (
    <Card {...props} >
      <Title>
        {props.title}
      </Title>
      {props.children}
      {
        props.date ? (
          <Date>
            {moment(props.date).fromNow()}
          </Date>
        ) : null
      }
    </Card>
  );
};

export default TitleCard;
