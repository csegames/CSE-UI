/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import gql from 'graphql-tag';

import { RequirementsFragment } from './RequirementsFragment';
import { ContainedItemsFragment } from './ContainedItemsFragment';
import { ContainerStatsFragment } from './ContainerStatsFragment';

export const ContainerDrawersFragment = gql`
  fragment ContainerDrawers on ContainerDrawerGQL {
    id
    requirements {
      ...Requirements
    }
    containedItems {
      ...ContainedItems
    }
    stats {
      ...ContainerStats
    }
  }
  ${RequirementsFragment}
  ${ContainedItemsFragment}
  ${ContainerStatsFragment}
`;
