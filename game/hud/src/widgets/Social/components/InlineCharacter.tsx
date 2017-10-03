/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleDeclaration } from 'aphrodite';
import gql from 'graphql-tag';
import { Spinner } from 'camelot-unchained';
import { graphql } from 'react-apollo';

export interface InlineCharacterStyle extends StyleDeclaration {
  card: React.CSSProperties;
}

interface InlineCharacterProps {
  id: string;
  shard: number;
  data?: any;
}

export const defaultInlineCharacterStyle: InlineCharacterStyle = {
  card: {

  },
};

const inlineCharacter = (props: InlineCharacterProps) => {
  if (props.data.loading) {
    return <Spinner />;
  }
  return (
      <a href={`#character/${props.data.character.id}`}>
        {props.data.character.name}
      </a>
  );
};

export default graphql(gql`
      query InlineCharacter($id: String!, $shard: Int!) {
        character(id: $id, shard: $shard) {
          id
          name
        }
      }
    `, {
      options: (props: InlineCharacterProps) => ({
        variables: {
          id: props.id,
          shard: props.shard,
        },
      }),
    })(inlineCharacter as any);
