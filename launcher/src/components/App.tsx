/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

// Components
import { ToolsHero } from './ToolsHero';
import { HeaderLinks } from './HeaderLinks';
import { VolumeControls } from './VolumeControls';
import { ToolSelector } from './ToolSelector';

// Widgets
import { SoundPlayer } from './SoundPlayer';
import { RootState } from '../redux/store';
import { isBlogRoute, Product, Route } from '../redux/navigationSlice';
import { Login } from './Login';
import { updateHUDSize } from '../redux/hudSlice';
import { CSETransition } from './CSETransition';
import { Blog } from './Blog';
import { ProductControls } from './ProductControls';
import ModalPane from './ModalPane';
import { APIDataSource } from '../dataSources/apiDataSource';
import { PatcherDataSource } from '../dataSources/patcherDataSource';
import { BlogDataSource } from '../dataSources/blogDataSource';

const Root = 'PatcherApp-Root';
const Content = 'PatcherApp-Content';

interface ReactProps {}

interface InjectedProps {
  product: Product;
  route: Route;
  accessToken: string | null;
}

type Props = ReactProps & InjectedProps;

class APatcherApp extends React.Component<Props & DispatchProp> {
  public name = 'uce-patcher';

  public render() {
    const { product, route, accessToken } = this.props;
    const isLogin = accessToken === null;

    return (
      <div className={Root}>
        <BlogDataSource />
        <PatcherDataSource />
        {
          // API should only be instantiated after auth.  Otherwise the Subscriptions
          // object spams connection failures because you aren't logged in yet.
          !isLogin && <APIDataSource />
        }

        {!isLogin && product == Product.Tools && <ToolsHero />}

        <HeaderLinks />
        <div className={Content}>
          <VolumeControls />

          <CSETransition show={isLogin} removeWhenHidden>
            <Login />
          </CSETransition>
          <CSETransition show={!isLogin}>
            <ProductControls />
            {product === Product.Tools && <ToolSelector />}
          </CSETransition>
          <CSETransition show={isBlogRoute(route)} removeWhenHidden>
            <Blog />
          </CSETransition>
        </div>
        <ModalPane />
        <SoundPlayer />
      </div>
    );
  }

  getSnapshotBeforeUpdate(): void {
    if (window.innerWidth > 0) {
      this.props.dispatch(updateHUDSize([window.innerWidth, window.innerHeight]));
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { accessToken } = state.login;
  const { product, route } = state.navigation;

  return {
    ...ownProps,
    accessToken,
    route,
    product
  };
}

export const PatcherApp = connect(mapStateToProps)(APatcherApp);
