/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { isEqual } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { utils } from '@csegames/camelot-unchained';
import { GroupMemberState } from 'gql/interfaces';

const Container = styled.div`
  display: flex;
  border-image: linear-gradient(to right, rgba(176, 176, 175, 0) 5%, rgba(176, 176, 175, 0.7), rgba(176, 176, 175, 0) 95%);
  border-image-slice: 1;
  border-width: 1px;
  padding: 3px 0px 5px;
`;

const Name = styled.div`
  cursor: default;
  color: white;
  font-size: 12px;
  font-family: TitilliumWeb;
  width: 50%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
  margin-right: 5px;
  text-shadow: 0px 0px 3px black, 0px 0px 3px black, 0px 0px 3px black,0px 0px 3px black,0px 0px 3px black;
`;

const Resources = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`;

const HealthContainer = styled.div`
  height: 7px;
  margin-bottom: 2px;
  flex: 1;
  background-color: ${(props: any) => props.backgroundColor};
`;

const ResourceContainer = styled.div`
  height: 2px;
  margin-bottom: ${(props: any) => props.marginBottom || '2px'};
  flex: 1;
  background-color: ${(props: any) => props.backgroundColor};
`;

const ResourceBar = styled.div`
  height: 100%;
  background-color: ${(props: any) => props.backgroundColor};
`;

export interface WatchListItemProps {
  item: GroupMemberState;
}

export interface WatchListItemState {

}

class WatchListItem extends React.Component<WatchListItemProps, WatchListItemState> {
  public render() {
    const item = this.props.item;
    if (!item.health || !item.health[0]) return null;

    const currentHealth = item.health[0].current;
    const healthBarColor = Math.floor(currentHealth) === 0 ? 'transparent' : Math.floor(currentHealth) < 33 ? '#D10000' :
      Math.floor(currentHealth) < 66 ? '#F9B800' : '#39ABCE';
    return (
      <Container>
        <Name>{item.name}</Name>
        <Resources>
          <HealthContainer backgroundColor='rgba(0, 0, 0, 0.7)'>
            <ResourceBar
              style={{ width: `${((currentHealth / item.health[0].max) * 100).toFixed(1)}%` }}
              backgroundColor={healthBarColor}
            />
          </HealthContainer>
          {item.blood &&
            <ResourceContainer backgroundColor={utils.darkenColor('#A80009', 100)}>
              <ResourceBar
                style={{ width: `${(item.blood.current / item.blood.max) * 100}%` }}
                backgroundColor={'#A80009'}
              />
            </ResourceContainer>
          }
          {item.stamina &&
            <ResourceContainer marginBottom='0px' backgroundColor='rgba(0, 0, 0, 0.7)'>
              <ResourceBar
                style={{ width: `${(item.stamina.current / item.stamina.max) * 100}%` }}
                backgroundColor={'#AEEEB4'}
              />
            </ResourceContainer>
          }
        </Resources>
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: WatchListItemProps) {
    return nextProps.item.name !== this.props.item.name ||
      !isEqual(nextProps.item.health, this.props.item.health) ||
      !isEqual(nextProps.item.blood, this.props.item.blood) ||
      !isEqual(nextProps.item.stamina, this.props.item.stamina);
  }
}

export default WatchListItem;
