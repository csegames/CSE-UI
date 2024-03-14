/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import moment from 'moment';
import { styled } from '@csegames/linaria/react';
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
  PATCH_NOTES_COLOR
} from '../lib/styles';
import { primary } from '../../../api/graphql';

type PatchNote = primary.PatchNote;

const Divider = styled.div`
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
    background: url(/ui/images/news/news-texture.png) repeat-y;
  }
`;

export interface Props {
  note: PatchNote;
  onSelectNote: (note: PatchNote) => void;
}

class PatchNotesFeaturedItem extends React.Component<Props> {
  public render() {
    return (
      <FeaturedContainer style={{ backgroundImage: `url(../images/news/post-image.png) left top/80% no-repeat` }}>
        <TitleContainer>
          <Title>{this.props.note.title}</Title>
          <DescriptionText>BUIID #{this.props.note.patchNumber}</DescriptionText>
          <DescriptionText>{moment(this.props.note.utcDisplayStart).format('Do MMMM YYYY - h:mm a')}</DescriptionText>
        </TitleContainer>
        <Divider />
        <ContentContainer>
          <ContentImage src={'images/news/post-image.png'} />
          <ContentText
            dangerouslySetInnerHTML={{ __html: this.props.note.htmlContent }}
            style={{ maxHeight: '130px', overflow: 'hidden' }}
          />
        </ContentContainer>
        <ReadMoreButton onClick={this.onSelect}>
          <ReadMoreText>Read More</ReadMoreText>
        </ReadMoreButton>
      </FeaturedContainer>
    );
  }

  private onSelect() {
    this.props.onSelectNote(this.props.note);
  }
}

export default PatchNotesFeaturedItem;
