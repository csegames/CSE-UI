/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { connect } from 'react-redux';
import { RootState } from '../../mainScreen/redux/store';

const Root = 'HUD-ImagePreloader-Root';
const Image = 'HUD-ImagePreloader-Image';

interface State {
  cachedURLs: string[];
}

interface ReactProps {}

interface InjectedProps {
  imageURLsToCache: Record<string, string[]>;
}

type Props = ReactProps & InjectedProps;

class AImagePreloader extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      cachedURLs: this.buildFinalURLs(Object.keys(props.imageURLsToCache))
    };
  }

  public render(): React.ReactNode {
    return (
      <div className={Root}>
        {this.state.cachedURLs.map((url, index) => {
          return <img className={Image} src={url} key={index} />;
        })}
      </div>
    );
  }

  componentDidMount(): void {
    this.state.cachedURLs.forEach((url) => {
      clientAPI.requestAddImageToCache(url);
    });
  }

  componentDidUpdate(prevProps: Readonly<Props>, prevState: Readonly<State>, snapshot?: any): void {
    if (this.props.imageURLsToCache !== prevProps.imageURLsToCache) {
      const newURLs = this.buildFinalURLs(Object.keys(this.props.imageURLsToCache));
      const oldURLs = this.state.cachedURLs;

      const urlsToAdd = newURLs.filter((url) => !oldURLs.includes(url));
      const urlsToRemove = oldURLs.filter((url) => !newURLs.includes(url));

      urlsToAdd.forEach((url) => {
        clientAPI.requestAddImageToCache(url);
      });

      urlsToRemove.forEach((url) => {
        clientAPI.requestRemoveImageFromCache(url);
      });

      this.setState({ cachedURLs: newURLs });
    }
  }

  componentWillUnmount(): void {
    this.state.cachedURLs.forEach((url) => {
      clientAPI.requestRemoveImageFromCache(url);
    });
  }

  private buildFinalURLs(rawURLs: string[]): string[] {
    const finalURLs = rawURLs.map((url) => {
      // Process the URLs to ensure they match the format required by the client.

      // All slashes should be forward slashes.
      let u = url.replace('\\', '/');

      const dynamicStartIndex = u.indexOf('dynamic/');
      const iconsStartIndex = u.indexOf('images/icons/');
      if (dynamicStartIndex >= 0) {
        // Assets in the 'dynamic' folder retain their full paths.
        u = u.substring(dynamicStartIndex);
      } else if (iconsStartIndex >= 0) {
        // Assets in `images/icons/` also retain their full paths.
        u = u.substring(iconsStartIndex);
      } else if (u.includes('images/')) {
        // Any other assets in the 'images' folder have their directory structure flattened.
        const fileNameIndex = u.lastIndexOf('/') + 1;
        u = `images/${u.substring(fileNameIndex)}`;
      }

      return `coui://./${u}`;
    });
    return finalURLs;
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    imageURLsToCache: state.hud.imageURLsToCache
  };
};

export const ImagePreloader = connect(mapStateToProps)(AImagePreloader);
