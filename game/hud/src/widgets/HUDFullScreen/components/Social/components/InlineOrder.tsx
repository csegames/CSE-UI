/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleDeclaration } from 'aphrodite';
import gql from 'graphql-tag';
import { Spinner } from '@csegames/camelot-unchained';
import { graphql } from 'react-apollo';

export interface InlineOrderStyle extends StyleDeclaration {
  card: React.CSSProperties;
}

interface InlineOrderProps {
  id: string;
  shard: number;
  data?: any;
}

export const defaultInlineOrderStyle: InlineOrderStyle = {
  card: {

  },
};

const inlineOrder = (props: InlineOrderProps) => {
  if (props.data.loading) {
    return <Spinner />;
  }
  return (
      <a href={`#order/${props.data.order.id}`}>
        {props.data.order.name}
      </a>
  );
};

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
          },
        }),
      })(inlineOrder as any);
