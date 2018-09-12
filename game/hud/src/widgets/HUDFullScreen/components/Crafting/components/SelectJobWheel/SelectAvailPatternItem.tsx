/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';
import CraftingDefTooltip from 'widgets/HUDFullScreen/components/Crafting/components/CraftingDefTooltip';
import { PRIMARY_COLOR } from 'widgets/HUDFullScreen/components/Crafting/components/SelectorWheel';
import { RecipeData } from 'widgets/HUDFullScreen/components/Crafting/CraftingBase';
import { placeholderIcon } from 'widgets/HUDFullScreen/lib/constants';

const Container = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: black;
  border: 1px solid ${PRIMARY_COLOR};
  pointer-events: all;
  cursor: pointer;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: contain;
`;

export interface Props {
  recipe: RecipeData;
  onClick: (recipe: RecipeData) => void;
}

class SelectAvailPatternItem extends React.Component<Props> {
  public render() {
    const { recipe } = this.props;
    return (
      <Container onClick={this.onClick} onMouseOver={this.onMouseOver} onMouseLeave={this.onMouseLeave}>
        {recipe && recipe.def && <Image src={recipe.def.outputItem.iconUrl || placeholderIcon} />}
      </Container>
    );
  }

  private onClick = () => {
    if (this.props.recipe) {
      hideTooltip();
      this.props.onClick(this.props.recipe);
    }
  }

  private onMouseOver = (event: React.MouseEvent) => {
    const { recipe } = this.props;
    if (recipe) {
      const payload: ShowTooltipPayload = {
        content: (
          <CraftingDefTooltip
            recipeDef={recipe.def.outputItem}
            recipeData={recipe}
          />
        ),
        event,
      };
      showTooltip(payload);
    }
  }

  private onMouseLeave = () => {
    if (this.props.recipe) {
      hideTooltip();
    }
  }
}

export default SelectAvailPatternItem;
