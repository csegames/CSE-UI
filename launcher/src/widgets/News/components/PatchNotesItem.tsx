/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import moment from 'moment';
import { styled } from '@csegames/linaria/react';

import Item from './Item';
import { PATCH_NOTES_COLOR } from '../lib/styles';
import { primary } from '../../../api/graphql';

type PatchNote = primary.PatchNote;

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
  note: PatchNote;
  onSelectNote: (patchNote: PatchNote) => void;
}

class PatchNotesItem extends React.Component<Props> {
  public render() {
    return (
      <Item onClick={this.onSelect} indicatorColor={PATCH_NOTES_COLOR} imgSrc={'images/news/post-image.png'}>
        <Title>{this.props.note.title}</Title>
        <DescriptionText>BUIID #{this.props.note.patchNumber}</DescriptionText>
        <DescriptionText>{moment(this.props.note.utcDisplayStart).format('Do MMMM YYYY - h:mm a')}</DescriptionText>
      </Item>
    );
  }

  private onSelect() {
    this.props.onSelectNote(this.props.note);
  }
}

export default PatchNotesItem;
