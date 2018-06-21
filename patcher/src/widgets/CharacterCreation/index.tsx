/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'es6-promise';
import 'isomorphic-fetch';
import * as React from 'react';
import * as _ from 'lodash';
import { createStore, applyMiddleware } from 'redux';
import { connect, Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { events, webAPI, Gender, Archetype, Race, Faction, HelpInfo } from '@csegames/camelot-unchained';

import { view } from '../../components/OverlayView';
import FactionSelect from './components/FactionSelect';
import PlayerClassSelect from './components/PlayerClassSelect';
import RaceSelect from './components/RaceSelect';
import AttributesSelect from './components/AttributesSelect';
import BanesAndBoonsContainer from './components/BanesAndBoonsContainer';
import Navigation, { NavigationPageInfo } from './components/Navigation';
import CharacterSummary from './components/CharacterSummary';
import { helpSteps } from './components/HelpSteps';
import CharCreationHeader from './components/CharCreationHeader';
import LoadingOverlay from './components/LoadingOverlay';

// tslint:disable-next-line

import reducer from './services/session/reducer';
import { RacesState, fetchRaces, selectRace, RaceInfo, resetRace } from './services/session/races';
import { FactionsState, fetchFactions, selectFaction, FactionInfo, resetFaction } from './services/session/factions';
import {
  PlayerClassesState,
  fetchPlayerClasses,
  selectPlayerClass,
  PlayerClassInfo,
  resetClass,
} from './services/session/playerClasses';
import {
  AttributesState,
  fetchAttributes,
  allocateAttributePoint,
  AttributeInfo,
  attributeType,
  resetAttributes,
} from './services/session/attributes';
import {
  AttributeOffsetsState,
  fetchAttributeOffsets,
  resetAttributeOffsets,
} from './services/session/attributeOffsets';
import { CharacterState, createCharacter, CharacterCreationModel, resetCharacter } from './services/session/character';
import { selectGender, resetGender } from './services/session/genders';
import {
  BanesAndBoonsState,
  resetBanesAndBoons,
  fetchTraits,
} from './services/session/banesAndBoons';

export { CharacterCreationModel } from './services/session/character';

const store = createStore(reducer, applyMiddleware(thunk as any));

function select(state: any): any {
  return {
    racesState: state.races,
    playerClassesState: state.playerClasses,
    factionsState: state.factions,
    attributesState: state.attributes,
    attributeOffsetsState: state.attributeOffsets,
    gender: state.gender,
    characterState: state.character,
    banesAndBoonsState: state.banesAndBoons,
  };
}

export enum CharacterCreationPage {
  Faction,
  Race,
  Class,
  Attributes,
  BanesAndBoons,
  Summary,
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
  attributesState?: AttributesState;
  attributeOffsetsState?: AttributeOffsetsState;
  gender?: Gender;
  characterState?: CharacterState;
  banesAndBoonsState: BanesAndBoonsState;
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
      checkingApiServer: false,
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
            selectFaction={this.factionSelect}
          />
        );
        break;
      case CharacterCreationPage.Race:
        this.pushPagesVisited(CharacterCreationPage.Race);
        content = (
          <RaceSelect
            races={this.props.racesState.races}
            selectedRace={this.props.racesState.selected}
            selectRace={this.raceSelect}
            selectedGender={this.props.gender}
            selectGender={(selected: Gender) => this.props.dispatch(selectGender(selected)) }
            selectedFaction={this.props.factionsState.selected}
          />
        );
        break;
      case CharacterCreationPage.Class:
        this.pushPagesVisited(CharacterCreationPage.Class);
        content = (
          <PlayerClassSelect
            classes={this.props.playerClassesState.playerClasses}
            selectedClass={this.props.playerClassesState.selected}
            selectClass={this.classSelect}
            selectedFaction={this.props.factionsState.selected}
          />
        );
        break;
      case CharacterCreationPage.Attributes:
        const remainingPoints = this.props.attributesState.maxPoints - this.props.attributesState.pointsAllocated;
        this.pushPagesVisited(CharacterCreationPage.Attributes);
        if (this.pagesCompleted.find(pageNumber => pageNumber === CharacterCreationPage.Attributes) &&
          remainingPoints !== 0) {
          this.pagesCompleted.filter(pageNumber => pageNumber === CharacterCreationPage.Attributes);
        }
        content = (
          <AttributesSelect
            attributes={this.props.attributesState.attributes}
            attributeOffsets={this.props.attributeOffsetsState.offsets}
            selectedGender={this.props.gender}
            selectedRace={this.props.racesState.selected.id}
            selectedClass={this.props.playerClassesState.selected.id}
            allocatePoint={(name: string, value: number) => this.props.dispatch(allocateAttributePoint(name, value)) }
            remainingPoints={remainingPoints}
          />
        );
        break;
      case CharacterCreationPage.BanesAndBoons:
        const { dispatch, racesState, factionsState, playerClassesState, banesAndBoonsState } = this.props;
        this.pushPagesVisited(CharacterCreationPage.BanesAndBoons);
        content = (
          <BanesAndBoonsContainer
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
            attributes={this.props.attributesState.attributes}
            attributeOffsets={this.props.attributeOffsetsState.offsets}
            selectedRace={this.props.racesState.selected.id}
            selectedGender={this.props.gender}
            selectedClass={this.props.playerClassesState.selected.id}
            remainingPoints={remainingPoints}
            banesAndBoonsState={this.props.banesAndBoonsState}
            inputRef={ref => this.characterNameInputRef = ref}
            characterState={this.props.characterState}
          />
        );
    }
    const pages: NavigationPageInfo[] = [
      {
        pageNumber: CharacterCreationPage.Faction,
        pageComplete: this.pagesCompleted.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Faction) !== -1,
        pageVisited: this.pagesVisited.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Faction) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Faction),
      },
      {
        pageNumber: CharacterCreationPage.Race,
        pageComplete: this.pagesCompleted.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Race) !== -1,
        pageVisited: this.pagesVisited.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Race) !== -1,
          onClick: () => this.goToPage(CharacterCreationPage.Race),
      },
      {
        pageNumber: CharacterCreationPage.Class,
        pageComplete: this.pagesCompleted.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Class) !== -1,
        pageVisited: this.pagesVisited.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Class) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Class),
      },
      {
        pageNumber: CharacterCreationPage.Attributes,
        pageComplete: this.pagesCompleted.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Attributes) !== -1,
        pageVisited: this.pagesVisited.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Attributes) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Attributes),
      },
      {
        pageNumber: CharacterCreationPage.BanesAndBoons,
        pageComplete: this.pagesCompleted.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.BanesAndBoons) !== -1,
        pageVisited: this.pagesVisited.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.BanesAndBoons) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.BanesAndBoons),
      },
      {
        pageNumber: CharacterCreationPage.Summary,
        pageComplete: this.pagesCompleted.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Summary) !== -1,
        pageVisited: this.pagesVisited.findIndex(pageNumber =>
          pageNumber === CharacterCreationPage.Summary) !== -1,
        onClick: () => this.goToPage(CharacterCreationPage.Summary),
      },
    ];
    const onNextClick = () => this.state.page !== CharacterCreationPage.Summary ?
      this.goToPage(this.state.page + 1) : this.create();
    return (
      <div className='cu-character-creation'>
        <HelpInfo
          enabled={this.state.helpEnabled}
          initialStep={0}
          steps={helpSteps[CharacterCreationPage[this.state.page]]}
          onExitClick={this.toggleHelp}
        />
        <CharCreationHeader
          selectedServerName={this.state.selectedServerName}
          onCloseClick={this.onCloseClick}
          onHelpClick={this.toggleHelp} page={this.state.page}
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
    if (this.props.factionsState !== nextProps.factionsState ||
        this.props.playerClassesState !== nextProps.playerClassesState ||
        this.props.racesState !== nextProps.racesState) {
      this.props.dispatch(resetBanesAndBoons());
    }
  }

  public componentDidMount() {
    events.on('view-content', (View: any, props: any) => {
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
    if (!_.isEqual(nextProps.factionsState.selected, this.props.factionsState.selected) ||
      !_.isEqual(nextProps.racesState.selected, this.props.racesState.selected) ||
      !_.isEqual(nextProps.playerClassesState.selected, this.props.playerClassesState.selected)) {
        this.filterVisitedAndCompletedPages(nextState.page);
        this.props.dispatch(resetAttributeOffsets());
        this.props.dispatch(resetAttributes());
        this.props.dispatch(fetchAttributes(this.props.shard, this.props.apiHost));
        this.props.dispatch(fetchAttributeOffsets(this.props.shard, this.props.apiHost));
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
  }

  private pushPagesCompleted = (page: CharacterCreationPage) => {
    if (!_.find(this.pagesCompleted, p => p === page)) {
      this.pagesCompleted.push(page);
    }
  }

  private pushPagesVisited = (page: CharacterCreationPage) => {
    if (!_.find(this.pagesVisited, p => p === page)) {
      this.pagesVisited.push(page);
    }
  }

  private filterVisitedAndCompletedPages = (page: CharacterCreationPage) => {
    this.pagesCompleted = this.pagesCompleted.filter(pageNumber => pageNumber <= page);
    this.pagesVisited = this.pagesVisited.filter(pageNumber => pageNumber <= page);
  }

  private create = () => {
    events.fire('play-sound', 'create-character');
    // validate name
    const { banesAndBoonsState } = this.props;
    const modelName = (this.characterNameInputRef as any).value.trim();
    const normalName = modelName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const errors: any = [];
    if (normalName.length < 2 || modelName.length > 20)
      errors.push('A character name must be between 2 and 20 characters in length.');
    if (modelName.search(/^[a-zA-Z]/) === -1)
      errors.push('A character name must begin with a letter.');
    if (modelName.search(/[\-'][\-']/) > -1)
      errors.push('A character name must not contain two or more consecutive hyphens (-) or apostrophes (\').');
    if (modelName.search(/^[a-zA-Z\-']+$/) === -1)
      errors.push('A character name must only contain the letters A-Z, hyphens (-), and apostrophes (\').');
    if (errors.length > 0) {
      errors.forEach((e: string) => toastr.error(e, 'Oh No!!', {timeOut: 5000}));
    } else {
      const traitIDs = [
        ...Object.keys(banesAndBoonsState.addedBanes),
        ...Object.keys(banesAndBoonsState.addedBoons),
      ];
      // try to create...
      const model: CharacterCreationModel = {
        name: modelName,
        race: this.props.racesState.selected.id,
        gender: this.props.gender,
        faction: this.props.factionsState.selected.id,
        archetype: this.props.playerClassesState.selected.id,
        shardID: this.props.shard,
        attributes: this.props.attributesState.attributes.reduce((acc: any, cur: AttributeInfo) => {
          if (cur.type !== attributeType.PRIMARY) return acc;
          if (typeof acc.name !== 'undefined') {
            const name = acc.name;
            const val = acc.allocatedPoints;
            acc = {};
            acc[name] = val;
          }
          if (typeof acc[cur.name] === 'undefined' || isNaN(acc[cur.name])) {
            acc[cur.name] = cur.allocatedPoints;
          } else {
            acc[cur.name] += cur.allocatedPoints;
          }
          return acc;
        }),
        traitIDs,
      };
      this.props.dispatch(createCharacter(model,
        this.props.apiKey,
        this.props.apiHost,
        this.props.shard,
        this.props.apiVersion,
      ));
    }
  }

  private factionSelect = (selected: FactionInfo) => {
    this.props.dispatch(selectFaction(selected));
    this.pushPagesCompleted(CharacterCreationPage.Faction);

    const factionRaces = this.props.racesState.races.filter((r: RaceInfo) => r.faction === selected.id);
    const factionClasses = this.props.playerClassesState.playerClasses
      .filter((c: PlayerClassInfo) => c.faction === selected.id);
    this.props.dispatch(selectPlayerClass(factionClasses[0]));
    this.props.dispatch(selectRace(factionRaces[0]));

    events.fire('play-sound', 'select');
  }

  private raceSelect = (selected: RaceInfo) => {
    this.props.dispatch(selectRace(selected));
    events.fire('play-sound', 'select');
    this.pushPagesCompleted(CharacterCreationPage.Race);
  }

  private classSelect = (selected: PlayerClassInfo) => {
    this.props.dispatch(selectPlayerClass(selected));
    events.fire('play-sound', 'select');
    this.pushPagesCompleted(CharacterCreationPage.Class);
  }

  private previousPage = () => {
    this.setState({ page: this.state.page - 1, helpEnabled: false });
    events.fire('play-sound', 'select');
  }

  private goToPage = (page: CharacterCreationPage) => {
    // Check if api server is still up
    this.setState({ checkingApiServer: true });
    const apiServerOnline = this.isApiServerOnline();
    if (!apiServerOnline) {
      toastr.error(
        `Sorry, I am unable to reach the API server right now. It may just be getting a
        quick update, please wait and give it a try in a minute!`,
        'Oh No!!',
        { timeout: 3000 },
      );
      return;
    }

    const { banesAndBoonsState } = this.props;
    const factionErrors = [];
    const raceErrors = [];
    const classErrors = [];
    const attributeErrors = [];
    const banesAndBoonsErrors = [];
    const sumOfTraitValues = (Object.keys(banesAndBoonsState.addedBoons).length > 0 &&
    Object.keys(banesAndBoonsState.addedBoons).map((id: string) => banesAndBoonsState.traits[id].points)
      .reduce((a, b) => a + b) || 0) + (Object.keys(banesAndBoonsState.addedBanes).length > 0 &&
    Object.keys(banesAndBoonsState.addedBanes).map((id: string) =>
      banesAndBoonsState.traits[id].points * -1).reduce((a, b) => a + b) || 0);
    if (this.props.factionsState.selected == null) {
      factionErrors.push('Choose a faction to continue');
    }
    if (this.props.racesState.selected == null) {
      raceErrors.push('Choose a race to continue.');
    }
    if (this.props.gender === 0) {
      raceErrors.push('Choose a gender to continue.');
    }
    if (this.props.playerClassesState.selected == null) {
      classErrors.push('Choose a class to continue.');
    }
    if (this.props.attributesState.pointsAllocated !== this.props.attributesState.maxPoints) {
      attributeErrors.push(
        `You must spend all ${this.props.attributesState.maxPoints} points into your character's attributes.
        You have only spent ${this.props.attributesState.pointsAllocated} points`);
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
      Minimum points required: ${banesAndBoonsState.minPoints}`);
    }
    if (banesAndBoonsState.minPoints !== 0 &&
        _.isEmpty(Object.keys(banesAndBoonsState.addedBanes)) && _.isEmpty(Object.keys(banesAndBoonsState.addedBoons))) {
      banesAndBoonsErrors.push('Must select banes and boons');
    }

    switch (page) {
      case CharacterCreationPage.Faction: {
        events.fire('play-sound', 'select');
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
        events.fire('play-sound', 'select');
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
        events.fire('play-sound', 'select');
        this.setState({ page: CharacterCreationPage.Class, helpEnabled: false });
        break;
      }
      case CharacterCreationPage.Attributes: {
        const errors = [...factionErrors, ...raceErrors, ...classErrors];
        if (!_.isEmpty(errors)) {
          this.makeErrors(errors);
          return;
        }
        this.props.dispatch(fetchTraits({
          apiHost: this.props.apiHost,
          playerClass: Archetype[this.props.playerClassesState.selected.id],
          race: Race[this.props.racesState.selected.id],
          faction: Faction[this.props.factionsState.selected.id],
          initType: 'both',
        }));
        this.pushPagesCompleted(CharacterCreationPage.Class);
        events.fire('play-sound', 'select');
        this.setState({ page: CharacterCreationPage.Attributes, helpEnabled: false });
        break;
      }
      case CharacterCreationPage.BanesAndBoons: {
        const errors = [...factionErrors, ...raceErrors, ...classErrors, ...attributeErrors];
        if (!_.isEmpty(errors)) {
          this.makeErrors(errors);
          return;
        }
        this.pushPagesCompleted(CharacterCreationPage.Attributes);
        events.fire('play-sound', 'select');
        setTimeout(() => this.setState({ page: CharacterCreationPage.BanesAndBoons, helpEnabled: false }), 10);
        break;
      }
      case CharacterCreationPage.Summary: {
        const errors = [...factionErrors, ...raceErrors, ...classErrors, ...attributeErrors, ...banesAndBoonsErrors];
        if (!_.isEmpty(errors)) {
          this.makeErrors(errors);
          return;
        }
        this.pushPagesCompleted(CharacterCreationPage.BanesAndBoons);
        events.fire('play-sound', 'select');
        this.setState({ page: CharacterCreationPage.Summary, helpEnabled: false });
        break;
      }
    }
  }

  private isApiServerOnline = async () => {
    const res = await webAPI.ServersAPI.GetServersV1({ url: this.props.apiHost });
    this.setState({ checkingApiServer: false });
    return res;
  }

  private makeErrors = (errors: string[]) => {
    errors.forEach(message => toastr.error(message, 'Oh No!!', 5000));
  }

  private resetAndInit = (apiHost: string = this.props.apiHost) => {
    this.props.dispatch(resetFaction());
    this.props.dispatch(resetRace());
    this.props.dispatch(resetGender());
    this.props.dispatch(resetClass());
    this.props.dispatch(resetAttributeOffsets());
    this.props.dispatch(resetAttributes());
    this.props.dispatch(resetCharacter());
    this.props.dispatch(fetchFactions(this.props.shard, apiHost));
    this.props.dispatch(fetchRaces(this.props.shard, apiHost));
    this.props.dispatch(fetchPlayerClasses(apiHost, this.props.shard, this.props.apiVersion));
    this.props.dispatch(fetchAttributes(this.props.shard, apiHost));
    this.props.dispatch(fetchAttributeOffsets(this.props.shard, apiHost));
    this.setState({page: CharacterCreationPage.Faction});
    this.pagesCompleted = [];
    this.pagesVisited = [];
  }

  private onCloseClick = () => {
    events.fire('play-sound', 'select');
    events.fire('view-content', view.NONE);
    this.resetAndInit();
  }
}

const ConnectedCharacterCreation = connect(select)(CharacterCreation);

export interface ContainerProps {
  apiKey: string;
  apiHost: string;
  apiVersion: number;
  shard: number;
  created: (created: CharacterCreationModel) => void;
}

class Container extends React.Component<ContainerProps, any> {
  public render() {
    return (
      <div id='cu-character-creation'>
        <Provider store={store}>
          <ConnectedCharacterCreation apiKey={this.props.apiKey}
            apiHost={this.props.apiHost}
            apiVersion={this.props.apiVersion}
            shard={this.props.shard}
            created={this.props.created} />
        </Provider>
        <div className='preloader' ></div>
        <div className='cu-character-creation__footer' />
      </div>
    );
  }
}

export default Container;
