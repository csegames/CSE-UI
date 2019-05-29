/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { VoxJob, InventoryItem } from 'gql/interfaces';
import { RecipeData } from '../../CraftingBase';
import { CraftingContext } from '../../CraftingContext';
import OutputItem from './OutputItem';
import ItemCountEdit from './ItemCountEdit';
import CustomNameEdit from './CustomNameEdit';
import QualityEdit from './QualityEdit';
import ShapeRunEdit from './ShapeRunEdit';
import { getItemWithNewUnitCount } from 'fullscreen/lib/utils';
import {
  getJobContext,
  shouldShowQualityEdit,
  shouldShowItemCount,
  shouldShowCustomNameInput,
  shouldShowShapeRunCount,
} from '../../lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const OutputItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  pointer-events: all;
`;

const EditContainer = styled.div`
  position: relative;
  width: 100%;
  pointer-events: all;
`;

// #region QualityAndNameEditContainer constants
const QUALITY_NAME_AND_EDIT_CONTAINER_TOP = 30;
const QUALITY_NAME_AND_EDIT_CONTAINER_LEFT = 60;
// #endregion
const QualityAndNameEditContainer = styled.div`
  position: absolute;
  top: ${QUALITY_NAME_AND_EDIT_CONTAINER_TOP}px;
  left: ${QUALITY_NAME_AND_EDIT_CONTAINER_LEFT}px;
  pointer-events: all;

  @media (max-width: 2560px) {
    top: ${QUALITY_NAME_AND_EDIT_CONTAINER_TOP * MID_SCALE}px;
    left: ${QUALITY_NAME_AND_EDIT_CONTAINER_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${QUALITY_NAME_AND_EDIT_CONTAINER_TOP * HD_SCALE}px;
    left: ${QUALITY_NAME_AND_EDIT_CONTAINER_LEFT * HD_SCALE}px;
  }
`;

// #region ItemCountEditContainer constants
const ITEM_COUNT_EDIT_CONTAINER_TOP = 30;
const ITEM_COUNT_EDIT_CONTAINER_RIGHT = 60;
// #endregion
const ItemCountEditContainer = styled.div`
  position: absolute;
  top: ${ITEM_COUNT_EDIT_CONTAINER_TOP}px;
  right: ${ITEM_COUNT_EDIT_CONTAINER_RIGHT}px;
  pointer-events: all;

  @media (max-width: 2560px) {
    top: ${ITEM_COUNT_EDIT_CONTAINER_TOP * MID_SCALE}px;
    right: ${ITEM_COUNT_EDIT_CONTAINER_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${ITEM_COUNT_EDIT_CONTAINER_TOP * HD_SCALE}px;
    right: ${ITEM_COUNT_EDIT_CONTAINER_RIGHT * HD_SCALE}px;
  }
`;

export interface ComponentProps {
  jobNumber: number;
}

export interface InjectedProps {
  voxJobIDs: string[];
  selectedRecipe: RecipeData;
  voxJob: VoxJob.Fragment;
}

export type Props = ComponentProps & InjectedProps;

class OutputItems extends React.Component<Props> {
  public render() {
    const { voxJob, selectedRecipe, jobNumber } = this.props;
    const outputItem = this.getOutputItem();
    return (
      <Container>
        <OutputItemContainer>
          {voxJob ?
            outputItem ?
              <OutputItem
                item={outputItem}
                staticDef={outputItem.staticDefinition}
                givenName={voxJob ? voxJob.givenName : null}
                jobNumber={jobNumber}
              /> :
                <OutputItem
                  item={null}
                  staticDef={selectedRecipe && selectedRecipe.def ? selectedRecipe.def.outputItem : null}
                  givenName={voxJob ? voxJob.givenName : null}
                  jobNumber={jobNumber}
                /> :
            null
          }
        </OutputItemContainer>
        <EditContainer>
          <QualityAndNameEditContainer>
            {shouldShowCustomNameInput(voxJob) && <CustomNameEdit jobNumber={jobNumber} />}
            {shouldShowQualityEdit(voxJob) && <QualityEdit jobNumber={jobNumber} />}
          </QualityAndNameEditContainer>
          <ItemCountEditContainer>
            {shouldShowItemCount(selectedRecipe) && <ItemCountEdit jobNumber={jobNumber} />}
            {shouldShowShapeRunCount(selectedRecipe) && <ShapeRunEdit jobNumber={jobNumber} />}
          </ItemCountEditContainer>
        </EditContainer>
      </Container>
    );
  }

  private getOutputItem = () => {
    const { voxJob } = this.props;
    let outputItem: InventoryItem.Fragment = null;

    if (voxJob && voxJob.outputItems.length > 0) {
      // Stack same item output
      outputItem = voxJob.outputItems[0].item;
      voxJob.outputItems.slice(1, voxJob.outputItems.length).forEach((output) => {
        if (outputItem.staticDefinition.name === output.item.staticDefinition.name) {
          outputItem = getItemWithNewUnitCount(outputItem, outputItem.stats.item.unitCount + 1);
        }
      });
    }

    return outputItem;
  }
}

class OutputItemWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <CraftingContext.Consumer>
        {({ voxJobIDs }) => (
          <JobContext.Consumer>
            {({ voxJob, selectedRecipe }) => {
              return (
                <OutputItems {...this.props} voxJobIDs={voxJobIDs} selectedRecipe={selectedRecipe} voxJob={voxJob} />
              );
            }}
          </JobContext.Consumer>
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default OutputItemWithInjectedContext;
