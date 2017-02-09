/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-21 14:38:42
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-21 16:34:52
 */

import * as React from 'react';
import {StyleSheet, css, StyleDeclaration} from 'aphrodite';
import gql from 'graphql-tag';
import {ql, client, Card, Spinner, TitleCard, RaisedButton} from 'camelot-unchained';
import {graphql, InjectedGraphQLProps} from 'react-apollo';

export interface InlineOrderStyle extends StyleDeclaration {
  card: React.CSSProperties;
}

interface InlineOrderProps extends InjectedGraphQLProps <{
   order: {
    id: string;
    name: string;
  }
} > {
  id: string;
  shard: number;
}

export const defaultInlineOrderStyle: InlineOrderStyle = {
  card: {

  },
}

const inlineOrder = (props: InlineOrderProps) => {
  if (props.data.loading) {
      return <Spinner />;
    }
    return (
      <a href={`#order/${props.data.order.id}`}>
        {props.data.order.name}
      </a>
    )
}

export default graphql(gql`
      query InlineOrder($id: String!, $shard: Int!) {
        order(id: $id, shard: $shard) {
          id
          name
        }
      }
      `, {
  options: (props: InlineOrderProps) => ({
    variables: {
      id: props.id,
      shard: props.shard,
    }
  })
})(inlineOrder);
