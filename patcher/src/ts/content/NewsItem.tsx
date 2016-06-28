/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import {Post} from '../redux/modules/news';
import Animate from '../../../../shared/components/Animate';

export interface NewsItemProps {
  post: Post;
};

export interface NewsItemState {
  showFullArticle: boolean;
};

class NewsItem extends React.Component<NewsItemProps, NewsItemState> {
  public name: string = 'cse-patcher-news-item';
  
  constructor(props: NewsItemProps) {
    super(props);
    this.state = {
      showFullArticle: false
    };
  }
  
  showFullArticle = () => {
    this.setState({
      showFullArticle: true
    });
  }
  
  hideFullArticle = () => {
    this.setState({
      showFullArticle: false
    });
  }
  
  componentDidUpdate(prevProps: NewsItemProps, prevState: NewsItemState) {
    const root: HTMLDivElement = (this.refs as any).newsContent;
    if (root) {
      const as: NodeListOf<HTMLAnchorElement> = root.getElementsByTagName("a");
      for (let i = 0; i < as.length; i++) {
        const a: HTMLAnchorElement = as[i];
        a.target = "_blank";
      }
    }
  }

  render() {
    const {post} = this.props;
    const title = post.title.rendered.split('&#8211;')[0].split('–')[0];
    const dateString = new Date(post.date).toLocaleString();
    
    let fullArticle: any = null;
    if (this.state.showFullArticle) {
      fullArticle = (
        <div key='0' className='full-page'>
          <div className='article-content card-panel'>
            <div className='content-container'>
                <span className='card-title grey-text' onClick={this.hideFullArticle}
                dangerouslySetInnerHTML={{__html: `${title}<i class="material-icons right">close</i><p>${dateString}</p>`}} />
                <div ref="newsContent" className='words' dangerouslySetInnerHTML={{__html: post.content.rendered}} />
            </div>
          </div>
        </div>
      );
    }
    
    var c = document.createElement('div');
    c.innerHTML = post.content.rendered;
    c.getElementsByTagName('img');
    let images = c.getElementsByTagName('img');
    let imgSrc: any = 'images/other-bg.png';
    let imgClass: any = 'wide';
    let imgWidth: any = 500;
    if(images.length > 0) {
      let index = images.length - 1;
      do {
        let img = images[index];
        if (img.width > imgWidth) {
          imgSrc = img.src;
          imgWidth = img.width;
          if(img.width / img.height <= 1) imgClass = 'tall'
          break;
        }
        --index;
      } while(index >= 0)
      
    }
    
    return (
      <div>
        <div className='card news-card' onClick={this.showFullArticle}>
            <img className={imgClass} src={imgSrc} style={{marginLeft: `-${imgWidth/2}px`}} />
          <div className='card-content'>
            <span className='card-title' dangerouslySetInnerHTML={{__html: title}} />
            <h6 className='date'>{dateString}</h6>
            <p dangerouslySetInnerHTML={{__html: post.excerpt.rendered}} />
          </div>
        </div>
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown'
          durationEnter={400} durationLeave={500}>
          {fullArticle}
        </Animate>
      </div>
    );
  }
}

export default NewsItem;
