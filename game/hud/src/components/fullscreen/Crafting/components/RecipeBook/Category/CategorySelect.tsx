/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { isEqual } from 'lodash';
import { VoxJobType, ItemType, VoxJob } from 'gql/interfaces';
import { CraftingContext } from '../../../CraftingContext';
import { AlloyType, RecipeData, InputItem } from '../../../CraftingBase';
import {
  getJobTypeIcon,
  getItemTypeIcon,
  getNearestVoxEntityID,
  voxJobToRecipeType,
  getAlloyTypeIcon,
  getJobContext,
  isValidVoxEntityID,
} from '../../../lib/utils';
import { FilteredAvailablePatterns } from '.';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  width: 100%;
  height: 100%;
`;

// #region SectionContainer constants
const SECTION_CONTAINER_MARGIN_BOTTOM = 20;
// #endregion
const SectionContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: ${SECTION_CONTAINER_MARGIN_BOTTOM}px;

  @media (max-width: 2560px) {
    margin-bottom: ${SECTION_CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-bottom: ${SECTION_CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

// #region SectionTitle constants
const SECTION_TITLE_FONT_SIZE = 36;
// #endregion
const SectionTitle = styled.div`
  text-align: center;
  font-size: ${SECTION_TITLE_FONT_SIZE}px;
  font-family: TradeWinds;

  @media (max-width: 2560px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ButtonContainer constants
const BUTTON_CONTAINER_WIDTH = 672;
// #endregion
const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: ${BUTTON_CONTAINER_WIDTH}px;
  height: fit-content;

  @media (max-width: 2560px) {
    width: ${BUTTON_CONTAINER_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${BUTTON_CONTAINER_WIDTH * HD_SCALE}px
  }
`;

// #region SelectButton constants
const SELECT_BUTTON_DIMENSIONS = 204;
const SELECT_BUTTON_HORIZONTAL_MARGIN = 10;
// #endregion
const SelectButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: ${SELECT_BUTTON_DIMENSIONS}px;
  height: ${SELECT_BUTTON_DIMENSIONS}px;
  margin: 0 ${SELECT_BUTTON_HORIZONTAL_MARGIN}px;
  border-radius: 50%;
  cursor: pointer;
  background-image: url(../images/crafting/uhd/category-select-ring.png);
  background-repeat: no-repeat;
  background-size: contain;
  opacity: 1;
  transition: opacity 0.3s;

  &.hidden {
    opacity: 0.2;
    pointer-events: none;
  }

  &:hover {
    opacity: 0.5;
  }

  @media (max-width: 2560px) {
    width: ${SELECT_BUTTON_DIMENSIONS * MID_SCALE}px;
    height: ${SELECT_BUTTON_DIMENSIONS * MID_SCALE}px;
    margin: 0 ${SELECT_BUTTON_HORIZONTAL_MARGIN * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${SELECT_BUTTON_DIMENSIONS * HD_SCALE}px;
    height: ${SELECT_BUTTON_DIMENSIONS * HD_SCALE}px;
    margin: 0 ${SELECT_BUTTON_HORIZONTAL_MARGIN * HD_SCALE}px;
    background-image: url(../images/crafting/hd/category-select-ring.png);
  }
`;

// #region JobIcon constants
const JOB_ICON_FONT_SIZE = 80;
const JOB_ICON_MARGIN_BOTTOM = 10;
// #endregion
const JobIcon = styled.div`
  font-size: ${JOB_ICON_FONT_SIZE}px;
  margin-bottom: ${JOB_ICON_MARGIN_BOTTOM}px;
  color: black;

  @media (max-width: 2560px) {
    font-size: ${JOB_ICON_FONT_SIZE * MID_SCALE}px;
    margin-bottom: ${JOB_ICON_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${JOB_ICON_FONT_SIZE * HD_SCALE}px;
    margin-bottom: ${JOB_ICON_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

// #region JobText constants
const JOB_TEXT_FONT_SIZE = 24;
// #endregion
const JobText = styled.div`
  font-size: ${JOB_TEXT_FONT_SIZE}px;
  color: black;
  text-transform: uppercase;
  font-family: TradeWinds;

  @media (max-width: 2560px) {
    font-size: ${JOB_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${JOB_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ConceptArt constants
const CONCEPT_ART_BOTTOM = 40;
const CONCEPT_ART_WIDTH = 836;
const CONCEPT_ART_HEIGHT = 512;
// #endregion
const ConceptArt = styled.div`
  position: absolute;
  left: 0;
  right: 0;
  bottom: ${CONCEPT_ART_BOTTOM}px;
  width: ${CONCEPT_ART_WIDTH}px;
  height: ${CONCEPT_ART_HEIGHT}px;
  margin: auto;
  background-image: url(../images/crafting/uhd/drawings/sketch-mid-1.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;

  @media (max-width: 2560px) {
    bottom: ${CONCEPT_ART_BOTTOM * MID_SCALE}px;
    width: ${CONCEPT_ART_WIDTH * MID_SCALE}px;
    height: ${CONCEPT_ART_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${CONCEPT_ART_BOTTOM * HD_SCALE}px;
    width: ${CONCEPT_ART_WIDTH * HD_SCALE}px;
    height: ${CONCEPT_ART_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/drawings/sketch-mid-1.png);
  }
`;

export interface ComponentProps {
  isSelect: boolean;
  jobNumber: number;
  selectedCategory: VoxJobType;
  filteredAvailablePatterns: FilteredAvailablePatterns;
  onSelectCategory: (category: VoxJobType, shouldFilter?: boolean) => void;
  onSelectItemType: (itemType: ItemType) => void;
  onSelectAlloyType: (alloyType: AlloyType) => void;
}

export interface InjectedProps {
  voxJob: VoxJob.Fragment;
  voxEntityID: string;
  inputItems: InputItem[];
  addVoxJobID: (jobId: string, jobType: VoxJobType) => void;
  onSelectRecipe: (recipe: RecipeData) => void;
}

export type Props = ComponentProps & InjectedProps;

enum ButtonSelectType {
  VoxJob,
  ItemType,
  AlloyType,
}

interface ButtonSelect {
  type: ButtonSelectType;
  value: VoxJobType | ItemType | AlloyType;
  hide?: boolean;
}

const SELECT_BUTTONS: ButtonSelect[] = [
  { type: ButtonSelectType.VoxJob, value: VoxJobType.Shape },
  { type: ButtonSelectType.VoxJob, value: VoxJobType.Salvage },
  { type: ButtonSelectType.VoxJob, value: VoxJobType.Repair },
  { type: ButtonSelectType.VoxJob, value: VoxJobType.Purify },
  { type: ButtonSelectType.VoxJob, value: VoxJobType.Make },
];

const MAKE_ITEM_TYPES: ButtonSelect[] = [
  { type: ButtonSelectType.ItemType, value: ItemType.Ammo },
  { type: ButtonSelectType.ItemType, value: ItemType.Armor },
  { type: ButtonSelectType.ItemType, value: ItemType.Block },
  { type: ButtonSelectType.ItemType, value: ItemType.SiegeEngine },
  { type: ButtonSelectType.ItemType, value: ItemType.Weapon },
];

const SHAPE_ALLOY_TYPES: ButtonSelect[] = [
  { type: ButtonSelectType.AlloyType, value: AlloyType.Cloth },
  { type: ButtonSelectType.AlloyType, value: AlloyType.Leather },
  { type: ButtonSelectType.AlloyType, value: AlloyType.Metal },
  { type: ButtonSelectType.AlloyType, value: AlloyType.Stone },
  { type: ButtonSelectType.AlloyType, value: AlloyType.Wood },
];

class CategorySelect extends React.Component<Props> {
  public render() {
    const buttons = this.getButtons();

    const shouldFilter = !this.props.voxJob;
    const filteredButtons = this.getButtons(shouldFilter);

    return (
      <Container>
        {!this.props.isSelect &&
          <SectionContainer>
            <SectionTitle>All Categories</SectionTitle>
            <ButtonContainer>
              {buttons.map(button => this.renderButton(button))}
            </ButtonContainer>
          </SectionContainer>
        }
        {isValidVoxEntityID(this.props.voxEntityID) && this.props.isSelect &&
          <SectionContainer>
            <SectionTitle>Select</SectionTitle>
            <ButtonContainer>
              {filteredButtons.map(button => this.renderButton(button, button.type === ButtonSelectType.VoxJob))}
            </ButtonContainer>
          </SectionContainer>
        }
        <ConceptArt />
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: Props) {
    return this.props.isSelect !== nextProps.isSelect ||
      this.props.voxEntityID !== nextProps.voxEntityID ||
      this.props.jobNumber !== nextProps.jobNumber ||
      this.props.selectedCategory !== nextProps.selectedCategory ||
      this.props.inputItems.length !== nextProps.inputItems.length ||
      !isEqual(this.props.voxJob, nextProps.voxJob) ||
      !isEqual(this.props.filteredAvailablePatterns, nextProps.filteredAvailablePatterns);
  }

  private renderButton = (button: ButtonSelect, isCraftButton?: boolean) => {
    const icon = this.getButtonIcon(button);
    return (
      <SelectButton className={button.hide ? 'hidden' : ''} onClick={() => this.onButtonClick(button, isCraftButton)}>
        <JobIcon className={icon} />
        <JobText>{this.getButtonText(button)}</JobText>
      </SelectButton>
    );
  }

  private getButtons = (shouldFilter?: boolean) => {
    const { selectedCategory, inputItems, filteredAvailablePatterns } = this.props;
    if (!selectedCategory) {
      if (!shouldFilter || inputItems.length === 0) {
        return SELECT_BUTTONS;
      }

      const selectButtons: ButtonSelect[] = SELECT_BUTTONS.map((button) => {
        if (!filteredAvailablePatterns[voxJobToRecipeType(button.value as VoxJobType)]) {
          return {
            ...button,
            hide: true,
          };
        }

        return button;
      });
      return selectButtons;
    }

    if (selectedCategory === VoxJobType.Make) {
      if (!shouldFilter || inputItems.length === 0) {
        return MAKE_ITEM_TYPES;
      }

      const includedItemTypes: { [type: string]: boolean } = {};
      Object.keys(filteredAvailablePatterns).forEach((recipeType) => {
        filteredAvailablePatterns[recipeType].forEach((pattern) => {
          if (pattern.def) {
            includedItemTypes[pattern.def.outputItem.itemType] = true;
          }
        });
      });

      const makeItemTypes = MAKE_ITEM_TYPES.map((button) => {
        if (!includedItemTypes[button.value]) {
          return {
            ...button,
            hide: true,
          };
        }

        return button;
      });

      return makeItemTypes;
    }

    if (selectedCategory === VoxJobType.Shape) {
      if (!shouldFilter || inputItems.length === 0) {
        return SHAPE_ALLOY_TYPES;
      }
      const shapeAlloyTypes: ButtonSelect[] = SHAPE_ALLOY_TYPES.map((button) => {
        if (!filteredAvailablePatterns[voxJobToRecipeType(button.value as VoxJobType)]) {
          return {
            ...button,
            hide: true,
          };
        }

        return button;
      });

      return shapeAlloyTypes;
    }

    return [];
  }

  private getButtonIcon = (button: ButtonSelect) => {
    switch (button.type) {
      case ButtonSelectType.VoxJob: {
        return getJobTypeIcon(button.value as VoxJobType);
      }
      case ButtonSelectType.ItemType: {
        return getItemTypeIcon(button.value as ItemType);
      }
      case ButtonSelectType.AlloyType: {
        return getAlloyTypeIcon(button.value as AlloyType);
      }
      default: '';
    }
  }

  private getButtonText = (button: ButtonSelect) => {
    switch (button.type) {
      case ButtonSelectType.VoxJob: {
        return VoxJobType[button.value];
      }
      case ButtonSelectType.ItemType: {
        if (button.value === ItemType.SiegeEngine) {
          return 'Siege';
        }

        return ItemType[button.value];
      }
      case ButtonSelectType.AlloyType: {
        return AlloyType[button.value];
      }

      default: '';
    }
  }

  private onButtonClick = (button: ButtonSelect, isCraftButton?: boolean) => {
    if (isCraftButton) {
      switch (button.value as VoxJobType) {
        case VoxJobType.Repair:
        case VoxJobType.Salvage:
        case VoxJobType.Purify: {
          this.onCraftClick(button.value as VoxJobType);
          break;
        }

        default: {
          this.props.onSelectCategory(button.value as VoxJobType, true);
          break;
        }
      }

      return;
    }

    switch (button.type) {
      case ButtonSelectType.VoxJob: {
        this.props.onSelectCategory(button.value as VoxJobType);
        break;
      }
      case ButtonSelectType.ItemType: {
        this.props.onSelectItemType(button.value as ItemType);
        break;
      }
      case ButtonSelectType.AlloyType: {
        this.props.onSelectAlloyType(button.value as AlloyType);
        break;
      }

      default: () => {};
    }
  }

  private onCraftClick = async (jobType: VoxJobType) => {
    const recipeData = { type: voxJobToRecipeType(jobType) };

    this.props.onSelectRecipe(recipeData);
  }
}

class CategorySelectWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({ crafting, addVoxJobID }) => {
          const voxEntityID = getNearestVoxEntityID(crafting);
          const JobContext = getJobContext(this.props.jobNumber);
          return (
            <JobContext.Consumer>
              {({ voxJob, inputItems, onSelectRecipe }) => (
                <CategorySelect
                  {...this.props}
                  voxJob={voxJob}
                  inputItems={inputItems}
                  voxEntityID={voxEntityID}
                  addVoxJobID={addVoxJobID}
                  onSelectRecipe={onSelectRecipe}
                />
              )}
            </JobContext.Consumer>
          );
        }}
      </CraftingContext.Consumer>
    );
  }
}

export default CategorySelectWithInjectedContext;
