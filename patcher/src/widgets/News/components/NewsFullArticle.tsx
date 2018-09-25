/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

import { Post, PostItem } from '..';
import { getNewsTitle, getNewsImageInfo, getNewsDate } from '../utils';
import {
  FullContainer,
  TitleContainer,
  Title,
  DescriptionText,
  ContentContainer,
  ContentImage,
  ContentText,
  CloseButton,
  NEWS_COLOR,
} from '../lib/styles';

const Divider = styled('div')`
  position: relative;
  background-color: ${NEWS_COLOR};
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
  onClose: () => void;
}

class NewsFullArticle extends React.Component<Props> {
  public render() {
    const postItem = this.props.post.item as Post;
    const title = getNewsTitle(postItem);
    const date = getNewsDate(postItem);
    const { imgSrc } = getNewsImageInfo(postItem);
    return (
      <FullContainer backgroundImage={imgSrc} onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <CloseButton className='icon-close' onClick={this.props.onClose} />
        <TitleContainer>
          <Title dangerouslySetInnerHTML={{ __html: title }} />
          <DescriptionText className='date'>{date}</DescriptionText>
        </TitleContainer>
        <Divider />
        <ContentContainer className='cse-ui-scroller-grey' style={{ width: '740px' }}>
          <ContentImage src={imgSrc} />
          <ContentText dangerouslySetInnerHTML={{ __html: postItem.content.rendered }} />
        </ContentContainer>
      </FullContainer>
    );
  }
}

export default NewsFullArticle;
