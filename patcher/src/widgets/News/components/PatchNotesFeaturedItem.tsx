/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as moment from 'moment';
import styled from 'react-emotion';
import { PatchNote } from '@csegames/camelot-unchained/lib/graphql';
import {
  FeaturedContainer,
  TitleContainer,
  Title,
  DescriptionText,
  ContentContainer,
  ContentImage,
  ContentText,
  ReadMoreButton,
  ReadMoreText,
  PATCH_NOTES_COLOR,
} from '../lib/styles';
import { PostItem } from '..';

const Divider = styled('div')`
  position: relative;
  background-color: ${PATCH_NOTES_COLOR};
  width: 3px;
  margin: 0 20px;
  height: 150px;
  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: url(images/news/news-texture.png) repeat-y;
  }
`;

export interface Props {
  post: PostItem;
  onSelectPost: (post: PostItem) => void;
}

class PatchNotesFeaturedItem extends React.Component<Props> {
  public render() {
    const patchNote = this.props.post.item as PatchNote;
    return (
      <FeaturedContainer backgroundImage={'images/news/post-image.png'}>
        <TitleContainer>
          <Title>{patchNote.title}</Title>
          <DescriptionText>BUIID #{patchNote.patchNumber}</DescriptionText>
          <DescriptionText>{moment(patchNote.utcDisplayStart).format('Do MMMM YYYY - h:mm a')}</DescriptionText>
        </TitleContainer>
        <Divider />
        <ContentContainer>
          <ContentImage src={'images/news/post-image.png'} />
          <ContentText
            dangerouslySetInnerHTML={{ __html: patchNote.htmlContent }}
            style={{ maxHeight: '130px', overflow: 'hidden' }}
          />
        </ContentContainer>
        <ReadMoreButton onClick={this.onSelect}>
          <ReadMoreText>Read More</ReadMoreText>
        </ReadMoreButton>
      </FeaturedContainer>
    );
  }

  private onSelect = () => {
    this.props.onSelectPost(this.props.post);
  }
}

export default PatchNotesFeaturedItem;
