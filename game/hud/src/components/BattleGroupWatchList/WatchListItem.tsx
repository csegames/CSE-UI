/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';
import BodyPartHealthBar from './BodyPartHealthBar';
import { GroupMemberState } from 'gql/interfaces';

const Container = styled('div')`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  border-bottom: 1px solid #454545;
  padding: 3px 0px 10px;
`;

const BodyPartHealthContainer = styled('div')`
  flex: 1;
  display: flex;
  justify-content: flex-end;
`;

const HealthBarContainer = styled('div')`
  height: 25px;
  margin-left: 5px;
`;

const ResourceContainer = styled('div')`
  height: 2px;
  flex: 1;
  background-color: ${(props: any) => props.backgroundColor};
`;

const ResourceBar = styled('div')`
  height: 100%;
  background-color: ${(props: any) => props.backgroundColor};
`;

export interface WatchListItemProps {
  item: GroupMemberState;
}

export interface WatchListItemState {

}

class WatchListItem extends React.PureComponent<WatchListItemProps, WatchListItemState> {
  public render() {
    const item = this.props.item;
    return (
      <Container>
        <div className={css`flex: 2;`}>
          <header>{item.name}</header>
          <div className={css`display: flex;`}>
            {item.blood &&
              <ResourceContainer backgroundColor={utils.darkenColor('#A80009', 100)}>
                <ResourceBar
                  style={{ width: `${(item.blood.current / item.blood.max) * 100}%` }}
                  backgroundColor={'#A80009'}
                />
              </ResourceContainer>
            }
            {item.stamina &&
              <ResourceContainer backgroundColor={utils.darkenColor('#AEEEB4', 100)}>
                <ResourceBar
                  style={{ width: `${(item.stamina.current / item.stamina.max) * 100}%` }}
                  backgroundColor={'#000000'}
                />
              </ResourceContainer>
            }
          </div>
        </div>
        {item.health && item.health[0] &&
          <BodyPartHealthContainer>
            <HealthBarContainer>
              <BodyPartHealthBar
                value={item.health[0].current}
                maxValue={item.health[0].max}
                width={12}
              />
            </HealthBarContainer>
          </BodyPartHealthContainer>
        }
      </Container>
    );
  }
}

export default WatchListItem;
