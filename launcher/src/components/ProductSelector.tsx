/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { changeProduct, Product } from '../redux/navigationSlice';
import { playSound, Sound } from '../lib/Sound';
import { ResizeDetector } from '../lib/ResizeDetector';
import { Launchable } from '../redux/launchablesSlice';
import { PatchPermissions } from '../api/patcher/patchPermissions';

const Root = 'ProductSelector-Root';
const AccessLevelLabel = 'ProductSelector-AccessLevelLabel';
const AccordionSelectionRow = 'ProductSelector-AccordionSelectionRow';
const AccordionSelectionLabel = 'ProductSelector-AccordionSelectionLabel';
const AccordionCollapser = 'ProductSelector-AccordionCollapser';
const AccordionContents = 'ProductSelector-AccordionContents';
const AccordionRow = 'ProductSelector-AccordionRow';

const Separator = 'ProductControls-Separator';
const AccordionArrow = 'ProductControls-AccordionArrow';

function productToName(product: Product): string {
  switch (product) {
    case Product.CamelotUnchained:
      return 'Camelot Unchained';
    case Product.Tools:
      return 'Tools';
    default:
      return '';
  }
}

interface ReactProps {}

interface InjectedProps {
  product: Product;
  launchables: Record<string, Launchable>;
  selections: Record<Product, string | null>;
  permissions: Record<number, PatchPermissions>;
}

type Props = ReactProps & InjectedProps;

interface State {
  isOpen: boolean;
  childrenHeight: number;
}

class AProductSelector extends React.Component<Props & DispatchProp, State> {
  constructor(props: Props & DispatchProp) {
    super(props);
    this.state = {
      isOpen: false,
      childrenHeight: 0
    };
  }

  public render() {
    const { product, selections, launchables } = this.props;
    const products = this.getProducts();
    const canSelect = products.length > 0;
    const selected = launchables[selections[product] ?? ''];

    return (
      <div className={Root}>
        {selected && (
          <div className={AccessLevelLabel} style={{ opacity: this.state.isOpen ? 0 : 0.5 }}>
            {`Your Access Level: ${this.getAccessString()}`}
          </div>
        )}
        <div className={Separator} />
        <div
          className={`${AccordionSelectionRow}${canSelect ? ' canSelect' : ''}`}
          onClick={canSelect ? this.toggleAccordion.bind(this) : undefined}
        >
          <div className={AccordionSelectionLabel}>{productToName(product)}</div>
          {products.length > 1 && <div className={`${AccordionArrow}${this.state.isOpen ? ' open' : ''}`} />}
        </div>
        <div
          className={AccordionCollapser}
          style={{ height: canSelect && this.state.isOpen ? this.state.childrenHeight : 0 }}
        >
          <div className={AccordionContents}>
            <ResizeDetector
              onResize={(newWidth, newHeight) => {
                if (newHeight !== this.state.childrenHeight) {
                  this.setState({ childrenHeight: newHeight });
                }
              }}
            />
            {products.map(this.renderAccordionRow.bind(this))}
          </div>
        </div>
      </div>
    );
  }

  private renderAccordionRow(product: Product): React.ReactNode {
    const isSelected = this.props.product === product;
    return (
      <div
        key={Product[product]}
        className={`${AccordionRow}${isSelected ? ' selected' : ''}`}
        onClick={() => {
          playSound(Sound.Select);
          this.props.dispatch(changeProduct(product));
          this.setState({ isOpen: false });
        }}
      >
        {productToName(product)}
      </div>
    );
  }

  private toggleAccordion(): void {
    if (!this.state.isOpen) {
      playSound(Sound.SelectChange);
    }

    this.setState({ isOpen: !this.state.isOpen });
  }

  // TODO : unravel this mess by serving all channel data (except install status) from the api
  private getProducts(): Product[] {
    const products = [Product.CamelotUnchained];
    if ((this.props.permissions[Product.CamelotUnchained] ?? PatchPermissions.Public) & PatchPermissions.Development) {
      products.push(Product.Tools);
    }
    return products;
  }

  private getAccessString(): string {
    const perms = this.props.permissions[this.props.product];
    if (perms === undefined) return 'None';

    // Check UCE first
    if ((perms & PatchPermissions.Development) !== 0) return 'Developer';

    // Then check pre-release access
    if ((perms & PatchPermissions.InternalTest) !== 0) return 'IT';
    if ((perms & PatchPermissions.Alpha) !== 0) return 'Alpha';
    if ((perms & PatchPermissions.Beta1) !== 0) return 'Beta 1';
    if ((perms & PatchPermissions.Beta2) !== 0) return 'Beta 2';
    if ((perms & PatchPermissions.Beta3) !== 0) return 'Beta 3';
    if ((perms & PatchPermissions.Live) !== 0) return 'Live';

    // Then lastly check backers and public
    if ((perms & PatchPermissions.AllBackers) !== 0) return 'Backers';
    if (perms === PatchPermissions.Public) return 'Public';
    return 'None';
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { product, selections } = state.navigation;
  const { launchables, login } = state;

  return {
    ...ownProps,
    product,
    launchables,
    selections,
    permissions: login.permissions
  };
};

export const ProductSelector = connect(mapStateToProps)(AProductSelector);
