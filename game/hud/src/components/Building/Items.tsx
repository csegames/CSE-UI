/*
* This Source Code Form is subject to the terms of the Mozilla Public
* License, v. 2.0. If a copy of the MPL was not distributed with this
* file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

import * as React from 'react';
import styled from 'react-emotion';
import { Tooltip } from 'components/UI/Tooltip';

const Container = styled('div')`
  flex: 1 1 auto;
  margin-top: -10px;
  padding-top: 10px;
  background-image: url(images/settings/bag-bg-grey.png);
  background-repeat: no-repeat;
  background-position: top center;
  overflow: auto;
  box-sizing: border-box!important;
  pointer-events: auto;
`;

const Content = styled('div')`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
  overflow-y: auto;
  box-sizing: border-box!important;
  color: #ececec;
`;

const Item = styled('div')`
  display: inline-block;
  margin: 2px;
  border: 1px solid #444;
  &:hover {
    border: 1px solid #fff;
  }
`;

const SelectedItem = styled(Item)`
  border: 1px solid gold;
`;

const Image = styled('img')`
  width: 64px;
  height: 64px;
`;

const TooltipContainer = styled('div')`
  padding: 5px;
  background: #222;
  color: #ececec;
  border: 1px solid #444;
  display: grid;
  max-width: 200px;
  grid-template:
    'icon name' auto
    'icon tags' auto
    / auto auto;
`;

const TooltipIcon = styled('img')`
  grid-area: icon;
  width: 64px;
  height: 64px;
  align-self: center;
  justify-self: center;
`;

const TooltipItemTags = styled('div')`
  grid-area: tags;
  padding: 5px;
  align-self: center;
`;

const TooltipName = styled('div')`
  grid-area: name;
  padding: 5px;
  align-self: center;
`;


export interface ItemsProps {
}

export interface ItemsState {
}

export class Items extends React.Component<ItemsProps, ItemsState> {
  private itemChangeHandle: EventHandle = null;

  constructor(props: ItemsProps) {
    super(props);
    this.state = {
    };

    this.itemChangeHandle = game.onSelectedBlockChanged(() => this.forceUpdate());
  }

  public render() {
    const items = game.building.potentialItems && Object.values(game.building.potentialItems) || [];
    return (
      <Container className='cse-ui-scroller-thumbonly'>
        <Content>
        {items.length === 0 ? 'No Potential Items Available.' : null}
        {items.map((i) => {
          const I = i.id === game.building.activePotentialItemID ? SelectedItem : Item;
          return (
              <Tooltip
                content={(
                  <TooltipContainer>
                    <TooltipIcon src={i.icon} />
                    <TooltipName>{i.name}</TooltipName>
                    <TooltipItemTags>{Object.values(i.tags).join(' ')}</TooltipItemTags>
                  </TooltipContainer>
                )}
                closeOnEvents={[game.engineEvents.EE_OnToggleBuildSelector]}
              >
              <I
                key={i.id}
                onClick={() => game.building.selectPotentialItemAsync(i.id)}
              >
                <Image src={i.icon}/>
              </I>
              </Tooltip>
          );
        })}
        </Content>
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: ItemsProps, nextState: ItemsState) {
    return false;
  }

  public componentWillUnmount() {
    if (this.itemChangeHandle) {
      this.itemChangeHandle.clear();
      this.itemChangeHandle = null;
    }
  }
}
