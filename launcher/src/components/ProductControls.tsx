/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect, DispatchProp } from 'react-redux';

import { RootState } from '../redux/store';
import { Product } from '../redux/navigationSlice';
import { ProductSelector } from './ProductSelector';
import { ServerSelector } from './ServerSelector';
import { PatchDisplay } from './PatchDisplay';

const Root = 'ProductControls-Root';
const Separator = 'ProductControls-Separator';

interface ReactProps {}

interface InjectedProps {
  currentProduct: Product;
}

type Props = ReactProps & InjectedProps;

class AProductControls extends React.Component<Props & DispatchProp> {
  public render() {
    return (
      <div className={Root}>
        <ProductSelector />
        {this.props.currentProduct === Product.CamelotUnchained && (
          <>
            <div className={Separator} />
            <ServerSelector />
          </>
        )}
        <div className={Separator} />
        <PatchDisplay />
      </div>
    );
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { product: currentProduct } = state.navigation;

  return {
    ...ownProps,
    currentProduct
  };
}

export const ProductControls = connect(mapStateToProps)(AProductControls);
