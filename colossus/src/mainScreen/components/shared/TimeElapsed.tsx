import { formatDuration, getServerDate } from '@csegames/library/dist/_baseGame/utils/timeUtils';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';

interface ReactProps {
  start: Date;
}

interface InjectedProps {
  serverTimeDeltaMS: number;
}

type Props = ReactProps & InjectedProps;

interface State {
  text: string;
}

export class ATimeElapsed extends React.Component<Props, State> {
  private tickHandle: number;

  constructor(props: Props) {
    super(props);
    this.tickHandle = window.setInterval(this.setText.bind(this), 1000);
    this.state = { text: '' };
    this.setText();
  }

  private setText(): void {
    const delta = Math.floor(getServerDate(this.props.serverTimeDeltaMS).getTime() - this.props.start.getTime());
    const text = delta > 0 ? formatDuration(delta / 1000) : '';
    this.setState({ text });
  }

  public componentWillUnmount(): void {
    window.clearInterval(this.tickHandle);
  }

  public render(): React.ReactNode {
    return this.state.text;
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { serverTimeDeltaMS } = state.clock;

  return {
    ...ownProps,
    serverTimeDeltaMS
  };
}

export const TimeElapsed = connect(mapStateToProps)(ATimeElapsed);
