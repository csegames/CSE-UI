import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { ExplainedValue } from '@csegames/library/dist/_baseGame/types/ExplainedValue';

// Styles.
const Root = 'ExplainedValueDisplay-Root';
const Header = 'ExplainedValueDisplay-Header';
const HeaderButton = 'ExplainedValueDisplay-HeaderButton';
const HeaderText = 'ExplainedValueDisplay-HeaderText';
const Rows = 'ExplainedValueDisplay-Rows';
const Row = 'ExplainedValueDisplay-Row';
const RowText = 'ExplainedValueDisplay-RowText';

interface ReactProps {
  value: ExplainedValue<any>;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

interface State {
  isOpen: boolean;
}

export class AExplainedValueDisplay extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { isOpen: false };
  }

  public render(): React.ReactNode {
    return (
      <div className={Root}>
        <div className={Header}>
          <div className={HeaderButton} onClick={this.onExpandToggled.bind(this)}>
            {this.state.isOpen ? '-' : '+'}
          </div>
          <div className={HeaderText}>{`${this.props.value.name} - ${this.props.value.value}`}</div>
        </div>
        <div className={Rows} style={{ height: this.state.isOpen ? '' : '0' }}>
          {this.props.value.explanation.map((v, i) => {
            return typeof v === 'string' ? (
              <div className={Row} key={i}>
                <div className={RowText}>{v}</div>
              </div>
            ) : (
              <ExplainedValueDisplay value={v} key={i} />
            );
          })}
        </div>
      </div>
    );
  }

  private onExpandToggled(): void {
    this.setState({ isOpen: !this.state.isOpen });
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  return {
    ...ownProps
  };
}

export const ExplainedValueDisplay = connect(mapStateToProps)(AExplainedValueDisplay);
