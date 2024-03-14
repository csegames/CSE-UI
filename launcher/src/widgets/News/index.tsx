/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { has, uniqBy } from 'lodash';

import Animate from '../../lib/Animate';
import ResponseError from '../../lib/ResponseError';
import { fetchJSON } from '../../lib/fetchHelpers';

import NewsItem from './components/NewsItem';
import { Post } from '../../services/session/news';
import { FetchStatus, defaultFetchStatus, merge } from '../../lib/reduxUtils';
import FilterTabs, { PostFilter } from './components/FilterTabs';
import PatchNotesItem from './components/PatchNotesItem';
import NewsFeaturedItem from './components/NewsFeaturedItem';
import PatchNotesFeaturedItem from './components/PatchNotesFeaturedItem';
import NewsFullArticle from './components/NewsFullArticle';
import PatchNotesFullArticle from './components/PatchNotesFullArticle';
import { FullWrapper } from './lib/styles';
import { primary } from '../../api/graphql';
import { query } from '../../api/query';
import { primaryConf } from '../../api/networkConfig';
import gql from 'graphql-tag';
import { ContentPhase } from '../../services/ContentPhase';

const patchNotesQuery = gql`
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

const Container = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  width: 100%;
  z-index: 1;
  a {
    color: #3fd0b0;
  }
`;

const Content = styled.div`
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

const ContentItem = styled.div`
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

const LoadMore = `
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

const LoadMoreText = styled.div`
  ${LoadMore}
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #847b72;
`;

const LoadMoreLoading = styled.div`
  ${LoadMore}
  font-weight: 700;
  color: #847b72;
`;

export interface RenderedObject {
  rendered: string;
}

export type PostItem = Post | primary.PatchNote;

export function isPatchNote(post: PostItem): post is primary.PatchNote {
  return typeof (post as primary.PatchNote)['utcDisplayStart'] === 'string';
}

type NewsProps = { phase: ContentPhase };
export interface NewsState extends FetchStatus {
  activeFilter?: PostFilter;
  didInvalidate?: boolean;
  nextPage?: number;
  fetchedPageCount?: number;
  posts?: PostItem[];
  selectedPost?: PostItem;
}

const postsPerPage = 12;
function makePostsUrl(phase: ContentPhase, page: number): string {
  if (phase === ContentPhase.Colossus) {
    //TODO: put the FSR news wordpress data source here once we have one
    return '';
  }
  return `https://camelotunchained.com/v3/wp-json/wp/v2/posts?per_page=${postsPerPage}&page=${page}`;
}

let stateCache: NewsState = merge(defaultFetchStatus, {
  activeFilter: PostFilter.All,
  didInvalidate: false,
  nextPage: 1,
  fetchedPageCount: 0,
  posts: [],
  selectedPost: null
});

class News extends React.Component<NewsProps, NewsState> {
  public name: string = 'cse-patcher-news';

  constructor(props: NewsProps) {
    super(props);
    this.state = stateCache;
  }

  public render() {
    const { activeFilter } = this.state;
    const posts = this.getPostsWithInvisibleCells(
      activeFilter === PostFilter.All
        ? this.state.posts
        : this.state.posts.filter((post) => isPatchNote(post) !== (PostFilter.News === activeFilter))
    );
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
        <Content>{newsItems}</Content>
        {(this.state.activeFilter === PostFilter.All || this.state.activeFilter === PostFilter.News) &&
          (this.state.isFetching ? (
            <LoadMoreLoading className='wave-text'>
              <i>|</i>
              <i>|</i>
              <i>|</i>
              <i>|</i>
              <i>|</i>
              <i>|</i>
              <i>|</i>
            </LoadMoreLoading>
          ) : (
            <LoadMoreText onClick={this.fetchNextPage}>Load More</LoadMoreText>
          ))}
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
  };

  private renderNewsItem = (post: PostItem, i: number) => {
    if (post === null) {
      return <ContentItem key={i} />;
    }
    if (i === 0) {
      // Feature first item
      if (isPatchNote(post)) {
        return <PatchNotesFeaturedItem key={i} note={post} onSelectNote={this.onSelectPostItem.bind(this)} />;
      }
      return <NewsFeaturedItem key={i} post={post} onSelectPost={this.onSelectPostItem.bind(this)} />;
    }

    if (isPatchNote(post)) {
      return (
        <ContentItem key={i}>
          <PatchNotesItem note={post} onSelectNote={this.onSelectPostItem.bind(this)} />
        </ContentItem>
      );
    }

    return (
      <ContentItem key={i}>
        <NewsItem post={post} onSelectPost={this.onSelectPostItem.bind(this)} />
      </ContentItem>
    );
  };

  private renderSelectedPost = () => {
    const { selectedPost } = this.state;
    if (!selectedPost) return null;
    if (isPatchNote(selectedPost)) {
      return (
        <FullWrapper key={selectedPost.id} onClick={this.onCloseFullArticle.bind(this)}>
          <PatchNotesFullArticle note={selectedPost} onClose={this.onCloseFullArticle.bind(this)} />
        </FullWrapper>
      );
    }

    return (
      <FullWrapper key={selectedPost.id} onClick={this.onCloseFullArticle.bind(this)}>
        <NewsFullArticle key={selectedPost.id} post={selectedPost} onClose={this.onCloseFullArticle.bind(this)} />
      </FullWrapper>
    );
  };

  private fetchPage = (page: number) => {
    this.setState({ isFetching: true });
    const url = makePostsUrl(this.props.phase, page);
    if (url) {
      fetchJSON(url)
        .then(this.onFetchNewsPosts.bind(this))
        .catch((error: ResponseError) => {
          this.setState(
            merge(this.state, {
              isFetching: false,
              error
            })
          );
        });
    } else {
      this.setState(
        merge(this.state, {
          isFetching: false,
          didInvalidate: false,
          nextPage: 0,
          lastUpdated: new Date(),
          posts: [],
          selectedPost: null
        })
      );
    }
  };

  private onFetchNewsPosts = async (posts: Post[]) => {
    const res = await this.getPatchNotes(posts);
    let mergedPosts: PostItem[] = this.state.posts;

    mergedPosts = mergedPosts.concat(posts);

    if (res.ok) {
      const patchNotePostItems = res.data.patchNotes.map((patchNote) => {
        return {
          type: PostFilter.PatchNotes,
          item: patchNote
        };
      });
      mergedPosts = uniqBy(mergedPosts.concat(patchNotePostItems as any), (p) => p.id);
    }
    mergedPosts.sort((a, b) => {
      const aDate = this.getPostItemDate(a);
      const bDate = this.getPostItemDate(b);
      return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
    });
    stateCache = merge(this.state, {
      isFetching: false,
      didInvalidate: false,
      nextPage: this.state.nextPage + 1,
      lastUpdated: new Date(),
      posts: mergedPosts,
      selectedPost: null
    });
    this.setState(stateCache);
  };

  private getPatchNotes = async (posts: Post[]) => {
    const { from, to } = this.getFromAndToDate(posts);
    return await query<Pick<primary.CUQuery, 'patchNotes'>>(
      { query: patchNotesQuery, variables: { channel: 4, from, to } },
      primaryConf
    );
  };

  private getFromAndToDate = (posts: Post[]) => {
    const sortedPosts = posts.sort((a, b) => {
      const aDate = this.getPostItemDate(a);
      const bDate = this.getPostItemDate(b);
      return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
    });

    return {
      from: new Date(sortedPosts[0].date),
      to: new Date(sortedPosts[sortedPosts.length - 1].date)
    };
  };

  private getPostItemDate = (postItem: Post | primary.PatchNote) => {
    if (has(postItem, 'date')) {
      return new Date((postItem as Post).date);
    }

    return new Date((postItem as primary.PatchNote).utcDisplayStart);
  };

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
  };

  private onSelectPostItem = (post: PostItem) => {
    this.setState({ selectedPost: post });
  };

  private onCloseFullArticle = () => {
    this.setState({ selectedPost: null });
  };

  private onFilterClick = (filter: PostFilter) => {
    this.setState({ activeFilter: filter });
  };
}

export default News;
