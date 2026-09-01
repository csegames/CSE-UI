import * as React from 'react';
import { AddDispatch, RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { WarbandSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/WarbandSnapshot';
import { PlayerEntityStateModel } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { PartyState } from '../../redux/partySlice';
import { TextInput, TextInputType } from '../input/TextInput';
import { FactionButton } from '../FactionButton';
import { getStringTableValue, getTokenizedStringTableValue } from '../../helpers/stringTableHelpers';
import { callCreateInvitationForName } from '../../helpers/rest/warbandsRestCalls';

// CSS classes
const Root = 'HUD-PartyInviteDialog-Root';
const NameInputContainer = 'HUD-PartyInviteDialog-NameInputContainer';
const NameCharacterInput = 'HUD-PartyInviteDialog-NameCharacterInput';
const InvitationStatus = 'HUD-PartyInviteDialog-InvitationStatus';
const InviteButton = 'HUD-PartyInviteDialog-InviteButton';

// String IDs
const StringIDPartySendInvitation = 'PartySendInvitation';
const StringIDPartyInvitationSent = 'PartyInvitationSent';

interface State {
  inputValue: string;
  lastInvited: string;
}

interface ReactProps {}

interface InjectedProps {
  warband: WarbandSnapshot;
  party: PartyState;
  self: PlayerEntityStateModel;
  stringTable: Record<string, StringTableEntryDef>;
  minCharacterNameLength: number;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class APartyInviteDialog extends React.Component<Props, State> {
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

        <div className={InvitationStatus}>
          {this.state.lastInvited.length > 0
            ? getTokenizedStringTableValue(StringIDPartyInvitationSent, this.props.stringTable, {
                PLAYER_NAME: this.state.lastInvited
              })
            : ''}
        </div>

        <FactionButton
          className={InviteButton}
          onClick={this.onSendInviteClicked.bind(this)}
          disabled={this.state.inputValue.trim().length < this.props.minCharacterNameLength}
        >
          {getStringTableValue(StringIDPartySendInvitation, this.props.stringTable)}
        </FactionButton>
      </div>
    );
  }

  private onSendInviteClicked(): void {
    const toInvite = this.state.inputValue.trim();

    this.props.dispatch(callCreateInvitationForName(toInvite));

    this.setState({ lastInvited: toInvite, inputValue: '' });
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  return {
    ...ownProps,
    warband: state.warband,
    party: state.party,
    self: state.entities.self,
    stringTable: state.stringTable.stringTable,
    minCharacterNameLength: state.gameDefs.settings?.minCharacterNameLength ?? 3
  };
};

export const PartyInviteDialog = connect(mapStateToProps)(APartyInviteDialog);
