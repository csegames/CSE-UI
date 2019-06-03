/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { getPaperDollIcon, getPaperDollBaseIcon } from 'fullscreen/lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const query = `
  query PaperdollIcon {
    myCharacter {
      id
      faction
      race
      gender
      archetype
    }
  }
`;

// #region PaperdollIcon constants
const PAPERDOLL_ICON_BOTTOM = 230;
// #endregion
const Icon = styled.img`
  position: absolute;
  right: 0;
  left: 0;
  bottom: ${PAPERDOLL_ICON_BOTTOM}px;
  margin: auto;
  max-width: 100%;
  width: auto;
  height: 80%;

  @media (max-width: 2560px) {
    bottom: ${PAPERDOLL_ICON_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${PAPERDOLL_ICON_BOTTOM * HD_SCALE}px;
  }
`;

// #region Base constants
const BASE_BOTTOM = 230;
// #endregion
const Base = styled.img`
  position: absolute;
  right: 0px;
  left: 0px;
  bottom: ${BASE_BOTTOM}px;
  margin: auto;
  width: auto;
  height: 20%;
  object-fit: contain;

  @media (max-width: 2560px) {
    bottom: ${BASE_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${BASE_BOTTOM * HD_SCALE}px;
  }
`;

export interface Props {

}

class PaperdollIcon extends React.Component<Props> {
  public render() {
    return (
      <GraphQL query={query}>
        {(graphql: GraphQLResult<Pick<GraphQL.Schema.CUQuery, 'myCharacter'>>) => {
          if (graphql.loading || (graphql.lastError && graphql.lastError !== 'OK') || !graphql.data) {
            return (
              <div>Loading...</div>
            );
          }

          const { myCharacter } = graphql.data;
          const standingIcon = getPaperDollIcon(myCharacter.gender, myCharacter.race, myCharacter.archetype);
          const baseIcon = getPaperDollBaseIcon(myCharacter.faction);
          return (
            <div>
              <Base src={baseIcon} />
              <Icon src={standingIcon} />
            </div>
          );
        }}
      </GraphQL>
    );
  }
}

export default PaperdollIcon;
