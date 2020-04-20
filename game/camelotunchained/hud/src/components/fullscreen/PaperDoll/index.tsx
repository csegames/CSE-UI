/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';

import BodyPartHealth, { MaxHealthPartsInfo } from '../ItemShared/components/BodyPartHealth';
import CharacterAndOrderName from './CharacterAndOrderName';
import EquipmentSlots from './EquipmentSlots';
import { EquippedItem, PaperDollContainerGQL } from 'gql/interfaces';
import { EquippedItemFragment } from 'gql/fragments/EquippedItemFragment';
import { getMyPaperDollBG } from 'fullscreen/lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const paperDollContainerQuery = gql`
  query PaperDollContainerGQL {
    myEquippedItems(allowOfflineItems: false) {
      readiedGearSlots {
        id
        gearSlotType
      }
      items {
        ...EquippedItem
      }
    }
  }
  ${EquippedItemFragment}
`;

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: stretch;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-size: cover;
  &:before {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 65%;
    background: url(../images/paperdoll/bg/bg-veil.png) no-repeat;
    background-size: cover;
  }
`;

// #region NameBackground constants
const NAME_BACKGROUND_TOP = -46;
const NAME_BACKGROUND_HEIGHT = 334;
const NAME_BACKGROUND_WIDTH = 800;
// #endregion
const NameBackground = styled.div`
  position: absolute;
  top: ${NAME_BACKGROUND_TOP}px;
  height: ${NAME_BACKGROUND_HEIGHT}px;
  width: ${NAME_BACKGROUND_WIDTH}px;
  left: 0;
  background: url(../images/paperdoll/name-bg-splash.png) no-repeat;
  background-size: contain;

  @media (max-width: 2560px) {
    top: ${NAME_BACKGROUND_TOP * MID_SCALE}px;
    height: ${NAME_BACKGROUND_HEIGHT * MID_SCALE}px;
    width: ${NAME_BACKGROUND_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${NAME_BACKGROUND_TOP * HD_SCALE}px;
    height: ${NAME_BACKGROUND_HEIGHT * HD_SCALE}px;
    width: ${NAME_BACKGROUND_WIDTH * HD_SCALE}px;
  }
`;

const PaperdollContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;
  height: 100%;
`;

// #region CharacterInfoContainer constants
const CHARACTER_INFO_CONTAINER_HEIGHT = 100;
const CHARACTER_INFO_CONTAINER_MARGIN_TOP = 40;
// #endregion
const CharacterInfoContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${CHARACTER_INFO_CONTAINER_HEIGHT}px;
  margin-top: ${CHARACTER_INFO_CONTAINER_MARGIN_TOP}px;

  @media (max-width: 2560px) {
    height: ${CHARACTER_INFO_CONTAINER_HEIGHT * MID_SCALE}px;
    margin-top: ${CHARACTER_INFO_CONTAINER_MARGIN_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CHARACTER_INFO_CONTAINER_HEIGHT * HD_SCALE}px;
    margin-top: ${CHARACTER_INFO_CONTAINER_MARGIN_TOP * HD_SCALE}px;
  }
`;

const LoadingOverlay = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  pointer-events: all;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

// #region RefreshTitle constants
const REFRESH_TITLE_FONT_SIZE = 70;
// #endregion
const RefreshTitle = styled.div`
  font-size: ${REFRESH_TITLE_FONT_SIZE}px;
  color: white;

  @media (max-width: 2560px) {
    font-size: ${REFRESH_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${REFRESH_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface EquippedItemsMap {
  [slotName: string]: any;
}

export interface PaperDollProps {
  onEquippedItemsChange: (equippedItems: EquippedItem.Fragment[]) => void;
  onReadiedWeaponsChange: (slotIDs: string[]) => void;
}

export interface PaperDollState {
  maxHealthParts: MaxHealthPartsInfo;
}

class PaperDoll extends React.Component<PaperDollProps, PaperDollState> {
  private refetchListener: EventHandle;
  private paperdollBG: string = '';
  private graphql: GraphQLResult<PaperDollContainerGQL.Query>;
  constructor(props: PaperDollProps) {
    super(props);
    this.state = {
      maxHealthParts: {},
    };

    this.paperdollBG = getMyPaperDollBG();
  }
  public render() {
    return (
      <GraphQL 
        query={{ 
          query: paperDollContainerQuery, 
          disableBatching: true, 
          maxAttempts: 2,
          operationName: "paperdoll-info"
        }} 
        onQueryResult={this.handleQueryResult}
      >
        {(graphql: GraphQLResult<PaperDollContainerGQL.Query>) => {
          this.graphql = graphql;
          return (
            <Container style={{ backgroundImage: `url(${this.paperdollBG})` }}>
              {graphql.loading &&
                <LoadingOverlay>
                  <RefreshTitle>Loading...</RefreshTitle>
                </LoadingOverlay>
              }
              <NameBackground />
              <PaperdollContainer>
                <CharacterInfoContainer>
                  <CharacterAndOrderName characterName={camelotunchained.game.selfPlayerState.name} />
                  <BodyPartHealth maxHealthParts={this.state.maxHealthParts} />
                </CharacterInfoContainer>
                <EquipmentSlots onEquippedItemsChange={this.props.onEquippedItemsChange} />
              </PaperdollContainer>
            </Container>
          );
        }}
      </GraphQL>
    );
  }

  public componentDidMount() {
    this.initializeMaxHealthParts();
    this.refetchListener = game.on('refetch-character-info', this.refetch);
  }

  public componentWillUnmount() {
    this.refetch();
    game.off(this.refetchListener);
  }

  private handleQueryResult = (graphql: GraphQLResult<PaperDollContainerGQL.Query>) => {
    if (graphql.loading || !graphql.data || !graphql.data.myEquippedItems) return graphql;

    this.props.onEquippedItemsChange(graphql.data.myEquippedItems.items);
    this.props.onReadiedWeaponsChange(graphql.data.myEquippedItems.readiedGearSlots.map(s => s.id));
    return graphql;
  }

  private refetch = () => {
    if (this.graphql) {
      this.graphql.refetch();
    }
  }

  private initializeMaxHealthParts = () => {
    const maxHealthParts = {};
    Object.values(camelotunchained.game.selfPlayerState.health).forEach((part, i) => {
      maxHealthParts[window.BodyPart[i]] = part.max;
    });

    this.setState({ maxHealthParts });
  }
}

export default PaperDoll;
