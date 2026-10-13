/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Images are imported so that WebPack can find them (and give us errors if they are missing).
import DamagedItemURL from '../../../images/warning/HUD-repair-indicator-damaged.png';
import BrokenItemURL from '../../../images/warning/HUD-repair-indicator-broken.png';
import InventoryFullURL from '../../../images/warning/HUD-inventory-full.png';
import InventoryAlmostFullURL from '../../../images/warning/HUD-inventory-almostfull.png';

import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../../redux/hudSlice';
import { RootState } from '../../redux/store';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { getItemIsBroken, getItemIsLowDurability } from '../../helpers/itemHelpers';
import { TooltipSource } from '../TooltipSource';
import { getStringTableValue } from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';

// Once you're down to this many empty inventory slots, we show the initial inventory warning.
const INVENTORY_THRESHOLD = 5;

// CSS classes
const Root = 'HUD-PlayerWarningIcons-Root';
const Icon = 'HUD-PlayerWarningIcons-Icon';

const StringIDPlayerWarningIconsRepairMinor = 'PlayerWarningIconsRepairMinor';
const StringIDPlayerWarningIconsRepairMajor = 'PlayerWarningIconsRepairMajor';
const StringIDPlayerWarningIconsInventoryMinor = 'PlayerWarningIconsInventoryMinor';
const StringIDPlayerWarningIconsInventoryMajor = 'PlayerWarningIconsInventoryMajor';

interface ReactProps {
  isDragCopy: boolean;
}

interface InjectedProps {
  equippedItems: Item[];
  isSelectedWidget: boolean;
  emptyInventorySlots: number;
  stringTable: Record<string, StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

class APlayerWarningIcons extends React.Component<Props> {
  render(): JSX.Element {
    return (
      <div className={Root}>
        {this.renderRepairWarning()}
        {this.renderInventoryWarning()}
      </div>
    );
  }

  renderRepairWarning(): React.ReactNode {
    const [url, tooltip] = this.getRepairDetails();
    if (url) {
      return (
        <TooltipSource
          className={Icon}
          tooltipID={'RepairWarning'}
          content={() => getStringTableValue(tooltip!, this.props.stringTable)}
          positionType={'mouse'}
        >
          <img className={Icon} src={url} />
        </TooltipSource>
      );
    } else {
      return null;
    }
  }

  renderInventoryWarning(): React.ReactNode {
    const [url, tooltip] = this.getInventoryDetails();
    if (url) {
      return (
        <TooltipSource
          className={Icon}
          tooltipID={'InventoryWarning'}
          content={() => getStringTableValue(tooltip!, this.props.stringTable)}
          positionType={'mouse'}
        >
          <img className={Icon} src={url} />
        </TooltipSource>
      );
    } else {
      return null;
    }
  }

  private getRepairDetails(): [string | undefined, string | undefined] {
    let [hasDamagedItem, hasBrokenItem] = this.getDamagedOrBroken();
    hasDamagedItem = hasDamagedItem || this.props.isSelectedWidget;

    if (hasBrokenItem) {
      return [BrokenItemURL, StringIDPlayerWarningIconsRepairMajor];
    } else if (hasDamagedItem || this.props.isSelectedWidget) {
      // If this is the selected widget in HUD Edit mode, we show at least this one icon.
      return [DamagedItemURL, StringIDPlayerWarningIconsRepairMinor];
    } else {
      return [undefined, undefined];
    }
  }

  private getInventoryDetails(): [string | undefined, string | undefined] {
    if (this.props.emptyInventorySlots <= 0) {
      return [InventoryFullURL, StringIDPlayerWarningIconsInventoryMajor];
    } else if (this.props.emptyInventorySlots <= INVENTORY_THRESHOLD) {
      return [InventoryAlmostFullURL, StringIDPlayerWarningIconsInventoryMinor];
    } else {
      return [undefined, undefined];
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
    isSelectedWidget: state.hud.editor.selectedWidgetID === WIDGET_ID_PLAYERWARNINGICONS,
    emptyInventorySlots: state.gameDefs.settings.inventoryCapacityBase - state.inventory.primary.length,
    stringTable: state.stringTable.stringTable
  };
};

const PlayerWarningIcons = connect(mapStateToProps)(APlayerWarningIcons);

export const WIDGET_ID_PLAYERWARNINGICONS = 'Player Warning Icons';
export const repairWarningRegistry: HUDWidgetRegistration = {
  id: WIDGET_ID_PLAYERWARNINGICONS,
  nameStringID: 'HUDEditorWidgetNamePlayerWarningIcons',
  defaults: {
    xAnchor: HUDHorizontalAnchor.Right,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 9,
    yOffset: 28
  },
  requiresGameDefsLoaded: true,
  layer: HUDLayer.HUD,
  render: (isDragCopy: boolean) => {
    return <PlayerWarningIcons isDragCopy={isDragCopy} />;
  }
};
