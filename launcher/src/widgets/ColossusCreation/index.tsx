/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'es6-promise';
import * as React from 'react';
import * as _ from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { view } from '../../components/OverlayView';
import LoadingOverlay from '../CharacterCreation/components/LoadingOverlay';

// tslint:disable-next-line
import reducer from '../CharacterCreation/services/session/reducer';
import { CharacterCreationPage } from '../../widgets/CharacterCreation';
import CharacterSummary from '../../widgets/CharacterCreation/components/CharacterSummary';
import CharCreationHeader from '../../widgets/CharacterCreation/components/CharCreationHeader';
import Navigation, { NavigationPageInfo } from '../../widgets/CharacterCreation/components/Navigation';
import {
  StatsSelectContext,
  ContextState as StatsSelectContextState,
  StatsSelectContextProvider
} from '../../widgets/CharacterCreation/components/StatsSelect/StatsSelectContext';
import { BanesAndBoonsState } from '../CharacterCreation/services/session/banesAndBoons';
import {
  CharacterState,
  createCharacter,
  CharacterCreationModel,
  resetCharacter
} from '../CharacterCreation/services/session/character';
import { globalEvents } from '../../lib/EventEmitter';
import { Sound, playSound } from '../../lib/Sound';
import { Archetype, Gender, Race } from '../../api/helpers';
import { ArchetypeInfo, Faction, RaceInfo } from '../../api/webapi';

const store = createStore(reducer, applyMiddleware(thunk as any));

function select(state: any): any {
  return {
    racesState: state.races,
    playerClassesState: state.playerClasses,
    factionsState: state.factions,
    gender: state.gender,
    characterState: state.character,
    banesAndBoonsState: state.banesAndBoons
  };
}

const defaultColossusClass: ArchetypeInfo = {
  name: '',
  description: '',
  faction: Faction.Arthurian,
  id: 0,
  stringID: Archetype.Abbot,
  importantStats: [],
  numericID: 0
};

const defaultColossusRaceInfo: RaceInfo = {
  name: '',
  description: '',
  faction: defaultColossusClass.faction,
  id: 16,
  stringID: 'HumanMaleA',
  numericID: 16
};

const defaultColossusModel: CharacterCreationModel = {
  name: '',
  race: Race.HumanMaleA,
  gender: Gender.Male,
  faction: Faction.Arthurian,
  archetype: Archetype[defaultColossusClass.stringID as keyof typeof Archetype],
  shardID: 0,
  attributes: {},
  traitIDs: []
};

const defaultColossusBoons: BanesAndBoonsState = {
  initial: false,
  totalPoints: 0,
  traits: {},
  addedBanes: {},
  addedBoons: {},
  generalBoons: {},
  playerClassBoons: {},
  raceBoons: {},
  factionBoons: {},
  generalBanes: {},
  playerClassBanes: {},
  raceBanes: {},
  factionBanes: {},
  allPrerequisites: {},
  allExclusives: {},
  minPoints: 0,
  maxPoints: 0
};

interface CharacterCreationProps {
  apiKey: string;
  apiHost: string;
  apiVersion: number;
  shard: number;
  created: (character: CharacterCreationModel) => void;
  dispatch?: (action: any) => void;
  characterState?: CharacterState;
  refetchCharactersAndServers: () => void;
}

export interface CharacterCreationState {
  selectedServerName: string;
  helpEnabled: boolean;
  checkingApiServer: boolean;
}

const pages: NavigationPageInfo[] = [
  {
    pageNumber: CharacterCreationPage.Summary,
    pageComplete: true,
    pageVisited: true,
    onClick: () => {}
  }
];

declare const toastr: any;

class ColossusCharacterCreation extends React.Component<CharacterCreationProps, CharacterCreationState> {
  private characterNameInputRef: Element;

  constructor(props: any) {
    super(props);
    this.state = {
      selectedServerName: '',
      helpEnabled: false,
      checkingApiServer: false
    };
  }

  public render() {
    return (
      <div className='cu-character-creation'>
        <CharCreationHeader
          selectedServerName={this.state.selectedServerName}
          onCloseClick={this.onCloseClick}
          onHelpClick={() => {}}
          page={CharacterCreationPage.Summary}
        />
        <div className='cu-character-creation__content'>
          {this.state.checkingApiServer && <LoadingOverlay />}
          <CharacterSummary
            showInfo={false}
            showImage={false}
            selectedRace={defaultColossusModel.race}
            selectedGender={defaultColossusModel.gender}
            selectedClass={defaultColossusClass}
            banesAndBoonsState={defaultColossusBoons}
            inputRef={(ref: any) => (this.characterNameInputRef = ref)}
            characterState={this.props.characterState}
          />
        </div>
        <Navigation
          onNextClick={this.create.bind(this)}
          onBackClick={() => {}}
          onHelpClick={() => {}}
          onCancelClick={this.onCloseClick.bind(this)}
          currentPage={0}
          pages={pages}
          disableNavButtons={false}
        />
      </div>
    );
  }

  public componentDidMount() {
    globalEvents.on('view-content', (View: any, props: any) => {
      if (view.COLOSSUSCREATION !== View) return;
      this.resetAndInit(props.apiHost);
      this.setState({ selectedServerName: props.selectedServer });
    });
  }

  public componentDidCatch(error: any, info: any) {
    console.error(error);
    console.log(info);
  }

  public componentDidUpdate() {
    if (this.props.characterState.success) {
      this.props.created(this.props.characterState.created);
      this.resetAndInit();
    }
  }

  private create() {
    playSound(Sound.CreateCharacter);
    // validate name
    const modelName = (this.characterNameInputRef as any).value.trim();
    const normalName = modelName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const errors: any = [];
    if (normalName.length < 2 || modelName.length > 20) {
      errors.push('A character name must be between 2 and 20 characters in length.');
    }
    if (modelName.search(/^[a-zA-Z]/) === -1) {
      errors.push('A character name must begin with a letter.');
    }
    if (modelName.search(/[\-'][\-']/) > -1) {
      errors.push("A character name must not contain two or more consecutive hyphens (-) or apostrophes (').");
    }
    if (modelName.search(/^[a-zA-Z\-']+$/) === -1) {
      errors.push("A character name must only contain the letters A-Z, hyphens (-), and apostrophes (').");
    }
    if (errors.length > 0) {
      errors.forEach((e: string) => toastr.error(e, 'Oh No!!', { timeOut: 5000 }));
    } else {
      // try to create...
      const model: CharacterCreationModel = { ...defaultColossusModel, shardID: this.props.shard, name: modelName };
      this.props.dispatch(createCharacter(model, this.props.apiHost, this.props.shard));
    }
  }

  private resetAndInit = (apiHost: string = this.props.apiHost) => {
    this.props.dispatch(resetCharacter());
    this.setState({});
  };

  private onCloseClick = () => {
    playSound(Sound.Select);
    globalEvents.trigger('view-content', view.NONE);
    this.resetAndInit();
  };
}

class CharacterCreationWithInjectedContext extends React.Component<CharacterCreationProps> {
  public render() {
    return (
      <StatsSelectContextProvider
        shard={this.props.shard}
        host={this.props.apiHost}
        selectedGender={defaultColossusModel.gender}
        selectedRace={defaultColossusRaceInfo}
        selectedClass={defaultColossusClass}
      >
        <StatsSelectContext.Consumer>
          {(statsSelectState: StatsSelectContextState) => <ColossusCharacterCreation {...this.props} />}
        </StatsSelectContext.Consumer>
      </StatsSelectContextProvider>
    );
  }
}

const ConnectedCharacterCreation: React.ComponentType<any> = connect(select)(CharacterCreationWithInjectedContext);

export interface ContainerProps {
  apiKey: string;
  apiHost: string;
  apiVersion: number;
  shard: number;
  created: (created: CharacterCreationModel) => void;
  refetchCharactersAndServers: () => void;
}

class Container extends React.Component<ContainerProps, any> {
  public render() {
    return (
      <div id='cu-character-creation'>
        <Provider store={store as any}>
          <ConnectedCharacterCreation
            apiKey={this.props.apiKey}
            apiHost={this.props.apiHost}
            apiVersion={this.props.apiVersion}
            shard={this.props.shard}
            created={this.props.created}
          />
        </Provider>
        <div className='preloader'></div>
        <div className='cu-character-creation__footer' />
      </div>
    );
  }
}

export default Container;
