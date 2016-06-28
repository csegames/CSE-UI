/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Promise} from 'es6-promise';
import 'isomorphic-fetch';

import ResponseError from '../../../../../shared/lib/ResponseError';
import {fetchJSON} from '../../../../../shared/lib/fetchHelpers';

export interface RenderedObject {
  rendered: string
}

export interface WPData {
  id: number,
  date: string,
  guid: RenderedObject
  link: string,
  modified: string,
  modified_gmt: string,
  slug: string,
  title: RenderedObject,
  author: number,
  comment_status: string,
  ping_status: string,
  type: string,
  _links: any,
}

export interface Post extends WPData {
  status: string,
  content: RenderedObject,
  excerpt: RenderedObject,
  featured_image: number,
  sticky: boolean,
  format: string,
}

export interface Media extends WPData {
  alt_text: string,
  caption: string,
  description: string,
  media_type: string,
  media_details: any
}

export interface ImageSize {
  file: string,
  width: number,
  height: number,
  'mime-type': string,
  source_url: string
}

export interface ImageMediaDetails {
  width: number,
  height: number,
  file: string,
  sizes: {
    thumbnail: ImageSize,
    'portfolio-one-third': ImageSize,
    'portfolio-one-fourth': ImageSize
  },
  post: number,
  source_url: string
}

// action types
const INVALIDATE_NEWS = 'cse-patcher/news/INVALIDATE_NEWS';

const FETCH_NEXT_PAGE = 'cse-patcher/news/FETCH_NEXT_PAGE';
const FETCH_PAGE_SUCCESS = 'cse-patcher/news/FETCH_NEWS_SUCCESS';
const FETCH_PAGE_FAILED = 'cse-patcher/news/FETCH_NEWS_FAILED';

const postsPerPage = 12;

// sync actions
export function requestPage(page: number) {
  return {
    type: FETCH_NEXT_PAGE,
    page: page
  }
}

export function fetchPageSuccess(posts: Array<any>) {
  return {
    type: FETCH_PAGE_SUCCESS,
    posts: posts,
    receivedAt: Date.now()
  };
}

export function fetchPageFailed(error: ResponseError) {
  return {
    type: FETCH_PAGE_FAILED,
    error: error
  };
}

// async actions
function makePostsUrl(page: number): string {
  return `http://camelotunchained.com/v3/wp-json/wp/v2/posts?per_page=${postsPerPage}&page=${page}?callback=foo`;
}

export function fetchPage(page: number) {
  return (dispatch: (action: any) => any) => {
    dispatch(requestPage(page));
    return fetchJSON(makePostsUrl(page))
      .then((posts: Array<any>) => dispatch(fetchPageSuccess(posts)))
      .catch((error: ResponseError) => dispatch(fetchPageFailed(error)));
  }
}

// reducer
export interface NewsState {
  isFetching?: boolean;
  didInvalidate?: boolean;
  lastUpdated?: Date;
  nextPage?: number;
  fetchedPageCount?: number;
  posts?: Array<Post>;
  error?: string;
}

const initialState = {
  isFetching: false,
  didInvalidate: false,
  lastUpdated: <Date>null,
  nextPage: 1,
  fetchedPageCount: 0,
  posts: <Array<Post>>[]
}

export default function reducer(state: any = initialState, action: any = {}) {
  switch(action.type) {
    case INVALIDATE_NEWS:
      return Object.assign({}, state, {
        didInvalidate: true,
        fetchedPageCount: 0
      });
    case FETCH_NEXT_PAGE:
      return Object.assign({}, state, {
        isFetching: true
      });
    case FETCH_PAGE_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        didInvalidate: false,
        nextPage: state.nextPage + 1,
        lastUpdated: action.receivedAt,
        posts: state.posts.concat(action.posts)
      });
    case FETCH_PAGE_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    default: return state;
  }
}
