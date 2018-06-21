/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import * as React from 'react';
import { utils } from '@csegames/camelot-unchained';

import ResponseError from '../../lib/ResponseError';
import { fetchJSON } from '../../lib/fetchHelpers';

import NewsItem from './components/NewsItem';
import { NewsState, Post } from '../../services/session/news';
import { FetchStatus, defaultFetchStatus, hashMerge } from '../../lib/reduxUtils';

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


export interface NewsProps {
}

export interface NewsState extends FetchStatus {
  didInvalidate?: boolean;
  nextPage?: number;
  fetchedPageCount?: number;
  posts?: Post[];
}


const postsPerPage = 12;
function makePostsUrl(page: number): string {
  return `http://camelotunchained.com/v3/wp-json/wp/v2/posts?per_page=${postsPerPage}&page=${page}`;
}

let stateCache: NewsState = utils.merge(defaultFetchStatus, {
  didInvalidate: false,
  nextPage: 1,
  fetchedPageCount: 0,
  posts: [],
});

class News extends React.Component<NewsProps, NewsState> {
  public name: string = 'cse-patcher-news';

  constructor(props: NewsProps) {
    super(props);
    this.state = stateCache;
  }

  public render() {

    const newsItems = this.state.posts.map(this.renderNewsItem);
    return (
      <div className='News'>
          <ul className='News__content'>
            {newsItems}
          </ul>
          {
            this.state.isFetching ?
              <div className='News__loadMore News__loadMore--loading wave-text'>
                <i>|</i><i>|</i><i>|</i><i>|</i><i>|</i><i>|</i><i>|</i>
              </div> :
                <a className='News__loadMore' href='#' onClick={this.fetchNextPage}>Load More</a>
          }
      </div>
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

  private renderNewsItem = (post: Post) => {
    return (
      <li className='cse-patcher-news-item' key={post.id}>
        <NewsItem post={post} />
      </li>
    );
  }

  private fetchPage = (page: number) => {
    this.setState({isFetching: true} as any);
    fetchJSON(makePostsUrl(page))
      .then((posts: Post[]) => {
        const mergedPosts = hashMerge((p: Post) => '' + p.id, this.state.posts, posts);
        mergedPosts.sort((a, b) => {
          const aDate = new Date(a.date);
          const bDate = new Date(b.date);
          return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
        });
        stateCache = utils.merge(this.state, {
          isFetching: false,
          didInvalidate: false,
          nextPage: this.state.nextPage + 1,
          lastUpdated: new Date(),
          posts: mergedPosts,
        }) as any;
        this.setState(stateCache);
      })
      .catch((error: ResponseError) => {
        this.setState(utils.merge(this.state, {
          isFetching: false,
          error,
        }));
      });
  }
}

export default News;
