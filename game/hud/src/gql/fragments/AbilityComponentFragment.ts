/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */
import gql from 'graphql-tag';

export const AbilityComponentFragment = gql`
  fragment AbilityComponent on AbilityComponentDefRef {
    id
    display {
      name
      description
      iconURL
    }
    abilityComponentCategory {
      id
      displayInfo {
        name
        description
        iconURL
      }
    }
    progression {
      levels {
        id
        levels {
          levelNumber
          progressionForLevel
        }
      }
    }
    abilityTags
    networkRequirements {
      requireTag {
        tag
      }
      excludeTag {
        tag
      }
      requireComponent {
        component {
          id
          display {
            name
          }
          abilityComponentCategory {
            displayInfo {
              name
            }
          }
        }
      }
      excludeComponent {
        component {
          id
          display {
            name
          }
          abilityComponentCategory {
            displayInfo {
              name
            }
          }
        }
      }
    }
  }
`;
