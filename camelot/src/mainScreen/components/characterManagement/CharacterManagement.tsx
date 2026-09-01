/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { AppDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { getFactionData } from '../../gameData/factionData';
import { CharacterSelection } from './CharacterSelection';
import { CharacterCreation } from './CharacterCreation';
import { CSETransition } from '../../../shared/components/CSETransition';
import { CharacterCreationState } from '../../redux/charactersSlice';
import { FactionSelection } from './FactionSelection';

// CSS classes
const Root = 'HUD-CharacterManagement-Root';

interface ReactProps {}

interface InjectedProps {
  uiFactionID: string;
  characterCreationState: CharacterCreationState | null;
  dispatch?: AppDispatch;
}

type Props = ReactProps & InjectedProps;

class ACharacterManagement extends React.Component<Props> {
  render(): JSX.Element {
    const factionData = getFactionData(this.props.uiFactionID);
    const isCreatingCharacter = !!this.props.characterCreationState;
    const shouldSelectFaction = !this.props.characterCreationState?.factionID;

    return (
      <div className={Root} style={{ backgroundImage: `url(${factionData.backgroundFullscreenImage})` }}>
        <CSETransition show={!isCreatingCharacter} key={`CharacterSelection`} removeWhenHidden={true}>
          <CharacterSelection />
        </CSETransition>
        <CSETransition
          show={isCreatingCharacter && shouldSelectFaction}
          key={`FactionSelection`}
          removeWhenHidden={true}
        >
          <FactionSelection />
        </CSETransition>
        <CSETransition
          show={isCreatingCharacter && !shouldSelectFaction}
          key={`CharacterCreation`}
          removeWhenHidden={true}
        >
          <CharacterCreation />
        </CSETransition>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps,
    uiFactionID: state.hud.uiFactionID,
    characterCreationState: state.characters.characterCreationState
  };
};

export const CharacterManagement = connect(mapStateToProps)(ACharacterManagement);
