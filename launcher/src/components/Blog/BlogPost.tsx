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

const Divider = 'Blog-Post-Divider';
const FullContainer = 'Blog-Post-FullContainer';
const TitleContainer = 'Blog-Post-TitleContainer';
const Title = 'Blog-Post-Title';
const DescriptionText = 'Blog-Post-DescriptionText';
const ContentContainer = 'Blog-Post-ContentContainer';
const ContentText = 'Blog-Post-ContentText';
const CloseButton = 'Blog-Post-CloseButton';

interface ReactProps {
  post: Post;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class ABlogPost extends React.Component<Props & DispatchProp> {
  public render() {
    const { type, title, posted, imgSrc, content } = this.props.post;
    return (
      <div
        className={FullContainer}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        style={{ backgroundImage: `url(${imgSrc}) left top/80% no-repeat` }}
      >
        <div className={`${CloseButton} icon-close`} onClick={() => this.props.dispatch(changeRoute({ type }))} />
        <div className={TitleContainer}>
          <div className={Title} dangerouslySetInnerHTML={{ __html: title }} />
          <div className={`${DescriptionText} date`}>{posted.toLocaleString()}</div>
        </div>
        <div className={Divider} />
        <div className={`${ContentContainer} cse-ui-scroller-grey`} style={{ width: '740px' }}>
          <div className={ContentText} dangerouslySetInnerHTML={{ __html: content }} />
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

export const BlogPost = connect(mapStateToProps)(ABlogPost);
