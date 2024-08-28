/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  ChampionInfo,
  ChampionCostumeInfo,
  PerkDefGQL,
  StringTableEntryDef
} from '@csegames/library/dist/hordetest/graphql/schema';
import { ChampionInfoDisplay } from './ChampionInfoDisplay';
import { ChampionSelect } from './ChampionSelect';
import { TransitionAnimation } from '../../../shared/TransitionAnimation';
import { connect } from 'react-redux';
import { RootState } from '../../../../redux/store';
import { ProfileModel } from '../../../../redux/profileSlice';
import { Dispatch } from 'redux';
import { updateSelectedChampion } from '../../../../redux/championInfoSlice';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getStringTableValue } from '../../../../helpers/stringTableHelpers';
import { InitTopic } from '../../../../redux/initializationSlice';

const Container = 'ChampionProfile-Container';
const ErrorContainer = 'ChampionProfile-ErrorContainer';
const ChampionImage = 'ChampionProfile-ChampionImage';
const ChampionInfoPosition = 'ChampionProfile-ChampionInfoPosition';
const AnimationContainerClass = 'ChampionProfile-AnimationContainer';

const TransitionAnimationClass = 'ChampionProfile-TransitionAnimation';

const StringIDChampionProfileErrors = 'ChampionProfileErrors';

interface ReactProps {}

interface InjectedProps {
  selectedChampion: ChampionInfo;
  championCostumes: ChampionCostumeInfo[];
  champions: ChampionInfo[];
  profile: ProfileModel;
  usingGamepad: boolean;
  usingGamepadInMainMenu: boolean;
  perksByID: Dictionary<PerkDefGQL>;
  stringTable: Dictionary<StringTableEntryDef>;
  initializationTopics: Dictionary<Boolean>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AChampionProfile extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  render() {
    if (this.props.champions && this.props.selectedChampion && this.props.initializationTopics[InitTopic.Store]) {
      const costume = this.getEquippedCostumeForSelectedChampion();
      const standingImage = (costume && costume.standingImageURL) || '';

      return (
        <div className={Container}>
          <TransitionAnimation
            defaultShouldPlayAnimation
            changeVariable={standingImage}
            containerStyles={AnimationContainerClass}
            animationClass={TransitionAnimationClass}
          >
            <img className={ChampionImage} src={standingImage} />
          </TransitionAnimation>
          <ChampionSelect />
          <div className={ChampionInfoPosition}>
            <ChampionInfoDisplay />
          </div>
        </div>
      );
    } else {
      return (
        <div className={ErrorContainer}>
          {getStringTableValue(StringIDChampionProfileErrors, this.props.stringTable)}
        </div>
      );
    }
  }

  componentDidMount() {
    if (!this.props.selectedChampion) {
      this.props.dispatch(updateSelectedChampion(this.getDefaultChampion()));
    }
  }

  private getEquippedCostumeForSelectedChampion(): ChampionCostumeInfo {
    const selectedChampionGQL = this.props.profile.champions.find((c) => {
      return c.championID === this.props.selectedChampion.id;
    });

    if (!selectedChampionGQL) {
      return null;
    }

    const allCostumesForChampion: ChampionCostumeInfo[] = this.props.championCostumes.filter(
      (costume: ChampionCostumeInfo) => {
        return costume.requiredChampionID === this.props.selectedChampion.id;
      }
    );

    const costumePerk = this.props.perksByID[selectedChampionGQL.costumePerkID];

    const equippedCostume = allCostumesForChampion.find((costume) => {
      return costume.id === costumePerk?.costume?.id;
    });

    return equippedCostume;
  }

  private getDefaultChampion() {
    if (this.props.profile && this.props.profile.defaultChampionID) {
      const colossusProfileChampion = this.props.champions.find((c) => c.id === this.props.profile.defaultChampionID);

      if (colossusProfileChampion) {
        return colossusProfileChampion;
      } else {
        console.error('User had a ColossusProfile default champion with an invalid championID');
      }
    }

    return this.props.champions[0];
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { usingGamepad, usingGamepadInMainMenu } = state.baseGame;
  const { champions, championCostumes, selectedChampion } = state.championInfo;
  const { perksByID } = state.store;
  const { stringTable } = state.stringTable;
  const initializationTopics = state.initialization.componentStatus;

  return {
    ...ownProps,
    selectedChampion,
    championCostumes: championCostumes || [],
    champions: champions || [],
    profile: state.profile,
    usingGamepad,
    usingGamepadInMainMenu,
    perksByID,
    stringTable,
    initializationTopics
  };
}

export const ChampionProfile = connect(mapStateToProps)(AChampionProfile);
