/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { debounce, isEqual, isEmpty } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { VoxJob } from 'gql/interfaces';
import { RecipeData, InputItem } from '../../CraftingBase';
import { getJobContext, getMinAndMaxItemCount } from '../../lib/utils';
import NumberWheel from '../NumberWheel';

const ItemCountEditContainer = styled.div`
  display: block;
`;

export interface InjectedProps {
  voxJob: VoxJob.Fragment;
  selectedRecipe: RecipeData;
  inputItems: InputItem[];
  onItemCountChange: (itemCount: number) => void;
}

export interface ComponentProps {
  jobNumber: number;
}

export type Props = InjectedProps & ComponentProps;

export interface State {
  minItemCount: number;
  maxItemCount: number;
}

class ItemCount extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { minItemCount, maxItemCount } = getMinAndMaxItemCount(props.selectedRecipe, props.inputItems);
    this.state = {
      minItemCount,
      maxItemCount,
    };
    this.onItemCountChange = debounce(this.onItemCountChange, 200);
  }

  public render() {
    const { selectedRecipe } = this.props;
    if (!selectedRecipe) return null;

    return (
      <ItemCountEditContainer>
        <NumberWheel
          defaultValue={this.getDefaultItemCount()}
          maxValue={this.state.maxItemCount}
          minValue={this.state.minItemCount}
          maxCutoffValue={this.getMaxCutoffValue()}
          onSelectValue={this.onItemCountChange}
          prevValueDecorator={'x'}
        />
      </ItemCountEditContainer>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (!isEqual(prevProps.inputItems, this.props.inputItems) ||
        !isEqual(prevProps.selectedRecipe, this.props.selectedRecipe)) {
      const { minItemCount, maxItemCount } = getMinAndMaxItemCount(this.props.selectedRecipe, this.props.inputItems);
      if (minItemCount !== this.state.minItemCount || maxItemCount !== this.state.maxItemCount) {
        this.setState({ minItemCount, maxItemCount });
      }
    }
  }

  private onItemCountChange = (newVal: number) => {
    if (typeof newVal !== 'number') {
      return;
    }

    const { minItemCount, maxItemCount } = this.state;
    if (newVal >= minItemCount && maxItemCount >= newVal) {
      // If meets min and max item count, then send it up to context to be saved.
      this.props.onItemCountChange(newVal);
    }
  }

  private getDefaultItemCount = () => {
    if (!this.props.voxJob || isEmpty(this.props.voxJob.outputItems)) {
      return 0;
    }

    return this.props.voxJob.itemCount;
  }

  private getMaxCutoffValue = () => {
    const { selectedRecipe } = this.props;
    if (selectedRecipe && selectedRecipe.def.outputItem.isStackableItem) {
      return 99;
    }

    return 10;
  }
}

class ItemCountWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ voxJob, selectedRecipe, inputItems, onItemCountChange }) => {
          return (
            <ItemCount
              {...this.props}
              voxJob={voxJob}
              selectedRecipe={selectedRecipe}
              inputItems={inputItems}
              onItemCountChange={onItemCountChange}
            />
          );
        }}
      </JobContext.Consumer>
    );
  }
}

export default ItemCountWithInjectedContext;
