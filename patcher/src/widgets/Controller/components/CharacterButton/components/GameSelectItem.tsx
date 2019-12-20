/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { serverTypeToIcon, ServerType } from '../../../ControllerContext';

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
  transition: opacity .3s ease;
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
    box-shadow: 0 0 75px 16px rgba(255,255,255,0.89);
  }
  &:hover:before {
    opacity: 1;
  }
`;

const GameName = styled.div`
  position: absolute;
  width: 64px;
  margin-top: -10px;
  text-align: center;
  font-size: 12px;
  font-family: Caudex;
  letter-spacing: 1px;
  color: #C6C6C6;
  text-shadow: 0px 1px 2px black;
  opacity: 0;
  -webkit-animation: gameNameAnim 0.5s forwards;
  animation: gameNameAnim 0.5s forwards;

  @keyframes gameNameAnim {
    from {
      opacity: 0;
      margin-top: -5px;
    }
    to {
      opacity: 1;
      margin-top: -10px;
    }
  }
`;

function serverTypeToProductType(serverType: ServerType) {
  switch (serverType) {
    case ServerType.CUGAME: return Product.CamelotUnchained;
    case ServerType.COLOSSUS: return Product.Colossus;
    case ServerType.CUBE: return Product.Cube;
    default: return Product.Tools;
  }
}


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
      showName: false,
    };
  }

  public render() {
    const { type } = this.props;
    const gameName = type === ServerType.CUGAME ? 'Camelot Unchained' : type === ServerType.CUBE ? 'Cube' : '';
    return (
      <Container>
        <GameImage
          style={{ backgroundImage: `url(${serverTypeToIcon(type)})` }}
          onClick={() => {
            // BAD HACK
            game.trigger('product-selection-changed', serverTypeToProductType(type));
            // END BAD HACK
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
  }

  private hideGameName = () => {
    this.setState({ showName: false });
  }
}

export default GameSelectItem;
