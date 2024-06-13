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
import FactionSelect from './components/FactionSelect';
import PlayerClassSelect from './components/Class/PlayerClassSelect';
import RaceSelect from './components/Race/RaceSelect';
import StatsSelect from './components/StatsSelect';
import BanesAndBoonsContainer from './components/BanesAndBoonsContainer';
import Navigation, { NavigationPageInfo } from './components/Navigation';
import CharacterSummary from './components/CharacterSummary';
import CharCreationHeader from './components/CharCreationHeader';
import LoadingOverlay from './components/LoadingOverlay';

// tslint:disable-next-line
import {
  StatsSelectContext,
  StatsSelectContextProvider,
  ContextState as StatsSelectContextState,
  StatObjectInfo
} from './components/StatsSelect/StatsSelectContext';
import reducer from './services/session/reducer';
import { RacesState, fetchRaces, selectRace, resetRace } from './services/session/races';
import { FactionsState, fetchFactions, selectFaction, resetFaction } from './services/session/factions';
import { RaceInfo, FactionInfo, ArchetypeInfo } from '../../api/webapi';
import {
  PlayerClassesState,
  fetchPlayerClasses,
  selectPlayerClass,
  resetClass
} from './services/session/playerClasses';
import { CharacterState, createCharacter, CharacterCreationModel, resetCharacter } from './services/session/character';
import { selectGender, resetGender } from './services/session/genders';
import { BanesAndBoonsState, resetBanesAndBoons, fetchTraits } from './services/session/banesAndBoons';
import { checkAPIServer } from '../../lib/checkAPIServer';
import { Sound, playSound } from '../../lib/Sound';
import { Archetype, Gender, Race } from '../../api/helpers';
import { Faction } from '../../api/webapi';
import { globalEvents } from '../../lib/EventEmitter';
export { CharacterCreationModel } from './services/session/character';

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

export enum CharacterCreationPage {
  Faction,
  Race,
  Class,
  Stats,
  BanesAndBoons,
  Summary
}

export interface CharacterCreationProps {
  apiKey: string;
  apiHost: string;
  apiVersion: number;
  shard: number;
  created: (character: CharacterCreationModel) => void;
  dispatch?: (action: any) => void;
  racesState?: RacesState;
  playerClassesState?: PlayerClassesState;
  factionsState?: FactionsState;
  gender?: Gender;
  characterState?: CharacterState;
  banesAndBoonsState: BanesAndBoonsState;
  statsSelectState: StatsSelectContextState;
  refetchCharactersAndServers: () => void;
}

export interface CharacterCreationState {
  page: CharacterCreationPage;
  selectedServerName: string;
  helpEnabled: boolean;
  checkingApiServer: boolean;
}

declare const toastr: any;

class CharacterCreation extends React.Component<CharacterCreationProps, CharacterCreationState> {
  private pagesVisited: CharacterCreationPage[] = [];
  private pagesCompleted: CharacterCreationPage[] = [];
  private characterNameInputRef: Element;

  constructor(props: any) {
    super(props);
    this.state = {
      page: CharacterCreationPage.Faction,
      selectedServerName: '',
      helpEnabled: false,
      checkingApiServer: false
    };
  }

  public render() {
    let content: any = null;

    switch (this.state.page) {
      case CharacterCreationPage.Faction:
        this.pushPagesVisited(CharacterCreationPage.Faction);
        content = (
          <FactionSelect
            onFactionDoubleClick={() => this.goToPage(this.state.page + 1)}
            factions={this.props.factionsState.factions}
            selectedFaction={this.props.factionsState.selected}
            selectFaction={this.factionSelect.bind(this)}
          />
        );
        break;
      case CharacterCreationPage.Race:
        this.pushPagesVisited(CharacterCreationPage.Race);
        content = (
          <RaceSelect
            races={this.props.racesState.races}
            selectedRace={this.props.racesState.selected}
            selectRace={this.raceSelect.bind(this)}
            selectedGender={this.props.gender}
            selectGender={(selected: Gender) => this.props.dispatch(selectGender(selected))}
            selectedFaction={this.props.factionsState.selected}
          />
        );
        break;
      case CharacterCreationPage.Class:
        this.pushPagesVisited(CharacterCreationPage.Class);
        content = (
          <PlayerClassSelect
            classes={this.props.playerClassesState.playerClasses}
            selectedGender={this.props.gender}
            selectedRace={this.props.racesState.selected}
            selectedClass={this.props.playerClassesState.selected}
            selectedFaction={this.props.factionsState.selected}
            selectClass={this.classSelect.bind(this)}
          />
        );
        break;
      case CharacterCreationPage.Stats:
        this.pushPagesVisited(CharacterCreationPage.Stats);
        if (
          this.pagesCompleted.find((pageNumber) => pageNumber === CharacterCreationPage.Stats) &&
          this.props.statsSelectState.remainingPoints !== 0
        ) {
          this.pagesCompleted.filter((pageNumber) => pageNumber === CharacterCreationPage.Stats);
        }
        content = <StatsSelect selectedClass={this.props.playerClassesState.selected} />;
        break;
      case CharacterCreationPage.BanesAndBoons:
        const { dispatch, racesState, factionsState, playerClassesState, banesAndBoonsState } = this.props;
        this.pushPagesVisited(CharacterCreationPage.BanesAndBoons);
        content = (
          <BanesAndBoonsContainer
            shard={this.props.shard}
            apiHost={this.props.apiHost}
            race={racesState}
            faction={factionsState}
            playerClass={playerClassesState}
            banesAndBoons={banesAndBoonsState}
            dispatch={dispatch}
          />
        );
        break;
      case CharacterCreationPage.Summary:
        this.pushPagesVisited(CharacterCreationPage.Summary);
        content = (
          <CharacterSummary
            showInfo={true}
            showImage={true}
            selectedRace={Race[this.props.racesState.selected.stringID as keyof typeof Race]}
            selectedGender={this.props.gender}
            selectedClass={this.props.playerClassesState.selected}
            banesAndBoonsState={this.props.banesAndBoonsState}
            inputRef={(ref) => (this.characterNameInputRef = ref)}
            characterState={this.props.characterState}
          />
        );
    }
    const pages: NavigationPageInfo[] = [
      {
        pageNumber: CharacterCreationPage.Faction,
        pageComplete:
          this.pagesCompleted.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Faction) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Faction) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Faction)
      },
      {
        pageNumber: CharacterCreationPage.Race,
        pageComplete: this.pagesCompleted.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Race) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Race) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Race)
      },
      {
        pageNumber: CharacterCreationPage.Class,
        pageComplete: this.pagesCompleted.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Class) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Class) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Class)
      },
      {
        pageNumber: CharacterCreationPage.Stats,
        pageComplete: this.pagesCompleted.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Stats) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Stats) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Stats)
      },
      {
        pageNumber: CharacterCreationPage.BanesAndBoons,
        pageComplete:
          this.pagesCompleted.findIndex((pageNumber) => pageNumber === CharacterCreationPage.BanesAndBoons) !== -1,
        pageVisited:
          this.pagesVisited.findIndex((pageNumber) => pageNumber === CharacterCreationPage.BanesAndBoons) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.BanesAndBoons)
      },
      {
        pageNumber: CharacterCreationPage.Summary,
        pageComplete:
          this.pagesCompleted.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Summary) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) => pageNumber === CharacterCreationPage.Summary) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Summary)
      }
    ];
    const onNextClick = () =>
      this.state.page !== CharacterCreationPage.Summary ? this.goToPage(this.state.page + 1) : this.create();
    return (
      <div className='cu-character-creation'>
        {/* <HelpInfo
          enabled={this.state.helpEnabled}
          initialStep={0}
          steps={helpSteps[CharacterCreationPage[this.state.page]]}
          onExitClick={this.toggleHelp}
        /> */}
        <CharCreationHeader
          selectedServerName={this.state.selectedServerName}
          onCloseClick={this.onCloseClick}
          onHelpClick={this.toggleHelp}
          page={this.state.page}
        />
        <div className='cu-character-creation__content'>
          {this.state.checkingApiServer && <LoadingOverlay />}
          {content}
        </div>
        <Navigation
          onNextClick={onNextClick}
          onBackClick={this.state.page !== CharacterCreationPage.Faction ? this.previousPage : () => {}}
          onHelpClick={this.toggleHelp}
          onCancelClick={this.onCloseClick}
          currentPage={this.state.page}
          pages={pages}
          disableNavButtons={!this.props.factionsState.factions || _.isEmpty(this.props.factionsState.factions)}
        />
      </div>
    );
  }

  public componentWillReceiveProps(nextProps: CharacterCreationProps) {
    if (
      this.props.factionsState !== nextProps.factionsState ||
      this.props.playerClassesState !== nextProps.playerClassesState ||
      this.props.racesState !== nextProps.racesState
    ) {
      this.props.dispatch(resetBanesAndBoons());
    }
  }

  public componentDidMount() {
    globalEvents.on('view-content', (View: any, props: any) => {
      if (view.CHARACTERCREATION === View) {
        this.resetAndInit(props.apiHost);
        this.setState({ selectedServerName: props.selectedServer });
      }
    });
  }

  public componentDidCatch(error: any, info: any) {
    console.error(error);
    console.log(info);
  }

  public componentWillUpdate(nextProps: CharacterCreationProps, nextState: CharacterCreationState) {
    if (
      !_.isEqual(nextProps.factionsState.selected, this.props.factionsState.selected) ||
      !_.isEqual(nextProps.racesState.selected, this.props.racesState.selected) ||
      !_.isEqual(nextProps.playerClassesState.selected, this.props.playerClassesState.selected)
    ) {
      // Player changed faction or race or class so reset stat values to default
      this.filterVisitedAndCompletedPages(nextState.page);
      this.props.statsSelectState.resetValues();
    }
  }

  public componentDidUpdate() {
    if (this.props.characterState.success) {
      this.props.created(this.props.characterState.created);
      this.resetAndInit();
    }
  }

  private toggleHelp = () => {
    this.setState({ helpEnabled: !this.state.helpEnabled });
  };

  private pushPagesCompleted = (page: CharacterCreationPage) => {
    if (!_.find(this.pagesCompleted, (p) => p === page)) {
      this.pagesCompleted.push(page);
    }
  };

  private pushPagesVisited = (page: CharacterCreationPage) => {
    if (!_.find(this.pagesVisited, (p) => p === page)) {
      this.pagesVisited.push(page);
    }
  };

  private filterVisitedAndCompletedPages = (page: CharacterCreationPage) => {
    this.pagesCompleted = this.pagesCompleted.filter((pageNumber) => pageNumber <= page);
    this.pagesVisited = this.pagesVisited.filter((pageNumber) => pageNumber <= page);
  };

  private create = () => {
    playSound(Sound.CreateCharacter);
    // validate name
    const { banesAndBoonsState } = this.props;
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
      const traitIDs = [...Object.keys(banesAndBoonsState.addedBanes), ...Object.keys(banesAndBoonsState.addedBoons)];

      // Fill out primaryAttributesMap
      const primaryAttributesMap: { [statId: string]: number } = {};
      this.props.statsSelectState.primaryStats.forEach((primaryStat: StatObjectInfo) => {
        primaryAttributesMap[primaryStat.statDef.id] = primaryStat.value - primaryStat.defaultValue;
      });

      // try to create...
      const model: CharacterCreationModel = {
        name: modelName,
        race: Race[this.props.racesState.selected.stringID as keyof typeof Race],
        gender: this.props.gender,
        faction: this.props.factionsState.selected.id,
        archetype: Archetype[this.props.playerClassesState.selected.stringID as keyof typeof Archetype],
        shardID: this.props.shard,
        attributes: primaryAttributesMap,
        traitIDs
      };
      this.props.dispatch(createCharacter(model, this.props.apiHost, this.props.shard));
    }
  };

  private factionSelect = (selected: FactionInfo) => {
    this.props.dispatch(selectFaction(selected));
    this.pushPagesCompleted(CharacterCreationPage.Faction);

    const factionRaces = this.props.racesState.races.filter((r: RaceInfo) => r.faction === selected.id);
    const factionClasses = this.props.playerClassesState.playerClasses.filter(
      (c: ArchetypeInfo) => c.faction === selected.id
    );
    this.props.dispatch(selectPlayerClass(factionClasses[0]));
    this.props.dispatch(selectRace(factionRaces[0]));

    playSound(Sound.Select);
  };

  private raceSelect = (selected: RaceInfo) => {
    this.props.dispatch(selectRace(selected));
    playSound(Sound.Select);
    this.pushPagesCompleted(CharacterCreationPage.Race);
  };

  private classSelect = (selected: ArchetypeInfo) => {
    this.props.dispatch(selectPlayerClass(selected));
    playSound(Sound.Select);
    this.pushPagesCompleted(CharacterCreationPage.Class);
  };

  private previousPage = () => {
    this.setState({ page: this.state.page - 1, helpEnabled: false });
    playSound(Sound.Select);
  };

  private goToPage = (page: CharacterCreationPage) => {
    // Check if api server is still up
    this.setState({ checkingApiServer: true });
    const apiServerOnline = this.isApiServerOnline();
    if (!apiServerOnline) {
      toastr.error(
        `Sorry, I am unable to reach the API server right now. It may just be getting a
        quick update, please wait and give it a try in a minute!`,
        'Oh No!!',
        { timeout: 3000 }
      );
      return;
    }

    const { banesAndBoonsState } = this.props;
    const factionErrors = [];
    const raceErrors = [];
    const classErrors = [];
    const attributeErrors = [];
    const banesAndBoonsErrors = [];
    const sumOfTraitValues =
      ((Object.keys(banesAndBoonsState.addedBoons).length > 0 &&
        Object.keys(banesAndBoonsState.addedBoons)
          .map((id: string) => banesAndBoonsState.traits[id].points)
          .reduce((a, b) => a + b)) ||
        0) +
      ((Object.keys(banesAndBoonsState.addedBanes).length > 0 &&
        Object.keys(banesAndBoonsState.addedBanes)
          .map((id: string) => banesAndBoonsState.traits[id].points * -1)
          .reduce((a, b) => a + b)) ||
        0);
    if (this.props.factionsState.selected == null) {
      factionErrors.push('Choose a faction to continue');
    }
    if (this.props.racesState.selected == null) {
      raceErrors.push('Choose a race to continue.');
    }
    if (this.props.gender === Gender.None) {
      raceErrors.push('Choose a gender to continue.');
    }
    if (this.props.playerClassesState.selected == null) {
      classErrors.push('Choose a class to continue.');
    }
    if (this.props.statsSelectState.remainingPoints !== 0) {
      attributeErrors.push(
        `You must spend all ${this.props.statsSelectState.maxPoints} points into your character's attributes.
        You have only spent ${
          this.props.statsSelectState.maxPoints - this.props.statsSelectState.remainingPoints
        } points`
      );
    }
    if (banesAndBoonsState.totalPoints !== 0) {
      banesAndBoonsErrors.push('You must equally distribute points into your Boons and Banes');
    }
    if (sumOfTraitValues > banesAndBoonsState.maxPoints) {
      banesAndBoonsErrors.push(`The total points of chosen Banes and Boons, ${sumOfTraitValues}
      , exceeds the maximum points allowed. Maximum points allowed: ${banesAndBoonsState.maxPoints}`);
    }
    if (sumOfTraitValues < banesAndBoonsState.minPoints) {
      banesAndBoonsErrors.push(
        `The total points of chosen Banes and Boons, ${sumOfTraitValues}, does not meet the minimum points required.
      Minimum points required: ${banesAndBoonsState.minPoints}`
      );
    }
    if (
      banesAndBoonsState.minPoints !== 0 &&
      _.isEmpty(Object.keys(banesAndBoonsState.addedBanes)) &&
      _.isEmpty(Object.keys(banesAndBoonsState.addedBoons))
    ) {
      banesAndBoonsErrors.push('Must select banes and boons');
    }

    var exclusiveError = null;

    // We need to build a list of all the traits that apply to this character.  which is spread across 8 different lists
    // but will produce a smallish list of traits for us to check
    const allTraitsForCharacter: string[] = [
      ...Object.keys(banesAndBoonsState.playerClassBoons),
      ...Object.keys(banesAndBoonsState.raceBoons),
      ...Object.keys(banesAndBoonsState.factionBoons),
      ...Object.keys(banesAndBoonsState.generalBoons),
      ...Object.keys(banesAndBoonsState.playerClassBanes),
      ...Object.keys(banesAndBoonsState.raceBanes),
      ...Object.keys(banesAndBoonsState.factionBanes),
      ...Object.keys(banesAndBoonsState.generalBanes)
    ];

    Object.keys(banesAndBoonsState.allExclusives).forEach((traitID) => {
      // the exclusive traits list includes exclusive traits for all combos of characters
      // if this character doesn't have access to the trait at all, then we should skip this exlusive set
      if (allTraitsForCharacter.indexOf(traitID) == -1) {
        return;
      }

      const exclusiveInfo = banesAndBoonsState.traits[traitID].exclusives;
      if (exclusiveInfo) {
        var traitCount = 0;
        exclusiveInfo.ids.forEach((exclusiveID) => {
          if (banesAndBoonsState.addedBoons[exclusiveID] || banesAndBoonsState.addedBanes[exclusiveID]) {
            traitCount++;
          }
        });

        if (exclusiveInfo.minRequired && traitCount < exclusiveInfo.minRequired) {
          exclusiveError = 'Must select another trait from the group ';
          for (var i = 0; i < exclusiveInfo.ids.length; ++i) {
            exclusiveError += banesAndBoonsState.traits[exclusiveInfo.ids[i]].name;

            if (i + 2 == exclusiveInfo.ids.length) {
              // the second to last entry
              exclusiveError += ' and ';
            } else if (i + 1 == exclusiveInfo.ids.length) {
              exclusiveError += ', ';
            }
          }
        }
      }
    });

    if (exclusiveError) {
      banesAndBoonsErrors.push(exclusiveError);
    }

    switch (page) {
      case CharacterCreationPage.Faction: {
        playSound(Sound.Select);
        this.setState({ page: CharacterCreationPage.Faction });
        break;
      }
      case CharacterCreationPage.Race: {
        const errors = [...factionErrors];
        if (!_.isEmpty(errors)) {
          this.makeErrors(errors);
          return;
        }
        this.pushPagesCompleted(CharacterCreationPage.Faction);
        playSound(Sound.Select);
        this.setState({ page: CharacterCreationPage.Race, helpEnabled: false });
        break;
      }
      case CharacterCreationPage.Class: {
        const errors = [...factionErrors, ...raceErrors];
        if (!_.isEmpty(errors)) {
          this.makeErrors(errors);
          return;
        }
        this.pushPagesCompleted(CharacterCreationPage.Race);
        playSound(Sound.Select);
        this.setState({ page: CharacterCreationPage.Class, helpEnabled: false });
        break;
      }
      case CharacterCreationPage.Stats: {
        const errors = [...factionErrors, ...raceErrors, ...classErrors];
        if (!_.isEmpty(errors)) {
          this.makeErrors(errors);
          return;
        }
        this.props.dispatch(
          fetchTraits({
            shard: this.props.shard,
            apiHost: this.props.apiHost,
            playerClass: this.props.playerClassesState.selected.stringID,
            race: this.props.racesState.selected.stringID,
            faction: Faction[this.props.factionsState.selected.id],
            initType: 'both'
          })
        );
        this.pushPagesCompleted(CharacterCreationPage.Class);
        playSound(Sound.Select);
        this.setState({ page: CharacterCreationPage.Stats, helpEnabled: false });
        break;
      }
      case CharacterCreationPage.BanesAndBoons: {
        const errors = [...factionErrors, ...raceErrors, ...classErrors, ...attributeErrors];
        if (!_.isEmpty(errors)) {
          this.makeErrors(errors);
          return;
        }
        this.pushPagesCompleted(CharacterCreationPage.Stats);
        playSound(Sound.Select);
        window.setTimeout(() => this.setState({ page: CharacterCreationPage.BanesAndBoons, helpEnabled: false }), 10);
        break;
      }
      case CharacterCreationPage.Summary: {
        const errors = [...factionErrors, ...raceErrors, ...classErrors, ...attributeErrors, ...banesAndBoonsErrors];
        if (!_.isEmpty(errors)) {
          this.makeErrors(errors);
          return;
        }
        this.pushPagesCompleted(CharacterCreationPage.BanesAndBoons);
        playSound(Sound.Select);
        this.setState({ page: CharacterCreationPage.Summary, helpEnabled: false });
        break;
      }
    }
  };

  private isApiServerOnline = async () => {
    const res = await checkAPIServer(this.props.apiHost);
    this.setState({ checkingApiServer: false });
    return res;
  };

  private makeErrors = (errors: string[]) => {
    errors.forEach((message) => toastr.error(message, 'Oh No!!', 5000));
  };

  private resetAndInit = (apiHost: string = this.props.apiHost) => {
    this.props.dispatch(resetFaction());
    this.props.dispatch(resetRace());
    this.props.dispatch(resetGender());
    this.props.dispatch(resetClass());
    this.props.dispatch(resetCharacter());
    this.props.dispatch(fetchFactions(this.props.shard, apiHost));
    this.props.dispatch(fetchRaces(this.props.shard, apiHost));
    this.props.dispatch(fetchPlayerClasses(apiHost));
    this.props.statsSelectState.resetValues();
    this.setState({ page: CharacterCreationPage.Faction });
    this.pagesCompleted = [];
    this.pagesVisited = [];
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
        selectedGender={this.props.gender}
        selectedRace={this.props.racesState.selected}
        selectedClass={this.props.playerClassesState.selected}
      >
        <StatsSelectContext.Consumer>
          {(statsSelectState: StatsSelectContextState) => (
            <CharacterCreation {...this.props} statsSelectState={statsSelectState} />
          )}
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
