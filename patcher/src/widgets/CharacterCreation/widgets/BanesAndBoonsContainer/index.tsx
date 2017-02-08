import * as React from 'react';
import BanesAndBoons from '../../components/BanesAndBoons';
import { BanesAndBoonsInfo, AddedBaneOrBoonInfo, BanesAndBoonsState, onSelectBane, onSelectBoon } from './services/session/banesAndBoons';
import { Provider, connect } from 'react-redux';
import { createStore, bindActionCreators } from 'redux';
import reducer, { SessionState } from './services/session';

const store = createStore(reducer);

export interface BanesAndBoonsContainerProps {
  onSelectBane: Function,
  onSelectBoon: Function
}

export interface BanesAndBoonsContainerState {
  addedBanes: Array<AddedBaneOrBoonInfo>,
  addedBoons: Array<AddedBaneOrBoonInfo>
}

const fakeAddedTrait = {
  empty: true,
  name: 'Live by sword',
  description: 'You may not equip weapons or focus items other than swords',
  points: 4,
  icon: '',
  required: false
};

class BanesAndBoonsContainer extends React.Component<BanesAndBoonsContainerProps, BanesAndBoonsContainerState> {
  constructor(props: BanesAndBoonsContainerProps) {
    super(props);
    this.state = {
      addedBanes: Array(10).fill(fakeAddedTrait),
      addedBoons: Array(10).fill(fakeAddedTrait)
    }
  }
  render() {
    const fakeBanesAndBoons: Array<any> = [
      {
        name: 'Live by the sword',
        description: 'You may not equip weapons or focus items other than swords',
        points: -3,
        icon: '',
        required: false
      },
      {
        name: 'Live by the sword',
        description: 'You may not equip weapons or focus items other than swords',
        points: -3,
        icon: '',
        required: false
      },
      {
        name: 'Live by the sword',
        description: 'You may not equip weapons or focus items other than swords',
        points: -3,
        icon: '',
        required: false
      },
      {
        name: 'Live by the sword',
        description: 'You may not equip weapons or focus items other than swords',
        points: -3,
        icon: '',
        required: false
      },
      {
        name: 'Live by the sword',
        description: 'You may not equip weapons or focus items other than swords',
        points: -3,
        icon: '',
        required: false
      },
      {
        name: 'Live by the sword',
        description: 'You may not equip weapons or focus items other than swords',
        points: -3,
        icon: '',
        required: false
      },
      {
        name: 'Live by the sword',
        description: 'You may not equip weapons or focus items other than swords',
        points: -3,
        icon: '',
        required: false
      },
      {
        name: 'Live by the sword',
        description: 'You may not equip weapons or focus items other than swords',
        points: -3,
        icon: '',
        required: false
      }
    ];
    return (
      <BanesAndBoons
        generalBoons={fakeBanesAndBoons}
        realmBoons={fakeBanesAndBoons}
        raceBoons={fakeBanesAndBoons}
        classBoons={fakeBanesAndBoons}
        generalBanes={fakeBanesAndBoons}
        realmBanes={fakeBanesAndBoons}
        raceBanes={fakeBanesAndBoons}
        classBanes={fakeBanesAndBoons}
        maxPoints={10}
        minPoints={10}
        addedBanes={this.state.addedBanes}
        addedBoons={this.state.addedBoons}
        onBaneClick={(bane: BanesAndBoonsInfo) => this.props.onSelectBane(bane)}
        onBoonClick={(boon: BanesAndBoonsInfo) => this.props.onSelectBoon(boon)}
      />
    )
  }
}

export interface BanesAndBoonsProps {
  dispatch?: (action: any) => any;
  banesAndBoons?: BanesAndBoonsState;
}

function mapStateToProps(state: SessionState): BanesAndBoonsProps {
  return {
    banesAndBoons: state.banesAndBoons
  }
}

function mapDispatchToProps(dispatch: (action: any) => any) {
  return bindActionCreators({
    onSelectBane: onSelectBane,
    onSelectBoon: onSelectBoon
  }, dispatch)
}

const BanesAndBoonsWrapper = connect(mapStateToProps, mapDispatchToProps)(BanesAndBoonsContainer);

class Container extends React.Component<{},{}> {
  render() {
    return (
      <Provider store={store}>
        <BanesAndBoonsWrapper {...this.props}/>
      </Provider>
    )
  }
}

export default Container;
