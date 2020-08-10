/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { throttle } from 'lodash';
import { styled } from '@csegames/linaria/react';

declare const toastr: any;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.01);
`;

const Container = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  padding: 3px;
  min-width: 100px;
  background-image: url(../images/item-tooltips/bg.png);
  background-size: auto 100%;
  background-repeat: repeat-x;
  box-shadow: inset 0px 0px 10px 0px black;
  border: 1px solid #4e4e4e;

  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    background: url(../images/item-tooltips/ornament_left.png);
    width: 35px;
    height: 35px;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    background: url(../images/item-tooltips/ornament_right.png);
    width: 35px;
    height: 35px;
  }
`;

const Title = styled.div`
  font-family: Caudex;
  font-size: 14px;
  border-bottom: 1px solid #2e2e2e;
  cursor: default;
  padding: 3px;
  color: #ccc;
`;

const ItemAction = styled.div`
  font-weight: bold;
  border: 1px solid transparent;
  padding: 1px 4px;
  font-size: 14px;
  color: #ccc;
  cursor: pointer;

  &:hover {
    color: #ffdbac;
    border: 1px solid;
    border-image-source: linear-gradient(to right, #ae8b6f 20%, transparent);
    border-image-slice: 1;
    box-shadow: inset 0px 0px 10px 0px #000000;
    background-color: #221d17;
  }
`;

export interface Props {
}

export interface State {
  currentItemActionMessage: ItemActionsMessage;
  name: string;
  entityId: string;
}

export class ItemActions extends React.Component<Props, State> {
  private evh: EventHandle;
  private mouseX: number;
  private mouseY: number;

  constructor(props: Props) {
    super(props);

    this.handleMouseMove = throttle(this.handleMouseMove, 50);

    this.state = {
      currentItemActionMessage: null,
      name: '',
      entityId: '',
    };
  }

  public render() {
    const { currentItemActionMessage } = this.state;
    return currentItemActionMessage ? (
      <>
        <Overlay onClick={this.close} />
        <Container style={{ top: this.mouseY, left: this.mouseX }}>
          <Title>{this.state.name}</Title>
          {currentItemActionMessage.actions.map((itemAction) => {
            return (
              <ItemAction onClick={() => this.handleItemActionClick(itemAction)}>
                {itemAction.displayName}
              </ItemAction>
            );
          })}
        </Container>
      </>
    ) : null;
  }

  public componentDidMount() {
    window.addEventListener('mousemove', this.handleMouseMove);
    this.evh = camelotunchained.game.onShowItemActions(this.handleShowItemActions);
  }

  public componentWillUnmount() {
    window.removeEventListener('mousemove', this.handleMouseMove);
    this.evh.clear();
  }

  private handleShowItemActions = (message: ItemActionsMessage, entity: EntityStateModel) => {
    if (!message) {
      console.error('Tried to open ItemActions menu but got a bad ItemActionsMessage: ' + message);
      return;
    }

    if (!entity) {
      console.error('Tried to open ItemActions menu but got a bad entity: ' + entity);
      return;
    }

    this.setState({ currentItemActionMessage: message, name: `${entity.name}`, entityId: `${entity.entityID}` });
  }

  private handleItemActionClick = (itemAction: ItemAction) => {
    if (itemAction.id) {
      this.performItemAction(itemAction);
      this.handleUIReaction(itemAction);
    } else {
      this.handleUIReaction(itemAction);
    }

    this.close();
  }

  private performItemAction = async (itemAction: ItemAction) => {
    try {
      const res = await camelotunchained.game.webAPI.ItemAPI.PerformItemAction(
        camelotunchained.game.webAPI.defaultConfig,
        this.state.currentItemActionMessage.itemInstanceID,
        this.state.entityId,
        itemAction.id,
        {
          BoneAlias: this.state.currentItemActionMessage.boneAlias,
        }
      );
  
      if (!res.ok) {
        const data = JSON.parse(res.data);
        // If request fails for any reason
        if (data.FieldCodes && data.FieldCodes.length > 0) {
          toastr.error(data.FieldCodes[0].Message, 'Oh No!', { timeout: 3000 });
        } else {
          // This means api server failed move item request but did not have a message about what happened
          toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
        }
      }
    } catch (e) {
      toastr.error('An error occured', 'Oh No!', { timeout: 3000 });
    }
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private close = () => {
    this.setState({ currentItemActionMessage: null });
  }

  private handleUIReaction = (action: ItemAction) => {
    switch (action.uiReaction) {
      case UIReaction.CloseInventory: {
        this.closeInventory();
        break;
      }

      case UIReaction.OpenMiniMap: {
        this.openMiniMap();
        break;
      }

      case UIReaction.OpenCrafting: {
        console.log('Open crafting');
        this.openCrafting();
        break;
      }

      default: break;
    }
  }

  private closeInventory = () => {
    game.trigger('navigate', 'inventory');
  }

  private openMiniMap = () => {
    game.trigger('navigate', 'map');
  }

  private openCrafting = () => {
    game.trigger('navigate', 'crafting');
  }
}
