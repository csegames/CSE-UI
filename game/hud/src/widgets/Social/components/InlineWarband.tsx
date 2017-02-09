/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-21 14:38:42
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 18:17:17
 */

import * as React from 'react';
import {StyleSheet, css, StyleDeclaration} from 'aphrodite';
import gql from 'graphql-tag';
import {ql, client, Card, Spinner, TitleCard, RaisedButton} from 'camelot-unchained';
import {graphql, InjectedGraphQLProps} from 'react-apollo';

export interface InlineWarbandStyle extends StyleDeclaration {
  card: React.CSSProperties;
}

interface InlineWarbandProps extends InjectedGraphQLProps<ql.InlineWarbandQuery> {
  id: string;
  shard: number;
}

export const defaultInlineWarbandStyle: InlineWarbandStyle = {
  card: {

  },
}

const inlineWarband = (props: InlineWarbandProps) => {
  if (props.data.loading) {
      return <Spinner />;
    }
    return (
      <a href={`#warband/${props.data.warband.id}`}>
        {props.data.warband.name}
      </a>
    )
}

export default graphql(ql.queries.InlineWarband, {
  options: (props: InlineWarbandProps) => ({
    variables: {
      id: props.id,
      shard: props.shard,
    }
  })
})(inlineWarband);
