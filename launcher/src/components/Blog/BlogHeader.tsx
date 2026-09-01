/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../redux/store';
import { NEWS_COLOR } from '.';
import { Post } from '../../redux/blogSlice';
import { changeRoute } from '../../redux/navigationSlice';
import { playSound, Sound } from '../../lib/Sound';

const Title = 'Blog-Header-Title';
const DescriptionText = 'Blog-Header-DescriptionText';
const TextureWrapper = 'Blog-Header-TextureWrapper';
const Container = 'Blog-Header-Container';
const Image = 'Blog-Header-Image';
const Overlay = 'Blog-Header-Overlay';
const ChildrenContainer = 'Blog-Header-ChildrenContainer';
const ReadMore = 'Blog-Header-ReadMore';
const Arrow = 'Blog-Header-Arrow';

interface ReactProps {
  post: Post;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class ABlogHeader extends React.Component<Props & DispatchProp> {
  public render() {
    const { title, posted, imgSrc } = this.props.post;
    return (
      <div className={TextureWrapper} onClick={this.onClick.bind(this)} onMouseEnter={this.onMouseEnter}>
        <div
          className={Container}
          style={{ borderImage: `linear-gradient(to right, ${NEWS_COLOR}, transparent) 10% 1%` }}
        >
          <img className={Image} src={imgSrc} />
          <div className={Overlay} />
          <div className={`${ChildrenContainer} children-container`}>
            <div className={Title} dangerouslySetInnerHTML={{ __html: title }} />
            <div className={DescriptionText}>{posted.toLocaleString()}</div>
          </div>
          <div className={`${ReadMore} read-more`} style={{ color: NEWS_COLOR }}>
            {'Read More'}
            <span className={`${Arrow} fa fa-angle-right`} />
          </div>
        </div>
      </div>
    );
  }

  private onClick(): void {
    const { type, id: selected } = this.props.post;
    playSound(Sound.Select);
    this.props.dispatch(changeRoute({ type, selected }));
  }

  private onMouseEnter(): void {
    playSound(Sound.SelectChange);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const BlogHeader = connect(mapStateToProps)(ABlogHeader);
