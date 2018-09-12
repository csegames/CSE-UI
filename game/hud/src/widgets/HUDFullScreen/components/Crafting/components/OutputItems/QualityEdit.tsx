/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from  '@csegames/linaria/react';
import { isEqual } from 'lodash';
import { VoxJob } from 'gql/interfaces';
import { RecipeData, InputItem } from 'widgets/HUDFullScreen/components/Crafting/CraftingBase';
import { getJobContext, getMinAndMaxQuality } from 'widgets/HUDFullScreen/components/Crafting/lib/utils';
import NumberWheel from '../NumberWheel';

const QualityEditContainer = styled.div`
  display: block;
`;

export interface InjectedProps {
  voxJob: VoxJob.Fragment;
  selectedRecipe: RecipeData;
  inputItems: InputItem[];
  onQualityChange: (quality: number) => void;
}

export interface ComponentProps {
  jobNumber: number;
}

export type Props = InjectedProps & ComponentProps;

export interface State {
  quality: number;
  minQuality: number;
  maxQuality: number;
}

class QualityEdit extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      quality: 0,
      minQuality: 0,
      maxQuality: 0,
    };
  }

  public render() {
    return (
      <QualityEditContainer>
        <NumberWheel
          defaultValue={this.state.quality * 100}
          maxValue={this.state.maxQuality * 100}
          minValue={this.state.minQuality * 100}
          maxCutoffValue={100}
          onSelectValue={this.onQualityChange}
          trailValueDecorator='%'
        />
      </QualityEditContainer>
    );
  }

  public componentDidMount() {
    this.initState();
  }

  public componentDidUpdate(prevProps: Props) {
    const selectedRecipeChanged = prevProps.selectedRecipe && this.props.selectedRecipe &&
      prevProps.selectedRecipe.def && this.props.selectedRecipe.def &&
      prevProps.selectedRecipe.def.id !== this.props.selectedRecipe.def.id;
    const inputItemsChanged = !isEqual(prevProps.inputItems, this.props.inputItems);
    if (selectedRecipeChanged || inputItemsChanged) {
      this.initState();
    }
  }

  private initState = () => {
    const { minQuality, maxQuality } = getMinAndMaxQuality(this.props.selectedRecipe, this.props.inputItems);
    const quality = this.props.voxJob ? this.props.voxJob.endQuality : minQuality;
    if (quality > maxQuality) {
      this.onQualityChange(maxQuality * 100, { minQuality, maxQuality });
    } else if (quality < minQuality) {
      this.onQualityChange(minQuality * 100, { minQuality, maxQuality });
    } else {
      this.setState({ quality: quality * 100, minQuality, maxQuality });
    }
  }

  private onQualityChange = (newVal: number, newMinMax?: { minQuality: number, maxQuality: number }) => {
    if (typeof newVal !== 'number') {
      return;
    }

    const qualityVal = newVal / 100;
    const { minQuality, maxQuality } = newMinMax ? newMinMax : this.state;
    if (qualityVal >= minQuality && maxQuality >= qualityVal) {
      // If meets min and max item count, then send it up to context to be saved.
      if (qualityVal > 0) {
        this.props.onQualityChange(qualityVal);
      }
      this.setState({ quality: qualityVal, minQuality, maxQuality });
    } else if (qualityVal < minQuality) {
      // Item count is being set lower than min count, change input back to default.
      this.setState(state => ({ quality: this.getDefaultQuality(state.minQuality, state.maxQuality) }));
      return;
    } else if (qualityVal > maxQuality) {
      // Item count is being set higher than max count, change input back to default.
      this.setState(state => ({ quality: this.getDefaultQuality(state.minQuality, state.maxQuality) }));
      return;
    }
  }

  private getDefaultQuality = (minItemCount: number, maxItemCount: number) => {
    return Math.floor((minItemCount + maxItemCount) / 2);
  }
}

class QualityEditWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ voxJob, inputItems, selectedRecipe, onQualityChange }) => {
          return (
            <QualityEdit
              {...this.props}
              voxJob={voxJob}
              inputItems={inputItems}
              selectedRecipe={selectedRecipe}
              onQualityChange={onQualityChange}
            />
          );
        }}
      </JobContext.Consumer>
    );
  }
}

export default QualityEditWithInjectedContext;
