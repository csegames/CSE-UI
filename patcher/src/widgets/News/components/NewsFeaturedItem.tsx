/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Post, PostItem } from '..';
import { getNewsTitle, getNewsDate, getNewsImageInfo } from '../utils';
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
  onSelectPost: (post: PostItem) => void;
}

class NewsFeaturedItem extends React.Component<Props> {
  public render() {
    const postItem = this.props.post.item as Post;
    const title = getNewsTitle(postItem);
    const date = getNewsDate(postItem);
    const { imgSrc } = getNewsImageInfo(postItem);
    return (
      <FeaturedContainer backgroundImage={imgSrc}>
        <TitleContainer>
          <Title dangerouslySetInnerHTML={{ __html: title }} />
          <DescriptionText className='date'>{date}</DescriptionText>
        </TitleContainer>
        <Divider />
        <ContentContainer>
          <ContentImage src={imgSrc} />
          <ContentText
            style={{ maxHeight: '130px', overflow: 'hidden' }}
            dangerouslySetInnerHTML={{ __html: postItem.content.rendered }}
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

export default NewsFeaturedItem;
