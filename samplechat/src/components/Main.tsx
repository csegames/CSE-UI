import * as React from 'react';
import { AuthForm } from './AuthForm';
import { Chat } from './Chat';
import { AppDispatch, RootState } from '../redux/store';
import { connect, DispatchProp } from 'react-redux';
import { Credentials } from '../redux/authSlice';
import { callListCharacters, callSetCharacter } from '../rest/calls';
import { chatRenderer, chatService } from './chatSetup';

const characterID = process.env.CHARACTER_ID ?? 'rO4aBWaWSE4I1kj1ACW100';

interface Props {
  credentials: Credentials | null;
}

class AMain extends React.Component<Props & DispatchProp> {
  render(): React.ReactNode {
    const { credentials } = this.props;
    const isAuthed = credentials != null;

    if (!isAuthed) {
      return <AuthForm />;
    }

    return <Chat service={chatService} renderer={chatRenderer} />;
  }

  componentDidUpdate(prevProps: Props): void {
    if (!prevProps.credentials && this.props.credentials && !this.props.credentials.characterID) {
      (this.props.dispatch as AppDispatch)(callListCharacters(this.props.credentials));
    }
  }
}

const mapStateToProps = (state: RootState): Props => {
  const { credentials } = state.auth;
  return {
    credentials
  };
};

export const Main = connect(mapStateToProps)(AMain);
