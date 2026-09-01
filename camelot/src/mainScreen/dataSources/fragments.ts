import gql from 'graphql-tag';

export const groupMemberFragment = gql`
  fragment GroupMember on GroupMemberState {
    entityID
    type
    warbandID
    characterID
    faction
    name
    isAlive
    race
    gender
    classID
    statuses {
      id
      iconURL
      description
      name
    }
    resources {
      id
      current
      max
    }
    position {
      x
      y
      z
    }
    isLeader
    canKick
    rankLevel
  }
`;
