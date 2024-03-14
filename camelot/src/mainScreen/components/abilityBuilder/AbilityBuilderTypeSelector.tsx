/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { AbilityNetworkDefData } from '../../redux/gameDefsSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Vec2f } from '@csegames/library/dist/_baseGame/types/localDefinitions';
import { ClassDefGQL, RaceDefGQL } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { UserClassesData } from '@csegames/library/dist/_baseGame/clientFunctions/AssetFunctions';

const Root = 'HUD-AbilityBuilderTypeSelector-Root';
const SelectableRoot = 'HUD-AbilityBuilderTypeSelector-SelectableRoot';
const NetworkName = 'HUD-AbilityBuilderTypeSelector-NetworkName';
const BackgroundWrapper = 'HUD-AbilityBuilderTypeSelector-BackgroundWrapper';
const BackgroundImage = 'HUD-AbilityBuilderTypeSelector-BackgroundImage';
const Veil = 'HUD-AbilityBuilderTypeSelector-Veil';
const SelectImage = 'HUD-AbilityBuilderTypeSelector-SelectImage';

interface State {
  hoveredType: string;
  bgTranslate: Vec2f;
  characterTranslate: Vec2f;
  veilTranslate: Vec2f;
}

interface ReactProps {
  onTypeSelected: (type: string) => void;
}

interface InjectedProps {
  abilityNetworks: Dictionary<AbilityNetworkDefData>;
  classDef: ClassDefGQL;
  raceDef: RaceDefGQL;
  classDynamicAsset: UserClassesData;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AAbilityBuilderTypeSelector extends React.Component<Props, State> {
  private entryPoint: Vec2f = { x: 0, y: 0 };

  constructor(props: Props) {
    super(props);
    this.state = {
      hoveredType: '',
      bgTranslate: { x: 0, y: 0 },
      characterTranslate: { x: 0, y: 0 },
      veilTranslate: { x: 0, y: 0 }
    };
  }
  render(): JSX.Element {
    const networkData: string[] =
      !this.props.classDef || !this.props.raceDef
        ? []
        : [...this.props.classDef.buildableAbilityNetworks, ...this.props.raceDef.buildableAbilityNetworks];

    return <div className={Root}>{networkData.map(this.renderSelectableType.bind(this, networkData.length))}</div>;
  }

  private renderSelectableType(networkCount: number, networkID: string): React.ReactNode {
    const isHovered = this.state.hoveredType === networkID;
    const network = this.props.abilityNetworks[networkID];
    if (!network) {
      console.warn(`Unable to find an AbilityNetwork with id "${networkID}"`, this.props.abilityNetworks);
      return null;
    }
    return (
      <div
        className={SelectableRoot}
        key={networkID}
        style={{ width: `${Math.min(33, 100 / networkCount)}%` }}
        onMouseOver={this.handleMouseOver.bind(this, networkID)}
        onMouseMove={this.handleMouseMove.bind(this)}
        onMouseLeave={this.handleMouseLeave.bind(this)}
        onClick={this.props.onTypeSelected.bind(this, networkID)}
      >
        <div
          className={BackgroundWrapper}
          style={{
            filter: `hue-rotate(${network.AbilityBuilderHueRotation}) ${
              isHovered ? 'brightness(150%)' : 'brightness(100%)'
            }`,
            maskImage: `url(${network.AbilityBuilderMaskImage})`,
            WebkitMaskImage: `url(${network.AbilityBuilderMaskImage})`,
            maskSize: `auto ${isHovered ? 118 : 100}%`,
            WebkitMaskSize: `auto ${isHovered ? 118 : 100}%`
          }}
        >
          <div
            className={BackgroundImage}
            style={{ left: isHovered ? this.state.bgTranslate.x : 0, top: isHovered ? this.state.bgTranslate.y : 0 }}
          />
          <div
            className={Veil}
            style={{
              left: isHovered ? this.state.veilTranslate.x : 0,
              top: isHovered ? this.state.veilTranslate.y : 0
            }}
          />
          <div
            className={SelectImage}
            style={{
              left: isHovered ? this.state.bgTranslate.x : 0,
              top: isHovered ? this.state.bgTranslate.y : 0,
              backgroundImage: `url(${this.getAbilityNetworkImage(networkID) ?? '/images/MissingAsset.png'})`
            }}
          />
        </div>
        <div
          className={NetworkName}
          style={{
            backgroundImage: `url(${network.AbilityBuilderNameplateImage})`,
            filter: `hue-rotate(${network.AbilityBuilderHueRotation}) ${
              isHovered ? 'brightness(150%)' : 'brightness(100%)'
            }`
          }}
        >
          {network.display.name}
        </div>
      </div>
    );
  }

  private getAbilityNetworkImage(networkID: string): string {
    if (this.props.classDynamicAsset) {
      return this.props.classDynamicAsset.AbilityNetworkImage[networkID];
    }
  }

  private handleMouseOver = (hoveredType: string, e: React.MouseEvent<HTMLDivElement>) => {
    this.setState({ hoveredType });
    this.entryPoint = { x: e.clientX, y: e.clientY };
  };

  private handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const x = -(e.pageX - this.entryPoint.x);
    const y = -(e.pageY - this.entryPoint.y);
    this.setState({
      bgTranslate: { x: x * 0.05, y: y * 0.01 },
      veilTranslate: { x: x * 0.03, y: y * 0.03 },
      characterTranslate: { x: x * 0.08, y: y * 0.03 }
    });
  };

  private handleMouseLeave = () => {
    this.entryPoint = { x: 0, y: 0 };
    this.setState({
      hoveredType: '',
      bgTranslate: { x: 0, y: 0 },
      characterTranslate: { x: 0, y: 0 },
      veilTranslate: { x: 0, y: 0 }
    });
  };
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const { abilityNetworks } = state.gameDefs;
  const classDef = state.gameDefs.classesByNumericID[state.player.classID];
  const raceDef = state.gameDefs.racesByNumericID[state.player.race];
  const classDynamicAsset = state.gameDefs.classDynamicAssets[classDef?.id];

  return {
    ...ownProps,
    abilityNetworks,
    classDef,
    classDynamicAsset,
    raceDef
  };
};

export const AbilityBuilderTypeSelector = connect(mapStateToProps)(AAbilityBuilderTypeSelector);
