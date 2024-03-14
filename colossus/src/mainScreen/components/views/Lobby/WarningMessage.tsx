import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../../redux/store';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';

const Container = 'StartScreen-WarningContainer';
const WarningIcon = 'StartScreen-WarningIcon';
const WarningBox = 'StartScreen-WarningBox';
const IconSymbol = 'fs-icon-misc-exclamation-circle';
const INITIALLY_VISIBLE_TIMEOUT_MS = 15000;

const StringIDPlayWarningMessage = 'PlayWarningMessage';

interface ReactProps {}

interface InjectedProps {
  initOK: boolean;
  stringTable: Dictionary<StringTableEntryDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

interface State {
  initialVisible: boolean;
  mouseOver: boolean;
}

class AWarningMessage extends React.Component<Props, State> {
  private timerHandle: number = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      initialVisible: true,
      mouseOver: false
    };
  }

  public componentDidMount(): void {
    this.timerHandle = window.setTimeout(() => {
      this.setState({ initialVisible: false });
      this.timerHandle = null;
    }, INITIALLY_VISIBLE_TIMEOUT_MS);
  }

  public componentWillUnmount(): void {
    if (this.timerHandle) {
      window.clearTimeout(this.timerHandle);
    }
  }

  public render(): React.ReactNode {
    const warningMessage = this.getWarningMessage();
    const hideStyle = !this.state.initialVisible && !this.state.mouseOver ? 'hide-warning-message' : '';

    return (
      warningMessage && (
        <div className={Container}>
          <span
            className={`${WarningIcon} ${IconSymbol}`}
            onMouseOver={this.iconMouseOverCallback.bind(this)}
            onMouseLeave={this.iconMouseLeaveCallback.bind(this)}
          />
          <div className={`${WarningBox} ${hideStyle}`}>{warningMessage}</div>
        </div>
      )
    );
  }

  private iconMouseOverCallback(e: React.MouseEvent<HTMLSpanElement>) {
    this.setState({ mouseOver: true });
  }

  private iconMouseLeaveCallback(e: React.MouseEvent<HTMLSpanElement>) {
    this.setState({ mouseOver: false });
  }

  private getWarningMessage() {
    if (!this.props.initOK) {
      // checking to see if we have the string table loaded.
      // if it has, localize the warning, if it hasn't show a hard coded version
      if (this.props.stringTable && this.props.stringTable[StringIDPlayWarningMessage]) {
        return getStringTableValue(StringIDPlayWarningMessage, this.props.stringTable);
      }

      return 'We are experiencing technical difficulties. Some things may not work properly, please be patient with us.';
    }

    return null;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { successful } = state.initialization;
  const { stringTable } = state.stringTable;

  return {
    ...ownProps,
    initOK: successful,
    stringTable
  };
}

export const WarningMessage = connect(mapStateToProps)(AWarningMessage);
