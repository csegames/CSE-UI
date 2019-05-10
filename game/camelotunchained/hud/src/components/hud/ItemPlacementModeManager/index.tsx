/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/camelotunchained';
import { Dialog } from 'shared/Dialog';

declare const toastr: any;

const iconClass = {
  translate: 'translate fa fa-arrows',
  rotate: 'rotate fa fa-sync',
  scale: 'scale fa fa-expand',
  reset: 'reset fa fa-undo',
};

const Container = styled.div`
  pointer-events: all;
  display: flex;
  flex-direction: column;
  background: url(../images/settings/bag-bg-grey.png);
  background-size: cover;
  width: 100%;
  height: 100%;
`;

const TopActionContainer = styled.div`
  padding-top: 15px;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BottomActionContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemActionContainer = styled.div`
  margin-top: 10px;
  pointer-events: all;
  cursor: pointer;
  width: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: gray;
  &:hover {
    filter: brightness(120%);
  }
  &.selected {
    color: white;
  }
`;

const ItemActionText = styled.div`
  font-size: 9px;
`;

const MenuButton = styled.div`
  pointer-events: all;
  position: relative;
  background: url(../images/gamemenu/button-big-off.png) no-repeat;
  background-size: 100% 100%;
  height: 30px;
  width: 80px;
  border: none;
  cursor: pointer;
  color: rgb(132,132,132);
  font-family: 'Caudex',serif;
  letter-spacing: 2px;
  font-size: 9px;
  text-transform: uppercase;
  display: block;
  line-height: 30px;
  text-align: center;
  margin: 0 5px;
  &:hover {
    color: rgb(204,204,204);
    background: url(../images/gamemenu/button-big-on.png) no-repeat;
    &::before {
      content: '';
      position: absolute;
      background-image: url(../images/gamemenu/button-glow.png);
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background-size: cover;
    }
  }
`;

const Divider = styled.div`
  margin: 0 5px;
`;

export interface Props {

}

export interface State {
  isActive: boolean;
  visible: boolean;
  selectedTransformGizmoMode: ItemPlacementTransformMode;
}

class ItemPlacementModeManager extends React.PureComponent<Props, State> {
  private evh: EventHandle[] = [];
  constructor(props: Props) {
    super(props);
    this.state = {
      isActive: false,
      visible: false,
      selectedTransformGizmoMode: game.itemPlacementMode.activeTransformMode,
    };
  }
  public render() {
    const { selectedTransformGizmoMode } = this.state;
    return this.state.visible ? (
      <Dialog useSmallTitle title='Placement' onClose={this.onCancelClick}>
        <Container data-input-group='block'>
          <TopActionContainer>
            {this.renderItemActionButton(
              'Translate',
              iconClass.translate,
              selectedTransformGizmoMode === ItemPlacementTransformMode.Translate,
              this.onTranslateClick,
            )}
            {this.renderItemActionButton(
              'Rotate',
              iconClass.rotate,
              selectedTransformGizmoMode === ItemPlacementTransformMode.Rotate,
              this.onRotateClick,
            )}
            {/* {this.renderItemActionButton(
              'Scale',
              iconClass.scale,
              selectedTransformGizmoMode === ItemPlacementTransformMode.Scale,
              this.onScaleClick,
            )} */}
            {this.renderItemActionButton(
              'Reset',
              iconClass.reset,
              false,
              this.onResetClick,
            )}
          </TopActionContainer>
          <Divider />
          <BottomActionContainer>
            <MenuButton onClick={this.onCommitClick}>Commit</MenuButton>
            <MenuButton onClick={this.onCancelClick}>Cancel</MenuButton>
          </BottomActionContainer>
        </Container>
      </Dialog>
    ) : null;
  }

  public componentDidMount() {
    this.evh.push(game.on('navigate', this.handleNav));
    this.evh.push(camelotunchained.game.onBuildingModeChanged(this.handleBuildingModeChanged));
    this.evh.push(camelotunchained.game.onItemPlacementModeChanged(this.handleItemPlacementModeChanged));
    this.evh.push(camelotunchained.game.onSendItemPlacementCommitRequest(this.handleSendItemPlacementCommitRequest));
  }

  public componentWillUnmount() {
    this.evh.forEach(e => e.clear());
  }

  private renderItemActionButton = (text: string, actionIcon: string, selected: boolean, onClick: () => void) => {
    return (
      <ItemActionContainer className={selected ? 'selected' : ''} onClick={onClick}>
        <span className={actionIcon} />
        <ItemActionText>{text}</ItemActionText>
      </ItemActionContainer>
    );
  }

  private handleBuildingModeChanged = (mode: BuildingMode) => {
    if (mode === BuildingMode.PlacingItem) {
      this.showPlacementMode();
    } else if (this.state.isActive) {
      this.setState({ isActive: false });
    }
  }

  private handleItemPlacementModeChanged = (isActive: boolean) => {
    const stateUpdate: Partial<State> = {};
    if (isActive && !this.state.visible) {
      stateUpdate.visible = true;
    }

    if (!isActive && this.state.visible) {
      stateUpdate.visible = false;
    }

    if (game.itemPlacementMode.activeTransformMode !== this.state.selectedTransformGizmoMode) {
      stateUpdate.selectedTransformGizmoMode = game.itemPlacementMode.activeTransformMode;
    }

    if (isActive !== this.state.isActive) {
      stateUpdate.isActive = isActive;
    }

    this.setState(state => ({
      ...state,
      ...stateUpdate,
    }));
  }

  private handleSendItemPlacementCommitRequest = (
    itemInstanceID: string,
    position: Vec3f,
    rotation: Euler3f,
    actionID: string | null) => {
    if (!actionID) {
      this.makeMoveItemRequest(itemInstanceID, position, rotation);
    } else {
      this.makeItemActionRequest(itemInstanceID, actionID, position, rotation);
    }
  }

  private handleNav = (uiName: string) => {
    if (uiName === 'placement-mode') {
      if (this.state.visible && !this.state.isActive) {
        this.hidePlacementMode();
      } else {
        this.showPlacementMode();
      }
    }
  }

  private showPlacementMode = () => {
    this.setState({ visible: true, isActive: true });
  }

  private hidePlacementMode = () => {
    this.setState({ visible: false, selectedTransformGizmoMode: ItemPlacementTransformMode.Translate, isActive: false });
  }

  private onTranslateClick = () => {
    game.itemPlacementMode.requestChangeTransformMode(ItemPlacementTransformMode.Translate);
  }

  private onRotateClick = () => {
    game.itemPlacementMode.requestChangeTransformMode(ItemPlacementTransformMode.Rotate);
  }

  // private onScaleClick = () => {
  //   game.changeItemPlacementMode(ItemPlacementTransformMode.Scale);
  // }

  private onCommitClick = () => {
    game.itemPlacementMode.requestCommit();
  }

  private onResetClick = () => {
    game.itemPlacementMode.requestReset();
  }

  private onCancelClick = () => {
    game.itemPlacementMode.requestCancel();
  }

  private makeItemActionRequest = async (itemId: string, actionId: string, position: Vec3F, rotation: Euler3f) => {
    try {
      const res = await webAPI.ItemAPI.PerformItemAction(
        webAPI.defaultConfig,
        game.shardID,
        camelotunchained.game.selfPlayerState.characterID,
        itemId,
        camelotunchained.game.selfPlayerState.entityID,
        actionId,
        { WorldPosition: position },
      );
      if (!res.ok) {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
        } else {
          // This means api server failed perform item action request but did not provide a message about what happened
          toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
        }
      }
    } catch (e) {
      toastr.error('There was an unhandled error!', 'Oh No!!', { timeout: 5000 });
    }
  }

  private makeMoveItemRequest = async (itemId: string, position: Vec3F, rotation: Euler3f) => {
    try {
      const res = await webAPI.ItemAPI.MoveItems(
        webAPI.defaultConfig,
        game.shardID,
        camelotunchained.game.selfPlayerState.characterID,
        {
          moveItemID: itemId,
          stackHash: '00000000000000000000000000000000',
          unitCount: -1,
          to: {
            entityID: '0000000000000000000000',
            characterID: '0000000000000000000000',
            position: -1,
            worldPosition: position,
            rotation,
            containerID: '0000000000000000000000',
            gearSlotIDs: [] as any,
            location: 'Ground',
            voxSlot: 'Invalid',
          },
          from: {
            entityID: '0000000000000000000000',
            characterID: camelotunchained.game.selfPlayerState.characterID,
            position: -1,
            containerID: '0000000000000000000000',
            gearSlotIDs: [] as any,
            location: 'Inventory',
            voxSlot: 'Invalid',
          },
        } as any,
      );
      if (!res.ok) {
        const data = JSON.parse(res.data);
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
        } else {
          // This means api server failed perform item action request but did not provide a message about what happened
          toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
        }
      }
    } catch (e) {
      toastr.error('There was an unhandled error!', 'Oh No!!', { timeout: 5000 });
    }
  }
}

export default ItemPlacementModeManager;
