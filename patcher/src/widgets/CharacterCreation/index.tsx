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
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import { events, Gender, Archetype, Faction, Race, webAPI, client } from 'camelot-unchained';

import { view } from '../../components/OverlayView';
import { patcher } from '../../services/patcher';
import FactionSelect from './components/FactionSelect';
import PlayerClassSelect from './components/PlayerClassSelect';
import RaceSelect from './components/RaceSelect';
import AttributesSelect from './components/AttributesSelect';
import BanesAndBoonsContainer from './components/BanesAndBoonsContainer';
import Navigation, { NavigationPageInfo } from './components/Navigation';

// tslint:disable-next-line
const Animate =  require('react-animate.css');

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
  AttributeOffsetInfo,
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

declare const Materialize: any;

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
  FACTION_SELECT,
  RACE_SELECT,
  CLASS_SELECT,
  ATTRIBUTES,
  BANES_AND_BOONS,
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
}

export interface ContainerStyles extends StyleDeclaration {
  closeButton: React.CSSProperties;
}

const defaultCharacterCreationStyle: ContainerStyles = {
  closeButton: {
    position: 'absolute',
    fontSize: '20px',
    top: 2,
    right: 5,
    color: 'white',
    cursor: 'pointer',
    zIndex: 10,
    ':hover': {
      textShadow: '0 0 3px white',
    },
    ':active': {
      textShadow: '0 0 10px white',
    },
  },
};

declare const toastr: any;

class CharacterCreation extends React.Component<CharacterCreationProps, CharacterCreationState> {
  private pagesVisited: CharacterCreationPage[] = [];
  private pagesCompleted: CharacterCreationPage[] = [];

  constructor(props: any) {
    super(props);
    this.state = { page: CharacterCreationPage.FACTION_SELECT };
  }

  public render() {
    let content: any = null;

    switch (this.state.page) {
      case CharacterCreationPage.FACTION_SELECT:
        this.pagesVisited.push(CharacterCreationPage.FACTION_SELECT);
        content = (
          <FactionSelect
            onFactionDoubleClick={this.factionNext}
            factions={this.props.factionsState.factions}
            selectedFaction={this.props.factionsState.selected}
            selectFaction={this.factionSelect}
          />
        );
        break;
      case CharacterCreationPage.RACE_SELECT:
        this.pagesVisited.push(CharacterCreationPage.RACE_SELECT);
        content = (
          <RaceSelect races={this.props.racesState.races}
            selectedRace={this.props.racesState.selected}
            selectRace={this.raceSelect}
            selectedGender={this.props.gender}
            selectGender={(selected: Gender) => this.props.dispatch(selectGender(selected)) }
            selectedFaction={this.props.factionsState.selected} />
        );
        break;
      case CharacterCreationPage.CLASS_SELECT:
        this.pagesVisited.push(CharacterCreationPage.CLASS_SELECT);
        content = (
          <PlayerClassSelect classes={this.props.playerClassesState.playerClasses}
            selectedClass={this.props.playerClassesState.selected}
            selectClass={this.classSelect}
            selectedFaction={this.props.factionsState.selected} />
        );
        break;
      case CharacterCreationPage.ATTRIBUTES:
        const remainingPoints = this.props.attributesState.maxPoints - this.props.attributesState.pointsAllocated;
        this.pagesVisited.push(CharacterCreationPage.ATTRIBUTES);
        if (this.pagesCompleted.find((pageNumber) => pageNumber === CharacterCreationPage.ATTRIBUTES) &&
          remainingPoints !== 0) {
          this.pagesCompleted.filter((pageNumber) => pageNumber === CharacterCreationPage.ATTRIBUTES);
        }
        content = (
          <AttributesSelect attributes={this.props.attributesState.attributes}
            attributeOffsets={this.props.attributeOffsetsState.offsets}
            selectedGender={this.props.gender}
            selectedRace={this.props.racesState.selected.id}
            selectedClass={this.props.playerClassesState.selected.id}
            allocatePoint={(name: string, value: number) => this.props.dispatch(allocateAttributePoint(name, value)) }
            remainingPoints={remainingPoints} />
        );
        break;
      case CharacterCreationPage.BANES_AND_BOONS:
        const { dispatch, racesState, factionsState, playerClassesState, banesAndBoonsState } = this.props;
        this.pagesVisited.push(CharacterCreationPage.BANES_AND_BOONS);
        content = (
          <BanesAndBoonsContainer
            apiHost={this.props.apiHost}
            race={racesState}
            faction={factionsState}
            playerClass={playerClassesState}
            banesAndBoons={banesAndBoonsState}
            dispatch={dispatch}
            baneStyles={{}}
            boonStyles={{}}
            styles={{}}
            traitSummaryStyles={{}}
          />
        );
        break;
    }
    const ss = StyleSheet.create(defaultCharacterCreationStyle);
    const pages: NavigationPageInfo[] = [
      {
        pageNumber: CharacterCreationPage.FACTION_SELECT,
        pageComplete: this.pagesCompleted.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.FACTION_SELECT) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.FACTION_SELECT) !== -1,
        onClick: () => this.setState({ page: CharacterCreationPage.FACTION_SELECT }),
      },
      {
        pageNumber: CharacterCreationPage.RACE_SELECT,
        pageComplete: this.pagesCompleted.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.RACE_SELECT) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.RACE_SELECT) !== -1,
        onClick: () => this.setState({ page: CharacterCreationPage.RACE_SELECT }),
      },
      {
        pageNumber: CharacterCreationPage.CLASS_SELECT,
        pageComplete: this.pagesCompleted.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.CLASS_SELECT) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.CLASS_SELECT) !== -1,
        onClick: () => this.setState({ page: CharacterCreationPage.CLASS_SELECT }),
      },
      {
        pageNumber: CharacterCreationPage.ATTRIBUTES,
        pageComplete: this.pagesCompleted.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.ATTRIBUTES) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.ATTRIBUTES) !== -1,
        onClick: () => this.setState({ page: CharacterCreationPage.ATTRIBUTES }),
      },
      {
        pageNumber: CharacterCreationPage.BANES_AND_BOONS,
        pageComplete: this.pagesCompleted.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.BANES_AND_BOONS) !== -1,
        pageVisited: this.pagesVisited.findIndex((pageNumber) =>
          pageNumber === CharacterCreationPage.BANES_AND_BOONS) !== -1,
        onClick: () => this.setState({ page: CharacterCreationPage.BANES_AND_BOONS }),
      },
    ];
    return (
      <div className='cu-character-creation'>
        <div className='cu-character-creation__header'>
          
        </div>
        <div className='cu-character-creation__content'>
          {content}
        </div>
        <Navigation
          onNextClick={this.nextPage}
          onBackClick={this.state.page !== CharacterCreationPage.FACTION_SELECT ? this.previousPage : () => {}}
          onHelpClick={this.onHelpClick}
          onCancelClick={this.onCloseClick}
          currentPage={this.state.page}
          pages={pages}
          disableNavButtons={!this.props.factionsState.factions || _.isEmpty(this.props.factionsState.factions)}
        />
      </div>
    );
  }

  public componentWillReceiveProps(nextProps: CharacterCreationProps) {
    // if (this.props && nextProps && this.props.shard !== nextProps.shard) {
    //   this.resetAndInit();
    // }
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
      }
    });
  }

  public componentWillUpdate(nextProps: CharacterCreationProps, nextState: CharacterCreationState) {
    if (nextProps.factionsState.selected !== this.props.factionsState.selected ||
      nextProps.racesState.selected !== this.props.racesState.selected ||
      nextProps.playerClassesState.selected !== this.props.playerClassesState.selected) {
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

  private onHelpClick = () => {
    events.fire('character-creation-help', this.state.page);
  }

  private filterVisitedAndCompletedPages = (page: CharacterCreationPage) => {
    this.pagesCompleted = this.pagesCompleted.filter((pageNumber) => pageNumber < page);
    this.pagesVisited = this.pagesVisited.filter((pageNumber) => pageNumber < page);
  }

  private create = () => {
    events.fire('play-sound', 'create-character');
    // validate name
    const { banesAndBoonsState } = this.props;
    const modelName = (this.refs['name-input'] as any).value.trim();
    const normalName = modelName.replace(/[^a-zA-Z]/g, '').toLowerCase();
    const sumOfTraitValues = (Object.keys(banesAndBoonsState.addedBoons).length > 0 &&
    Object.keys(banesAndBoonsState.addedBoons).map((id: string) => banesAndBoonsState.traits[id].points)
    .reduce((a, b) => a + b) || 0) + (Object.keys(banesAndBoonsState.addedBanes).length > 0 &&
    Object.keys(banesAndBoonsState.addedBanes).map((id: string) =>
    banesAndBoonsState.traits[id].points * -1).reduce((a, b) => a + b) || 0);
    
    const errors: any = [];
    if (normalName.length < 2 || modelName.length > 20)
      errors.push('A character name must be between 2 and 20 characters in length.');
    if (modelName.search(/^[a-zA-Z]/) === -1)
      errors.push('A character name must begin with a letter.');
    if (modelName.search(/[\-'][\-']/) > -1)
      errors.push('A character name must not contain two or more consecutive hyphens (-) or apostrophes (\').');
    if (modelName.search(/^[a-zA-Z\-']+$/) === -1)
      errors.push('A character name must only contain the letters A-Z, hyphens (-), and apostrophes (\').');
    if (banesAndBoonsState.totalPoints !== 0)
      errors.push('You must equally distribute points into your Boons and Banes');
    if (sumOfTraitValues > banesAndBoonsState.maxPoints) 
      errors.push(`The total points of chosen Banes and Boons, ${sumOfTraitValues}, exceeds the maximum points allowed. 
      Maximum points allowed: ${banesAndBoonsState.maxPoints}`);
    if (sumOfTraitValues < banesAndBoonsState.minPoints) 
      errors.push(
        `The total points of chosen Banes and Boons, ${sumOfTraitValues}, does not meet the minimum points required. 
      Minimum points required: ${banesAndBoonsState.minPoints}`);
    if (this.props.attributesState.maxPoints !== this.props.attributesState.pointsAllocated)
      errors.push(`You must spend all ${this.props.attributesState.maxPoints} points into your character's attributes.
      You have only spent ${this.props.attributesState.pointsAllocated} points.`);
    if (!webAPI.TraitsAPI.GetTraitsV1(webAPI.defaultConfig, client.shardID).then(res => res.ok))
      errors.push(
        'We are having technical difficulties. You will not be able to create a character until they have been fixed.',
      );
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
        this.props.apiVersion));
    }
  }

  private nextPage = () => {
    switch (this.state.page) {
      case CharacterCreationPage.FACTION_SELECT: {
        this.factionNext();
        break;
      }
      case CharacterCreationPage.RACE_SELECT: {
        this.raceNext();
        break;
      }
      case CharacterCreationPage.CLASS_SELECT: {
        this.classNext();
        break;
      }
      case CharacterCreationPage.ATTRIBUTES: {
        this.attributesNext();
        break;
      }
      case CharacterCreationPage.BANES_AND_BOONS: {
        this.create();
        break;
      }
    }
  }

  private factionSelect = (selected: FactionInfo) => {
    this.props.dispatch(selectFaction(selected));

    const factionRaces = this.props.racesState.races.filter((r: RaceInfo) => r.faction === selected.id);
    const factionClasses = this.props.playerClassesState.playerClasses
      .filter((c: PlayerClassInfo) => c.faction === selected.id);
    this.props.dispatch(selectPlayerClass(factionClasses[0]));
    this.props.dispatch(selectRace(factionRaces[0]));

    // reset race & class if they are not of the selected faction
    if (this.props.racesState.selected && this.props.racesState.selected.faction !== selected.id) {
      this.props.dispatch(selectRace(null));
      this.props.dispatch(selectPlayerClass(null));
    }
    events.fire('play-sound', 'select');
  }

  private factionNext = () => {
    this.pagesCompleted.push(CharacterCreationPage.FACTION_SELECT);
    if (this.props.factionsState.selected == null) {
      Materialize.toast('Choose a faction to continue.', 3000);
      return;
    }
    const factionRaces = this.props.racesState.races
      .filter((r: RaceInfo) => r.faction === this.props.factionsState.selected.id);
    const factionClasses = this.props.playerClassesState.playerClasses
      .filter((c: PlayerClassInfo) => c.faction === this.props.factionsState.selected.id);
    this.props.dispatch(selectPlayerClass(factionClasses[0]));
    this.props.dispatch(selectRace(factionRaces[0]));
    this.setState({ page: this.state.page + 1 });
    events.fire('play-sound', 'realm-select');
  }

  private raceSelect = (selected: RaceInfo) => {
    this.props.dispatch(selectRace(selected));
    events.fire('play-sound', 'select');
  }

  private raceNext = () => {
    if (this.props.racesState.selected == null) {
      Materialize.toast('Choose a race to continue.', 3000);
      return;
    }
    if (this.props.gender === 0) {
      Materialize.toast('Choose a gender to continue.', 3000);
      return;
    }
    this.pagesCompleted.push(CharacterCreationPage.RACE_SELECT);
    this.setState({ page: this.state.page + 1 });
    events.fire('play-sound', 'select');
  }

  private classSelect = (selected: PlayerClassInfo) => {
    this.props.dispatch(selectPlayerClass(selected));
    events.fire('play-sound', 'select');
  }

  private classNext = () => {
    if (this.props.playerClassesState.selected == null) {
      Materialize.toast('Choose a class to continue.', 3000);
      return;
    }
    this.pagesCompleted.push(CharacterCreationPage.CLASS_SELECT);
    this.setState({ page: this.state.page + 1 });
    events.fire('play-sound', 'select');
  }

  private attributesNext = () => {
    if (this.props.attributesState.pointsAllocated !== this.props.attributesState.maxPoints) {
      toastr.error(`You must spend all ${this.props.attributesState.maxPoints} points into your character's attributes.
      You have only spent ${this.props.attributesState.pointsAllocated} points`, 'Oh No!!!', {timeOut: 5000});
      return;
    }
    this.pagesCompleted.push(CharacterCreationPage.ATTRIBUTES);
    this.setState({page: this.state.page + 1});
    events.fire('play-sound', 'select');
  }

  private previousPage = () => {
    this.setState({ page: this.state.page - 1 });
    events.fire('play-sound', 'select');
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
    this.setState({page: CharacterCreationPage.FACTION_SELECT});
    this.pagesCompleted = [];
    this.pagesVisited = [];
  }

  private onCloseClick = () => {
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
