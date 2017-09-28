/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { StyleDeclaration } from 'aphrodite';
import { ql, Spinner } from 'camelot-unchained';
import { graphql, InjectedGraphQLProps } from 'react-apollo';

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
};

const inlineWarband = (props: InlineWarbandProps) => {
  if (props.data.loading) {
    return <Spinner />;
  }
  return (
      <a href={`#warband/${props.data.warband.id}`}>
        {props.data.warband.name}
      </a>
  );
};

export default graphql(ql.queries.InlineWarband, {
  options: (props: InlineWarbandProps) => ({
    variables: {
      id: props.id,
      shard: props.shard,
    },
  }),
})(inlineWarband as any);
