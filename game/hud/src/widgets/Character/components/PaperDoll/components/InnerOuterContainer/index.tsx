/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-05-05 10:46:17
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-05-11 19:16:08
 */

import * as React from 'react';
import * as _ from 'lodash';
import { Flyout, Tooltip } from 'camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import ItemSlot from '../ItemSlot';
import TooltipContent from '../../../TooltipContent';

import {
  onEquipItem,
  CharacterSheetState,
  onFocusPotentialCharacterSlots,
  onDefocusPotentialCharacterSlots,
} from '../../../../services/session/character';
import { ItemMap, ItemInfo } from '../../../../services/types/inventoryTypes';

export interface InnerOuterContainerStyle extends StyleDeclaration {
  armorContainer: React.CSSProperties;
}

const defaultInnerOuterContainerStyle: InnerOuterContainerStyle = {
  armorContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
    overflow: 'visible',
  },
};

export interface InnerOuterContainerProps {
  styles?: Partial<InnerOuterContainerStyle>;
  dispatch?: any;
  outerSlotName: string;
  innerSlotName: string;
  characterSheetState: CharacterSheetState;
}

export interface InnerOuterContainerState {
  hideTooltips: boolean;
}

class InnerOuterContainer extends React.Component<InnerOuterContainerProps, InnerOuterContainerState> {

  private rotate: any;
  private mouseOverElement: boolean;
  
  constructor(props: InnerOuterContainerProps) {
    super(props);
    this.state = {
      hideTooltips: false,
    };
  }

  public render() {
    const {
      dispatch,
      outerSlotName,
      innerSlotName,
      characterSheetState,
    } = this.props;

    const ss = StyleSheet.create(defaultInnerOuterContainerStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.armorContainer, custom.armorContainer)}>
        <ItemSlot
          dispatch={dispatch}
          slotType='major'
          slotName={outerSlotName}
          item={characterSheetState.equippedItems[outerSlotName]}
          characterSheetState={characterSheetState}
          hideTooltips={this.state.hideTooltips}
        />
        <ItemSlot
          dispatch={dispatch}
          slotType='minor'
          slotName={innerSlotName}
          item={characterSheetState.equippedItems[innerSlotName]}
          characterSheetState={characterSheetState}
          hideTooltips={this.state.hideTooltips}
        />
      </div>
    );
  }
}

export default InnerOuterContainer;
