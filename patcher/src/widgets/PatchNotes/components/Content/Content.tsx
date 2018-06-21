/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as moment from 'moment';
import styled from 'react-emotion';
import { utils, LoadingContainer } from '@csegames/camelot-unchained';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';
import Animate from '../../../../lib/Animate';

const Wrapper = styled('div')`
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const Header = styled('div')`
  padding: 0 5px;
  background-color: ${utils.darkenColor('#222222', 10)};
  color: white;
  font-size: 17px;
  border-bottom: 1px solid #777;
`;

const Body = styled('div')`
  flex: 1;
  display: flex;
  padding: 5px;
  overflow: auto;
  background-color: #222222;
  color: #ccc;
`;

const InnerHTMLContainer = styled('div')`
  flex: 1;
  width: 100%;
  height: 100%;
`;

export interface ContentQuery {
  patchNote: {
    id: string;
    htmlContent: string;
    utcDisplayStart: string;
    patchNumber: string;
    title: string;
  };
}

export interface ContentProps extends GraphQLInjectedProps<ContentQuery> {
  patchNoteId: string;
}

export interface ContentState {
  showContent: boolean;
}

class Content extends React.Component<ContentProps, ContentState> {
  constructor(props: ContentProps) {
    super(props);
    this.state = {
      showContent: true,
    };
  }

  public render() {
    const patchNote = this.props.graphql.data && this.props.graphql.data.patchNote;
    const date = patchNote && moment(patchNote.utcDisplayStart).toDate().toLocaleString();

    return (
      <Wrapper>
        <LoadingContainer wait={700} loading={this.props.graphql.loading} />
        <Header>
          {patchNote && `Patch #${patchNote.patchNumber} | "${patchNote.title}" | ${date}`}
        </Header>
        <Body>
          {patchNote ? <Animate animationEnter='fadeIn' animationLeave='fadeOut' durationEnter={400} durationLeave={0}>
            <InnerHTMLContainer
              key={patchNote.id}
              dangerouslySetInnerHTML={{ __html: patchNote.htmlContent }}
            />
          </Animate> : <div>There are currently no patch notes on this channel.</div>}
        </Body>
      </Wrapper>
    );
  }

  public componentWillReceiveProps(nextProps: ContentProps) {
    if (this.props.patchNoteId !== nextProps.patchNoteId) {
      this.props.graphql.refetch();
    }
  }
}

const ContentWithQL = withGraphQL<ContentProps>((props: ContentProps) => {
  return {
    query: `
      query Content($id: String!) {
        patchNote(id: $id) {
          id
          htmlContent
          utcDisplayStart
          patchNumber
          title
        }
      }
    `,
    variables: {
      id: props.patchNoteId,
    },
  };
})(Content);

export default ContentWithQL;
