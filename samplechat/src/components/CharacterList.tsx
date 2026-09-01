import * as React from 'react';
import { AppDispatch, RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { Credentials } from '../redux/authSlice';
import { Character } from '../redux/dataSlice';
import { callListCharacters, callSetCharacter } from '../rest/calls';

import './CharacterList.css';

interface Props {
  credentials: Credentials | null;
  characters: Character[] | null;
}

class ACharacterList extends React.Component<Props & DispatchProp> {
  render(): React.ReactNode {
    const { characters, credentials } = this.props;
    const characterID = credentials?.characterID ?? undefined;

    return (
      <div>
        <select className='characterList' value={characterID} onChange={this.onCharacterSelected.bind(this)}>
          {!characterID && <option key='---'>Select a character</option>}
          {characters &&
            characters.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
        </select>
      </div>
    );
  }

  componentDidMount(): void {
    this.updateCharacterList();
  }

  componentDidUpdate(prevProps: Props): void {
    if (prevProps.credentials?.screenName !== this.props.credentials?.screenName) {
      this.updateCharacterList();
    }
    if (prevProps.characters != this.props.characters) {
    }
  }

  private onCharacterSelected(ev: React.ChangeEvent<HTMLSelectElement>): void {
    const characterID = ev.target.value;
    const { credentials } = this.props;
    if (characterID && credentials) {
      (this.props.dispatch as AppDispatch)(callSetCharacter({ characterID, credentials }));
    }
  }

  private updateCharacterList(): void {
    if (this.props.credentials) {
      (this.props.dispatch as AppDispatch)(callListCharacters(this.props.credentials));
    }
  }
}

const mapStateToProps = (state: RootState): Props => {
  const { credentials } = state.auth;
  const { characters } = state.data;
  return { characters, credentials };
};

export const CharacterList = connect(mapStateToProps)(ACharacterList);
