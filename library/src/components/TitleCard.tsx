/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 19:06:38
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-13 21:00:56
 */

import * as React from 'react';
import { StyleSheet, css } from 'aphrodite';
import * as moment from 'moment';

import Card, { CardLevel, CardStyle, defaultCardStyle } from './Card';

export { CardLevel } from './Card';

export const defaultTitleCardStyle: TitleCardStyle = {
  ...defaultCardStyle,

  title: {
    fontSize: '1.2em',
    color: '#AAA',
    width: '100%',
  },

  date: {
    fontSize: '0.8em',
    color: '#777',
    textAlign: 'right',
  },

};

export interface TitleCardStyle extends CardStyle {
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
  const ss = StyleSheet.create(defaultTitleCardStyle);
  const custom = StyleSheet.create(props.styles || {});
  return (
    <Card {...props} >
      <div className={css(ss.title, custom.title)}>
        {props.title}
      </div>
      {props.children}
      {
        props.date ? (
          <div className={css(ss.date, custom.date)}>
            {moment(props.date).fromNow()}
          </div>
        ) : null
      }
    </Card>
  );
};

export default TitleCard;
