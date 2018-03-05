/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';

import {
  BaseAction,
  defaultAction,
  AsyncAction,
  FetchStatus,
  defaultFetchStatus,
  merge,
  hashMerge,
} from '../../lib/reduxUtils';
import ResponseError from '../../lib/ResponseError';
import { fetchJSON } from '../../lib/fetchHelpers';


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

const INVALIDATE_NEWS = 'cse-patcher/news/INVALIDATE_NEWS';

const FETCH_NEXT_PAGE = 'cse-patcher/news/FETCH_NEXT_PAGE';
const FETCH_PAGE_SUCCESS = 'cse-patcher/news/FETCH_NEWS_SUCCESS';
const FETCH_PAGE_FAILED = 'cse-patcher/news/FETCH_NEWS_FAILED';

const postsPerPage = 12;

export interface NewsAction extends BaseAction {
  page?: number;
  posts?: Post[];
}

export function requestPage(page: number): NewsAction {
  return {
    type: FETCH_NEXT_PAGE,
    when: new Date(),
    page,
  };
}

export function fetchPageSuccess(posts: Post[]): NewsAction {
  return {
    type: FETCH_PAGE_SUCCESS,
    when: new Date(),
    posts,
  };
}

export function fetchPageFailed(error: ResponseError): NewsAction {
  return {
    type: FETCH_PAGE_FAILED,
    when: new Date(),
    error: error.message,
  };
}

function makePostsUrl(page: number): string {
  return `http://camelotunchained.com/v3/wp-json/wp/v2/posts?per_page=${postsPerPage}&page=${page}`;
}

export function fetchPage(page: number): AsyncAction<NewsAction> {
  return (dispatch: (action: NewsAction) => any) => {
    dispatch(requestPage(page));
    return fetchJSON(makePostsUrl(page))
      .then((posts: Post[]) => dispatch(fetchPageSuccess(posts)))
      .catch((error: ResponseError) => dispatch(fetchPageFailed(error)));
  };
}

// reducer
export interface NewsState extends FetchStatus {
  didInvalidate?: boolean;
  nextPage?: number;
  fetchedPageCount?: number;
  posts?: Post[];
}

function getInitialState(): NewsState {
  return merge(defaultFetchStatus, {
    didInvalidate: false,
    nextPage: 1,
    fetchedPageCount: 0,
    posts: [],
  });
}

export default function reducer(state: NewsState = getInitialState(), action: NewsAction = defaultAction): NewsState {
  switch (action.type) {
    default: return state;
    case INVALIDATE_NEWS:
      return merge(state, {
        didInvalidate: true,
        fetchedPageCount: 0,
      });
    case FETCH_NEXT_PAGE:
      return merge(state, {
        isFetching: true,
      });
    case FETCH_PAGE_SUCCESS:
      const posts = hashMerge((p: Post) => '' + p.id, state.posts, action.posts);
      posts.sort((a, b) => {
        const aDate = new Date(a.date);
        const bDate = new Date(b.date);
        return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
      });
      return merge(state, {
        isFetching: false,
        didInvalidate: false,
        nextPage: state.nextPage + 1,
        lastUpdated: action.when,
        posts,
      });
    case FETCH_PAGE_FAILED:
      return merge(state, {
        isFetching: false,
        error: action.error,
      });
  }
}
