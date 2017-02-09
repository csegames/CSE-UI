/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-21 14:38:42
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-21 16:54:17
 */

import * as React from 'react';
import {StyleSheet, css, StyleDeclaration} from 'aphrodite';
import gql from 'graphql-tag';
import {ql, client, Card, Spinner, TitleCard, RaisedButton} from 'camelot-unchained';
import {graphql, InjectedGraphQLProps} from 'react-apollo';

export interface InlineCharacterStyle extends StyleDeclaration {
  card: React.CSSProperties;
}

interface InlineCharacterProps extends InjectedGraphQLProps <{
  character: {
    id: string;
    name: string;
    race: string;
    realm: string;
    gender: string;
    class: string;
  }
} > {
  id: string;
  shard: number;
}

export const defaultInlineCharacterStyle: InlineCharacterStyle = {
  card: {

  },
}

const inlineCharacter = (props: InlineCharacterProps) => {
  if (props.data.loading) {
      return <Spinner />;
    }
    return (
      <a href={`#character/${props.data.character.id}`}>
        {props.data.character.name}
      </a>
    )
}

export default graphql(gql`
      query InlineCharacter($id: String!, $shard: Int!) {
        character(id: $id, shard: $shard) {
          id
          name
          race
          realm
          gender
          class
        }
      }
    `, {
  options: (props: InlineCharacterProps) => ({
    variables: {
      id: props.id,
      shard: props.shard,
    }
  })
})(inlineCharacter);
