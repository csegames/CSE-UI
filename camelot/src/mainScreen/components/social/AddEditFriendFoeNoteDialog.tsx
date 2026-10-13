import * as React from 'react';
import { AddDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { TextInput, TextInputType } from '../input/TextInput';
import { FactionButton } from '../FactionButton';
import { getStringTableValue, StringIDGeneralCancel, StringIDGeneralSave } from '../../helpers/stringTableHelpers';
import { hideModal } from '../../redux/modalsSlice';
import { SocialPlayer } from './FriendFoeList';

// CSS classes
const Root = 'HUD-AddEditFriendFoeNoteDialog-Root';
const NoteInputContainer = 'HUD-AddEditFriendFoeNoteDialog-NoteInputContainer';
const NoteCharacterInput = 'HUD-AddEditFriendFoeNoteDialog-NoteCharacterInput';
const ButtonSection = 'HUD-AddEditFriendFoeNoteDialog-ButtonSection';
const ActionButton = 'HUD-AddEditFriendFoeNoteDialog-ActionButton';

interface State {
  inputValue: string;
}

interface ReactProps {
  player: SocialPlayer;
  isFoe?: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  minCharacterNameLength: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AAddEditFriendFoeNoteDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      inputValue: ''
    };
  }

  render(): React.ReactNode {
    return (
      <div className={Root}>
        <TextInput
          type={TextInputType.General}
          className={NoteInputContainer}
          inputClassName={NoteCharacterInput}
          value={this.state.inputValue}
          setValue={(value: string) => {
            this.setState({ inputValue: value });
          }}
          maxLength={255} // TODO: Probably this should come from a Config.
          showLength
          multiline
        />

        <div className={ButtonSection}>
          <FactionButton className={ActionButton} onClick={this.onAddClicked.bind(this)}>
            {getStringTableValue(StringIDGeneralSave, this.props.stringTable)}
          </FactionButton>
          <FactionButton className={ActionButton} onClick={this.onCancelClicked.bind(this)}>
            {getStringTableValue(StringIDGeneralCancel, this.props.stringTable)}
          </FactionButton>
        </div>
      </div>
    );
  }

  private onAddClicked(): void {
    // TODO: Going to need some clientAPI call, most likely.
    // TODO: if (this.props.isFoe) ...
  }

  private onCancelClicked(): void {
    this.props.dispatch(hideModal());
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    stringTable: state.stringTable.stringTable,
    minCharacterNameLength: state.gameDefs.settings?.minCharacterNameLength ?? 3
  };
};

export const AddEditFriendFoeNoteDialog = connect(mapStateToProps)(AAddEditFriendFoeNoteDialog);
