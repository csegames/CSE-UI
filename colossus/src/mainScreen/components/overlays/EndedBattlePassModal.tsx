import * as React from 'react';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { QuestDefGQL, StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { MiddleModalDisplay } from '../shared/MiddleModalDisplay';
import { Dispatch } from '@reduxjs/toolkit';
import { Button } from '../shared/Button';
import {
  StringIDGeneralDone,
  getStringTableValue,
  getTokenizedStringTableValue
} from '../../helpers/stringTableHelpers';
import { hideAllOverlays } from '../../redux/navigationSlice';

const Container = 'EndedBattlePassModal-Container';
const Background = 'EndedBattlePassModal-Background';
const Logo = 'EndedBattlePassModal-Logo';
const Title = 'EndedBattlePassModal-Title';
const CloseButton = 'EndedBattlePassModal-CloseButton';

const StringIDModalEnded = 'BattlePassModalEnded';

interface ReactProps {}

interface InjectedProps {
  stringTable: Dictionary<StringTableEntryDef>;
  previousBattlePass: QuestDefGQL;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AEndedBattlePassModal extends React.Component<Props> {
  public render() {
    return (
      <MiddleModalDisplay isVisible={true} onClickOverlay={this.onClose.bind(this)}>
        <img className={Background} src={this.props.previousBattlePass.endedSplashImage} />
        <div className={Container}>
          <div className={Logo} />
          <div className={Title}>
            {getTokenizedStringTableValue(StringIDModalEnded, this.props.stringTable, {
              SEASON: this.props.previousBattlePass.name
            })}
          </div>
          <Button
            type='blue'
            text={getStringTableValue(StringIDGeneralDone, this.props.stringTable)}
            styles={CloseButton}
            onClick={this.onClose.bind(this)}
          />
        </div>
      </MiddleModalDisplay>
    );
  }
  private onClose() {
    this.props.dispatch(hideAllOverlays());
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { stringTable } = state.stringTable;
  const { previousBattlePass } = state.quests;
  return { stringTable, previousBattlePass };
}

export const EndedBattlePassModal = connect(mapStateToProps)(AEndedBattlePassModal);
