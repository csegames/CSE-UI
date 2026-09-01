/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { getItemResource } from '../../helpers/itemHelpers';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { EntityResourceDef } from '../../dataSources/manifest/entityResourceManifest';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';

// CSS classes
const Root = 'HUD-ItemResource-Root';
const Name = 'HUD-ItemResource-Name';
const Empty = 'empty';

interface ReactProps {
  item: Item;
  resourceID: string;
}

interface InjectedProps {
  entityResourcesByStringID: Record<string, EntityResourceDef>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AItemTooltipResourceWidget extends React.Component<Props> {
  render(): JSX.Element {
    const itemResource = getItemResource(this.props.item, this.props.entityResourcesByStringID[this.props.resourceID]);
    const resource = this.getResource();

    return (
      <div className={`${Root}${itemResource.current === 0 ? ` ${Empty}` : ''}`}>
        <span className={Name}>{resource.name}</span>
        <span>
          <span>{addCommasToNumber(itemResource.current.toFixed(0))}</span>
          {`/${addCommasToNumber(itemResource.max.toFixed(0))}`}
        </span>
      </div>
    );
  }

  getResource(): EntityResourceDef {
    return this.props.entityResourcesByStringID[this.props.resourceID];
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    entityResourcesByStringID: state.gameDefs.entityResourcesByStringID,
    ...ownProps
  };
};

export const ItemTooltipResourceWidget = connect(mapStateToProps)(AItemTooltipResourceWidget);
