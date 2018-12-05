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
`;

const Block = styled('div')`
  display: inline-block;
  margin: 2px;
  border: 1px solid #444;
  &:hover {
    border: 1px solid #fff;
  }
`;

const SelectedBlock = styled(Block)`
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
    'icon block-tags' auto
    'icon mat-tags' auto
    / auto auto;
`;

const TooltipIcon = styled('img')`
  grid-area: icon;
  width: 64px;
  height: 64px;
  align-self: center;
  justify-self: center;
`;

const TooltipBlockTags = styled('div')`
  grid-area: block-tags;
  padding: 5px;
  align-self: center;
`;

const TooltipMatTags = styled('div')`
  grid-area: mat-tags;
  padding: 5px;
  align-self: center;
`;

export interface BlocksProps {
}

export interface BlocksState {
}

export class Blocks extends React.Component<BlocksProps, BlocksState> {
  private blockChangeHandle: EventHandle = null;

  constructor(props: BlocksProps) {
    super(props);
    this.state = {
    };

    this.blockChangeHandle = game.onSelectedBlockChanged(() => this.forceUpdate());
  }

  public render() {
    return (
      <Container className='cse-ui-scroller-thumbonly'>
        <Content>
        {Object.values(game.building.materials).map((m) => {
          return Object.values(m.blocks).map((b) => {
            const B = b.id === game.building.activeBlockID ? SelectedBlock : Block;
            return (
              <Tooltip
                content={(
                  <TooltipContainer>
                    <TooltipIcon src={'data:image/png;base64,' + m.icon} />
                    <TooltipBlockTags>{Object.values(b.tags).join(' ')}</TooltipBlockTags>
                    <TooltipMatTags>{Object.values(m.tags).join(' ')}</TooltipMatTags>
                  </TooltipContainer>
                )}
                closeOnEvents={[game.engineEvents.EE_OnToggleBuildSelector]}
              >
              <B
                key={b.id}
                onClick={() => game.building.selectBlockAsync(b.id)}
              >
                <Image src={'data:image/png;base64,' + b.icon}/>
              </B>
              </Tooltip>
            );
          });
        })}
        </Content>
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: BlocksProps, nextState: BlocksState) {
    return false;
  }

  public componentWillUnmount() {
    if (this.blockChangeHandle) {
      this.blockChangeHandle.clear();
    }
  }
}
