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
  padding: 2px;
  background-color: #ccc;
  min-width: 100px;
`;

const Title = styled.div`
  font-family: Lato;
  font-weight: bold;
  font-size: 14px;
  border-bottom: 1px solid black;
  cursor: default;
`;

const ItemAction = styled.div`
  font-family: Lato;
  font-weight: bold;
  padding: 2px 5px;
  font-size: 12px;
  color: black;
  cursor: pointer;

  &:hover {
    color: white;
    background-color: #666666;
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
