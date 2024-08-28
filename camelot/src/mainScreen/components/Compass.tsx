/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Facing2fDegrees } from '@csegames/library/dist/_baseGame/GameClientModels/SelfPlayerState';
import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { HUDLayer, HUDWidgetRegistration } from '../redux/hudSlice';
import { RootState } from '../redux/store';
import { Vec3f } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import { distanceVec3 } from '@csegames/library/dist/_baseGame/utils/distance';
import { GroupMemberState } from '@csegames/library/dist/camelotunchained/graphql/schema';
import TooltipSource from './TooltipSource';
import { EntityID } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { InitTopic } from '../redux/initializationSlice';
import { HUDHorizontalAnchor, HUDVerticalAnchor } from '@csegames/library/dist/camelotunchained/game/types/HUDTypes';

const Root = 'HUD-Compass-Root';
const Direction = 'HUD-Compass-Direction';
const DirectionHidden = 'HUD-Compass-DirectionHidden';
const Bullet = 'HUD-Compass-Bullet';
const BulletHidden = 'HUD-Compass-BulletHidden';
const FriendlyTarget = 'HUD-Compass-FriendlyTarget';
const FriendlyTargetHidden = 'HUD-Compass-FriendlyTargetHidden';
const WarbandMember = 'HUD-Compass-WarbandMember';
const WarbandMemberHidden = 'HUD-Compass-WarbandMemberHidden';

const totalRange = 360;
const visibleRange = 135;
const directionRange = totalRange / 4;
const directions = ['N', 'E', 'S', 'W'];

interface NodeInfo {
  isHidden: boolean;
  percent: number;
}

interface ReactProps {}

interface InjectedProps {
  cameraFacing: Facing2fDegrees;
  playerCharacterID: string;
  playerPosition: Vec3f | null;
  playerEntityID: string;
  friendlyTargetName: string | null;
  friendlyTargetPosition: Vec3f | null;
  friendlyTargetID: EntityID;
  warbandMembers: (GroupMemberState | null)[];
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class ACompass extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render(): JSX.Element {
    if (!this.props.playerPosition) {
      return null;
    }

    const friendlyTargetInfo = this.getFriendlyTargetInfo();
    const warbandMembers = this.props.warbandMembers.filter(
      (member) => member && member.characterID !== this.props.playerCharacterID && member.isAlive
    );
    return (
      <div className={Root}>
        {directions.map((direction, directionIndex) => {
          const directionDegrees = directionIndex * directionRange;
          const directionInfo = this.getDegreesCompassInfo(directionDegrees);
          const bulletDegrees = (directionIndex + 0.5) * directionRange;
          const bulletInfo = this.getDegreesCompassInfo(bulletDegrees);
          return (
            <>
              <span
                className={directionInfo.isHidden ? `${Direction} ${DirectionHidden}` : Direction}
                style={{ left: this.getPercentLeft(directionInfo.percent) }}
                key={directionIndex}
              >
                {direction}
              </span>
              <span
                className={bulletInfo.isHidden ? `${Bullet} ${BulletHidden}` : Bullet}
                style={{ left: this.getPercentLeft(bulletInfo.percent) }}
                key={directionIndex}
              >
                •
              </span>
            </>
          );
        })}
        {warbandMembers.map((warbandMember, warbandMemberIndex) => {
          const warbandMemberInfo = this.getPositionCompassInfo(warbandMember.position);
          return (
            <TooltipSource
              tooltipParams={{
                id: `Compass-WarbandMember-${warbandMember.characterID}`,
                content: () => (
                  <>
                    {warbandMember.name}
                    <br />
                    {distanceVec3(this.props.playerPosition, warbandMember.position).toFixed(2)}m
                  </>
                ),
                disableBackground: false
              }}
            >
              <div
                className={warbandMemberInfo.isHidden ? `${WarbandMember} ${WarbandMemberHidden}` : WarbandMember}
                style={{ left: this.getPercentLeft(warbandMemberInfo.percent) }}
                key={warbandMemberIndex}
              >
                <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
                  <path
                    d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'
                    fill='#fff'
                    fillOpacity='1'
                  />
                  <path d='M0 0h24v24H0z' fill='none' />
                </svg>
              </div>
            </TooltipSource>
          );
        })}
        {friendlyTargetInfo && (
          <TooltipSource
            tooltipParams={{
              id: 'Compass-FriendlyTarget',
              content: () => (
                <>
                  {this.props.friendlyTargetName}
                  <br />
                  {distanceVec3(this.props.playerPosition, this.props.friendlyTargetPosition).toFixed(2)}m
                </>
              )
            }}
          >
            <div
              className={friendlyTargetInfo.isHidden ? `${FriendlyTarget} ${FriendlyTargetHidden}` : FriendlyTarget}
              style={{ left: this.getPercentLeft(friendlyTargetInfo.percent) }}
            >
              <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'>
                <path d='M0 0h512v512H0z' fill='transparent' fillOpacity={0}></path>
                <g>
                  <path
                    d='M265.22 19.688v57.75c91.033 4.56 164.143 77.686 168.717 168.718h57.75c-4.635-123.12-103.345-221.85-226.468-226.47zm-18.69.03C123.67 24.65 24.717 123.244 20.063 246.157H78.44C83 155.333 155.786 82.33 246.53 77.47V19.72zm9.69 107.22c-32.23 0-61.768 11.79-84.408 31.312l22.47 22.47c12.306-10.246 27.204-17.487 43.562-20.626l18.78 70.53 18.75-70.374c15.887 3.182 30.37 10.232 42.407 20.156l22.345-22.344c-22.465-19.41-51.782-31.125-83.906-31.125zm97.124 44.343L331 193.626c9.996 12.136 17.072 26.77 20.22 42.813l-70.095 18.687 70.125 18.656c-3.15 16.247-10.31 31.112-20.438 43.44l22.344 22.342c19.513-22.637 31.312-52.154 31.313-84.375 0-32.124-11.716-61.44-31.126-83.906zm-194.75.157c-19.478 22.446-31.28 51.697-31.28 83.75 0 32.15 11.885 61.6 31.467 84.22l22.532-22.532c-9.933-12.202-16.96-26.866-20.093-42.875l70.936-18.875-70.906-18.906c3.136-15.81 10.098-30.235 19.906-42.25l-22.562-22.532zm-138.5 93.407C25.044 387.51 123.868 486.332 246.53 491.28V432.94c-90.544-4.852-163.21-77.547-168.06-168.094H20.093zm413.812 0C429.044 355.6 356.056 428.42 265.22 432.97v58.342c122.924-4.638 221.507-103.596 226.436-226.468h-57.75zm-177.28 14.75l-18.97 71.28c-16.208-3.188-30.995-10.455-43.22-20.687L172 352.625c22.618 19.582 52.072 31.47 84.22 31.47 32.05 0 61.304-11.803 83.75-31.283l-22.345-22.343c-11.955 9.914-26.296 16.98-42.03 20.217l-18.97-71.093z'
                    fill='#fff'
                    fillOpacity='1'
                  />
                </g>
              </svg>
            </div>
          </TooltipSource>
        )}
      </div>
    );
  }

  getCameraDirection(): number {
    let direction = (this.props.cameraFacing.yaw + totalRange - visibleRange / 2) % totalRange;
    if (direction < 0) {
      direction = totalRange - Math.abs(direction);
    }
    direction = Math.round(direction);
    direction = Math.round((totalRange - (direction - directionRange)) % totalRange);
    return direction;
  }

  getPercentLeft(percent: number): string {
    return `calc(${percent * 100}% - 1.125rem)`;
  }

  getFriendlyTargetInfo(): NodeInfo | null {
    if (this.props.friendlyTargetPosition && this.props.playerEntityID !== this.props.friendlyTargetID) {
      return this.getPositionCompassInfo(this.props.friendlyTargetPosition);
    }
    return null;
  }

  getDegreesCompassInfo(degrees: number): NodeInfo {
    const cameraDirection = this.getCameraDirection();
    const visibleStart = (cameraDirection + totalRange - visibleRange) % totalRange;
    let relativeDirectionDegrees = degrees - visibleStart;
    if (relativeDirectionDegrees < -totalRange / 2) {
      relativeDirectionDegrees += totalRange;
    }
    const percent = relativeDirectionDegrees / visibleRange;
    const isHidden =
      relativeDirectionDegrees < -totalRange / 4 || relativeDirectionDegrees > visibleRange + totalRange / 4;
    return { isHidden, percent };
  }

  getPositionCompassInfo(position: Vec3f): NodeInfo | null {
    const radiansToDegrees = (valueRads: number): number => (valueRads * totalRange) / 2 / Math.PI;
    const vectorLength = (vectorPosition: Vec3f): number =>
      Math.sqrt(vectorPosition.x * vectorPosition.x + vectorPosition.y * vectorPosition.y);
    const vectorNormalize = (vectorPosition: Vec3f): Vec3f => {
      const invLength = 1 / vectorLength(vectorPosition);
      return { x: vectorPosition.x * invLength, y: vectorPosition.y * invLength, z: vectorPosition.z * invLength };
    };
    const bearingFromYawDegrees = (yawDegrees: number): number => {
      yawDegrees = 90 - yawDegrees;
      while (yawDegrees < 0) {
        yawDegrees += 360;
      }
      return yawDegrees;
    };
    const direction = vectorNormalize({
      x: position.x - this.props.playerPosition.x,
      y: position.y - this.props.playerPosition.y,
      z: position.z - this.props.playerPosition.x
    });
    return this.getDegreesCompassInfo(bearingFromYawDegrees(radiansToDegrees(Math.atan2(direction.y, direction.x))));
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    cameraFacing: state.player.cameraFacing,
    playerCharacterID: state.player.characterID,
    playerPosition: state.entities.positions[state.player.entityID],
    playerEntityID: state.player.entityID,
    friendlyTargetName: state.entities.friendlyTarget?.name ?? null,
    friendlyTargetPosition: state.entities.positions[state.entities.friendlyTarget?.entityID ?? null],
    friendlyTargetID: state.entities.friendlyTargetID,
    warbandMembers: state.warband.members
  };
};

const Compass = connect(mapStateToProps)(ACompass);

const WIDGET_NAME = 'Compass';

export const compassRegistry: HUDWidgetRegistration = {
  name: WIDGET_NAME,
  defaults: {
    xAnchor: HUDHorizontalAnchor.Center,
    yAnchor: HUDVerticalAnchor.Top,
    xOffset: 0,
    yOffset: 6
  },
  layer: HUDLayer.HUD,
  initTopics: [InitTopic.Warband],
  render: () => {
    return <Compass />;
  }
};
