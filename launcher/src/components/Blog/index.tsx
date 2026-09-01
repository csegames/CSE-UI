/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { Animate } from '../../lib/Animate';

import { BlogHeader } from './BlogHeader';
import { BlogPost } from './BlogPost';
import { RootState } from '../../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { BlogType, isBlogRoute, Route } from '../../redux/navigationSlice';
import { loadNextPage, Post } from '../../redux/blogSlice';
import { BlogFeaturedHeader } from './BlogFeaturedHeader';

export const NEWS_COLOR = 'rgba(236, 119, 127, 1)';

const Root = 'Blog-Root';
const FullWrapper = 'Blog-FullWrapper';
const Container = 'Blog-Container';
const Content = 'Blog-Content';
const ContentItem = 'Blog-ContentItem';
const LoadMoreText = 'Blog-LoadMoreText';
const LoadMoreLoading = 'Blog-LoadMoreLoading';

interface ReactProps {}

interface InjectedProps {
  route: Route;
  news: Record<number, Post>;
  patchNotes: Record<number, Post>;
  loading: Record<BlogType, boolean>;
}

type Props = ReactProps & InjectedProps;

class ABlog extends React.Component<Props & DispatchProp> {
  public name: string = 'cse-patcher-news';

  public render() {
    const { route, loading, dispatch } = this.props;
    if (!isBlogRoute(route)) return null;

    const posts = this.getPostsWithInvisibleCells();

    return (
      <div className={`${Root} cse-ui-scroller-grey`}>
        <div className={Container}>
          <div className={Content}>{posts.map(this.renderNewsItem.bind(this))}</div>
          {loading[route.type] ? (
            <div className={`${LoadMoreLoading} wave-text`}>
              <i>{'|'}</i>
              <i>{'|'}</i>
              <i>{'|'}</i>
              <i>{'|'}</i>
              <i>{'|'}</i>
              <i>{'|'}</i>
              <i>{'|'}</i>
            </div>
          ) : (
            <div className={LoadMoreText} onClick={() => dispatch(loadNextPage(route.type))}>
              {'Load More'}
            </div>
          )}
          <Animate animationEnter='fadeIn' animationLeave='fadeOut' durationEnter={200} durationLeave={200}>
            {route.selected ? this.renderSelectedPost() : null}
          </Animate>
        </div>
      </div>
    );
  }

  private renderNewsItem(post: Post | null, index: number): React.ReactNode {
    if (post === null) {
      return <div key={index} className={ContentItem} />;
    }

    if (index === 0) {
      return <BlogFeaturedHeader key={index} post={post} />;
    }

    return (
      <div key={index} className={ContentItem}>
        <BlogHeader post={post} />
      </div>
    );
    return null;
  }

  private renderSelectedPost(): React.ReactNode {
    const { route, news, patchNotes } = this.props;
    if (!isBlogRoute(route) || route.selected === undefined) return null;

    const article = route.type === 'news' ? news[route.selected] : patchNotes[route.selected];
    if (!article) return null;
    return (
      <div className={FullWrapper} key={route.selected}>
        <BlogPost post={article} />
      </div>
    );
    return null;
  }

  private getPostsWithInvisibleCells(): (Post | null)[] {
    const { route, news, patchNotes } = this.props;

    const posts: Post[] = route.type == 'news' ? Object.values(news) : Object.values(patchNotes);

    if (!posts.length) return posts;

    // sort by date descending
    posts.sort((a, b) => b.posted.valueOf() - a.posted.valueOf());

    // slot 0 = featured, need even rows of 3 afterward
    const values: (Post | null)[] = [...posts];
    while ((values.length - 1) % 3) {
      values.push(null);
    }
    return values;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { route: route } = state.navigation;
  const { news, patchNotes, loading } = state.blog;
  return {
    ...ownProps,
    route,
    news,
    loading,
    patchNotes
  };
};

export const Blog = connect(mapStateToProps)(ABlog);
