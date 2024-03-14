/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Item, EntityResourceDefinitionGQL } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { getItemResource } from './itemUtils';
import { ItemResourceID } from './itemData';
import { addCommasToNumber } from '@csegames/library/dist/_baseGame/utils/textUtils';

const Root = 'HUD-ItemResource-Root';
const Name = 'HUD-ItemResource-Name';

interface ReactProps {
  item: Item;
  resourceID: ItemResourceID;
}

interface InjectedProps {
  entityResources: Dictionary<EntityResourceDefinitionGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AItemResource extends React.Component<Props> {
  render(): JSX.Element {
    const itemResource = getItemResource(this.props.item, this.props.resourceID);
    const resource = this.getResource();
    return (
      <div className={Root}>
        <span className={Name}>{resource.name}</span>
        <span>
          {`${addCommasToNumber(itemResource.currentValue.toFixed(0))} / ${addCommasToNumber(
            itemResource.maxValue.toFixed(0)
          )}`}
        </span>
      </div>
    );
  }

  getResource(): EntityResourceDefinitionGQL {
    return this.props.entityResources[this.props.resourceID];
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    entityResources: state.gameDefs.entityResources,
    ...ownProps
  };
};

export const ItemResource = connect(mapStateToProps)(AItemResource);
