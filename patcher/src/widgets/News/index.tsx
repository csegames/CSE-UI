/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import * as React from 'react';
import styled, { css } from 'react-emotion';
import { has, uniqBy } from 'lodash';
import { utils, client } from '@csegames/camelot-unchained';
import { CUQuery, PatchNote } from '@csegames/camelot-unchained/lib/graphql';
import { query } from '@csegames/camelot-unchained/lib/graphql/query';

import Animate from '../../lib/Animate';
import ResponseError from '../../lib/ResponseError';
import { fetchJSON } from '../../lib/fetchHelpers';

import NewsItem from './components/NewsItem';
import { Post } from '../../services/session/news';
import { FetchStatus, defaultFetchStatus } from '../../lib/reduxUtils';
import { isPatchNote } from './utils';
import FilterTabs, { PostFilter } from './components/FilterTabs';
import PatchNotesItem from './components/PatchNotesItem';
import NewsFeaturedItem from './components/NewsFeaturedItem';
import PatchNotesFeaturedItem from './components/PatchNotesFeaturedItem';
import NewsFullArticle from './components/NewsFullArticle';
import PatchNotesFullArticle from './components/PatchNotesFullArticle';
import { FullWrapper } from './lib/styles';

const patchNotesQuery = `
  query PatchNotesQuery($channel: Int!, $from: Date!, $to: Date!) {
    patchNotes(channel: $channel, from: $from, to: $to) {
      id
      title
      patchNumber
      htmlContent
      utcDisplayStart
    }
  }
`;

const Container = styled('div')`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 1;
  a {
    color: #3fd0b0;
  }
`;

const Content = styled('div')`
  display: flex;
  flex-wrap: wrap;
  flex: 1 1 auto;
  padding: 0 20px;
  color: #ececec;
  width: 75%;
  margin: auto;
  list-style-type: inherit;
  margin-bottom: 15px;
`;

const ContentItem = styled('div')`
  flex: 1;
  list-style-type: inherit;
  display: inline-block;
  margin-bottom: 8px;
  overflow: hidden;
  text-align: left;
  margin-right: 5px;
  margin-left: 5px;
  margin-bottom: 10px;
  flex-basis: 30%;
`;

const LoadMore = css`
  position: relative;
  margin-bottom: 40px;
  text-align: center;
  cursor: pointer;
  -webkit-user-select: none;
  user-select: non;
  font-size: 12px;
  font-family: Caudex;
  width: fit-content;
  align-self: center;
  padding: 0 5px;

  &:hover {
    filter: brightness(120%);
  }

  &:before {
    content: '';
    position: absolute;
    top: 2px;
    left: 0;
    width: 1px;
    height: 12px;
    background-color: #847B72;
  }

  &:after {
    content: '';
    position: absolute;
    top: 2px;
    right: 0;
    width: 1px;
    height: 12px;
    background-color: #847B72;
  }
`;

const LoadMoreText = styled('div')`
  ${LoadMore}
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #847B72;
`;

const LoadMoreLoading = styled('div')`
  ${LoadMore}
  font-weight: 700;
  color: #847B72;
`;

export interface RenderedObject {
  rendered: string;
}

export interface WPData {
  id: number;
  date: string;
  guid: RenderedObject;
  link: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  title: RenderedObject;
  author: number;
  comment_status: string;
  ping_status: string;
  type: string;
  _links: any;
}

export interface Post extends WPData {
  status: string;
  content: RenderedObject;
  excerpt: RenderedObject;
  featured_image: number;
  sticky: boolean;
  format: string;
}

export interface Media extends WPData {
  alt_text: string;
  caption: string;
  description: string;
  media_type: string;
  media_details: any;
}

export interface ImageSize {
  file: string;
  width: number;
  height: number;
  'mime-type': string;
  source_url: string;
}

export interface ImageMediaDetails {
  width: number;
  height: number;
  file: string;
  sizes: {
    thumbnail: ImageSize,
    'portfolio-one-third': ImageSize,
    'portfolio-one-fourth': ImageSize,
  };
  post: number;
  source_url: string;
}

export interface PostItem {
  type: PostFilter;
  item: Post | PatchNote;
}


export interface NewsProps {
}

export interface NewsState extends FetchStatus {
  activeFilter?: PostFilter;
  didInvalidate?: boolean;
  nextPage?: number;
  fetchedPageCount?: number;
  posts?: PostItem[];
  selectedPost?: PostItem;
}


const postsPerPage = 12;
function makePostsUrl(page: number): string {
  return `http://camelotunchained.com/v3/wp-json/wp/v2/posts?per_page=${postsPerPage}&page=${page}`;
}

let stateCache: NewsState = utils.merge(defaultFetchStatus, {
  activeFilter: PostFilter.All,
  didInvalidate: false,
  nextPage: 1,
  fetchedPageCount: 0,
  posts: [],
  selectedPost: null,
});

class News extends React.Component<NewsProps, NewsState> {
  public name: string = 'cse-patcher-news';

  constructor(props: NewsProps) {
    super(props);
    this.state = stateCache;
  }

  public render() {
    const { activeFilter } = this.state;
    const posts = this.getPostsWithInvisibleCells(activeFilter === PostFilter.All ? this.state.posts :
      this.state.posts.filter(post => post.type === activeFilter));
    const newsItems = posts.map(this.renderNewsItem);

    let fullArticle = null;
    if (this.state.selectedPost) {
      fullArticle = this.renderSelectedPost();
    }
    return (
      <Container>
        <Animate animationEnter='fadeIn' animationLeave='fadeOut' durationEnter={200} durationLeave={200}>
          {fullArticle}
        </Animate>
        <FilterTabs activeFilter={activeFilter} onFilterClick={this.onFilterClick} />
        <Content>
          {newsItems}
        </Content>
        {(this.state.activeFilter === PostFilter.All || this.state.activeFilter === PostFilter.News) &&
          (this.state.isFetching ?
            <LoadMoreLoading className='wave-text'>
              <i>|</i><i>|</i><i>|</i><i>|</i><i>|</i><i>|</i><i>|</i>
            </LoadMoreLoading> :
            <LoadMoreText onClick={this.fetchNextPage}>Load More</LoadMoreText>
        )}
      </Container>
    );
  }

  public componentDidMount() {
    if (this.state.posts.length === 0) {
      this.fetchNextPage();
    }
  }

  private fetchNextPage = () => {
    if (this.state.isFetching) return;
    this.fetchPage(this.state.nextPage);
  }

  private renderNewsItem = (post: PostItem, i: number) => {
    if (post === null) {
      return <ContentItem key={i} />;
    }
    if (i === 0) {
      // Feature first item
      if (isPatchNote(post)) {
        return (
          <PatchNotesFeaturedItem key={i} post={post} onSelectPost={this.onSelectPost} />
        );
      }
      return (
        <NewsFeaturedItem key={i} post={post} onSelectPost={this.onSelectPost} />
      );
    }

    if (isPatchNote(post)) {
      return (
        <ContentItem key={i}>
          <PatchNotesItem post={post} onSelectPost={this.onSelectPost} />
        </ContentItem>
      );
    }

    return (
      <ContentItem key={i}>
        <NewsItem post={post} onSelectPost={this.onSelectPost} />
      </ContentItem>
    );
  }

  private renderSelectedPost = () => {
    const { selectedPost } = this.state;
    if (!selectedPost) return null;
    if (isPatchNote(selectedPost)) {
      return (
        <FullWrapper key={selectedPost.item.id} onClick={this.onCloseFullArticle}>
          <PatchNotesFullArticle post={selectedPost} onClose={this.onCloseFullArticle} />
        </FullWrapper>
      );
    }

    return (
      <FullWrapper key={selectedPost.item.id} onClick={this.onCloseFullArticle}>
        <NewsFullArticle key={selectedPost.item.id} post={selectedPost} onClose={this.onCloseFullArticle} />
      </FullWrapper>
    );
  }

  private fetchPage = (page: number) => {
    this.setState({ isFetching: true });
    fetchJSON(makePostsUrl(page))
      .then(this.onFetchNewsPosts)
      .catch((error: ResponseError) => {
        this.setState(utils.merge(this.state, {
          isFetching: false,
          error,
        }));
      });
  }

  private onFetchNewsPosts = async (posts: Post[]) => {
    const res = await this.getPatchNotes(posts);
    let mergedPosts: PostItem[] = this.state.posts;

    const newsPostItems = posts.map((newsPost) => {
      return {
        type: PostFilter.News,
        item: newsPost,
      };
    });
    mergedPosts = mergedPosts.concat(newsPostItems);

    if (res.ok) {
      const patchNotePostItems = res.data.patchNotes.map((patchNote) => {
        return {
          type: PostFilter.PatchNotes,
          item: patchNote,
        };
      });
      mergedPosts = uniqBy(mergedPosts.concat(patchNotePostItems), p => p.item.id);
    }
    mergedPosts.sort((a, b) => {
      const aDate = this.getPostItemDate(a.item);
      const bDate = this.getPostItemDate(b.item);
      return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
    });
    stateCache = utils.merge(this.state, {
      isFetching: false,
      didInvalidate: false,
      nextPage: this.state.nextPage + 1,
      lastUpdated: new Date(),
      posts: mergedPosts,
      selectedPost: null,
    });
    this.setState(stateCache);
  }

  private getPatchNotes = async (posts: Post[]) => {
    const { from, to } = this.getFromAndToDate(posts);
    const res = await query<Pick<CUQuery, 'patchNotes'>>({
      query: patchNotesQuery,
      variables: { channel: 4, from, to },
      operationName: null,
      namedQuery: null,
    }, {
      url: client.apiHost + '/graphql',
      requestOptions: {
        headers: {
          loginToken: client.loginToken,
          shardID: `${client.shardID}`,
          characterID: client.characterID,
        },
      },
    });
    return res;
  }

  private getFromAndToDate = (posts: Post[]) => {
    const sortedPosts = posts.sort((a, b) => {
      const aDate = this.getPostItemDate(a);
      const bDate = this.getPostItemDate(b);
      return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
    });

    return {
      from: new Date(sortedPosts[0].date),
      to: new Date(sortedPosts[sortedPosts.length - 1].date),
    };
  }

  private getPostItemDate = (postItem: Post | PatchNote) => {
    if (has(postItem, 'date')) {
      return new Date((postItem as Post).date);
    }

    return new Date((postItem as PatchNote).utcDisplayStart);
  }

  private getPostsWithInvisibleCells = (posts: (PostItem | null)[]) => {
    const remainder = posts.length > 0 ? (posts.length - 1) % 3 : 0;
    const postsWithInvisibleCells = [...posts];
    if (remainder) {
      for (let i = 0; i < remainder; i++) {
        // A null post indicates an invisible cell
        postsWithInvisibleCells.push(null);
      }
    }

    return postsWithInvisibleCells;
  }

  private onSelectPost = (post: PostItem) => {
    this.setState({ selectedPost: post });
  }

  private onCloseFullArticle = () => {
    this.setState({ selectedPost: null });
  }

  private onFilterClick = (filter: PostFilter) => {
    this.setState({ activeFilter: filter });
  }
}

export default News;
