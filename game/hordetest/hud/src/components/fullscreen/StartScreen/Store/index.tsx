/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { StoreNavMenu } from './StoreNavMenu';
import { BundleItem } from './BundleItem';
import { skins, StoreItem, StoreItemType, Bundle, Skin } from './testData';
import { ConfirmPurchase } from './ConfirmPurchase';
import { SkinItem } from './SkinItem';

const Container = styled.div`
  display: flex;
  flex-direction: column;
`;

const ItemsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 846px;
  height: 930px;
  overflow: auto;
  align-self: center;

  &::-webkit-scrollbar {
    width: 6px;
    height: 6px;
  }

  &::-webkit-scrollbar-track {
    box-shadow: none;
    background: none;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #4f4f4f;
  }
`;

export interface Props {
}

export enum StoreRoute {
  Featured,
  Weapons,
  Skins,
  Accessories,
  CsePoints,
}

export function Store(props: Props) {
  const [currentRoute, setCurrentRoute] = useState(StoreRoute.Featured);

  function onSelectRoute(route: StoreRoute) {
    setCurrentRoute(route);
  }

  function onSkinClick(skin: Skin) {
    game.trigger('show-right-modal', <ConfirmPurchase skin={skin} />)
  }

  function renderRoute() {
    switch (currentRoute) {
      case StoreRoute.Featured: {
        return renderList(skins.filter(s => !s.isUnlocked && s.isFeatured));
      }
      case StoreRoute.Weapons: {
        return renderList(skins.filter(s => !s.isUnlocked && s.type === StoreItemType.Weapon));
      }
      case StoreRoute.Skins: {
        return renderList(skins.filter(s => !s.isUnlocked && s.type === StoreItemType.Skin));
      }
      case StoreRoute.Accessories: {
        return <div>Accessories</div>
      }
      case StoreRoute.CsePoints: {
        return <div>CSE Points</div>
      }
    };
  }

  function renderList(storeItems: StoreItem[]) {
    return (
      <ItemsContainer>
        {storeItems.map((storeItem) => {
          if (storeItem.type === StoreItemType.Skin || storeItem.type === StoreItemType.Weapon) {
            return (
              <SkinItem skin={storeItem} onSkinClick={onSkinClick} />
            );
          }

          return (
            <BundleItem bundle={storeItem as Bundle} />
          );
        })}
      </ItemsContainer>
    );
  }

  return (
    <Container>
      <StoreNavMenu selectedRoute={currentRoute} onSelectRoute={onSelectRoute} />
      {renderRoute()}
    </Container>
  );
}
