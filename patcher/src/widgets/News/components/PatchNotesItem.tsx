/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import moment from 'moment';
import { styled } from 'linaria/react';

import Item from './Item';
import { PostItem } from '..';
import { PATCH_NOTES_COLOR } from '../lib/styles';
import { PatchNote } from 'gql/interfaces';

const Title = styled.div`
  font-family: Caudex;
  font-size: 18px;
  margin-bottom: 5px;
`;

const DescriptionText = styled.div`
  font-family: Titillium Web;
  font-size: 10px;
`;

export interface Props {
  post: PostItem;
  onSelectPost: (patchNote: PostItem) => void;
}

class PatchNotesItem extends React.Component<Props> {
  public render() {
    const patchNote = this.props.post.item as PatchNote;
    return (
      <Item onClick={this.onSelect} indicatorColor={PATCH_NOTES_COLOR} imgSrc={'images/news/post-image.png'}>
        <Title>{patchNote.title}</Title>
        <DescriptionText>BUIID #{patchNote.patchNumber}</DescriptionText>
        <DescriptionText>{moment(patchNote.utcDisplayStart).format('Do MMMM YYYY - h:mm a')}</DescriptionText>
      </Item>
    );
  }

  private onSelect = () => {
    this.props.onSelectPost(this.props.post);
  }
}

export default PatchNotesItem;
