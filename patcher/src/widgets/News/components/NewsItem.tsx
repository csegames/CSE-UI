/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import Item from './Item';
import { Post } from '../../../services/session/news';
import { getNewsTitle, getNewsDate, getNewsImageInfo } from '../utils';
import { PostItem } from '..';
import { NEWS_COLOR } from '../lib/styles';

const Title = styled.div`
  font-family: Caudex;
  font-size: 18px;
  margin-bottom: 5px;
`;

const DescriptionText = styled.div`
  font-family: Titillium Web;
  font-size: 10px;
`;

export interface NewsItemProps {
  post: PostItem;
  onSelectPost: (post: PostItem) => void;
}

class NewsItem extends React.Component<NewsItemProps> {
  public render() {
    const postItem = this.props.post.item as Post;
    const title = getNewsTitle(postItem);
    const date = getNewsDate(postItem);
    const { imgSrc, imgClass } = getNewsImageInfo(postItem);
    return (
      <Item indicatorColor={NEWS_COLOR} imgSrc={imgSrc} containerClass={imgClass} onClick={this.onSelect}>
        <Title dangerouslySetInnerHTML={{ __html: title }} />
        <DescriptionText>{date}</DescriptionText>
      </Item>
    );
  }

  private onSelect = () => {
    this.props.onSelectPost(this.props.post);
  }
}

export default NewsItem;
