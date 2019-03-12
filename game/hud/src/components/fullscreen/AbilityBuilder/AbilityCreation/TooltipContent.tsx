/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { checkNetworkRequirements, NetworkRequirementResult } from '../utils';
import { AbilityBuilderQuery } from 'gql/interfaces';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_MAX_WIDTH = 800;
const CONTAINER_PADDING = 15;
// #endregion
const Container = styled.div`
  max-width: ${CONTAINER_MAX_WIDTH}px;
  padding: ${CONTAINER_PADDING}px;
  overflow: visible;

  @media (max-width: 2560px) {
    max-width: ${CONTAINER_MAX_WIDTH * MID_SCALE}px;
    padding: ${CONTAINER_PADDING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    max-width: ${CONTAINER_MAX_WIDTH * HD_SCALE}px;
    padding: ${CONTAINER_PADDING * HD_SCALE}px;
  }
`;

// #region Name constants
const NAME_FONT_SIZE = 36;
// #endregion
const Name = styled.div`
  font-size: ${NAME_FONT_SIZE}px;
  font-family: Caudex;
  color: white;

  @media (max-width: 2560px) {
    font-size: ${NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Description constants
const DESCRIPTION_FONT_SIZE = 24;
const DESCRIPTION_LINE_HEIGHT = 32;
const DESCRIPTION_MARGIN_BOTTOM = 20;
// #endregion
const Description = styled.div`
  font-size: ${DESCRIPTION_FONT_SIZE}px;
  line-height: ${DESCRIPTION_LINE_HEIGHT}px;
  margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM}px;
  color: #BBBCBC;

  @media (max-width: 2560px) {
    font-size: ${DESCRIPTION_FONT_SIZE * MID_SCALE}px;
    line-height: ${DESCRIPTION_LINE_HEIGHT * MID_SCALE}px;
    margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DESCRIPTION_FONT_SIZE * HD_SCALE}px;
    line-height: ${DESCRIPTION_LINE_HEIGHT * HD_SCALE}px;
    margin-bottom: ${DESCRIPTION_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

// #region TagsContainer constants
const TAGS_CONTAINER_FONT_SIZE = 28;
const TAGS_CONTAINER_MARGIN_BOTTOM = 10;
// #endregion
const TagsContainer = styled.div`
  display: flex;
  color: #C3C3C3;
  font-size: ${TAGS_CONTAINER_FONT_SIZE}px;
  margin-bottom: ${TAGS_CONTAINER_MARGIN_BOTTOM}px;
  font-style: italic;

  @media (max-width: 2560px) {
    font-size: ${TAGS_CONTAINER_FONT_SIZE * MID_SCALE}px;
    margin-bottom: ${TAGS_CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TAGS_CONTAINER_FONT_SIZE * HD_SCALE}px;
    margin-bottom: ${TAGS_CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

const NetworkRequirementSection = styled.div`
  display: flex;
  flex-direction: column;
`;

// #region Requirement constants
const REQUIREMENT_FONT_SIZE = 24;
const REQUIREMENT_LINE_HEIGHT = 32;
// #endregion
const Requirement = styled.div`
  display: flex;
  align-items: center;
  color: green;
  font-size: ${REQUIREMENT_FONT_SIZE}px;
  line-height: ${REQUIREMENT_LINE_HEIGHT}px;

  &.disabled {
    color: red;
  }

  @media (max-width: 2560px) {
    font-size: ${REQUIREMENT_FONT_SIZE * HD_SCALE}px;
    line-height: ${REQUIREMENT_LINE_HEIGHT * HD_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${REQUIREMENT_FONT_SIZE * HD_SCALE}px;
    line-height: ${REQUIREMENT_LINE_HEIGHT * HD_SCALE}px;
  }
`;

// #region RequirementIcon constants
const REQUIREMENT_ICON_MARGIN_LEFT = 10;
// #endregion
const RequirementIcon = styled.span`
  margin-left: ${REQUIREMENT_ICON_MARGIN_LEFT}px;

  @media (max-width: 2560px) {
    margin-left: ${REQUIREMENT_ICON_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-left: ${REQUIREMENT_ICON_MARGIN_LEFT * HD_SCALE}px;
  }
`;

// const StatItem = styled.div`
//   display: flex;
//   align-items: center;
//   justify-content: space-between;
//   color: #848484;
//   padding-right: 80px;
//   font-size: 32px;

//   &.even {
//     background: url(../images/abilitybuilder/hd/tooltip-odd-bg-texture.png) no-repeat;
//     background-size: 105% auto;
//     background-position: -15px center;
//   }

//   @media (max-width: 1920px) {
//     padding-right: 40px;
//     font-size: 16px;
//   }
// `;

export interface Props {
  componentItem: AbilityBuilderQuery.AbilityComponents;
  selectedComponentsList: AbilityBuilderQuery.AbilityComponents[];
}

export class TooltipContent extends React.PureComponent<Props> {
  public render() {
    const { componentItem } = this.props;
    const networkReqResults = checkNetworkRequirements(this.props.componentItem, this.props.selectedComponentsList);
    return (
      <Container>
        <Name>{componentItem.display.name}</Name>
        <TagsContainer>
          {componentItem.abilityTags.map((tag, i) =>
            tag.toTitleCase() + (i < componentItem.abilityTags.length - 1 ? ', ' : ''))}
        </TagsContainer>
        <Description>{componentItem.display.description}</Description>
        {/* {this.props.componentItem.stats && this.props.componentItem.stats.map((stat, i) => {
          const isEven = i % 2 === 0;
          return (
            <StatItem className={isEven ? 'even' : ''}>
              <div>{stat.name}</div>
              <div>{stat.value}</div>
            </StatItem>
          );
        })} */}
        {componentItem.networkRequirements.map((requirement) => {
          return (
            <NetworkRequirementSection>
              {Object.keys(requirement).map((key) => {
                if (!requirement[key]) {
                  return null;
                }

                return this.renderRequirement(key, requirement[key], networkReqResults);
              })}
            </NetworkRequirementSection>
          );
        })}
        {networkReqResults.isAnExcludeTag.result &&
          <Requirement className='disabled'>
            The component {networkReqResults.isAnExcludeTag.component.display.name} excludes
            &nbsp;{networkReqResults.isAnExcludeTag.reason.toTitleCase()} components when selected.
          </Requirement>
        }
        {networkReqResults.isAnExcludeComponent.result &&
          <Requirement className='disabled'>
            The component {networkReqResults.isAnExcludeComponent.component.display.name} excludes
            &nbsp;this component when selected.
          </Requirement>
        }
      </Container>
    );
  }

  private renderRequirement = (key: string,
                                requirement: AbilityBuilderQuery.RequireTag | AbilityBuilderQuery.ExcludeTag |
                                  AbilityBuilderQuery.RequireComponent | AbilityBuilderQuery.ExcludeComponent,
                                networkReqResults: NetworkRequirementResult) => {

    let renderComponent = null;
    switch (key) {
      case 'requireTag': {
        const reqTag = requirement as AbilityBuilderQuery.RequireTag;
        if (reqTag) {
          renderComponent = (
            <Requirement className={!networkReqResults.meetsRequireTagReq ? 'disabled' : ''}>
              {'Requires Tag: ' + reqTag.tag.toTitleCase()}
              {networkReqResults.meetsRequireTagReq ? this.renderCheck() : this.renderTimes()}
            </Requirement>
          );
        }
        break;
      }

      case 'excludeTag': {
        const exclTag = requirement as AbilityBuilderQuery.ExcludeTag;
        if (exclTag) {
          renderComponent = (
            <Requirement className={!networkReqResults.meetsExcludeTagReq ? 'disabled' : ''}>
              {'Exclude Tag: ' + exclTag.tag.toTitleCase()}
              {networkReqResults.meetsExcludeTagReq ? this.renderCheck() : this.renderTimes()}
            </Requirement>
          );
        }
        break;
      }

      case 'requireComponent': {
        const reqComponent = requirement as AbilityBuilderQuery.RequireComponent;
        if (reqComponent) {
          renderComponent = (
            <Requirement className={!networkReqResults.meetsRequireComponentReq ? 'disabled' : ''}>
              {'Requires Component: ' + reqComponent.component.display.name +
              ` (${reqComponent.component.abilityComponentCategory.displayInfo.name})`}
              {networkReqResults.meetsRequireComponentReq ? this.renderCheck() : this.renderTimes()}
            </Requirement>
          );
        }
        break;
      }

      case 'excludeComponent': {
        const exclComponent = requirement as AbilityBuilderQuery.ExcludeComponent;
        if (exclComponent) {
          renderComponent = (
            <Requirement className={!networkReqResults.meetsExcludeComponentReq ? 'disabled' : ''}>
              {'Exclude Component: ' + exclComponent.component.display.name +
              ` (${exclComponent.component.abilityComponentCategory.displayInfo.name})`}
              {networkReqResults.meetsExcludeComponentReq ? this.renderCheck() : this.renderTimes()}
            </Requirement>
          );
        }
        break;
      }

      default: return null;
    }

    return renderComponent;
  }

  private renderCheck = () => {
    return <RequirementIcon className='fa fa-check' />;
  }

  private renderTimes = () => {
    return <RequirementIcon className='fa fa-times' />;
  }
}
