/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';
import { RootState } from '../../redux/store';
import { Post } from '../../redux/blogSlice';
import { changeRoute } from '../../redux/navigationSlice';

const Divider = 'Blog-FeaturedHeader-Divider';

const FeaturedContainer = 'Blog-FeaturedHeader-FeaturedContainer';
const TitleContainer = 'Blog-FeaturedHeader-TitleContainer';
const Title = 'Blog-FeaturedHeader-Title';
const DescriptionText = 'Blog-FeaturedHeader-DescriptionText';
const ContentContainer = 'Blog-FeaturedHeader-ContentContainer';
const ContentImage = 'Blog-FeaturedHeader-ContentImage';
const ContentText = 'Blog-FeaturedHeader-ContentText';
const ReadMoreButton = 'Blog-FeaturedHeader-ReadMoreButton';
const ReadMoreText = 'Blog-FeaturedHeader-ReadMoreText';

interface ReactProps {
  post: Post;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class ABlogFeaturedHeader extends React.Component<Props & DispatchProp> {
  public render() {
    const { type, id: selected, title, posted, imgSrc, content } = this.props.post;
    return (
      <div className={FeaturedContainer}>
        <div className={TitleContainer}>
          <div className={Title} dangerouslySetInnerHTML={{ __html: title }} />
          <div className={`${DescriptionText} date`}>{posted.toLocaleString()}</div>
        </div>
        <div className={Divider} />
        <div className={ContentContainer}>
          <img className={ContentImage} src={imgSrc} />
          <div className={ContentText} dangerouslySetInnerHTML={{ __html: content }} />
        </div>
        <div className={ReadMoreButton} onClick={() => this.props.dispatch(changeRoute({ type, selected }))}>
          <div className={ReadMoreText}>{'Read More'}</div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const BlogFeaturedHeader = connect(mapStateToProps)(ABlogFeaturedHeader);
