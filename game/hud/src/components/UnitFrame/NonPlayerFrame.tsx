/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { Tooltip } from 'components/Tooltip';


const NonPlayerFrameContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  pointer-events: all;
`;

const Image = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
`;


const MainGrid = styled.div`
  position: relative;
  flex: 0 0 auto;
  display: grid;
  cursor: pointer !important;
  grid-template-columns: 1px 16px 11px 41px 338px 8px;
  grid-template-rows: 13px 43px 19px 4px 13px 5px;
  @media (max-width: 1920px) {
    grid-template-columns: 1px 8px 5px 21px 169px 4px;
    grid-template-rows: 7px 21px 10px 1px 7px 2px;
  }
`;

const HeraldryFrameContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  grid-row-start: 1;
  grid-row-end: 5;
  grid-column-start: 2;
  grid-column-end: 5;
`;

const NameBG = styled(Image)`
  grid-row-start: 2;
  grid-row-end: 4;
  grid-column-start: 3;
  grid-column-end: 6;
`;

const Name = styled.div`
  position: relative;
  color: white;
  grid-row-start: 2;
  grid-row-end: 4;
  grid-column-start: 5;
  grid-column-end: 7;
  z-index: 1;
  padding: 15px 0 0 10px;
  font-size: 22px;
  @media (max-width: 1920px) {
    font-size: 14px;
    padding: 7px 0 0 5px;
  }
`;

const MainFrame = styled(Image)`
  grid-column-start: 2;
  grid-column-end: 6;
  grid-row-start: 3;
  grid-row-end: 6;
`;

const Health = styled.div`
  grid-row-start: 5;
  grid-row-end: 6;
  grid-column-start: 4;
  grid-column-end: 6;
  height: 100%;
  transform: skewX(31.6deg);
`;

const HealthText = styled.div`
  position: absolute;
  text-align: center;
  grid-row-start: 5;
  grid-row-end: 6;
  grid-column-start: 4;
  grid-column-end: 6;
  grid-area: health;
  z-index: 1;
  height: 100%;
  width: 100%;
  color: white;
  line-height: 12px;
  @media (max-width: 1920px) {
    font-size: 16px;
    line-height: 6px;
  }
`;

const Statuses = styled.div`
   display: flex;
   flex-wrap: wrap;
   justify-content: flex-start;
   align-content: flex-start;
   min-width: 180px;
   @media (max-width: 1920px) {
     min-width: 85px;
   }
`;

const Status = styled.div`
  position: relative;
  overflow: hidden;
  border: 1px solid black;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  margin: 4px;
  @media (max-width: 1920px) {
    width: 16px;
    height: 16px;
    margin: 2px;
  }
`;

const StatusTooltip = styled.div`
  background: #333;
  border: 1px solid #777;
  padding: 5px;
  color: white;
`;

const StatusTooltipName = styled.h3`
  margin: 0;
  margin-bottom: 5px;
`;

const StatusTooltipDescription = styled.p`
  margin: 0;
  padding: 0;
`;

export interface Props {
  entity: SiegeState | ResourceNodeState;
  target?: 'enemy' | 'friendly';
}

export interface State {
  hover: boolean;
}

export class NonPlayerFrame extends React.Component<Props, State> {

  public state = {
    hover: false,
  };

  public render() {
    return (
      <UIContext.Consumer>
        {this.uiContextRender}
      </UIContext.Consumer>
    );
  }

  public componentDidMount() {
    game.store.onUpdated(() => this.forceUpdate());
  }

  public shouldComponentUpdate(nextProps: Props, nextState: State) {
    if (this.state.hover !== nextState.hover) {
      return true;
    }

    if (Object.is(this.props.entity, nextProps.entity)) {
      return false;
    }

    return true;
  }

  private uiContextRender = (uiContext: UIContext) => {
    const { entity } = this.props;
    if (!entity.health) return null;
    const imgDir = 'images/unit-frames/' + (uiContext.isUHD() ? '4k/' : '1080/');
    const realmPrefix = this.realmPrefix(entity.faction);
    const theme = uiContext.currentTheme();

    return (
      <NonPlayerFrameContainer data-input-group='block'>
        <MainGrid onMouseOver={this.setHoverOn} onMouseLeave={this.setHoverOff}>
          <NameBG src={imgDir + realmPrefix + 'nameplate-bg.png'} />
          <MainFrame src={imgDir + 'mini-bg.png'} />
          <Health style={{
            width: CurrentMax.cssPercent(entity.health),
            backgroundColor: theme.unitFrames.color.health,
          }} />
          <MainFrame src={imgDir + realmPrefix + 'mini-frame.png'} />

          {this.state.hover &&
              <HealthText>{entity.health.current + ' / ' + entity.health.max}</HealthText>
          }

          <Name>{entity.name}</Name>

          <HeraldryFrameContainer>
            <Image src={imgDir + 'profile-bg.png'} />
            <Image
              src={imgDir + realmPrefix + 'propic.png'}
              style={{ WebkitMaskImage: `url(${imgDir}profile-bg.png)` }}
            />
            <Image src={imgDir + realmPrefix + 'default-frame.png'} />
          </HeraldryFrameContainer>

        </MainGrid>

        <Statuses>
          {Object.values(entity.statuses).map(this.renderStatus)}
        </Statuses>
      </NonPlayerFrameContainer>
    );
  }

  private renderStatus = (status: {id: number } & Timing) => {
    const info = game.store.getStatusInfo(status.id) || {
      name: 'unknown',
      description: 'unknown',
      iconURL: 'images/unit-frames/4k/' + this.realmPrefix(this.props.entity.faction) + 'propic.png',
    };

    return (
      <Tooltip content={(
        <StatusTooltip>
          <StatusTooltipName>
            {info.name}
          </StatusTooltipName>
          <StatusTooltipDescription>
            {info.description}
          </StatusTooltipDescription>
        </StatusTooltip>
      )}>
        <Status key={status.id}>
          <Image src={info.iconURL} />;
        </Status>
      </Tooltip>
    );
  }

  private setHoverOn = () => {
    this.setState({ hover: true });
  }

  private setHoverOff = () => {
    this.setState({ hover: false });
  }

  private realmPrefix = (faction: Faction) => {
    switch (faction) {
      case Faction.Arthurian: return 'art-';
      case Faction.Viking: return 'vik-';
      case Faction.TDD: return 'tdd-';
      default: return '';
    }
  }
}
