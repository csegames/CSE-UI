/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { ServerType, serverTypeToIcon, serverTypeToProductType } from '../../../ControllerContext';
import { globalEvents } from '../../../../../lib/EventEmitter';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  margin-left: 35px;
  margin-bottom: 20px;
`;

const GameImage = styled.div`
  display: inline-block;
  position: relative;
  pointer-events: all;
  width: 60px;
  height: 80px;
  zoom: 100%;
  cursor: pointer;
  z-index: 10;
  transition: opacity 0.3s ease;
  background-repeat: no-repeat;
  background-position: center;
  bottom: 0;

  &:before {
    content: '';
    z-index: 0;
    position: absolute;
    bottom: 0;
    left: 32px;
    opacity: 0;
    box-shadow: 0 0 75px 16px rgba(255, 255, 255, 0.89);
  }
  &:hover:before {
    opacity: 1;
  }
`;

const GameName = styled.div`
  position: absolute;
  width: 74px;
  top: 70px;
  left: -6px;
  text-align: center;
  font-size: 12px;
  font-family: Caudex;
  letter-spacing: 1px;
  color: #c6c6c6;
  text-shadow: 0px 1px 2px black;
  opacity: 0;
  -webkit-animation: gameNameAnim 0.5s forwards;
  animation: gameNameAnim 0.5s forwards;

  @keyframes gameNameAnim {
    from {
      opacity: 0;
      top: 65px;
    }
    to {
      opacity: 1;
      top: 70px;
    }
  }
`;

export interface GameSelectItemProps {
  type: ServerType;
  onSelectServerType: (type: ServerType) => void;
}

export interface GameSelectItemState {
  showName: boolean;
}

class GameSelectItem extends React.Component<GameSelectItemProps, GameSelectItemState> {
  constructor(props: GameSelectItemProps) {
    super(props);
    this.state = {
      showName: false
    };
  }

  public render() {
    const { type } = this.props;
    const gameName = this.getGameName(type);
    return (
      <Container>
        <GameImage
          style={{ backgroundImage: `url(${serverTypeToIcon(type)})` }}
          onClick={() => {
            globalEvents.trigger('product-selection-changed', serverTypeToProductType(type));
            this.props.onSelectServerType(type);
          }}
          onMouseOver={this.showGameName}
          onMouseLeave={this.hideGameName}
        />
        {this.state.showName && <GameName>{gameName}</GameName>}
      </Container>
    );
  }

  private showGameName = () => {
    this.setState({ showName: true });
  };

  private hideGameName = () => {
    this.setState({ showName: false });
  };

  private getGameName = (gameType: ServerType) => {
    switch (gameType) {
      case ServerType.CUGAME:
        return 'Camelot Unchained';
      case ServerType.CUBE:
        return 'Cube';
      case ServerType.COLOSSUS:
        return 'Final Stand Ragnarök';
      default:
        return '';
    }
  };
}

export default GameSelectItem;
