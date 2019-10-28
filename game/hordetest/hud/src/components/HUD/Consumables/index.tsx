/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { ConsumableButton } from './ConsumableButton';

const Container = styled.div`
  display: flex;
  align-items: center;
`;

const KeybindBox = styled.div`
  font-family: Exo;
  font-weight: bold;
  font-size: 14px;
  color: white;
  width: 25px;
  height: 17px;
  background-color: rgba(0, 0, 0, 0.7);
  white-space: nowrap;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const NextKeybind = css`
  margin-left: 5px;
`;

const NextArrow = styled.div`
  margin-left: 3px;
  margin-top: 4px;
  font-size: 8px;
`;

const PrevKeybind = css`
  margin-right: 5px;
`;

const PrevArrow = styled.div`
  margin-right: 3px;
  margin-top: 4px;
  font-size: 8px;
`;

export interface Props {
}

export interface State {
  consumableItemsState: ConsumableItemsState;
}

export class Consumables extends React.Component<Props, State> {
  private evh: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      consumableItemsState: hordetest.game.consumableItemsState,
    }
  }

  public render() {
    const { keybindForNext, keybindForPrior, keybindToUse, items, activeIndex } = this.state.consumableItemsState;
    const itemsArray = Object.values(items);
    return (
      <Container>
        {keybindForPrior.iconClass ?
          <KeybindBox className={`${keybindForPrior.iconClass} ${PrevKeybind}`}></KeybindBox> :
          <KeybindBox className={PrevKeybind}>
            <PrevArrow className='fas fa-chevron-left'></PrevArrow>
            <div>{keybindForPrior.name}</div>
          </KeybindBox>
        }

        <ConsumableButton
          item={itemsArray[0]}
          isActive={0 === activeIndex}
          useKeybind={keybindToUse}
        />
        <ConsumableButton
          item={itemsArray[1]}
          isActive={1 === activeIndex}
          useKeybind={keybindToUse}
        />
        <ConsumableButton
          item={itemsArray[2]}
          isActive={2 === activeIndex}
          useKeybind={keybindToUse}
        />
        <ConsumableButton
          item={itemsArray[3]}
          isActive={3 === activeIndex}
          useKeybind={keybindToUse}
        />
        <ConsumableButton
          item={itemsArray[4]}
          isActive={4 === activeIndex}
          useKeybind={keybindToUse}
        />

        {keybindForNext.iconClass ?
          <KeybindBox className={`${keybindForNext.iconClass} ${NextKeybind}`}></KeybindBox> :
          <KeybindBox className={NextKeybind}>
            <div>{keybindForNext.name}</div>
            <NextArrow className='fas fa-chevron-right'></NextArrow>
          </KeybindBox>
        }
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = hordetest.game.consumableItemsState.onUpdated(this.handleConsumableItemsUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handleConsumableItemsUpdate = () => {
    this.setState({ consumableItemsState: cloneDeep(hordetest.game.consumableItemsState) });
  }
}
