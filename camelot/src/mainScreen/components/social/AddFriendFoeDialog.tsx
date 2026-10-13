import * as React from 'react';
import { AddDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { TextInput, TextInputType } from '../input/TextInput';
import { FactionButton } from '../FactionButton';
import { getStringTableValue, StringIDGeneralCancel } from '../../helpers/stringTableHelpers';
import { StringIDGeneralConfirm } from '../../helpers/stringTableHelpers';
import { hideModal } from '../../redux/modalsSlice';

// CSS classes
const Root = 'HUD-AddFriendFoeDialog-Root';
const NameInputContainer = 'HUD-AddFriendFoeDialog-NameInputContainer';
const NameCharacterInput = 'HUD-AddFriendFoeDialog-NameCharacterInput';
const InputStatus = 'HUD-AddFriendFoeDialog-InputStatus';
const ButtonSection = 'HUD-AddFriendFoeDialog-ButtonSection';
const ActionButton = 'HUD-AddFriendFoeDialog-ActionButton';

interface State {
  inputValue: string;
  lastInvited: string;
}

interface ReactProps {
  isFoe?: boolean;
}

interface InjectedProps {
  stringTable: Record<string, StringTableEntryDef>;
  minCharacterNameLength: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AAddFriendFoeDialog extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      inputValue: '',
      lastInvited: ''
    };
  }

  render(): React.ReactNode {
    return (
      <div className={Root}>
        <TextInput
          type={TextInputType.CharacterName}
          className={NameInputContainer}
          inputClassName={NameCharacterInput}
          value={this.state.inputValue}
          setValue={(value: string) => {
            this.setState({ inputValue: value });
          }}
          showLength
          showRules
        />

        <div className={InputStatus}>
          {/* {this.state.lastInvited.length > 0
            ? getTokenizedStringTableValue(StringIDPartyInvitationSent, this.props.stringTable, {
                PLAYER_NAME: this.state.lastInvited
              })
            : ''} */}
        </div>

        <div className={ButtonSection}>
          <FactionButton
            className={ActionButton}
            onClick={this.onAddClicked.bind(this)}
            disabled={this.state.inputValue.trim().length < this.props.minCharacterNameLength}
          >
            {getStringTableValue(StringIDGeneralConfirm, this.props.stringTable)}
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

    this.setState({ lastInvited: this.state.inputValue.trim() });
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

export const AddFriendFoeDialog = connect(mapStateToProps)(AAddFriendFoeDialog);
