/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import NewsItem from './NewsItem';
import {Post} from '../redux/modules/news';

export interface NewsProps {
  isFetching: boolean;
  didInvalidate: boolean;
  lastUpdated: Date;
  nextPage: number;
  posts: Array<any>;
  fetchPage: (page: number) => any;
};

export interface NewsState {};

class News extends React.Component<NewsProps, NewsState> {
  public name: string = 'cse-patcher-news';
  
  fetchNextPage = () => {
    if (this.props.isFetching) return;
    this.props.fetchPage(this.props.nextPage);
  }
  
  renderNewsItem = (post: Post) => {
    return (
      <li className='cse-patcher-news-item' key={post.id}>
        <NewsItem post={post} />
      </li>
    );
  }
  
  componentDidMount() {
    if (this.props.posts.length == 0) {
      this.fetchNextPage();
    }
  }
  
  render() {
    
    let spinner: any = <div />;
    if (this.props.isFetching) {
      spinner = (
        <div className="preloader-wrapper small active">
          <div className="spinner-layer spinner-yellow-only">
            <div className="circle-clipper left">
              <div className="circle"></div>
            </div><div className="gap-patch">
              <div className="circle"></div>
            </div><div className="circle-clipper right">
              <div className="circle"></div>
            </div>
          </div>
        </div>
      );
    }
    
    let newsItems = this.props.posts.map(this.renderNewsItem);
    return (
      <div id={this.name} className='main-content'>
        <div className='content-area'>
          <ul>
            {newsItems}
          </ul>
          {spinner}
          <p className='loadmore'><a href='#' onClick={this.fetchNextPage}>Load More</a></p>
          <p />
          <p />
          <p />
        </div>
      </div>
    );
  }
};

export default News;
