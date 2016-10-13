/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {webAPI, utils} from 'camelot-unchained';

import QuickSelect from '../../../../components/QuickSelect';
import {ServerType, serverTypeToString, PatcherServer} from '../../services/session/controller';


class ActiveGameView extends React.Component<{type: ServerType}, {}> {
  render() {
    const {type} = this.props;
    return <div className='ActiveGameView'>{serverTypeToString(type)}</div>;
  }
}

class GameListView extends React.Component<{type: ServerType}, {}> {
  render() {
    const {type} = this.props;
    return <div className='ActiveGameView'>{serverTypeToString(type)}</div>;
  }
}

export interface GameSelectProps {
  servers: utils.Dictionary<PatcherServer>;
  selectType: (serverType: ServerType) => void;
}

export interface GameSelectState {
  selectedType: ServerType;
}

class GameSelect extends React.Component<GameSelectProps, GameSelectState> {

  constructor(props: GameSelectProps) {
    super(props);

    this.state = {
      selectedType: ServerType.CUGAME,
    };
  }

  selectType = (type: ServerType) => {
    this.props.selectType(type);
    this.setState({selectedType: type} as any);
  }

  render() {

    let values: ServerType[] = [];
    for (let i = ServerType.CUGAME; i < ServerType.UNKNOWN; ++i) {
      let anyOfType = false;
      for (const key in this.props.servers) {
        if (this.props.servers[key].type == i) {
         anyOfType = true;
         break;
        }
      }
      if (anyOfType) values.push(i);
    }
    let {selectedType} = this.state;
    return <QuickSelect items={values}
                        containerClass='GameSelect'
                        selectedItemIndex={utils.findIndexWhere(values, t => t === selectedType)}
                        activeViewComponentGenerator={t => <ActiveGameView type={t} />}
                        listViewComponentGenerator={t => <GameListView type={t}/>}
                        onSelectedItemChanged={this.selectType} />;
  }
}

export default GameSelect;
