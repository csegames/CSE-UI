/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import {
  TitleContainer,
  Title,
  DescriptionText,
  ContentContainer,
  ContentText,
  ContentImage,
  FullContainer,
  CloseButton,
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
  onClose: () => void;
}

class PatchNotesFullArticle extends React.Component<Props> {
  public render() {
    return (
      <FullContainer
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{ backgroundImage: `url(../images/news/post-image.png) left top/80% no-repeat` }}
      >
        <CloseButton className='icon-close' onClick={this.props.onClose} />
        <TitleContainer>
          <Title>{this.props.note.title}</Title>
          <DescriptionText>BUIID #{this.props.note.patchNumber}</DescriptionText>
          <DescriptionText className='date'>{this.props.note.utcDisplayStart}</DescriptionText>
        </TitleContainer>
        <Divider />
        <ContentContainer className='cse-ui-scroller-grey' style={{ width: '740px' }}>
          <ContentImage src={'images/news/post-image.png'} />
          <ContentText dangerouslySetInnerHTML={{ __html: this.props.note.htmlContent }} />
        </ContentContainer>
      </FullContainer>
    );
  }
}

export default PatchNotesFullArticle;
