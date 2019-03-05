/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import { ControllerContext, ContextState, PatcherServer, ServerType } from '../../ControllerContext';
import CharacterSelectList from './components/CharacterSelectList';
import CharacterSelectBG from './components/CharacterSelectBG';
import CharacterDeleteModal from '../CharacterDeleteModal';
import { APIServerStatus } from '../ControllerDisplay/index';
import { SimpleCharacter } from 'gql/interfaces';
import { KeyCodes } from '@csegames/camelot-unchained';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  -webkit-user-select: none;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 10;
  background-color: rgba(0, 0, 0, 0.8);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 2px;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 20;
  font-size: 14px;
`;

const ListContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  position: absolute;
  top: 35px;
  right: 0;
  width: 100%;
  height: 90%;
  z-index: 10;
  margin: 0 5px;
  padding: 0 5px;
  overflow-y: scroll;
  -webkit-mask-image: linear-gradient(to bottom,transparent 0%,black 4%, black 90%, transparent 100%)
`;

const ListBG = styled.div`
  position: absolute;
  top: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  background: linear-gradient(to left,rgba(0,0,0,0.85),rgba(0,0,0,0) 50%);
  -webkit-mask-image: linear-gradient(to bottom, rgba(0,0,0,1), transparent);
  z-index: 9;
`;

const BottomListFade = styled.div`
  position: fixed;
  right: 200px;
  bottom: -50px;
  box-shadow: 0 0 200px 230px rgba(0,0,0,1);
  z-index: 11;
`;

const CloseButton = styled.div`
  width: auto;
  height: auto;
  padding: 1px 6px;
  text-align: center;
  font-family:"caudex";
  border-image: linear-gradient(180deg,#e2e2e2,#888888) stretch;
  border-style: solid;
  border-width: 1px 3px;
  transition: background-color .3s;
  background-color: rgba(17, 17, 17, 0.8);
  border-image-slice: 1;
  color: #bfbfbf;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 0;
  text-transform: uppercase;
  -webkit-mask-image: url(/ui/images/controller/button-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  transition: all ease .2s;
  &:hover {
    background-color: rgba(36, 36, 36, 0.8);
    border-image-slice: 1;
    color: #e6e6e6;
  }
`;

export interface ComponentProps {
  onDeleteCharacterSuccess: (id: string) => void;
  onCloseClick: () => void;
  charSelectVisible: boolean;
  apiServerStatus: APIServerStatus;
}

export interface InjectedProps {
  characters: {[id: string]: SimpleCharacter};
  servers: {[id: string]: PatcherServer};

  selectedCharacter: SimpleCharacter;
  selectedServer: PatcherServer;
  onUpdateState: (state: Partial<ContextState>) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface CharacterSelectState {
  showDeleteModal: boolean;
  selectedCharacter: SimpleCharacter;
}

class CharacterSelect extends React.Component<Props, CharacterSelectState> {
  private listRef: any;
  constructor(props: Props) {
    super(props);
    this.state = {
      showDeleteModal: false,
      selectedCharacter: null,
    };
  }

  public render() {
    if (_.isEmpty(this.props.servers)) {
      return null;
    }
    const selectedCharacter = this.state.selectedCharacter || this.props.selectedCharacter ||
      _.values(this.props.characters)[0];

    const servers = {};
    Object.keys(this.props.servers).forEach((serverKey) => {
      const server = this.props.servers[serverKey];
      if (server.type === ServerType.CUGAME) {
        servers[serverKey] = server;
      }
    });

    return (
      <Container
        id='cu-character-select'
        style={{
          opacity: this.props.charSelectVisible ? 1 : 0,
          visibility: this.props.charSelectVisible ? 'visible' : 'hidden',
        }}>
        <Header><CloseButton onClick={this.onClose}>X</CloseButton></Header>
        <CharacterSelectBG selectedCharacter={selectedCharacter} />
        <ListBG />
        <ListContainer ref={ref => this.listRef = ref}>
          <CharacterSelectList
            servers={servers}
            selectedCharacter={selectedCharacter}
            selectedServer={this.props.selectedServer}
            onCharacterSelect={this.onSelectCharacter}
            onChooseCharacter={this.onChooseCharacter}
            charSelectVisible={this.props.charSelectVisible}
            apiServerStatus={this.props.apiServerStatus}
          />
        </ListContainer>
        <BottomListFade />
        {this.state.showDeleteModal &&
          <CharacterDeleteModal
            character={selectedCharacter}
            servers={servers}
            closeModal={this.toggleModal}
            onSuccess={this.onDeleteSuccess}
          />
        }
        {this.state.showDeleteModal && <Overlay />}
      </Container>
    );
  }

  public componentDidMount() {
    game.trigger('pause-videos');
    game.on('character-select-show-delete', this.toggleModal);
    window.addEventListener('keydown', this.handleEscKey);
  }

  public componentWillReceiveProps(nextProps: Props) {
    if ((!this.state.selectedCharacter && nextProps.selectedCharacter) ||
        !_.isEqual(this.props.selectedCharacter, nextProps.selectedCharacter)) {
      if (this.listRef) {
        this.listRef.scrollTop = 0;
      }
      this.setSelectedCharacter(nextProps.selectedCharacter);
    }

    if (this.props.charSelectVisible !== nextProps.charSelectVisible && this.listRef) {
      this.listRef.scrollTop = 0;
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleEscKey);
  }

  private setSelectedCharacter = (character: SimpleCharacter) => {
    this.setState({ selectedCharacter: character });
  }

  private onSelectCharacter = (character?: SimpleCharacter) => {
    if (character) {
      this.setSelectedCharacter(character);
    }
  }

  private onChooseCharacter = () => {
    this.props.onCloseClick();
    const characterServer = _.find(this.props.servers, server => server.shardID === this.state.selectedCharacter.shardID);
    this.props.onUpdateState({ selectedCharacter: this.state.selectedCharacter, selectedServer: characterServer });
  }

  private toggleModal = () => {
    this.setState({ showDeleteModal: !this.state.showDeleteModal });
  }

  private onDeleteSuccess = (id: string) => {
    this.props.onDeleteCharacterSuccess(id);
    this.toggleModal();
    this.setSelectedCharacter(this.props.characters[0]);
  }

  private handleEscKey = (e: KeyboardEvent) => {
    if (e.which === KeyCodes.KEY_Escape && this.props.charSelectVisible) {
      this.onClose();
    }
  }

  private onClose = () => {
    game.trigger('play-sound', 'select');
    game.trigger('resume-videos');
    this.props.onCloseClick();
  }
}

class CharacterSelectWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <ControllerContext.Consumer>
        {({ characters, servers, selectedCharacter, selectedServer, onUpdateState }) => (
          <CharacterSelect
            {...this.props}
            characters={characters}
            servers={servers}
            selectedCharacter={selectedCharacter}
            selectedServer={selectedServer}
            onUpdateState={onUpdateState}
          />
        )}
      </ControllerContext.Consumer>
    );
  }
}

export default CharacterSelectWithInjectedContext;
