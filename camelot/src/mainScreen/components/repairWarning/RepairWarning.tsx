/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import DamagedItemURL from '../../../images/Repair/HUD-repair-indicator-damaged.png';
import BrokenItemURL from '../../../images/Repair/HUD-repair-indicator-broken.png';

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { getItemIsBroken, getItemIsLowDurability } from '../../helpers/itemHelpers';

// CSS classes
const Root = 'HUD-RepairWarning-Root';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  equippedItems: Item[];
  isSelectedWidget: boolean;
}

type Props = ReactProps & InjectedProps;

class ARepairWarning extends React.Component<Props> {
  render(): JSX.Element {
    return <img className={Root} src={this.getImageURL()} />;
  }

  private getImageURL(): string | undefined {
    let [hasDamagedItem, hasBrokenItem] = this.getDamagedOrBroken();
    hasDamagedItem = hasDamagedItem || this.props.isSelectedWidget;

    if (hasBrokenItem) {
      return BrokenItemURL;
    } else if (hasDamagedItem) {
      return DamagedItemURL;
    } else {
      return undefined;
    }
  }

  private getDamagedOrBroken(): [boolean, boolean] {
    let hasDamagedItem = false;
    let hasBrokenItem = false;

    for (let i = 0; i < this.props.equippedItems.length; ++i) {
      hasDamagedItem = hasDamagedItem || getItemIsLowDurability(this.props.equippedItems[i]);
      hasBrokenItem = hasBrokenItem || getItemIsBroken(this.props.equippedItems[i]);
    }

    return [hasDamagedItem, hasBrokenItem];
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    equippedItems: state.inventory.equipment,
    isSelectedWidget: state.hud.editor.selectedWidgetID === WIDGET_ID_REPAIRWARNING
  };
};

const RepairWarning = connect(mapStateToProps)(ARepairWarning);

export const WIDGET_ID_REPAIRWARNING = 'Repair Warning';
export const repairWarningRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_REPAIRWARNING,
  nameStringID: 'HUDEditorWidgetNameRepairWarning',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 9,
    yOffset: 28
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <RepairWarning isDragCopy={isDragCopy} />;
  }
};
